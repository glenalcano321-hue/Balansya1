import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export interface MenuItem {
  id: string;
  name: string;
  category: 'main-dish' | 'appetizer' | 'dessert' | 'beverage';
  prepTime: number;
  cookTime: number;
  plateTime: number;
  active: boolean;
  expectedOrders: number;
}

const initialMenuItems: MenuItem[] = [
  { id: 'M001', name: 'Chicken Adobo', category: 'main-dish', prepTime: 15, cookTime: 45, plateTime: 5, active: true, expectedOrders: 35 },
  { id: 'M002', name: 'Sinigang na Baboy', category: 'main-dish', prepTime: 20, cookTime: 50, plateTime: 5, active: true, expectedOrders: 28 },
  { id: 'M003', name: 'Beef Kare-Kare', category: 'main-dish', prepTime: 25, cookTime: 60, plateTime: 5, active: false, expectedOrders: 0 },
  { id: 'M004', name: 'Lumpia Shanghai', category: 'appetizer', prepTime: 30, cookTime: 10, plateTime: 3, active: true, expectedOrders: 45 },
  { id: 'M005', name: 'Pancit Canton', category: 'main-dish', prepTime: 15, cookTime: 20, plateTime: 4, active: true, expectedOrders: 32 },
  { id: 'M006', name: 'Halo-Halo', category: 'dessert', prepTime: 10, cookTime: 0, plateTime: 5, active: true, expectedOrders: 20 },
  { id: 'M007', name: 'Lechon Kawali', category: 'main-dish', prepTime: 20, cookTime: 40, plateTime: 5, active: false, expectedOrders: 0 },
  { id: 'M008', name: 'Mango Shake', category: 'beverage', prepTime: 5, cookTime: 0, plateTime: 2, active: true, expectedOrders: 25 },
];

interface MenuContextType {
  items: MenuItem[];
  setItems: (items: MenuItem[]) => void;
  targetDate: string;
  setTargetDate: (date: string) => void;
  saveMenuToFirebase: () => Promise<void>;
}

const getTodayString = () => new Date().toISOString().split('T')[0];

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [targetDate, setTargetDate] = useState<string>(getTodayString());

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "dailyMenu", targetDate), async (docSnap) => {
      if (docSnap.exists()) {
        setItems(docSnap.data().items as MenuItem[]);
      } else {
        const masterSnap = await getDoc(doc(db, "globalSettings", "masterMenu"));
        if (masterSnap.exists()) {
          setItems(masterSnap.data().items as MenuItem[]);
        } else {
          setItems(initialMenuItems);
        }
      }
    });
    return () => unsubscribe();
  }, [targetDate]);

  const saveMenuToFirebase = async () => {
    try {
      await setDoc(doc(db, "dailyMenu", targetDate), { items });
      await setDoc(doc(db, "globalSettings", "masterMenu"), { items });
    } catch (error) {
      console.error("Error saving menu:", error);
      throw error;
    }
  };

  return (
    <MenuContext.Provider value={{ items, setItems, targetDate, setTargetDate, saveMenuToFirebase }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) throw new Error('useMenu must be used within a MenuProvider');
  return context;
}