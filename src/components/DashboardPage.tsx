import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Shield, TrendingUp, ScanLine, GraduationCap, AlertTriangle, CheckCircle2, Clock, Play } from 'lucide-react';
import { CyberHealthCheckModal } from './CyberHealthCheckModal';
import type { Company, Employee, Scan, Lesson } from '../App';

interface DashboardPageProps {
  company: Company;
  employees: Employee[];
  scans: Scan[];
  lessons: Lesson[];
  updateCompany: (updates: Partial<Company>) => void;
}

export function DashboardPage({ company, employees, scans, lessons, updateCompany }: DashboardPageProps) {
  const [healthCheckOpen, setHealthCheckOpen] = useState(false);

  const lastScan = scans[0];
  const avgTrainingProgress = employees.length > 0
    ? Math.round(employees.reduce((sum, e) => sum + e.training_progress, 0) / employees.length)
    : 0;
  const completedLessons = lessons.filter(l => l.completed).length;
  const pendingActions = [
    !company.mfa_enabled && 'Enable MFA',
    !company.security_training && 'Complete security training',
    avgTrainingProgress < 100 && 'Finish employee training',
  ].filter(Boolean);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-orange-500';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">Welcome back! 👋</h2>
        <p className="text-gray-600">Here's your cybersecurity overview for {company.name}</p>
      </div>

      {/* Cyber Health Score - Featured Card */}
      <Card className="bg-gradient-to-br from-blue-500 via-blue-600 to-teal-600 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="w-6 h-6" />
            Cyber Health Score
          </CardTitle>
          <CardDescription className="text-blue-100">
            Overall security posture of your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Circular Progress */}
            <div className="relative w-48 h-48">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="white"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - company.health_score / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className="text-5xl text-white">{company.health_score}</div>
                <div className="text-blue-100">out of 100</div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="flex-1 space-y-4 w-full">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-100">Configuration (40%)</span>
                  <span className="text-white">
                    {[company.mfa_enabled, company.password_policy, company.backups_enabled, company.updates_current, company.antivirus_enabled, company.security_training].filter(Boolean).length}/6
                  </span>
                </div>
                <Progress value={([company.mfa_enabled, company.password_policy, company.backups_enabled, company.updates_current, company.antivirus_enabled, company.security_training].filter(Boolean).length / 6) * 100} className="h-2 bg-blue-400" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-100">Employee Readiness (30%)</span>
                  <span className="text-white">{avgTrainingProgress}%</span>
                </div>
                <Progress value={avgTrainingProgress} className="h-2 bg-blue-400" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-100">Threat Detection (30%)</span>
                  <span className="text-white">{scans.length} scans</span>
                </div>
                <Progress value={scans.length > 0 ? 70 : 0} className="h-2 bg-blue-400" />
              </div>

              <Button
                onClick={() => setHealthCheckOpen(true)}
                className="w-full bg-white text-blue-600 hover:bg-blue-50 mt-4"
              >
                <Play className="w-4 h-4 mr-2" />
                Run 2-Minute Cyber Check
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Last Scan */}
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <ScanLine className="w-5 h-5 text-blue-500" />
              Last Scan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lastScan ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {lastScan.risk_level === 'Safe' && (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Safe
                    </Badge>
                  )}
                  {lastScan.risk_level === 'Medium' && (
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Medium Risk
                    </Badge>
                  )}
                  {lastScan.risk_level === 'High' && (
                    <Badge className="bg-red-100 text-red-700 border-red-200">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      High Risk
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 text-sm truncate">{lastScan.url}</p>
                <p className="text-gray-500 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(lastScan.created_at).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">
                No scans yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Training Progress */}
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <GraduationCap className="w-5 h-5 text-teal-500" />
              Training Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl text-gray-900">{completedLessons}/{lessons.length}</div>
              <p className="text-gray-600">Lessons completed</p>
              <Progress value={(completedLessons / lessons.length) * 100} className="h-2" />
              <p className="text-gray-500 text-sm">
                Average employee progress: {avgTrainingProgress}%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Pending Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingActions.length > 0 ? (
              <div className="space-y-2">
                {pendingActions.slice(0, 3).map((action, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span className="text-gray-700">{action}</span>
                  </div>
                ))}
                {pendingActions.length > 3 && (
                  <p className="text-gray-500 text-xs mt-2">
                    +{pendingActions.length - 3} more actions
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-gray-600">All caught up! 🎉</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Security Recommendations */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Security Recommendations
          </CardTitle>
          <CardDescription>
            Improve your security posture with these actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!company.mfa_enabled && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-blue-900 mb-2">Enable Multi-Factor Authentication</h4>
                <p className="text-blue-700 text-sm mb-3">
                  Add an extra layer of security to protect your accounts
                </p>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  +15 points
                </Badge>
              </div>
            )}
            
            {!company.security_training && (
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <h4 className="text-teal-900 mb-2">Complete Security Training</h4>
                <p className="text-teal-700 text-sm mb-3">
                  Educate your team on the latest security best practices
                </p>
                <Badge className="bg-teal-100 text-teal-700 border-teal-200">
                  +10 points
                </Badge>
              </div>
            )}
            
            {!company.backups_enabled && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="text-purple-900 mb-2">Enable Automated Backups</h4>
                <p className="text-purple-700 text-sm mb-3">
                  Protect your data with regular automated backups
                </p>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                  +12 points
                </Badge>
              </div>
            )}
            
            {avgTrainingProgress < 100 && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="text-amber-900 mb-2">Complete Employee Training</h4>
                <p className="text-amber-700 text-sm mb-3">
                  Get all employees to 100% training completion
                </p>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                  +{Math.round((100 - avgTrainingProgress) / 10)} points
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cyber Health Check Modal */}
      <CyberHealthCheckModal
        open={healthCheckOpen}
        onClose={() => setHealthCheckOpen(false)}
        company={company}
        updateCompany={updateCompany}
      />
    </div>
  );
}
