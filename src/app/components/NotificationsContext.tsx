import React, { createContext, useContext, useState, useCallback } from 'react';

export type NotificationType = 'warning' | 'info' | 'success' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  time: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (type: NotificationType, message: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((type: NotificationType, message: string) => {
    setNotifications(prev => {
      // Prevent duplicate messages
      if (prev.some(n => n.message === message && !n.read)) return prev;
      
      const newNotif: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        message,
        time: new Date(),
        read: false
      };
      return [newNotif, ...prev];
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

// THIS IS THE MISSING PIECE YOUR BROWSER WAS LOOKING FOR!
export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}