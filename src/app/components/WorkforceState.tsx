import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export type WorkerStatus = 'present' | 'absent' | 'day-off' | 'unavailable';

export interface Worker {
  id: string;
  name: string;
  position: string;
  skillLevel: number;
  status: WorkerStatus;
  workTimeMinutes: number;
  shiftDurationMinutes: number;
  idleTimeMinutes: number;
  station: string;
  tasksCompleted: number;
}

interface WorkforceContextType {
  workers: Worker[];
  setWorkers: (workers: Worker[]) => void;
  targetDate: string;
  setTargetDate: (date: string) => void;
  saveWorkforceToFirebase: () => Promise<void>;
}

const getTodayString = () => new Date().toISOString().split('T')[0];

const WorkforceContext = createContext<WorkforceContextType | undefined>(undefined);

export function WorkforceProvider({ children }: { children: React.ReactNode }) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [targetDate, setTargetDate] = useState<string>(getTodayString());

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "dailyWorkforce", targetDate), async (docSnap) => {
      if (docSnap.exists()) {
        setWorkers(docSnap.data().workers as Worker[]);
      } else {
        const masterSnap = await getDoc(doc(db, "globalSettings", "masterRoster"));
        if (masterSnap.exists()) {
          const freshRoster = (masterSnap.data().workers as Worker[]).map(w => ({
             ...w, 
             status: (w.status === 'unavailable' ? 'unavailable' : 'present') as WorkerStatus,
             workTimeMinutes: 0,
             idleTimeMinutes: w.shiftDurationMinutes
          }));
          setWorkers(freshRoster);
        } else {
          setWorkers([]);
        }
      }
    });

    return () => unsubscribe();
  }, [targetDate]);

  const saveWorkforceToFirebase = async () => {
    try {
      await setDoc(doc(db, "dailyWorkforce", targetDate), { workers });
      await setDoc(doc(db, "globalSettings", "masterRoster"), { workers });
    } catch (error) {
      console.error("Error saving workforce to Firebase:", error);
      throw error;
    }
  };

  return (
    <WorkforceContext.Provider value={{ workers, setWorkers, targetDate, setTargetDate, saveWorkforceToFirebase }}>
      {children}
    </WorkforceContext.Provider>
  );
}

export function useWorkforce() {
  const context = useContext(WorkforceContext);
  if (context === undefined) throw new Error('useWorkforce must be used within a WorkforceProvider');
  return context;
}