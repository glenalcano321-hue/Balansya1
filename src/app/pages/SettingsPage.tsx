import { useState, useEffect } from 'react';
import { Lock, Monitor, Accessibility, User, Info, Save, Database, BellRing } from 'lucide-react';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [utilizationAlerts, setUtilizationAlerts] = useState(true);
  const [performanceReports, setPerformanceReports] = useState(false);
  const [cloudSync, setCloudSync] = useState(false);

  // 1. Initialize state from localStorage so settings persist across reloads
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('balansya-fontsize') || 'medium');

  // 2. FONT SIZE EFFECT: Watch for font changes and scale the root REM size
  useEffect(() => {
    const root = window.document.documentElement;
    if (fontSize === 'small') {
      root.style.fontSize = '14px'; // Scales Tailwind's rem units down
    } else if (fontSize === 'large') {
      root.style.fontSize = '18px'; // Scales Tailwind's rem units up
    } else {
      root.style.fontSize = '16px'; // Default standard size
    }
    localStorage.setItem('balansya-fontsize', fontSize);
  }, [fontSize]);

  const handleSave = () => {
    toast.success('System preferences saved successfully');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">System Preferences</h2>
        <p className="text-gray-600 mt-1">Manage global application settings, alerts, and database connections</p>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
            <User className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900">Administrator Profile</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="full-name" className="text-gray-700">Full Name</Label>
              <Input id="full-name" defaultValue="System Administrator" className="focus-visible:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email Address</Label>
              <Input id="email" type="email" defaultValue="admin@balansya.local" className="focus-visible:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-700">Role Designation</Label>
              <Input id="role" defaultValue="Lean Operations Director" disabled className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="establishment" className="text-gray-700">Enterprise Name</Label>
              <Input id="establishment" defaultValue="Capstone Culinary Enterprise" className="focus-visible:ring-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Data & Synchronization */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
          <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900">Data & Synchronization</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1 pr-6">
              <Label className="text-base">Enable Firebase Cloud Sync</Label>
              <p className="text-sm text-gray-500 leading-relaxed">
                Currently running in Local Storage mode. Toggle this to connect to your Firebase backend for real-time floor synchronization across multiple iPads/devices.
              </p>
            </div>
            <Switch 
              checked={cloudSync} 
              onCheckedChange={(val) => {
                setCloudSync(val);
                if (val) toast.info('Firebase connection requires .env configuration.');
              }} 
            />
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
          <div className="p-2 bg-red-100 text-red-700 rounded-lg">
            <BellRing className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900">Workflow Alerts & Notifications</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-6">
              <Label className="text-base font-semibold">Takt Time & Bottleneck Alerts</Label>
              <p className="text-sm text-gray-500">Trigger UI warnings when a station's cycle time exceeds the required takt time.</p>
            </div>
            <Switch checked={criticalAlerts} onCheckedChange={setCriticalAlerts} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-6">
              <Label className="text-base font-semibold">Worker Utilization Warnings</Label>
              <p className="text-sm text-gray-500">Get notified if the auto-assigner places a worker at &gt;90% capacity (fatigue risk).</p>
            </div>
            <Switch checked={utilizationAlerts} onCheckedChange={setUtilizationAlerts} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-6">
              <Label className="text-base font-semibold">Daily Efficiency Reports</Label>
              <p className="text-sm text-gray-500">Compile end-of-shift waste reduction metrics and utilization summaries.</p>
            </div>
            <Switch checked={performanceReports} onCheckedChange={setPerformanceReports} />
          </div>
        </div>
      </div>

      {/* UI Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Display Settings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <div className="p-2 bg-gray-100 text-gray-700 rounded-lg">
              <Monitor className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900">Display</h3>
          </div>
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger className="focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Compact</SelectItem>
                  <SelectItem value="medium">Standard</SelectItem>
                  <SelectItem value="large">Large (Kitchen Display)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Accessibility Settings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <div className="p-2 bg-gray-100 text-gray-700 rounded-lg">
              <Accessibility className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900">Accessibility</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>High Contrast Mode</Label>
                <p className="text-xs text-gray-500">For bright kitchen environments</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reduce Motion</Label>
                <p className="text-xs text-gray-500">Disable UI animations</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-xl shadow-lg p-8 text-white relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl pointer-events-none"></div>
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
            <Info className="w-8 h-8 text-blue-200" />
          </div>
          <div className="space-y-3 flex-1">
            <div>
              <h4 className="text-xl font-bold mb-1">Balansya</h4>
              <p className="text-blue-200 text-sm font-medium tracking-wide uppercase">Workforce Optimization System</p>
            </div>
            <p className="text-sm text-blue-100 leading-relaxed max-w-2xl">
              A skill matching and production line balancing system designed specifically for small culinary enterprises (MSMEs). 
              Applying Lean Six Sigma methodologies to optimize workforce allocation, reduce operational waste, and improve flow.
            </p>
            <div className="pt-4 mt-4 border-t border-white/20 grid grid-cols-2 gap-4 text-xs text-blue-200">
              <div>
                <span className="opacity-70 block mb-0.5">Development</span>
                <span className="font-semibold text-white">Capstone Project 2026</span>
              </div>
              <div>
                <span className="opacity-70 block mb-0.5">Location</span>
                <span className="font-semibold text-white">Iloilo City, Philippines</span>
              </div>
              <div>
                <span className="opacity-70 block mb-0.5">System Version</span>
                <span className="font-semibold text-white">v2.0.01-stable</span>
              </div>
              <div>
                <span className="opacity-70 block mb-0.5">License</span>
                <span className="font-semibold text-white">Academic / Research</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3 sticky bottom-6 bg-gray-50/80 p-4 rounded-xl backdrop-blur-md border border-gray-200/50 shadow-sm z-50">
        <Button variant="outline" className="bg-white">Discard Changes</Button>
        <Button onClick={handleSave} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Save className="w-4 h-4" />
          Save System Preferences
        </Button>
      </div>
    </div>
  );
}