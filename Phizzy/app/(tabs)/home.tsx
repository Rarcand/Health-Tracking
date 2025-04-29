import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../_layout';
import { useRouter } from 'expo-router';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAvatars } from '../../firebase/avatars';
import { fetchUserProgram, Program, Exercise } from '../../firebase/program';

export default function HomeScreen() {
  const router = useRouter();
  const { themeColor } = useContext(ThemeContext);
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [avatars, setAvatars] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState<Program | null>(null);
  const [todayExercises, setTodayExercises] = useState<Exercise[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [currentDay, setCurrentDay] = useState<string>('Monday');
  const [programLoading, setProgramLoading] = useState(true);
  
  // Fetch avatars from Firebase on component mount
  useEffect(() => {
    const loadAvatars = async () => {
      try {
        const avatarUrls = await fetchAvatars();
        setAvatars(avatarUrls);
        
        // Load selected avatar
        const savedAvatar = await AsyncStorage.getItem('selectedAvatar');
        if (savedAvatar !== null) {
          setSelectedAvatar(parseInt(savedAvatar));
        } else {
          // Default to first avatar if none selected
          setSelectedAvatar(0);
          await AsyncStorage.setItem('selectedAvatar', '0');
        }
      } catch (error) {
        console.error('Error loading avatars:', error);
        // Default to first avatar on error
        setSelectedAvatar(0);
      } finally {
        setLoading(false);
      }
    };
    loadAvatars();
  }, []);

  // Fetch program data from Firebase
  useEffect(() => {
    const loadProgram = async () => {
      try {
        setProgramLoading(true);
        const userId = await AsyncStorage.getItem('userId') || 'default-user';
        const userProgram = await fetchUserProgram(userId);
        
        if (userProgram) {
          setProgram(userProgram);
          
          // Determine current week and day
          const today = new Date();
          const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
          const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const currentDayName = dayNames[dayOfWeek];
          
          // Find the current week based on dates
          const currentWeekObj = userProgram.weeks.find(week => {
            const startDate = new Date(week.startDate);
            const endDate = new Date(week.endDate);
            return today >= startDate && today <= endDate;
          });
          
          if (currentWeekObj) {
            setCurrentWeek(currentWeekObj.weekNumber);
            setCurrentDay(currentDayName);
            
            // Get today's exercises
            if (currentWeekObj.days[currentDayName]) {
              setTodayExercises(currentWeekObj.days[currentDayName].exercises);
            } else {
              setTodayExercises([]);
            }
          } else {
            // Default to week 1 if no current week found
            setCurrentWeek(1);
            setCurrentDay('Monday');
            if (userProgram.weeks[0]?.days['Monday']) {
              setTodayExercises(userProgram.weeks[0].days['Monday'].exercises);
            } else {
              setTodayExercises([]);
            }
          }
        }
      } catch (error) {
        console.error('Error loading program:', error);
      } finally {
        setProgramLoading(false);
      }
    };
    
    loadProgram();
  }, []);

  // Calculate overall program completion
  const weekProgress = program ? 
    program.weeks.reduce((sum, week) => sum + week.progress, 0) / program.weeks.length : 
    0;
  const overallProgress = weekProgress / 100;

  const handleExercisePress = (exerciseName: string) => {
    router.push(`/exercise/${exerciseName}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColor }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Mission Control Section */}
        <Text style={styles.title}>Andrew's Mission{'\n'}Control</Text>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View style={styles.heroAvatar}>
              {loading ? (
                <Ionicons name="person" size={40} color="#4A2DBB" />
              ) : selectedAvatar !== null && avatars[selectedAvatar] ? (
                <Image 
                  source={{ uri: avatars[selectedAvatar] }} 
                  style={styles.avatarImage}
                />
              ) : (
                <Ionicons name="person" size={40} color="#4A2DBB" />
              )}
            </View>
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>
                Keep going, Andrew! Just 3 more days until your next Hero Milestone!
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Circle */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Program Completion</Text>
          <View style={styles.progressCircleContainer}>
            <Progress.Circle
              size={100}
              progress={overallProgress}
              showsText={true}
              formatText={() => `${Math.round(weekProgress)}%`}
              color="#ffffff"
              unfilledColor="rgba(255,255,255,0.2)"
              borderWidth={0}
              thickness={8}
              textStyle={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}
            />
          </View>
        </View>

        {/* Today's Training Section */}
        <Text style={styles.sectionTitle}>Today's Hero Training</Text>
        <Text style={styles.weekDay}>Week {currentWeek}, {currentDay}</Text>

        {/* Exercise List */}
        {programLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.loadingText}>Loading today's exercises...</Text>
          </View>
        ) : todayExercises.length > 0 ? (
          <View style={styles.exerciseList}>
            {todayExercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseItem}>
                <Text style={styles.exerciseNumber}>{index + 1}</Text>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseTitle}>{exercise.name}</Text>
                  <Text style={styles.exerciseSubtitle}>{exercise.sets}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.infoButton}
                  onPress={() => handleExercisePress(exercise.name)}
                >
                  <Ionicons name="information-circle-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noExercisesContainer}>
            <Text style={styles.noExercisesText}>No exercises scheduled for today.</Text>
          </View>
        )}

        {/* Journey Map Button */}
        <TouchableOpacity 
          style={styles.journeyButton}
          onPress={() => router.push('/map')}
        >
          <Text style={styles.journeyButtonText}>View Journey Map</Text>
        </TouchableOpacity>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A2DBB',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  heroCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  heroAvatar: {
    width: 120,
    aspectRatio: 1,
    borderRadius: 16,
    marginRight: 15,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  speechBubble: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 15,
  },
  speechText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  progressCircleContainer: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  weekDay: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  exerciseList: {
    marginBottom: 30,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
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
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  exerciseSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  infoButton: {
    padding: 5,
  },
  journeyButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  journeyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 30,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 30,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  noExercisesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  noExercisesText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
