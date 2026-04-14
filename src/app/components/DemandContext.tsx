import { createContext, useContext, useState, ReactNode } from 'react';

// The data we want to share globally
interface DemandState {
  baselineDemand: number;
  bulkOrderSize: number;
  multiplier: number;
  adjustedDemand: number; // The final calculated demand
}

const initialDemandState: DemandState = {
  baselineDemand: 150,
  bulkOrderSize: 0,
  multiplier: 1.0,
  adjustedDemand: 150,
};

interface DemandContextType {
  demandData: DemandState;
  updateDemandData: (newData: DemandState) => void;
}

const DemandContext = createContext<DemandContextType | undefined>(undefined);

export function DemandProvider({ children }: { children: ReactNode }) {
  const [demandData, setDemandData] = useState<DemandState>(initialDemandState);

  return (
    <DemandContext.Provider value={{ demandData, updateDemandData: setDemandData }}>
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