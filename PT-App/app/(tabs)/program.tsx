import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Dimensions } from 'react-native';
import { router } from 'expo-router';

export default function ProgramScreen() {
  const weeks = 12;
  const weekButtons = [];
  const therapistName = 'Therapist';
  const patientName = 'Patient';
  const screenWidth = Dimensions.get('window').width;

  for (let i = 1; i <= weeks; i++) {
    weekButtons.push(
      <View key={i} style={[styles.buttonWithCircle, { width: screenWidth - 32 }]}>
        {/* 👉 Circle with visible border and text */}
        <View style={styles.circle}>
          <Text style={styles.circleText}>0%</Text>
        </View>

        {/* 👉 Week button */}
        <View style={{ flex: 1 }}>
          <Button
            title={`Week ${i}`}
            onPress={() => router.push(`/weekPlanScreen/${i}`)}
          />
        </View>
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
          onPress={() => console.log('View Notes pressed')}
        />
      </View>

      {weekButtons}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  buttonWithCircle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
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
