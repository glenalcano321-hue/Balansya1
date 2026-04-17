import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../firebase'; 

interface DemandData {
  baselineDemand: number;
  bulkOrderSize: number;
  multiplier: number;
  adjustedDemand: number;
}

interface DemandContextType {
  demandData: DemandData;
  targetDate: string;
  setTargetDate: (date: string) => void;
  updateDemandData: (data: Partial<DemandData>) => void;
  saveDemandToFirebase: () => Promise<void>; // NEW: The explicit save function
}

const defaultDemand: DemandData = {
  baselineDemand: 150,
  bulkOrderSize: 0,
  multiplier: 1.0,
  adjustedDemand: 150,
};

const getTodayString = () => new Date().toISOString().split('T')[0];

const DemandContext = createContext<DemandContextType | undefined>(undefined);

export function DemandProvider({ children }: { children: React.ReactNode }) {
  const [demandData, setDemandData] = useState<DemandData>(defaultDemand);
  const [targetDate, setTargetDate] = useState<string>(getTodayString());

  // READ: Load data when the date changes
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "demandForecasts", targetDate), (docSnap) => {
      if (docSnap.exists()) {
        setDemandData(docSnap.data() as DemandData);
      } else {
        setDemandData(defaultDemand);
      }
    });
    return () => unsubscribe();
  }, [targetDate]);

  // WRITE (Local UI Only): Update the screen instantly
  const updateDemandData = (newData: Partial<DemandData>) => {
    setDemandData(prev => ({ ...prev, ...newData }));
  };

  // WRITE (Firebase): Actually send the payload to the cloud
  const saveDemandToFirebase = async () => {
    try {
      await setDoc(doc(db, "demandForecasts", targetDate), demandData);
    } catch (error) {
      console.error("Error saving to Firebase:", error);
      throw error; // Pass the error to the UI so we can show an alert
    }
  };

  return (
    <DemandContext.Provider value={{ 
      demandData, 
      targetDate, 
      setTargetDate, 
      updateDemandData, 
      saveDemandToFirebase 
    }}>
      {children}
    </DemandContext.Provider>
  );
}

export function useDemand() {
  const context = useContext(DemandContext);
  if (context === undefined) throw new Error('useDemand must be used within a DemandProvider');
  return context;
}