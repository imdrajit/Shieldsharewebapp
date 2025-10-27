import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Building, User, Users, Moon, Sun, RotateCcw, Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { User as UserType, Company, Employee } from '../App';

interface SettingsPageProps {
  user: UserType;
  company: Company;
  employees: Employee[];
  updateCompany: (updates: Partial<Company>) => void;
  updateEmployees: (employees: Employee[]) => void;
}

export function SettingsPage({ user, company, employees, updateCompany, updateEmployees }: SettingsPageProps) {
  const [companyName, setCompanyName] = useState(company.name);
  const [companyIndustry, setCompanyIndustry] = useState(company.industry);
  const [darkMode, setDarkMode] = useState(false);

  const handleSaveCompany = () => {
    updateCompany({
      name: companyName,
      industry: companyIndustry
    });
    toast.success('Company details updated successfully!');
  };

  const handleResetTraining = () => {
    // Reset all training progress
    const resetEmployees = employees.map(e => ({
      ...e,
      training_progress: 0,
      phish_clicks: 0
    }));
    updateEmployees(resetEmployees);
    toast.success('All training progress has been reset');
  };

  const handleResetHealth = () => {
    updateCompany({
      mfa_enabled: false,
      password_policy: false,
      backups_enabled: false,
      updates_current: false,
      antivirus_enabled: false,
      security_training: false,
      health_score: 30
    });
    toast.success('Health check has been reset');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company" className="space-y-6">
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your organization details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={companyIndustry}
                  onChange={(e) => setCompanyIndustry(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Company Size</Label>
                <Input
                  id="size"
                  value={company.size}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">Contact support to change company size</p>
              </div>

              <Button
                onClick={handleSaveCompany}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-500" />
                Employee List
              </CardTitle>
              <CardDescription>Manage your team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm text-gray-900">{employee.name}</div>
                      <div className="text-xs text-gray-500">{employee.email} · {employee.department}</div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {employee.training_progress}% trained
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Add Employee
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Name</Label>
                <Input id="userName" value={user.name} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userEmail">Email</Label>
                <Input id="userEmail" type="email" value={user.email} disabled className="bg-gray-50" />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={user.role} disabled className="bg-gray-50" />
              </div>

              <Button className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600">
                Update Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
              <Button variant="outline" className="w-full">
                Enable Two-Factor Authentication
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how ShieldShare looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="w-5 h-5 text-gray-600" /> : <Sun className="w-5 h-5 text-gray-600" />}
                  <div>
                    <div className="text-sm text-gray-900">Dark Mode</div>
                    <div className="text-xs text-gray-500">Switch to dark theme</div>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-900">Email Notifications</div>
                  <div className="text-xs text-gray-500">Receive security alerts via email</div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-900">Weekly Reports</div>
                  <div className="text-xs text-gray-500">Get weekly security summary</div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-900">Scan Alerts</div>
                  <div className="text-xs text-gray-500">Alert on high-risk detections</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions - use with caution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset All Training Progress
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset all employee training progress and phishing simulation results. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetTraining} className="bg-red-600 hover:bg-red-700">
                      Reset Training
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Health Check
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Cyber Health Check?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset your security configuration answers and recalculate your health score. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetHealth} className="bg-red-600 hover:bg-red-700">
                      Reset Health Check
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
