import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from './_layout';
import { fetchUserProgram, Program, WeekPlan } from '../firebase/program';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';

export default function ProgramWeeksScreen() {
  const router = useRouter();
  const { themeColor } = useContext(ThemeContext);
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProgram = async () => {
      try {
        setLoading(true);
        // In a real app, you would get the user ID from authentication
        // For now, we'll use a mock user ID
        const userId = await AsyncStorage.getItem('userId') || 'default-user';
        const userProgram = await fetchUserProgram(userId);
        
        if (userProgram) {
          setProgram(userProgram);
        } else {
          // If no program exists, create a mock program for demonstration
          const mockProgram: Program = {
            id: 'mock-program',
            patientId: userId,
            therapistId: 'therapist-1',
            therapistName: 'Dr. Smith',
            patientName: 'Andrew',
            totalWeeks: 12,
            weeks: Array.from({ length: 12 }, (_, i) => ({
              weekNumber: i + 1,
              startDate: new Date(Date.now() + i * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              endDate: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              days: {
                Monday: { exercises: [{ name: 'Squats', sets: '3 sets of 8' }] },
                Tuesday: { exercises: [{ name: 'Bridges', sets: '3 sets of 8' }] },
                Wednesday: { exercises: [{ name: 'Knee-to-Chest', sets: '3 sets of 8' }] },
                Thursday: { exercises: [{ name: 'Supermans', sets: '3 sets of 8' }] },
                Friday: { exercises: [{ name: 'Calf Raises', sets: '3 sets of 8' }] },
              },
              progress: Math.random() * 100,
            })),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setProgram(mockProgram);
        }
      } catch (err) {
        console.error('Error loading program:', err);
        setError('Failed to load your program. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProgram();
  }, []);

  const navigateToWeek = (weekNumber: number) => {
    router.push(`/week/${weekNumber}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColor }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Loading your program...</Text>
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
          <Text style={styles.headerTitle}>Your Program</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.programInfo}>
            <Text style={styles.programTitle}>{program?.patientName}'s Exercise Program</Text>
            <Text style={styles.therapistInfo}>Created by {program?.therapistName}</Text>
            <Text style={styles.weekCount}>{program?.totalWeeks} Week Program</Text>
          </View>

          <View style={styles.weeksContainer}>
            {program?.weeks.map((week) => (
              <TouchableOpacity 
                key={week.weekNumber}
                style={styles.weekCard}
                onPress={() => navigateToWeek(week.weekNumber)}
              >
                <View style={styles.weekHeader}>
                  <Text style={styles.weekTitle}>Week {week.weekNumber}</Text>
                  <View style={styles.progressContainer}>
                    <Progress.Circle
                      size={40}
                      progress={week.progress / 100}
                      showsText={true}
                      formatText={() => `${Math.round(week.progress)}%`}
                      color="#ffffff"
                      unfilledColor="rgba(255,255,255,0.2)"
                      borderWidth={0}
                      thickness={4}
                      textStyle={{ fontSize: 12, color: 'white', fontWeight: 'bold' }}
                    />
                  </View>
                </View>
                <Text style={styles.weekDates}>
                  {new Date(week.startDate).toLocaleDateString()} - {new Date(week.endDate).toLocaleDateString()}
                </Text>
                <View style={styles.exercisePreview}>
                  {Object.keys(week.days).slice(0, 3).map((day, index) => (
                    <View key={index} style={styles.dayPreview}>
                      <Text style={styles.dayName}>{day}</Text>
                      <Text style={styles.exerciseCount}>
                        {week.days[day].exercises.length} exercises
                      </Text>
                    </View>
                  ))}
                </View>
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
  programInfo: {
    marginBottom: 30,
  },
  programTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  therapistInfo: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  weekCount: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  weeksContainer: {
    gap: 20,
  },
  weekCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weekTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  progressContainer: {
    alignItems: 'center',
  },
  weekDates: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 15,
  },
  exercisePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayPreview: {
    alignItems: 'center',
  },
  dayName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  exerciseCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
}); 