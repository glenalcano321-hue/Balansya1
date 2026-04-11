import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { NotificationProvider } from './components/NotificationsContext';
import { WorkforceProvider } from './components/WorkforceState';

export default function App() {
  return (
    <NotificationProvider>
      <WorkforceProvider>
        <RouterProvider router={router} />
        <Toaster />
      </WorkforceProvider>
    </NotificationProvider>
  );
}