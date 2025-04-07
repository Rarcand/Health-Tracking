import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
  const today = new Date();
  const dayOfWeek = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);

  const startDates: string[] = [];
  for (let i = 0; i < 12; i++) {
    const weekStart = new Date(sunday);
    weekStart.setDate(sunday.getDate() + i * 7);
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
  
  const getCurrentWeekIndex = (): number => {
    const today = new Date();
    const currentSunday = new Date(today);
    currentSunday.setDate(today.getDate() - today.getDay());
  
    for (let i = 0; i < startDates.length; i++) {
      const start = new Date(startDates[i] + 'T00:00:00');
      if (start.toDateString() === currentSunday.toDateString()) {
        return i + 1;
      }
    }
    return -1;
  };
  
  const today = new Date();
  const isThisWeek = getCurrentWeekIndex() === parseInt(week as string, 10);
  const [selectedDayIndex, setSelectedDayIndex] = useState(isThisWeek ? today.getDay() : 0);
  
  const selectedDay = daysOfWeek[selectedDayIndex];

  const plan = weekPlans[weekNumber];
  const { exercises, sets } = plan.exercisesByDay[selectedDay];

  const [completed, setCompleted] = useState<boolean[]>(
    completionMap[weekNumber]?.[selectedDay] || new Array(exercises.length).fill(false)
  );

  useEffect(() => {
    if (!completionMap[weekNumber]) completionMap[weekNumber] = {};
    if (!completionMap[weekNumber][selectedDay]) {
      completionMap[weekNumber][selectedDay] = new Array(exercises.length).fill(false);
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
    if (selectedDayIndex === 0) {
      const prevWeek = weekNumber === 1 ? 12 : weekNumber - 1;
      setWeekNumber(prevWeek);
      setSelectedDayIndex(6);
    } else {
      setSelectedDayIndex(selectedDayIndex - 1);
    }
  };

  const goToNextDay = () => {
    if (selectedDayIndex === 6) {
      const nextWeek = weekNumber === 12 ? 1 : weekNumber + 1;
      setWeekNumber(nextWeek);
      setSelectedDayIndex(0);
    } else {
      setSelectedDayIndex(selectedDayIndex + 1);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.backButtonContainer}>
        <Button title="Back" onPress={() => router.back()} />
      </View>

      <Text style={styles.title}>Week {weekNumber}</Text>

      <View style={styles.arrowNavigator}>
        <Pressable onPress={goToPreviousDay} style={styles.arrowButton}>
          <Text style={styles.arrowText}>←</Text>
        </Pressable>
        <Text style={styles.dayLabel}>{plan.datesByDay[selectedDay]}</Text>
        <Pressable onPress={goToNextDay} style={styles.arrowButton}>
          <Text style={styles.arrowText}>→</Text>
        </Pressable>
      </View>

      {exercises.map((exercise, index) => (
        <Pressable
          key={index}
          style={styles.exerciseContainer}
          onPress={() => toggleCompletion(index)}
        >
          <View style={styles.exerciseRow}>
            <View style={styles.exerciseTextContainer}>
              <Text
                style={[styles.exerciseNumbered, completed[index] && styles.completedText]}
              >
                {index + 1}. {exercise}
              </Text>
              <Text
                style={[styles.setsCentered, completed[index] && styles.completedText]}
              >
                {sets[index]}
              </Text>
            </View>
            <Ionicons
              name={completed[index] ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={completed[index] ? '#4CAF50' : '#ccc'}
            />
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#fff' },
  backButtonContainer: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
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
  arrowText: {
    fontSize: 24,
    color: '#00aaff',
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  exerciseContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  setsCentered: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
});
