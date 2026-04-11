import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import WorkforceManagementPage from "./pages/WorkforceManagementPage";
import WorkforceAvailabilityPage from "./pages/WorkforceAvailabilityPage";
import MenuInputPage from "./pages/MenuInputPage";
import WorkstationSetupPage from "./pages/WorkstationSetupPage";
import DemandInputPage from "./pages/DemandInputPage";
import SkillMatrixPage from "./pages/SkillMatrixPage";
import TaskManagerPage from "./pages/TaskManagerPage";
import TaktTimeAnalysisPage from "./pages/TaktTimeAnalysisPage";
import UtilizationMonitorPage from "./pages/UtilizationMonitorPage";
import BottleneckDetectorPage from "./pages/BottleneckDetectorPage";
import StationAssignmentPage from "./pages/StationAssignmentPage";
import PerformanceReportsPage from "./pages/PerformanceReportsPage";
import KitchenLayoutEditorPage from "./pages/KitchenLayoutEditorPage";
import SystemArchitecturePage from "./pages/SystemArchitecturePage";
import HelpCenterPage from "./pages/HelpCenterPage";
import SettingsPage from "./pages/SettingsPage";

export const router = createBrowserRouter(
  [
    {
      path: "/login",
      Component: LoginPage,
    },
    {
      path: "/",
      Component: Layout,
      children: [
        { index: true, Component: DashboardPage },
        { path: "workforce-management", Component: WorkforceManagementPage },
        { path: "workforce-availability", Component: WorkforceAvailabilityPage },
        { path: "menu-input", Component: MenuInputPage },
        { path: "workstation-setup", Component: WorkstationSetupPage },
        { path: "demand-input", Component: DemandInputPage },
        { path: "skill-matrix", Component: SkillMatrixPage },
        { path: "task-manager", Component: TaskManagerPage },
        { path: "takt-time", Component: TaktTimeAnalysisPage },
        { path: "utilization", Component: UtilizationMonitorPage },
        { path: "bottleneck", Component: BottleneckDetectorPage },
        { path: "station-assignment", Component: StationAssignmentPage },
        { path: "performance", Component: PerformanceReportsPage },
        { path: "kitchen-layout", Component: KitchenLayoutEditorPage },
        { path: "system-architecture", Component: SystemArchitecturePage },
        { path: "help-center", Component: HelpCenterPage },
        { path: "settings", Component: SettingsPage },
      ],
    },
  ],
  {
    basename: "/Balansya1/", 
  }
);