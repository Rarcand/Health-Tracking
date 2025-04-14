import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

export const completionMap: {
  [week: number]: { [day: string]: boolean[] };
} = {};

const defaultDayPlan = {
  exercises: ['Squats', 'Supermans', 'Bridges', 'Knee-to-Chest', 'Calf Raises'],
  sets: ['3 sets of 8', '4 sets of 8', '2 sets of 4', '3 sets of 8', '3 sets of 8'],
};

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const createDatesByDay = (startDate: string): { [day: string]: string } => {
  const base = new Date(startDate + 'T00:00:00');
  const labels: { [day: string]: string } = {};

  for (let i = 0; i < 7; i++) {
    const date = new Date(base.getTime());
    date.setDate(date.getDate() + i);
    const dayName = daysOfWeek[i];
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    labels[dayName] = date.toLocaleDateString(undefined, options);
  }

  return labels;
};

const generateWeekPlan = (startDateStr: string): WeekPlan => {
  const datesByDay = createDatesByDay(startDateStr);
  const exercisesByDay: { [day: string]: typeof defaultDayPlan } = {};
  daysOfWeek.forEach(day => {
    exercisesByDay[day] = defaultDayPlan;
  });
  return {
    dates: `${datesByDay['Sunday']} - ${datesByDay['Saturday']}`,
    datesByDay,
    exercisesByDay,
  };
};

const generateStartDates = (): string[] => {
  const baseSunday = new Date('2025-04-06T00:00:00');

  const startDates: string[] = [];
  for (let i = 0; i < 12; i++) {
    const weekStart = new Date(baseSunday);
    weekStart.setDate(baseSunday.getDate() + i * 7);
    startDates.push(weekStart.toISOString().split('T')[0]);
  }
  return startDates;
};


const startDates = generateStartDates();

const weekPlans: { [key: number]: WeekPlan } = {};
startDates.forEach((startDate, i) => {
  weekPlans[i + 1] = generateWeekPlan(startDate);
});

export default function WeekPlanScreen() {
  const { week } = useLocalSearchParams();
  const [weekNumber, setWeekNumber] = useState(parseInt(week as string, 10));
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  useEffect(() => {
  const today = new Date();
  const currentDayIndex = today.getDay();
  const thisSunday = new Date(today);
  thisSunday.setDate(thisSunday.getDate() - currentDayIndex);

  const selectedWeekStart = new Date(startDates[weekNumber - 1] + 'T00:00:00');
  const selectedWeekEnd = new Date(selectedWeekStart);
  selectedWeekEnd.setDate(selectedWeekEnd.getDate() + 6);

  if (today >= selectedWeekStart && today <= selectedWeekEnd) {
    setSelectedDayIndex(currentDayIndex);
  } else {
    setSelectedDayIndex(0); // Sunday
  }
}, [weekNumber]);


  const selectedDay = daysOfWeek[selectedDayIndex];
  const plan = weekPlans[weekNumber];
  const { exercises, sets } = plan.exercisesByDay[selectedDay];

  const [completed, setCompleted] = useState<boolean[]>(
    completionMap[weekNumber]?.[selectedDay] || new Array(defaultDayPlan.exercises.length).fill(false)
  );

  useEffect(() => {
    if (!completionMap[weekNumber]) completionMap[weekNumber] = {};
    if (!completionMap[weekNumber][selectedDay]) {
      completionMap[weekNumber][selectedDay] = new Array(defaultDayPlan.exercises.length).fill(false);
    }
    setCompleted(completionMap[weekNumber][selectedDay]);
  }, [selectedDay, weekNumber]);

  const toggleCompletion = (index: number) => {
    const updated = [...completed];
    updated[index] = !updated[index];
    setCompleted(updated);
    completionMap[weekNumber][selectedDay] = updated;
  };

  const goToPreviousDay = () => {
    if (weekNumber === 1 && selectedDayIndex === 0) return;

    if (selectedDayIndex > 0) {
      setSelectedDayIndex(selectedDayIndex - 1);
    } else {
      setWeekNumber(weekNumber - 1);
      setSelectedDayIndex(6); // Go to Saturday of previous week
    }
  };

  const goToNextDay = () => {
    if (weekNumber === 12 && selectedDayIndex === 6) return;

    if (selectedDayIndex < 6) {
      setSelectedDayIndex(selectedDayIndex + 1);
    } else {
      setWeekNumber(weekNumber + 1);
      setSelectedDayIndex(0); // Sunday
    }
  };

  const currentSelectedDate = new Date(startDates[weekNumber - 1] + 'T00:00:00');
  currentSelectedDate.setDate(currentSelectedDate.getDate() + selectedDayIndex);

  const programStartDate = new Date(startDates[0] + 'T00:00:00');
  const programEndDate = new Date(startDates[11] + 'T00:00:00');
  programEndDate.setDate(programEndDate.getDate() + 6);

  const isAtProgramStart = currentSelectedDate.toDateString() === programStartDate.toDateString();
  const isAtProgramEnd = currentSelectedDate.toDateString() === programEndDate.toDateString();

  const getWeekProgressFraction = () => {
    let completedCount = 0;
    let totalCount = 0;
    const weekData = completionMap[weekNumber] || {};

    for (const day of daysOfWeek) {
      const entries = weekData[day] || new Array(defaultDayPlan.exercises.length).fill(false);
      completedCount += entries.filter(Boolean).length;
      totalCount += entries.length;
    }

    return totalCount > 0 ? completedCount / totalCount : 0;
  };

  const calculateWeekProgress = () => {
    return `${Math.round(getWeekProgressFraction() * 100)}%`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.backButtonContainer}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={32} color="white" />
        </Pressable>
      </View>

      <View style={[styles.exerciseContainer, styles.weekProgressContainer, styles.progressRow]}>
        <View style={styles.textCenterWrapper}>
          <Text style={styles.exerciseNumbered}>WEEK {weekNumber}</Text>
          <Text style={styles.dateRange}>{weekPlans[weekNumber].dates}</Text>
        </View>
        <View style={styles.progressCircle}>
          <Progress.Circle
            size={75}
            progress={getWeekProgressFraction()}
            showsText={true}
            formatText={() => calculateWeekProgress()}
            color="#ffffff"
            unfilledColor="rgba(255,255,255,0.2)"
            borderWidth={0}
            thickness={4}
            textStyle={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}
          />
        </View>
      </View>

      <View style={styles.arrowNavigator}>
        <Pressable
          onPress={goToPreviousDay}
          style={styles.arrowButton}
          disabled={isAtProgramStart}
        >
          <Ionicons
            name="chevron-back"
            size={32}
            color={isAtProgramStart ? '#999' : 'white'}
          />
        </Pressable>

        <Text style={styles.dayLabel}>{plan.datesByDay[selectedDay]}</Text>

        <Pressable
          onPress={goToNextDay}
          style={styles.arrowButton}
          disabled={isAtProgramEnd}
        >
          <Ionicons
            name="chevron-forward"
            size={32}
            color={isAtProgramEnd ? '#999' : 'white'}
          />
        </Pressable>
      </View>

      {exercises.map((exercise, index) => (
        <Pressable
          key={index}
          style={[styles.exerciseContainer, completed[index] && styles.exerciseContainerCompleted]}
          onPress={() => toggleCompletion(index)}
        >
          <View style={styles.exerciseRow}>
            <View style={styles.exerciseTextContainer}>
              <Text style={[styles.exerciseNumbered, completed[index] && styles.exerciseTextCompleted]}>
                {index + 1}. {exercise}
              </Text>
              <Text style={[styles.setsCentered, completed[index] && styles.exerciseTextCompleted]}>
                {sets[index]}
              </Text>
            </View>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                borderWidth: completed[index] ? 0 : 3,
                borderColor: 'white',
                backgroundColor: completed[index] ? '#cb9df5' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name='checkmark-sharp' size={28} color='#ffffff' />
            </View>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#6130C4' },
  backButtonContainer: { marginBottom: 16 },
  arrowNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 16,
    flexWrap: 'wrap',
  },
  arrowButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  exerciseContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#c8b4ec',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  exerciseContainerCompleted: {
    backgroundColor: '#ffffff',
  },
  weekProgressContainer: {
    backgroundColor: '#cb9df5',
    borderColor: '#ffffff',
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseTextContainer: {
    flexShrink: 1,
    flex: 1,
    alignItems: 'center',
  },
  exerciseNumbered: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  setsCentered: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  exerciseTextCompleted: {
    color: '#cb9df5',
  },
  progressRow: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  progressRight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  dateRange: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  textCenterWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircle: {
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
