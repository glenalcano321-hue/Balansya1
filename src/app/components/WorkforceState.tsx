import React, { createContext, useContext, useState } from 'react';

// Define the structure of your worker data
export type WorkerStatus = 'present' | 'absent' | 'day-off' | 'unavailable';

export interface WorkerData {
  id: string;
  name: string;
  position: string;
  station: string; // Added station for the Utilization Monitor
  status: WorkerStatus;
  skillLevel: number;
  shiftDurationMinutes: number;
  workTimeMinutes: number;
  idleTimeMinutes: number;
  tasksCompleted: number; // Added tasks for the Utilization Monitor
}

// Initial Data
const calculateIdle = (shift: number, work: number) => Math.max(0, shift - work);

const initialWorkers: WorkerData[] = [
  { id: 'W001', name: 'Maria Santos', position: 'Head Chef', station: 'ST-01', status: 'present', skillLevel: 5, shiftDurationMinutes: 480, workTimeMinutes: 408, idleTimeMinutes: calculateIdle(480, 408), tasksCompleted: 12 },
  { id: 'W002', name: 'Juan Dela Cruz', position: 'Sous Chef', station: 'ST-02', status: 'present', skillLevel: 4, shiftDurationMinutes: 480, workTimeMinutes: 442, idleTimeMinutes: calculateIdle(480, 442), tasksCompleted: 14 },
  { id: 'W003', name: 'Ana Reyes', position: 'Line Cook', station: 'ST-03', status: 'present', skillLevel: 3, shiftDurationMinutes: 480, workTimeMinutes: 374, idleTimeMinutes: calculateIdle(480, 374), tasksCompleted: 10 },
  { id: 'W004', name: 'Pedro Garcia', position: 'Prep Cook', station: 'ST-04', status: 'day-off', skillLevel: 3, shiftDurationMinutes: 480, workTimeMinutes: 0, idleTimeMinutes: 480, tasksCompleted: 0 },
  { id: 'W005', name: 'Lisa Tan', position: 'Line Cook', station: 'ST-05', status: 'present', skillLevel: 4, shiftDurationMinutes: 480, workTimeMinutes: 456, idleTimeMinutes: calculateIdle(480, 456), tasksCompleted: 15 },
  { id: 'W006', name: 'Carlos Wong', position: 'Line Lead', station: 'ST-06', status: 'present', skillLevel: 4, shiftDurationMinutes: 480, workTimeMinutes: 394, idleTimeMinutes: calculateIdle(480, 394), tasksCompleted: 11 },
];

interface WorkforceContextType {
  workers: WorkerData[];
  setWorkers: React.Dispatch<React.SetStateAction<WorkerData[]>>;
}

const WorkforceContext = createContext<WorkforceContextType | undefined>(undefined);

export function WorkforceProvider({ children }: { children: React.ReactNode }) {
  const [workers, setWorkers] = useState<WorkerData[]>(initialWorkers);

  return (
    <WorkforceContext.Provider value={{ workers, setWorkers }}>
      {children}
    </WorkforceContext.Provider>
  );
}

export function useWorkforce() {
  const context = useContext(WorkforceContext);
  if (context === undefined) {
    throw new Error('useWorkforce must be used within a WorkforceProvider');
  }
  return context;
}