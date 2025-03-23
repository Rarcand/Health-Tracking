import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Carousel from '@/components/Carousel';
import React, { useState } from 'react';

// Get current date
const currentDate = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

const User = 'User';
const Week = 'Week 1';

export default function HomeScreen() {
  // Task list state
  const [tasks, setTasks] = useState([
    { id: 1, text: '✔️ Warm-up: 5-minute stretch', completed: false },
    { id: 2, text: '🏋️ Strength Training', completed: false },
    { id: 3, text: '🏃 Cardio: 15-min run', completed: false },
  ]);

  // Toggle task completion
  const toggleTask = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Keep the original task order and number them
  const numberedTasks = tasks.map((task, index) => ({
    ...task,
    text: `${index + 1}. ${task.text}`, // Prepend task number
  }));

  // Reorder tasks to keep the original order but move completed tasks to the bottom
  const orderedTasks = [
    ...numberedTasks.filter((task) => !task.completed), // Incomplete tasks at the top
    ...numberedTasks.filter((task) => task.completed), // Completed tasks at the bottom
  ];

  return (
    <>
      {/* Header */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.User}>
          {User}'s Dashboard
        </ThemedText>
      </ThemedView>

      {/* Carousel Component */}
      <Carousel />

      {/* Daily Quest Section */}
      <ThemedView style={styles.questContainer}>
        <ThemedText type="title" style={styles.Quest}>Today's Quest</ThemedText>
        <ThemedText style={styles.questDescription}>
          {Week} - {currentDate}
        </ThemedText>
        <ThemedText style={styles.questDescription}>
          Complete all tasks to earn rewards.
        </ThemedText>

        {/* Task List */}
        {orderedTasks.map((task) => (
          <TouchableOpacity key={task.id} onPress={() => toggleTask(task.id)}>
            <ThemedView style={[styles.questBox, task.completed && styles.completedQuestBox]}>
              <ThemedText type="defaultSemiBold" style={styles.questText}>
                {task.text}
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 60,
    paddingTop: 20,
    paddingBottom: 20,
  },
  User: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  questContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
  },
  Quest: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  questDescription: {
    fontSize: 16,
    marginBottom: 15,
  },
  questBox: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: '90%', // Ensures all boxes have the same width
    minHeight: 50, // Ensures boxes remain even in height
    alignSelf: 'center',
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  completedQuestBox: {
    borderColor: 'green',
  },
  questText: {
    flex: 1, // Ensures text doesn't affect width
    textAlign: 'center', // Centers text inside the box
    color: '#000',
  },
});
