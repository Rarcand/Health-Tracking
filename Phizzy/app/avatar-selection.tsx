import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import all avatar images
const avatars = [
  require('../assets/avatars/avatar1.png'),
  require('../assets/avatars/avatar2.png'),
  require('../assets/avatars/avatar3.png'),
  require('../assets/avatars/avatar4.png'),
  require('../assets/avatars/avatar5.png'),
  require('../assets/avatars/avatar6.png'),
  require('../assets/avatars/avatar7.png'),
  require('../assets/avatars/avatar8.png'),
];

export default function AvatarSelectionScreen() {
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  const handleAvatarSelect = async (index: number) => {
    setSelectedAvatar(index);
    try {
      await AsyncStorage.setItem('selectedAvatar', index.toString());
    } catch (error) {
      console.error('Error saving avatar selection:', error);
    }
  };

  const handleContinue = () => {
    if (selectedAvatar !== null) {
      console.log('Navigating to home screen...');
      router.push('/(tabs)/home');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={32} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Select Your Hero</Text>
          </View>

          <View style={styles.avatarGrid}>
            {avatars.map((avatar, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.avatarContainer,
                  selectedAvatar === index && styles.selectedAvatarContainer
                ]}
                onPress={() => handleAvatarSelect(index)}
              >
                <Image source={avatar} style={styles.avatarImage} />
                {selectedAvatar === index && (
                  <View style={styles.selectedHighlight} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              selectedAvatar === null && styles.disabledButton
            ]}
            onPress={handleContinue}
            disabled={selectedAvatar === null}
          >
            <Text style={styles.continueButtonText}>CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A2DBB',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
    marginRight: 40,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    gap: 20,
  },
  avatarContainer: {
    width: '40%',
    aspectRatio: 1,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedAvatarContainer: {
    borderColor: '#4A2DBB',
    borderWidth: 3,
    borderRadius: 25,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  selectedHighlight: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FF6B6B',
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    zIndex: 1,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#4A2DBB',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  continueButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.5)',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 