import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Dimensions } from 'react-native';
import { router } from 'expo-router';

export default function ProgramScreen() {
  const weeks = 12;
  const therapistName = 'Therapist';
  const patientName = 'Patient';
  const { width, height } = Dimensions.get('window');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        vertical={true} 
        contentContainerStyle={{ paddingTop: 500, paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={true}>
        {/* Header Content */}
        <Text style={styles.title}>{patientName}'s Home Exercise Program</Text>
        <Text style={styles.description}>{weeks} week plan.</Text>
        <Text style={styles.description}>Provided by therapist {therapistName}.</Text>

        {/* Notes Button */}
        <View style={[styles.buttonContainer, { width: width - 32 }]}>
          <Button
            title={`View Notes from ${therapistName}.`}
            onPress={() => console.log('View Notes pressed')}
          />
        </View>

        {/* Week Buttons - FORCED to be scrollable */}
        {Array.from({ length: weeks }, (_, i) => (
          <View
            key={i + 1}
            style={[styles.weekRow, { width: width - 32 }]}
          >
            <View style={styles.weekButton}>
              <Button
                title={`Week ${i + 1}`}
                onPress={() => router.push(`/weekPlanScreen/${i + 1}`)}
              />
            </View>
            <View style={styles.circle}>
              <Text style={styles.circleText}>0%</Text>
            </View>
          </View>
        ))}
        
        {/* Nuclear Padding - Ensures scrollable area */}
        <View/>
      </ScrollView>
    </SafeAreaView>
  );
}

// Keep your existing styles
const styles = StyleSheet.create({
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
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  weekButton: {
    flex: 1,
    marginRight: 12,
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