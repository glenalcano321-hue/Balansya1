import { createContext, useContext, useState, ReactNode } from 'react';

// The shape of our skill database
export type SkillDatabase = {
  worker: string;
  skills: Record<string, number>;
}[];

// The default data matching your Eatery workers and stations
const initialSkills: SkillDatabase = [
  { worker: 'Maria Santos', skills: { 'ST-01': 2, 'ST-02': 4, 'ST-03': 5, 'ST-04': 4, 'ST-05': 3, 'ST-06': 2 } },
  { worker: 'Juan Dela Cruz', skills: { 'ST-01': 3, 'ST-02': 5, 'ST-03': 5, 'ST-04': 5, 'ST-05': 4, 'ST-06': 3 } },
  { worker: 'Ana Reyes', skills: { 'ST-01': 5, 'ST-02': 2, 'ST-03': 2, 'ST-04': 3, 'ST-05': 5, 'ST-06': 4 } },
  { worker: 'Pedro Garcia', skills: { 'ST-01': 2, 'ST-02': 5, 'ST-03': 3, 'ST-04': 4, 'ST-05': 3, 'ST-06': 3 } },
  { worker: 'Lisa Tan', skills: { 'ST-01': 4, 'ST-02': 3, 'ST-03': 2, 'ST-04': 4, 'ST-05': 5, 'ST-06': 5 } },
  { worker: 'Carlos Wong', skills: { 'ST-01': 4, 'ST-02': 4, 'ST-03': 5, 'ST-04': 5, 'ST-05': 4, 'ST-06': 3 } },
];

interface SkillContextType {
  globalSkills: SkillDatabase;
  updateGlobalSkills: (newSkills: SkillDatabase) => void;
}

const SkillContext = createContext<SkillContextType | undefined>(undefined);

export function SkillProvider({ children }: { children: ReactNode }) {
  const [globalSkills, setGlobalSkills] = useState<SkillDatabase>(initialSkills);

  return (
    <SkillContext.Provider value={{ globalSkills, updateGlobalSkills: setGlobalSkills }}>
      {children}
    </SkillContext.Provider>
  );
}

export function useSkills() {
  const context = useContext(SkillContext);
  if (context === undefined) {
    throw new Error('useSkills must be used within a SkillProvider');
  }
  return context;
}