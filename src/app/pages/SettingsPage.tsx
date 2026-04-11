import { useState } from 'react';
import { Lock, Monitor, Accessibility, User, Info, Save } from 'lucide-react';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [performanceReports, setPerformanceReports] = useState(false);
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Account Settings</h3>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input id="full-name" defaultValue="Manager Name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="manager@example.com" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue="Operations Manager" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="establishment">Establishment</Label>
              <Input id="establishment" defaultValue="Sample Culinary Enterprise" />
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Privacy & Notifications</h3>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive email updates about system changes</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Critical Alerts</Label>
              <p className="text-sm text-gray-500">Get notified about bottlenecks and capacity issues</p>
            </div>
            <Switch checked={criticalAlerts} onCheckedChange={setCriticalAlerts} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Daily Performance Reports</Label>
              <p className="text-sm text-gray-500">Receive daily summary reports via email</p>
            </div>
            <Switch checked={performanceReports} onCheckedChange={setPerformanceReports} />
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <Monitor className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Display Settings</h3>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Font Size</Label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date Format</Label>
            <Select defaultValue="mdy">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Time Format</Label>
            <Select defaultValue="12h">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                <SelectItem value="24h">24-hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <Accessibility className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Accessibility</h3>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>High Contrast Mode</Label>
              <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Reduce Motion</Label>
              <p className="text-sm text-gray-500">Minimize animations and transitions</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Keyboard Navigation</Label>
              <p className="text-sm text-gray-500">Enhanced keyboard shortcuts</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">About Balansya</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Balansya Workforce Optimization System</h4>
            <p className="text-sm text-gray-600">Version 1.0.0</p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Capstone Project Team</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              A skill matching and production line balancing system designed specifically for small culinary enterprises (MSMEs).
              This system helps managers optimize workforce allocation, reduce bottlenecks, and improve operational efficiency.
            </p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Credits</h4>
            <p className="text-sm text-gray-600">
              Developed as a capstone project - 2026
            </p>
            <p className="text-sm text-gray-600 mt-1">
              © 2026 Balansya Team. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
