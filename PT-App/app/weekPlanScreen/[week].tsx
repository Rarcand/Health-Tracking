import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router'; // Import router for navigation

// Define the type for a week's plan
type WeekPlan = {
  dates: string;
  exercises: string[];
};

// Define the type for the weekPlans object
type WeekPlans = {
  [key: number]: WeekPlan; // Index signature allowing number keys
};

export default function WeekPlanScreen() {
  const { week } = useLocalSearchParams(); // Get the week parameter from the URL
  const weekNumber = parseInt(week as string, 10); // Convert week to a number

  // Example data for each week's plan
  const weekPlans: WeekPlans = {
    1: {
      dates: 'December 23rd - December 30th',
      exercises: [
        'Exercise 1: 4 Sets of 8',
        'Exercise 2: 4 Sets of 8',
        'Exercise 3: 4 Sets of 8',
        'Exercise 4: 4 Sets of 8',
        'Exercise 5: 4 Sets of 8',
      ],
    },
    2: {
      dates: 'December 31st - January 6th',
      exercises: [
        'Exercise 1: 4 Sets of 8',
        'Exercise 2: 4 Sets of 8',
        'Exercise 3: 4 Sets of 8',
        'Exercise 4: 4 Sets of 8',
        'Exercise 5: 4 Sets of 8',
      ],
    },
    // Add plans for weeks 3 to 12
    3: { dates: '', exercises: [] },
    4: { dates: '', exercises: [] },
    5: { dates: '', exercises: [] },
    6: { dates: '', exercises: [] },
    7: { dates: '', exercises: [] },
    8: { dates: '', exercises: [] },
    9: { dates: '', exercises: [] },
    10: { dates: '', exercises: [] },
    11: { dates: '', exercises: [] },
    12: { dates: '', exercises: [] },
  };

  const plan = weekPlans[weekNumber]; // Now TypeScript allows this

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <View style={styles.backButtonContainer}>
        <Button title="Back" onPress={() => router.back()} />
      </View>

      <Text style={styles.title}>Week {weekNumber}</Text>
      <Text style={styles.dates}>{plan.dates}</Text>

      {/* Display Exercises */}
      {plan.exercises.map((exercise: string, index: number) => (
        <View key={index} style={styles.exerciseContainer}>
          <Text style={styles.exercise}>{exercise}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  backButtonContainer: {
    marginBottom: 16, // Add spacing below the back button
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  dates: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  exerciseContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  exercise: {
    fontSize: 16,
    color: '#333',
  },
});