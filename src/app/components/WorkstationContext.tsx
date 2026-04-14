import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Task {
  id: string;
  taskName: string;
  avgTime: number;
  skillRequired: string;
  complexity: 'Low' | 'Medium' | 'High';
}

export interface Workstation {
  id: string;
  stationName: string;
  stationType: string;
  tasks: Task[];
  capacity: number;
  notes: string;
}

// 1. THIS IS THE BASE TEMPLATE. You can safely edit these names and numbers 
// right here in the code if you want to change the starting defaults!
const defaultInitialWorkstations: Workstation[] = [
  {
    id: 'ST-01',
    stationName: 'Order Taking',
    stationType: 'Front of House',
    capacity: 2,
    notes: 'Handles customer orders and initial interaction',
    tasks: [
      { id: 'T001', taskName: 'Take order', avgTime: 3, skillRequired: 'Customer Service', complexity: 'Low' },
      { id: 'T002', taskName: 'Enter into system', avgTime: 2, skillRequired: 'System Operation', complexity: 'Low' }
    ]
  },
  {
    id: 'ST-02',
    stationName: 'Ingredient Preparation',
    stationType: 'Back of House',
    capacity: 3,
    notes: 'Prep work for all menu items',
    tasks: [
      { id: 'T003', taskName: 'Wash vegetables', avgTime: 5, skillRequired: 'Basic Prep', complexity: 'Low' },
      { id: 'T004', taskName: 'Cut ingredients', avgTime: 8, skillRequired: 'Knife Skills', complexity: 'Medium' },
      { id: 'T005', taskName: 'Measure portions', avgTime: 3, skillRequired: 'Precision', complexity: 'Low' }
    ]
  },
  {
    id: 'ST-03',
    stationName: 'Cooking Station',
    stationType: 'Back of House',
    capacity: 4,
    notes: 'Main cooking and heat preparation',
    tasks: [
      { id: 'T006', taskName: 'Grill proteins', avgTime: 12, skillRequired: 'Grilling', complexity: 'Medium' },
      { id: 'T007', taskName: 'Sauté vegetables', avgTime: 8, skillRequired: 'Cooking', complexity: 'Medium' },
      { id: 'T008', taskName: 'Deep fry', avgTime: 10, skillRequired: 'Frying', complexity: 'High' }
    ]
  },
  {
    id: 'ST-04',
    stationName: 'Plating Station',
    stationType: 'Back of House',
    capacity: 2,
    notes: 'Final presentation and quality check',
    tasks: [
      { id: 'T009', taskName: 'Plate dish', avgTime: 4, skillRequired: 'Plating', complexity: 'Medium' },
      { id: 'T010', taskName: 'Add garnish', avgTime: 2, skillRequired: 'Presentation', complexity: 'Low' },
      { id: 'T011', taskName: 'Quality check', avgTime: 1, skillRequired: 'Attention to Detail', complexity: 'Low' }
    ]
  },
  {
    id: 'ST-05',
    stationName: 'Serving Station',
    stationType: 'Front of House',
    capacity: 3,
    notes: 'Deliver food to customers',
    tasks: [
      { id: 'T012', taskName: 'Deliver order', avgTime: 4, skillRequired: 'Customer Service', complexity: 'Low' },
      { id: 'T013', taskName: 'Check satisfaction', avgTime: 2, skillRequired: 'Communication', complexity: 'Low' }
    ]
  },
  {
    id: 'ST-06',
    stationName: 'Beverage Station',
    stationType: 'Front of House',
    capacity: 2,
    notes: 'Drink preparation and restocking',
    tasks: [
      { id: 'T014', taskName: 'Prepare drinks', avgTime: 3, skillRequired: 'Beverage Prep', complexity: 'Low' },
      { id: 'T015', taskName: 'Restock cups', avgTime: 2, skillRequired: 'Organization', complexity: 'Low' }
    ]
  }
];

interface WorkstationContextType {
  workstations: Workstation[];
  setWorkstations: (stations: Workstation[]) => void;
}

const WorkstationContext = createContext<WorkstationContextType | undefined>(undefined);

export function WorkstationProvider({ children }: { children: ReactNode }) {
  // 2. THE LOCAL STORAGE FIX: 
  // Before loading the default template, check if the user has saved custom data in their browser!
  const [workstations, setWorkstations] = useState<Workstation[]>(() => {
    const savedData = localStorage.getItem('balansya_workstations');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error("Failed to parse local storage data");
      }
    }
    return defaultInitialWorkstations;
  });

  // 3. Automatically save to the browser every single time you edit or add a station
  useEffect(() => {
    localStorage.setItem('balansya_workstations', JSON.stringify(workstations));
  }, [workstations]);

  return (
    <WorkstationContext.Provider value={{ workstations, setWorkstations }}>
      {children}
    </WorkstationContext.Provider>
  );
}

export function useWorkstations() {
  const context = useContext(WorkstationContext);
  if (context === undefined) {
    throw new Error('useWorkstations must be used within a WorkstationProvider');
  }
  return context;
}