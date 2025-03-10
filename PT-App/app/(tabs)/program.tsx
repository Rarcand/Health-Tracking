import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router, Link } from 'expo-router'; 

export default function ProgramScreen() {

  const weeks = 12; // Number of weeks
  const weekButtons = [];
  const therapistName = 'Therapist'
  const patientName = 'Patient'
  const screenWidth = Dimensions.get('window').width;

  for (let i = 1; i <= weeks; i++) {
    weekButtons.push(
      <View key={i} style={[styles.buttonContainer, { width: screenWidth - 32 }]}>
        <Button
          title={`Week ${i}`}
          onPress={() => router.push(`/weekPlanScreen/${i}`)} // Navigate to WeekPlanScreen
        />
      </View>
    );
  }
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{patientName}'s Home Exercise Program</Text>
      <Text style={styles.description}>{weeks} week plan.</Text>
      <Text style={styles.description}>Provided by therapist {therapistName}.</Text>
      <View style={[styles.buttonContainer, { width: screenWidth - 32 }]}>
        <Button
          title={`View Notes from ${therapistName}.`}
          onPress={() => console.log('View Notes pressed')} // Replace with your logic
        />
      </View>

      {weekButtons}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    marginBottom: 16, // Add spacing between buttons
  },
});