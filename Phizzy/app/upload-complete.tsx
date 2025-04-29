import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import { ThemeContext } from './_layout';

export default function UploadCompleteScreen() {
  const router = useRouter();
  const { themeColor } = useContext(ThemeContext);
  const { videoUrl } = useLocalSearchParams();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColor }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Upload Complete</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={100} color="white" />
          </View>
          
          <Text style={styles.title}>Great job!</Text>
          <Text style={styles.subtitle}>Your exercise video has been uploaded successfully</Text>
          
          {videoUrl && (
            <View style={styles.videoInfo}>
              <Text style={styles.videoInfoText}>Video URL: {videoUrl}</Text>
            </View>
          )}

          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => router.push('/week/2')}
          >
            <Text style={styles.continueButtonText}>Continue to Week 2</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  videoInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    width: '100%',
  },
  videoInfoText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 