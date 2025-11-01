import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Shield, TrendingUp, ScanLine, GraduationCap, AlertTriangle, CheckCircle2, Clock, Play, Trophy, Users, Star, Target, Zap, ArrowRight, Globe, Mail, Usb, UserX } from 'lucide-react';
import { CyberHealthCheckModal } from './CyberHealthCheckModal';
import type { Company, Employee, Scan, Lesson } from '../App';

interface DashboardPageProps {
  company: Company;
  employees: Employee[];
  scans: Scan[];
  lessons: Lesson[];
  updateCompany: (updates: Partial<Company>) => void;
  onNavigate?: (page: string) => void;
}

export function DashboardPage({ company, employees, scans, lessons, updateCompany, onNavigate }: DashboardPageProps) {
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

      {/* Real-Time Protection Modules */}
      <div>
        <h3 className="text-gray-900 mb-4">🛡️ Real-Time Protection</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Browser Protection */}
          <Card 
            className="backdrop-blur-sm bg-gradient-to-br from-cyan-50 to-blue-50 border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => onNavigate?.('browser-protection')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900 text-sm">Web Shield</h4>
                  <p className="text-xs text-gray-600">Active</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Threats blocked</span>
                  <Badge className="bg-red-100 text-red-700 border-red-200">38</Badge>
                </div>
                <Progress value={95} className="h-1" />
              </div>
            </CardContent>
          </Card>

          {/* Email Security */}
          <Card 
            className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => onNavigate?.('email-security')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900 text-sm">Email Sync</h4>
                  <p className="text-xs text-gray-600">Connected</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Inbox scanned</span>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">95%</Badge>
                </div>
                <Progress value={95} className="h-1 [&>div]:bg-purple-500" />
              </div>
            </CardContent>
          </Card>

          {/* USB Protection */}
          <Card 
            className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => onNavigate?.('usb-protection')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Usb className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900 text-sm">USB Scanner</h4>
                  <p className="text-xs text-gray-600">3 Devices</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Safe devices</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">2/3</Badge>
                </div>
                <Progress value={67} className="h-1 [&>div]:bg-green-500" />
              </div>
            </CardContent>
          </Card>

          {/* Data Control */}
          <Card 
            className="backdrop-blur-sm bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => onNavigate?.('auto-data-erase')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <UserX className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900 text-sm">Data Control</h4>
                  <p className="text-xs text-gray-600">Enabled</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Policies active</span>
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200">3/3</Badge>
                </div>
                <Progress value={100} className="h-1 [&>div]:bg-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gamification Features */}
      <div>
        <h3 className="text-gray-900 mb-4">🏆 Gamification & Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Leaderboard Preview */}
        <Card 
          className="backdrop-blur-sm bg-gradient-to-br from-amber-50 to-yellow-50 border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          onClick={() => onNavigate?.('leaderboard')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Trophy className="w-5 h-5 text-amber-500" />
              Leaderboard
            </CardTitle>
            <CardDescription>See top cyber defenders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center text-white">
                  #1
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900">Your Rank</div>
                  <div className="text-xs text-gray-600">4,850 XP</div>
                </div>
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">6 Badges Earned</span>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">Level 12</Badge>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:opacity-90 group-hover:scale-105 transition-transform"
                size="sm"
              >
                View Rankings
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Team Missions Preview */}
        <Card 
          className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          onClick={() => onNavigate?.('team-missions')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Users className="w-5 h-5 text-blue-500" />
              Team Missions
            </CardTitle>
            <CardDescription>Collaborate and compete</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-white/60 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-900">Active Missions</span>
                </div>
                <div className="text-2xl text-blue-700 mb-1">3</div>
                <Progress value={65} className="h-2" />
                <p className="text-xs text-gray-600 mt-1">65% team progress</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">+500 XP Available</span>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">Team</Badge>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90 group-hover:scale-105 transition-transform"
                size="sm"
              >
                View Missions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* My Progress Preview */}
        <Card 
          className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          onClick={() => onNavigate?.('my-progress')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              My Progress
            </CardTitle>
            <CardDescription>Track your growth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-white/60 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-900">XP to Next Level</span>
                </div>
                <div className="text-2xl text-purple-700 mb-1">1,650</div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-gray-600 mt-1">75% to Level 13</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">+18% This Month</span>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">Improving</Badge>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 group-hover:scale-105 transition-transform"
                size="sm"
              >
                View Progress
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Security Recommendations */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Shield className="w-5 h-5 text-blue-500" />
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
