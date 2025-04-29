import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import { ThemeContext } from './_layout';
import * as ImagePicker from 'expo-image-picker';
import { uploadVideo } from '../firebase/videos';

export default function SquatPlayScreen() {
  const router = useRouter();
  const { themeColor } = useContext(ThemeContext);
  const [videoSource, setVideoSource] = useState<'none' | 'record' | 'upload'>('none');
  const [video, setVideo] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleRecordVideo = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera permissions to record video.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedVideo = result.assets[0];
      setVideo(selectedVideo);
      setVideoSource('record');
      setUploadResult(null);
    }
  };

  const handleChooseVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to select a video.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedVideo = result.assets[0];
      setVideo(selectedVideo);
      setVideoSource('upload');
      setUploadResult(null);
    }
  };

  const uploadVideo = async () => {
    if (!video) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      // Extract file extension
      const localUri = video.uri;
      const uriParts = localUri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      const fileName = `squat-exercise-${Date.now()}.${fileType}`;

      // Upload to Firebase Storage
      const downloadURL = await uploadVideo(
        localUri,
        fileName,
        (progress) => setUploadProgress(progress)
      );

      setUploadResult({ success: true, url: downloadURL });

      // Navigate to upload complete screen after successful upload
      setTimeout(() => {
        router.push({
          pathname: '/upload-complete',
          params: { videoUrl: downloadURL }
        });
      }, 1000);
    } catch (error: any) {
      console.error('Upload failed:', error);
      setUploadResult({ error: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setVideoSource('none');
    setVideo(null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadResult(null);
  };

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
          <Text style={styles.headerTitle}>Record Exercise</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Squats</Text>
          <Text style={styles.subtitle}>Record your exercise to track progress</Text>

          {!isUploading && !uploadResult && videoSource === 'none' && (
            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={styles.optionButton}
                onPress={handleRecordVideo}
              >
                <View style={styles.optionIconContainer}>
                  <Ionicons name="videocam" size={40} color="white" />
                </View>
                <Text style={styles.optionTitle}>Record Video</Text>
                <Text style={styles.optionDescription}>
                  Record yourself performing the exercise using your camera
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.optionButton}
                onPress={handleChooseVideo}
              >
                <View style={styles.optionIconContainer}>
                  <Ionicons name="cloud-upload" size={40} color="white" />
                </View>
                <Text style={styles.optionTitle}>Upload Video</Text>
                <Text style={styles.optionDescription}>
                  Upload a pre-recorded video from your device
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {(videoSource === 'record' || videoSource === 'upload') && video && !isUploading && !uploadResult && (
            <View style={styles.uploadContainer}>
                  <View style={styles.uploadPlaceholder}>
                    <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
                    <Text style={styles.uploadText}>Video Selected</Text>
                    <Text style={styles.fileName}>{video.uri.split('/').pop()}</Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.uploadButton, { backgroundColor: '#4CAF50' }]}
                    onPress={uploadVideo}
                  >
                    <Text style={styles.uploadButtonText}>Start Upload</Text>
                  </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          {isUploading && (
            <View style={styles.uploadContainer}>
              <View style={styles.uploadProgressContainer}>
                <View style={[styles.uploadProgressBar, { width: `${uploadProgress}%` }]} />
                <Text style={styles.uploadProgressText}>{uploadProgress}%</Text>
              </View>
              <Text style={styles.uploadingText}>Uploading your video...</Text>
              <ActivityIndicator size="large" color="white" style={{ marginTop: 10 }} />
            </View>
          )}

          {uploadResult?.error && (
            <View style={styles.uploadContainer}>
              <Text style={styles.errorText}>
                Upload failed: {uploadResult.error}
              </Text>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {!isUploading && !uploadResult && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instructions</Text>
            <Text style={styles.instructionsText}>
              • Stand with feet shoulder-width apart{'\n'}
              • Lower your body by bending your knees and hips{'\n'}
              • Keep your back straight and chest up{'\n'}
              • Return to standing position{'\n'}
              • Record from the side for best form analysis
            </Text>
          </View>
          )}
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 20,
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  optionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  uploadContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  fileName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  uploadButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
  },
  uploadProgressContainer: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  uploadProgressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  uploadProgressText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  uploadingText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 10,
  },
  instructionsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  instructionsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
}); 