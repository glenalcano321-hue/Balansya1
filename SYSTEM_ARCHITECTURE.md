# Balansya - Workforce Optimization System

## System Overview

Balansya is a comprehensive web-based skill matching and production line balancing system designed for small to medium culinary enterprises. The system follows a clear, traceable workflow from daily inputs through analytical processing to actionable recommendations.

## Workflow Architecture

### Stage 1: Daily Setup (Input Phase)

The workflow begins with three critical data input pages that establish the operating context for the day:

#### 1.1 Workforce Availability (`/workforce-availability`)
- **Purpose**: Capture daily attendance status
- **Input**: Worker presence (present, absent, day-off, unavailable)
- **Output**: Available workforce capacity for the day
- **Key Metrics**: Total workers, present count, absent count
- **Impact**: Determines available labor capacity for station assignments

#### 1.2 Menu Input (`/menu-input`)
- **Purpose**: Define active menu items and expected order volumes
- **Input**: Menu item selection, expected orders per item
- **Output**: Total workload requirements by preparation stage
- **Key Metrics**: Active items, total expected orders, prep time load, cook time load
- **Impact**: Establishes task requirements and time demands per workstation

#### 1.3 Demand & Event Input (`/demand-input`)
- **Purpose**: Set demand expectations and operational conditions
- **Input**: Baseline demand, event type (normal/peak/promo/holiday/bulk-order), bulk order size
- **Output**: Adjusted final demand with multipliers applied
- **Key Metrics**: Final expected demand, event multiplier
- **Impact**: Scales workload calculations and capacity requirements

### Stage 2: System Analysis (Processing Phase)

After daily inputs are complete, the system analyzes multiple dimensions of the operation:

#### 2.1 Skill Matrix (`/skill-matrix`)
- **Purpose**: Map worker competencies across all workstations
- **Analysis**: Worker skill levels (1-5 scale) for each station type
- **Key Insight**: Identifies which workers can effectively perform at each station
- **Logic**: Higher skill levels (4-5) = faster execution and better quality
- **Output**: Skill compatibility matrix for assignment optimization

#### 2.2 Takt Time Analysis (`/takt-time`)
- **Purpose**: Calculate required production pace
- **Formula**: Takt Time = Available Production Time ÷ Customer Demand
- **Key Insight**: Target cycle time per order to meet demand without delays
- **Logic**: Station cycle times must stay below takt time to avoid bottlenecks
- **Output**: Target pace (seconds per unit) for all stations

#### 2.3 Utilization Monitor (`/utilization`)
- **Purpose**: Measure worker productivity and idle time
- **Formula**: Utilization = Active Work Time ÷ Total Available Time
- **Key Insight**: Optimal range is 80-95% (balance between efficiency and sustainability)
- **Logic**: Low utilization = idle time; high utilization (>95%) = fatigue risk
- **Output**: Worker-level utilization rates and idle time quantification

#### 2.4 Bottleneck Detector (`/bottleneck`)
- **Purpose**: Identify capacity constraints in the production flow
- **Detection Logic**: Utilization > 100% = bottleneck (demand exceeds capacity)
- **Key Insight**: Shows where work accumulates and slows the entire line
- **Visual**: Process flow diagram with highlighted constraint stations
- **Output**: List of bottleneck stations requiring immediate attention

### Stage 3: Recommendations (Output Phase)

Based on all inputs and analyses, the system generates optimization recommendations:

#### 3.1 Station Assignment (`/station-assignment`)
- **Purpose**: Recommend optimal worker-to-station assignments
- **Optimization Goals**:
  - Minimize cycle time variance across stations
  - Balance utilization rates (target: 80-95%)
  - Match worker skills to task requirements
  - Eliminate or mitigate bottlenecks
- **Logic Explanation**:
  - Uses workforce availability (Stage 1.1)
  - Considers menu load requirements (Stage 1.2)
  - Applies demand multipliers (Stage 1.3)
  - Matches skills from matrix (Stage 2.1)
  - Enforces takt time targets (Stage 2.2)
  - Balances utilization levels (Stage 2.3)
  - Resolves detected bottlenecks (Stage 2.4)
- **Output**: Worker assignments with projected utilization rates

#### 3.2 Kitchen Layout Editor (`/kitchen-layout`)
- **Purpose**: Visualize and optimize physical workstation arrangement
- **Integration**: Links assignments to physical layout
- **Output**: Spatial optimization for workflow efficiency

### Stage 4: Monitoring (Feedback Phase)

#### 4.1 Operations Dashboard (`/`)
- **Purpose**: Real-time monitoring of current operations
- **Key Metrics**: Takt time, workforce utilization, bottleneck count, line efficiency
- **Quick Actions**: Start new daily setup, view alerts, access any workflow stage
- **Output**: At-a-glance system status

#### 4.2 Performance Reports (`/performance`)
- **Purpose**: Historical analysis and trend tracking
- **Key Insight**: Shows outcomes of complete workflow cycles over time
- **Metrics**: Efficiency trends, utilization patterns, idle time reduction
- **Output**: Validation of balancing strategies and continuous improvement data

## User Interface Design Principles

### Navigation Structure

The sidebar is organized by workflow stage (not alphabetically):

1. **Daily Setup**
   - Workforce Availability
   - Menu Input
   - Demand & Events

2. **System Analysis**
   - Skill Matrix
   - Takt Time Analysis
   - Utilization Monitor
   - Bottleneck Detector

3. **Recommendations**
   - Station Assignment
   - Kitchen Layout

4. **Monitoring**
   - Dashboard
   - Performance Reports

### Workflow Progress Tracker

A persistent progress bar at the top shows:
- Stage 1: Daily Setup (blue when active)
- Stage 2: System Analysis (blue when active)
- Stage 3: Recommendations (blue when active)
- Stage 4: Monitoring (blue when active)

### Contextual Information

Each page includes:
- **Workflow Context Panel**: Explains how this page fits into the overall process
- **Computation Logic**: Shows the formulas and reasoning used
- **Input Summary**: References what data from previous steps is being used
- **Next Step Button**: Clear navigation to the subsequent workflow stage

## Technical Implementation

### Technology Stack
- **Frontend Framework**: React 18.3
- **Routing**: React Router 7
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **UI Components**: Radix UI, Lucide Icons
- **Interactions**: React DnD (drag-and-drop for layout editor)

### Project Structure
```
src/app/
├── App.tsx                    # Root component
├── routes.ts                  # Route configuration
├── components/
│   ├── Layout.tsx            # Main layout with sidebar and workflow progress
│   ├── WorkflowProgress.tsx  # Workflow stage tracker
│   └── [other components]
└── pages/
    ├── LoginPage.tsx
    ├── DashboardPage.tsx
    ├── WorkforceAvailabilityPage.tsx
    ├── MenuInputPage.tsx
    ├── DemandInputPage.tsx
    ├── SkillMatrixPage.tsx
    ├── TaktTimeAnalysisPage.tsx
    ├── UtilizationMonitorPage.tsx
    ├── BottleneckDetectorPage.tsx
    ├── StationAssignmentPage.tsx
    ├── KitchenLayoutEditorPage.tsx
    └── PerformanceReportsPage.tsx
```

### Key Features

1. **Traceable Logic**: Every recommendation shows its calculation source
2. **Progressive Workflow**: Clear path from inputs → analysis → recommendations
3. **Visual Continuity**: Consistent design language and color coding
4. **Responsive Design**: Works on desktop and mobile devices
5. **Real-time Feedback**: Immediate visual updates as inputs change
6. **Educational**: Built for academic capstone presentation with clear explanations

## Use Case: Typical Daily Workflow

### Morning Setup (8:00 AM)
1. Manager logs in via `/login`
2. Navigates to Workforce Availability
3. Sets attendance for 6 workers (present) and 2 workers (day-off)
4. Proceeds to Menu Input
5. Activates 8 menu items with expected order volumes
6. Advances to Demand Input
7. Sets baseline demand (150 orders), selects "Peak Day" (1.5x multiplier)
8. Final demand: 225 orders

### System Analysis (8:15 AM)
9. System automatically calculates:
   - Takt time: 45 seconds per order
   - Worker utilization rates
   - Identifies ST-04 as bottleneck (105% utilization)

### Assignment Review (8:20 AM)
10. Manager reviews recommended station assignments
11. Runs optimization to rebalance ST-04 workload
12. Views kitchen layout for spatial verification
13. Confirms assignments for the day

### Operations Monitoring (Throughout Day)
14. Dashboard shows real-time metrics
15. Alerts appear if utilization exceeds thresholds
16. End-of-day performance report generated automatically

## Academic Presentation Notes

This system demonstrates:
- **Systems thinking**: Input → Process → Output → Feedback loop
- **Operations research**: Takt time, line balancing, bottleneck theory
- **Data-driven decision making**: Quantified recommendations, not intuition
- **Human-centered design**: Manager-friendly interface, clear explanations
- **Software engineering**: Clean architecture, component-based design, responsive UI

The redesign makes the computational logic transparent and traceable, suitable for academic evaluation and practical small business use.
