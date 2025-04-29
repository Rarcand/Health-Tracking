import { getFirestore, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const db = getFirestore(app);

export interface Exercise {
  name: string;
  sets: string;
  description?: string;
}

export interface DayPlan {
  exercises: Exercise[];
}

export interface WeekPlan {
  weekNumber: number;
  startDate: string;
  endDate: string;
  days: {
    [day: string]: DayPlan;
  };
  progress: number;
}

export interface Program {
  id: string;
  patientId: string;
  therapistId: string;
  therapistName: string;
  patientName: string;
  totalWeeks: number;
  weeks: WeekPlan[];
  createdAt: Date;
  updatedAt: Date;
}

export const fetchUserProgram = async (userId: string): Promise<Program | null> => {
  try {
    // Get the user's program document
    const programRef = doc(db, 'programs', userId);
    const programDoc = await getDoc(programRef);
    
    if (!programDoc.exists()) {
      console.log('No program found for user');
      return null;
    }
    
    const programData = programDoc.data();
    
    // Convert Firestore timestamps to JavaScript Date objects
    return {
      ...programData,
      createdAt: programData.createdAt?.toDate(),
      updatedAt: programData.updatedAt?.toDate(),
    } as Program;
  } catch (error) {
    console.error('Error fetching program:', error);
    return null;
  }
};

export const fetchAllPrograms = async (): Promise<Program[]> => {
  try {
    const programsRef = collection(db, 'programs');
    const programsSnapshot = await getDocs(programsRef);
    
    return programsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Program;
    });
  } catch (error) {
    console.error('Error fetching all programs:', error);
    return [];
  }
}; 