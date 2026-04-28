import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { NotificationProvider } from './components/NotificationsContext';
import { WorkforceProvider } from './components/WorkforceState';
import { SkillProvider } from './components/SkillContext'; 
import { WorkstationProvider } from './components/WorkstationContext';
import { DemandProvider } from './components/DemandContext';
import { MenuProvider } from './components/MenuContext';

export default function App() {
  return (
    <NotificationProvider>
      <WorkforceProvider>
        <SkillProvider> 
          <WorkstationProvider>
            <DemandProvider>
              <MenuProvider>
                <RouterProvider router={router} />
                <Toaster />
              </MenuProvider>
            </DemandProvider>
          </WorkstationProvider>
        </SkillProvider>
      </WorkforceProvider>
    </NotificationProvider>
  );
}