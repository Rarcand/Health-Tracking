import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Dimensions } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { completionMap } from '../weekPlanScreen/[week]';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const generateWeekDateRanges = (): { [week: number]: string } => {
  const today = new Date();
  const currentDay = today.getDay();
  const firstSunday = new Date(today);
  firstSunday.setDate(today.getDate() - currentDay);

  const ranges: { [week: number]: string } = {};
  for (let i = 0; i < 12; i++) {
    const start = new Date(firstSunday);
    start.setDate(start.getDate() + i * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const format = (date: Date) =>
      date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });

    ranges[i + 1] = `${format(start)} - ${format(end)}`;
  }
  return ranges;
};

const weekDateRanges = generateWeekDateRanges();

export default function ProgramScreen() {
  const weeks = 12;
  const therapistName = 'Therapist';
  const patientName = 'Patient';
  const { width } = Dimensions.get('window');

  const [percentages, setPercentages] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      const newPercentages = Array.from({ length: weeks }, (_, i) => {
        const week = i + 1;
        const weekData = completionMap[week] || {};

        let totalCompleted = 0;
        let totalExercises = 0;

        for (const day of daysOfWeek) {
          const dayData = weekData[day] || [];
          totalCompleted += dayData.filter(Boolean).length;
          totalExercises += dayData.length;
        }

        return totalExercises > 0
          ? Math.round((totalCompleted / totalExercises) * 100)
          : 0;
      });

      setPercentages(newPercentages);
    }, [])
  );

  return (
    <ScrollView
      contentContainerStyle={{ paddingTop: 50, paddingHorizontal: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator
    >
      <Text style={styles.title}>{patientName}'s Home Exercise Program</Text>
      <Text style={styles.description}>{weeks} week plan.</Text>
      <Text style={styles.description}>Provided by therapist {therapistName}.</Text>

      <View style={[styles.buttonContainer, { width: width - 32 }]}>
        <Button
          title={`View Notes from ${therapistName}`}
          onPress={() => console.log('View Notes pressed')}
        />
      </View>

      {Array.from({ length: weeks }, (_, i) => (
        <View key={i + 1} style={[styles.weekRow, { width: width - 32 }]}>
          <View style={styles.weekInfo}>
            <View style={styles.weekButton}>
              <Button
                title={`Week ${i + 1}`}
                onPress={() => router.push(`/weekPlanScreen/${i + 1}`)}
              />
            </View>
            <Text style={styles.dateRange}>{weekDateRanges[i + 1]}</Text>
          </View>
          <View style={styles.circle}>
            <Text style={styles.circleText}>
              {percentages[i] !== undefined ? `${percentages[i]}%` : '0%'}
            </Text>
          </View>
        </View>
      ))}

      <View />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'orange',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: 'orange',
    marginBottom: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 16,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  weekInfo: {
    flex: 1,
    marginRight: 12,
    alignItems: 'center',
  },
  weekButton: {
    marginBottom: 4,
  },
  dateRange: {
    fontSize: 12,
    color: '#888',
    textAlign: 'left',
    marginLeft: 4,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#00aaff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#00aaff',
  },
});
