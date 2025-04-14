import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { completionMap } from '../weekPlanScreen/[week]';
import * as Progress from 'react-native-progress';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const generateWeekDateRanges = (): { [week: number]: string } => {
  const firstSunday = new Date('2025-04-06T00:00:00');

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

export const weekDateRanges = generateWeekDateRanges();

export default function ProgramScreen() {
  const weeks = 12;
  const therapistName = 'Therapist';
  const patientName = 'Patient';
  const { width } = Dimensions.get('window');

  const weekColors = ['#FF785A', '#CB9DF5', '#9BF6EF', '#FA6495'];
  const [percentages, setPercentages] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      const newPercentages = Array.from({ length: weeks }, (_, i) => {
        const week = i + 1;
        const weekData = completionMap[week] || {};
        let completedCount = 0;
        let totalCount = 0;

        for (const day of daysOfWeek) {
          const entries = weekData[day] || new Array(5).fill(false);
          completedCount += entries.filter(Boolean).length;
          totalCount += entries.length;
        }

        return totalCount > 0 ? completedCount / totalCount : 0;
      });

      setPercentages(newPercentages);
    }, [])
  );

  return (
    <ScrollView
      contentContainerStyle={{ paddingTop: 50, paddingHorizontal: 16, paddingBottom: 32 }}
      style={{ backgroundColor: '#6130C4' }}
      showsVerticalScrollIndicator
    >
      <Text style={styles.title}>{patientName}'s Program</Text>
      {Array.from({ length: weeks }, (_, i) => (
        <View key={i + 1} style={[styles.weekRow, { width: width - 32 }]}>
          <Pressable
            style={[
              styles.largeButton,
              percentages[i] === 1
                ? { backgroundColor: 'white' }
                : { backgroundColor: weekColors[i % weekColors.length] }
            ]}
            onPress={() => router.push(`/weekPlanScreen/${i + 1}`)}
          >
            <View style={styles.textContainer}>
              <Text style={[styles.buttonText, percentages[i] === 1 && { color: weekColors[i % weekColors.length] }]}>WEEK {i + 1}</Text>
              <Text style={[styles.dateRange, percentages[i] === 1 && { color: weekColors[i % weekColors.length] }]}>{weekDateRanges[i + 1]}</Text>
            </View>
            <View style={styles.circle}>
              <Progress.Circle
                size={75}
                progress={percentages[i] ?? 0}
                showsText={true}
                formatText={() => `${Math.round((percentages[i] ?? 0) * 100)}%`}
                color={percentages[i] === 1 ? 'white' : '#ffffff'}
                unfilledColor="rgba(255,255,255,0.2)"
                borderWidth={0}
                thickness={4}
                textStyle={{ color: percentages[i] === 1 ? weekColors[i % weekColors.length] : 'white', fontSize: 21, fontWeight: 'bold' }}
              />
            </View>
          </Pressable>
        </View>
      ))}
      <View />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
    textAlign: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  largeButton: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  dateRange: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  circle: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
