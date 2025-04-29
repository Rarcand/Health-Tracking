import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';
import { app } from '../firebaseConfig';

const storage = getStorage(app);

export const uploadVideo = async (
  uri: string,
  fileName: string,
  onProgress: (progress: number) => void
): Promise<string> => {
  try {
    // Create a reference to the file location in Firebase Storage
    const videoRef = ref(storage, `videos/${fileName}`);

    // Fetch the video file
    const response = await fetch(uri);
    const blob = await response.blob();

    // Upload the video with progress tracking
    const uploadTask = uploadBytesResumable(videoRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          console.error('Error uploading video:', error);
          reject(error);
        },
        async () => {
          // Get the download URL after successful upload
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error('Error in uploadVideo:', error);
    throw error;
  }
};

export interface VideoMetadata {
  name: string;
  url: string;
  createdAt: Date;
}

export const fetchExerciseVideos = async (exerciseName: string): Promise<VideoMetadata[]> => {
  try {
    // Create a reference to the videos folder
    const videosRef = ref(storage, 'videos');
    
    // List all videos
    const result = await listAll(videosRef);
    
    // Filter videos by exercise name and get their metadata
    const videoPromises = result.items
      .filter(item => item.name.toLowerCase().includes(exerciseName.toLowerCase()))
      .map(async (item) => {
        const url = await getDownloadURL(item);
        // Get metadata (you would need to store this separately in Firestore in a real app)
        return {
          name: item.name,
          url,
          createdAt: new Date(), // In a real app, this would come from metadata
        };
      });
    
    return Promise.all(videoPromises);
  } catch (error) {
    console.error('Error fetching exercise videos:', error);
    return [];
  }
}; 