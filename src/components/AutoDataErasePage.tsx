import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Alert, AlertDescription } from './ui/alert';
import { 
  UserX, Shield, Trash2, Archive, Key, 
  AlertTriangle, CheckCircle2, Clock, FileText, Lock 
} from 'lucide-react';

interface OffboardingPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: any;
}

interface OffboardedEmployee {
  id: string;
  name: string;
  email: string;
  department: string;
  exitDate: Date;
  status: 'completed' | 'pending' | 'failed';
  filesErased: number;
  credentialsRevoked: boolean;
  logsArchived: boolean;
}

const mockPolicies: OffboardingPolicy[] = [
  {
    id: '1',
    name: 'Auto-wipe company files on exit',
    description: 'Automatically erases all company files from employee devices upon exit',
    enabled: true,
    icon: Trash2
  },
  {
    id: '2',
    name: 'Revoke credentials instantly',
    description: 'Immediately revokes all access credentials and API keys',
    enabled: true,
    icon: Key
  },
  {
    id: '3',
    name: 'Archive logs before deletion',
    description: 'Creates backup of activity logs before erasing employee data',
    enabled: true,
    icon: Archive
  },
];

const mockOffboardedEmployees: OffboardedEmployee[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    department: 'Engineering',
    exitDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    status: 'completed',
    filesErased: 1247,
    credentialsRevoked: true,
    logsArchived: true
  },
  {
    id: '2',
    name: 'Emma Wilson',
    email: 'emma.wilson@company.com',
    department: 'Marketing',
    exitDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    status: 'completed',
    filesErased: 892,
    credentialsRevoked: true,
    logsArchived: true
  },
  {
    id: '3',
    name: 'David Lee',
    email: 'david.lee@company.com',
    department: 'Sales',
    exitDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'pending',
    filesErased: 0,
    credentialsRevoked: false,
    logsArchived: false
  },
];

export function AutoDataErasePage() {
  const [policies, setPolicies] = useState<OffboardingPolicy[]>(mockPolicies);
  const [employees] = useState<OffboardedEmployee[]>(mockOffboardedEmployees);
  const [showWarning, setShowWarning] = useState(false);

  const handleTogglePolicy = (policyId: string) => {
    setPolicies(policies.map(p => 
      p.id === policyId ? { ...p, enabled: !p.enabled } : p
    ));
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 5000);
  };

  const completedCount = employees.filter(e => e.status === 'completed').length;
  const pendingCount = employees.filter(e => e.status === 'pending').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">Employee Exit Data Control 🔐</h2>
        <p className="text-gray-600">Automated data protection for employee offboarding</p>
      </div>

      {/* Warning Alert */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Policy changes will take effect immediately. This action ensures sensitive data is protected during employee transitions.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl mb-1">{employees.length}</div>
                <div className="text-blue-100 text-sm">Total Processed</div>
              </div>
              <UserX className="w-12 h-12 text-white/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl mb-1">{completedCount}</div>
                <div className="text-green-100 text-sm">Completed</div>
              </div>
              <CheckCircle2 className="w-12 h-12 text-white/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl mb-1">{pendingCount}</div>
                <div className="text-amber-100 text-sm">Pending</div>
              </div>
              <Clock className="w-12 h-12 text-white/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Policies */}
        <div className="lg:col-span-2 space-y-6">
          {/* Auto Data Erase Policies */}
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Shield className="w-5 h-5 text-blue-500" />
                Offboarding Protection Policies
              </CardTitle>
              <CardDescription>Configure automatic data protection rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policies.map((policy, index) => {
                  const Icon = policy.icon;
                  return (
                    <motion.div
                      key={policy.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        policy.enabled 
                          ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          policy.enabled 
                            ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                            : 'bg-gray-300'
                        }`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={policy.enabled ? 'text-blue-900' : 'text-gray-700'}>
                              {policy.name}
                            </h4>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Switch
                                  checked={policy.enabled}
                                  onCheckedChange={() => {}}
                                  className="data-[state=checked]:bg-blue-600"
                                />
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                                    Confirm Policy Change
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="space-y-3 pt-2">
                                    <p>
                                      You are about to {policy.enabled ? 'disable' : 'enable'}: <span className="font-semibold">{policy.name}</span>
                                    </p>
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                      <p className="text-amber-900 text-sm">
                                        {policy.enabled 
                                          ? '⚠️ Disabling this policy may expose sensitive company data during employee transitions.'
                                          : '✓ Enabling this policy will enhance data protection during employee offboarding.'
                                        }
                                      </p>
                                    </div>
                                    <p className="text-sm">
                                      This action ensures sensitive data is {policy.enabled ? 'not ' : ''}erased from departed employee systems.
                                    </p>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleTogglePolicy(policy.id)}
                                    className={policy.enabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                                  >
                                    {policy.enabled ? 'Disable' : 'Enable'} Policy
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                          <p className={`text-sm ${policy.enabled ? 'text-blue-700' : 'text-gray-600'}`}>
                            {policy.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Offboarding */}
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <FileText className="w-5 h-5 text-gray-500" />
                Recent Offboarding Activity
              </CardTitle>
              <CardDescription>Employees processed through data protection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employees.map((employee, index) => (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border ${
                      employee.status === 'completed' 
                        ? 'bg-green-50 border-green-200' 
                        : employee.status === 'pending'
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-gray-900">{employee.name}</h4>
                        <p className="text-gray-600 text-sm">{employee.email}</p>
                        <p className="text-gray-500 text-xs mt-1">{employee.department}</p>
                      </div>
                      <Badge className={
                        employee.status === 'completed'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : employee.status === 'pending'
                          ? 'bg-amber-100 text-amber-700 border-amber-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                      }>
                        {employee.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className={`p-2 rounded ${employee.filesErased > 0 ? 'bg-white' : 'bg-gray-100'}`}>
                        <div className="flex items-center gap-1 mb-1">
                          <Trash2 className="w-3 h-3 text-gray-600" />
                          <span className="text-gray-600">Files</span>
                        </div>
                        <div className="text-gray-900">{employee.filesErased.toLocaleString()}</div>
                      </div>
                      <div className={`p-2 rounded ${employee.credentialsRevoked ? 'bg-white' : 'bg-gray-100'}`}>
                        <div className="flex items-center gap-1 mb-1">
                          <Key className="w-3 h-3 text-gray-600" />
                          <span className="text-gray-600">Access</span>
                        </div>
                        <div className="text-gray-900">{employee.credentialsRevoked ? 'Revoked' : 'Active'}</div>
                      </div>
                      <div className={`p-2 rounded ${employee.logsArchived ? 'bg-white' : 'bg-gray-100'}`}>
                        <div className="flex items-center gap-1 mb-1">
                          <Archive className="w-3 h-3 text-gray-600" />
                          <span className="text-gray-600">Logs</span>
                        </div>
                        <div className="text-gray-900">{employee.logsArchived ? 'Archived' : 'Pending'}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>Exit date: {employee.exitDate.toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          {/* Protection Status */}
          <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white">Protection Active</h3>
                  <p className="text-purple-100 text-sm">All policies enabled</p>
                </div>
              </div>
              <p className="text-white/90 text-sm">
                Your organization is fully protected. All employee exits will be processed automatically with complete data erasure.
              </p>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-700 text-xs">1</span>
                  </div>
                  <p className="text-gray-700 text-sm">Employee exit is initiated in HR system</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-700 text-xs">2</span>
                  </div>
                  <p className="text-gray-700 text-sm">System archives activity logs for compliance</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-700 text-xs">3</span>
                  </div>
                  <p className="text-gray-700 text-sm">All access credentials are instantly revoked</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-700 text-xs">4</span>
                  </div>
                  <p className="text-gray-700 text-sm">Company files are securely erased from devices</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="backdrop-blur-sm bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1 text-sm">Important</h4>
                  <p className="text-gray-700 text-xs">
                    Ensure all policies are enabled before employee transitions. Data erasure is irreversible.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
