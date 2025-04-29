import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { app } from '../firebaseConfig';

const storage = getStorage(app);

export const fetchAvatars = async () => {
  try {
    const avatarsRef = ref(storage, 'avatars');
    const result = await listAll(avatarsRef);
    
    const avatarUrls = await Promise.all(
      result.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return url;
      })
    );
    
    return avatarUrls;
  } catch (error) {
    console.error('Error fetching avatars:', error);
    return [];
  }
}; 