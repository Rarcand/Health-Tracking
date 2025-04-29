import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../_layout';
import { fetchUserProgram, Program, Exercise } from '../../firebase/program';
import { fetchExerciseVideos, VideoMetadata } from '../../firebase/videos';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';

export default function ExerciseScreen() {
  const { exerciseName } = useLocalSearchParams();
  const router = useRouter();
  const { themeColor } = useContext(ThemeContext);
  const [program, setProgram] = useState<Program | null>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoMetadata | null>(null);

  useEffect(() => {
    const loadExercise = async () => {
      try {
        setLoading(true);
        const userId = await AsyncStorage.getItem('userId') || 'default-user';
        const userProgram = await fetchUserProgram(userId);
        
        if (userProgram) {
          setProgram(userProgram);
          // Find the exercise in any week's plan
          let foundExercise: Exercise | null = null;
          for (const week of userProgram.weeks) {
            for (const day of Object.values(week.days)) {
              const exercise = day.exercises.find(ex => ex.name === exerciseName);
              if (exercise) {
                foundExercise = exercise;
                break;
              }
            }
            if (foundExercise) break;
          }
          
          if (foundExercise) {
            setExercise(foundExercise);
            
            // Fetch videos for this exercise
            const exerciseVideos = await fetchExerciseVideos(exerciseName as string);
            setVideos(exerciseVideos);
            
            // Set the first video as selected if available
            if (exerciseVideos.length > 0) {
              setSelectedVideo(exerciseVideos[0]);
            }
          } else {
            setError(`Exercise "${exerciseName}" not found in your program.`);
          }
        } else {
          setError('No program found. Please contact your therapist to set up your program.');
        }
      } catch (err) {
        console.error('Error loading exercise:', err);
        setError('Failed to load the exercise. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadExercise();
  }, [exerciseName]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColor }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Loading exercise...</Text>
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
          <Text style={styles.headerTitle}>{exercise?.name}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.exerciseInfo}>
            <Text style={styles.setsText}>{exercise?.sets}</Text>
            {exercise?.description && (
              <Text style={styles.descriptionText}>{exercise.description}</Text>
            )}
          </View>

          {selectedVideo && (
            <View style={styles.videoContainer}>
              <Video
                source={{ uri: selectedVideo.url }}
                style={styles.video}
                useNativeControls
                resizeMode="contain"
                isLooping={false}
              />
            </View>
          )}

          {videos.length > 0 && (
            <View style={styles.videosList}>
              <Text style={styles.videosTitle}>Your Recorded Videos</Text>
              {videos.map((video, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.videoItem,
                    selectedVideo?.url === video.url && styles.selectedVideoItem
                  ]}
                  onPress={() => setSelectedVideo(video)}
                >
                  <View style={styles.videoItemContent}>
                    <Ionicons 
                      name="videocam" 
                      size={24} 
                      color={selectedVideo?.url === video.url ? '#FF6B6B' : 'white'} 
                    />
                    <Text style={[
                      styles.videoItemText,
                      selectedVideo?.url === video.url && styles.selectedVideoItemText
                    ]}>
                      {video.name}
                    </Text>
                  </View>
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={selectedVideo?.url === video.url ? '#FF6B6B' : 'white'} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={() => {
                router.push('/play');
              }}
            >
              <Text style={styles.startButtonText}>Record New Video</Text>
            </TouchableOpacity>
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
  exerciseInfo: {
    marginBottom: 30,
  },
  setsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16/9,
    backgroundColor: 'black',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 30,
  },
  video: {
    flex: 1,
  },
  videosList: {
    marginBottom: 30,
  },
  videosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  selectedVideoItem: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderColor: '#FF6B6B',
    borderWidth: 1,
  },
  videoItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  videoItemText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  selectedVideoItemText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  actionButtons: {
    marginTop: 20,
  },
  startButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 