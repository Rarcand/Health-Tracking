import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../_layout';
import { fetchUserProgram, Program, WeekPlan } from '../../firebase/program';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';

export default function WeekScreen() {
  const { weekNumber } = useLocalSearchParams();
  const router = useRouter();
  const { themeColor } = useContext(ThemeContext);
  const [program, setProgram] = useState<Program | null>(null);
  const [weekPlan, setWeekPlan] = useState<WeekPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  useEffect(() => {
    const loadWeekPlan = async () => {
      try {
        setLoading(true);
        const userId = await AsyncStorage.getItem('userId') || 'default-user';
        const userProgram = await fetchUserProgram(userId);
        
        if (userProgram) {
          setProgram(userProgram);
          const week = userProgram.weeks.find(w => w.weekNumber === Number(weekNumber));
          if (week) {
            setWeekPlan(week);
            // Set the first available day as selected
            if (Object.keys(week.days).length > 0) {
              setSelectedDay(Object.keys(week.days)[0]);
            }
          } else {
            setError(`Week ${weekNumber} not found in your program.`);
          }
        } else {
          setError('No program found. Please contact your therapist to set up your program.');
        }
      } catch (err) {
        console.error('Error loading week plan:', err);
        setError('Failed to load your week plan. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadWeekPlan();
  }, [weekNumber]);

  const handleExercisePress = (exerciseName: string) => {
    router.push(`/exercise/${exerciseName}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColor }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Loading your week plan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColor }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={60} color="white" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColor }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={32} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Week {weekNumber}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.weekInfo}>
            <Text style={styles.weekTitle}>Week {weekNumber}</Text>
            <Text style={styles.weekDates}>
              {weekPlan?.startDate && new Date(weekPlan.startDate).toLocaleDateString()} - {weekPlan?.endDate && new Date(weekPlan.endDate).toLocaleDateString()}
            </Text>
            <View style={styles.progressContainer}>
              <Progress.Circle
                size={80}
                progress={weekPlan ? weekPlan.progress / 100 : 0}
                showsText={true}
                formatText={() => `${Math.round(weekPlan?.progress || 0)}%`}
                color="#ffffff"
                unfilledColor="rgba(255,255,255,0.2)"
                borderWidth={0}
                thickness={6}
                textStyle={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}
              />
              <Text style={styles.progressLabel}>Week Progress</Text>
            </View>
          </View>

          <View style={styles.daysContainer}>
            {weekPlan && Object.keys(weekPlan.days).map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  selectedDay === day && styles.selectedDayButton
                ]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[
                  styles.dayButtonText,
                  selectedDay === day && styles.selectedDayButtonText
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.exercisesContainer}>
            <Text style={styles.exercisesTitle}>{selectedDay}'s Exercises</Text>
            {weekPlan && weekPlan.days[selectedDay]?.exercises.map((exercise, index) => (
              <TouchableOpacity
                key={index}
                style={styles.exerciseCard}
                onPress={() => handleExercisePress(exercise.name)}
              >
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseNumber}>{index + 1}</Text>
                  <View style={styles.exerciseDetails}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseSets}>{exercise.sets}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="white" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  weekInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  weekTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  weekDates: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressLabel: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 10,
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedDayButton: {
    backgroundColor: '#FF6B6B',
  },
  dayButtonText: {
    color: 'white',
    fontSize: 16,
  },
  selectedDayButtonText: {
    fontWeight: 'bold',
  },
  exercisesContainer: {
    marginBottom: 20,
  },
  exercisesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  exerciseNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    color: '#4A2DBB',
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: 'bold',
    marginRight: 15,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    marginBottom: 4,
  },
  exerciseSets: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
}); 