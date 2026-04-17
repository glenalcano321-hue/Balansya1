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
  updateDemandData: (data: Partial<DemandData>) => void;
}

const defaultDemand: DemandData = {
  baselineDemand: 150,
  bulkOrderSize: 0,
  multiplier: 1.0,
  adjustedDemand: 150,
};

const DemandContext = createContext<DemandContextType | undefined>(undefined);

export function DemandProvider({ children }: { children: React.ReactNode }) {
  const [demandData, setDemandData] = useState<DemandData>(defaultDemand);

  // 2. READ: Listen to Firebase in real-time
  useEffect(() => {
    // This creates a listener on a document called "daily-demand" inside a collection called "systemSettings"
    const unsubscribe = onSnapshot(doc(db, "systemSettings", "daily-demand"), (docSnap) => {
      if (docSnap.exists()) {
        // If data exists in Firebase, update our app!
        setDemandData(docSnap.data() as DemandData);
      }
    });

    // Cleanup the listener when the app closes
    return () => unsubscribe();
  }, []);

  // 3. WRITE: Send updates to Firebase
  const updateDemandData = async (newData: Partial<DemandData>) => {
    const updatedData = { ...demandData, ...newData };
    
    // Optimistically update the UI instantly
    setDemandData(updatedData); 

    try {
      // Push the new data up to Firebase
      await setDoc(doc(db, "systemSettings", "daily-demand"), updatedData);
    } catch (error) {
      console.error("Error saving demand to Firebase:", error);
    }
  };

  return (
    <DemandContext.Provider value={{ demandData, updateDemandData }}>
      {children}
    </DemandContext.Provider>
  );
}

export function useDemand() {
  const context = useContext(DemandContext);
  if (context === undefined) {
    throw new Error('useDemand must be used within a DemandProvider');
  }
  return context;
}