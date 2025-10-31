import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  TrendingUp, Award, Target, Zap, Shield, Trophy, Star, 
  Calendar, CheckCircle2, Flame, Crown, Medal, Brain, Lock
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  dateEarned: Date;
  unlocked: boolean;
}

const performanceData = [
  { week: 'Week 1', quizScore: 65, completionRate: 40 },
  { week: 'Week 2', quizScore: 72, completionRate: 55 },
  { week: 'Week 3', quizScore: 78, completionRate: 70 },
  { week: 'Week 4', quizScore: 85, completionRate: 82 },
  { week: 'Week 5', quizScore: 88, completionRate: 88 },
  { week: 'Week 6', quizScore: 92, completionRate: 95 },
];

const monthlyActivity = [
  { month: 'Jan', xp: 1200 },
  { month: 'Feb', xp: 1800 },
  { month: 'Mar', xp: 2100 },
  { month: 'Apr', xp: 2800 },
  { month: 'May', xp: 3200 },
  { month: 'Jun', xp: 4850 },
];

const achievements: Achievement[] = [
  {
    id: '1',
    name: 'Phish Buster',
    description: 'Detected 50+ phishing attempts',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    dateEarned: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    unlocked: true
  },
  {
    id: '2',
    name: 'Firewall Guardian',
    description: 'Completed security configuration',
    icon: Shield,
    color: 'from-emerald-500 to-teal-500',
    dateEarned: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    unlocked: true
  },
  {
    id: '3',
    name: 'Zero-Click Hero',
    description: 'Perfect score on 10 quizzes',
    icon: Zap,
    color: 'from-yellow-500 to-amber-500',
    dateEarned: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    unlocked: true
  },
  {
    id: '4',
    name: 'Cyber Champion',
    description: 'Reached level 10',
    icon: Trophy,
    color: 'from-purple-500 to-pink-500',
    dateEarned: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    unlocked: true
  },
  {
    id: '5',
    name: 'Security Scholar',
    description: 'Completed all training modules',
    icon: Award,
    color: 'from-red-500 to-orange-500',
    dateEarned: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    unlocked: true
  },
  {
    id: '6',
    name: 'Vigilant Defender',
    description: 'Reported 20+ security incidents',
    icon: Medal,
    color: 'from-indigo-500 to-blue-500',
    dateEarned: new Date(),
    unlocked: true
  },
  {
    id: '7',
    name: 'Team Leader',
    description: 'Complete 5 team missions',
    icon: Crown,
    color: 'from-gray-300 to-gray-400',
    dateEarned: new Date(),
    unlocked: false
  },
  {
    id: '8',
    name: 'Master Guardian',
    description: 'Reach level 20',
    icon: Shield,
    color: 'from-gray-300 to-gray-400',
    dateEarned: new Date(),
    unlocked: false
  },
  {
    id: '9',
    name: 'Threat Hunter',
    description: 'Detect 100 phishing attempts',
    icon: Brain,
    color: 'from-gray-300 to-gray-400',
    dateEarned: new Date(),
    unlocked: false
  },
];

const stats = {
  currentLevel: 12,
  currentXp: 4850,
  nextLevelXp: 6500,
  totalBadges: 6,
  cyberHealthScore: 88,
  improvementRate: 18,
  streakDays: 27,
  completedCourses: 15,
  quizzesPassed: 24,
  phishingDetected: 67,
};

export function MyProgressPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const xpProgress = ((stats.currentXp - (stats.currentLevel * 500)) / ((stats.currentLevel + 1) * 500 - stats.currentLevel * 500)) * 100;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">My Progress 📊</h2>
        <p className="text-gray-600">Track your learning journey and cybersecurity achievements</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-8 h-8" />
                <Badge className="bg-white/20 text-white border-white/30">Level {stats.currentLevel}</Badge>
              </div>
              <div className="text-3xl mb-1">{stats.currentXp.toLocaleString()}</div>
              <div className="text-blue-100 text-sm">Total XP Earned</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="backdrop-blur-sm bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8" />
                <Badge className="bg-white/20 text-white border-white/30">Unlocked</Badge>
              </div>
              <div className="text-3xl mb-1">{stats.totalBadges}</div>
              <div className="text-emerald-100 text-sm">Badges Earned</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-8 h-8" />
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+{stats.improvementRate}%</span>
                </div>
              </div>
              <div className="text-3xl mb-1">{stats.cyberHealthScore}</div>
              <div className="text-purple-100 text-sm">Cyber Health Score</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="backdrop-blur-sm bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Flame className="w-8 h-8" />
                <Badge className="bg-white/20 text-white border-white/30">Active</Badge>
              </div>
              <div className="text-3xl mb-1">{stats.streakDays}</div>
              <div className="text-amber-100 text-sm">Day Streak</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cyber Health Meter */}
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Shield className="w-5 h-5 text-teal-500" />
                Cyber Health Meter
              </CardTitle>
              <CardDescription>Your overall security awareness and protection level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                {/* Circular Meter */}
                <div className="relative">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="rgba(0,0,0,0.1)"
                      strokeWidth="16"
                      fill="none"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="url(#healthGradient)"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - stats.cyberHealthScore / 100)}`}
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - stats.cyberHealthScore / 100) }}
                      transition={{ duration: 2, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#14b8a6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <motion.div
                      className="text-5xl text-gray-900"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      {stats.cyberHealthScore}
                    </motion.div>
                    <div className="text-gray-600">Excellent</div>
                  </div>
                </div>

                {/* Improvement Stats */}
                <div className="flex-1 space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-gray-900">Monthly Improvement</span>
                    </div>
                    <div className="text-2xl text-green-700">+{stats.improvementRate}%</div>
                    <p className="text-sm text-green-600 mt-1">
                      You've improved your phishing detection accuracy by {stats.improvementRate}% this month!
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <div className="text-xl text-blue-700">{stats.completedCourses}</div>
                      <div className="text-xs text-blue-600">Courses</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg text-center">
                      <div className="text-xl text-purple-700">{stats.quizzesPassed}</div>
                      <div className="text-xs text-purple-600">Quizzes</div>
                    </div>
                    <div className="p-3 bg-teal-50 rounded-lg text-center">
                      <div className="text-xl text-teal-700">{stats.phishingDetected}</div>
                      <div className="text-xs text-teal-600">Threats Found</div>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg text-center">
                      <div className="text-xl text-amber-700">{stats.streakDays}</div>
                      <div className="text-xs text-amber-600">Day Streak</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* XP Progress Bar */}
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Zap className="w-5 h-5 text-yellow-500" />
                XP Progress
              </CardTitle>
              <CardDescription>Your journey to Level {stats.currentLevel + 1}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Level Progress */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <div className="text-xl">{stats.currentLevel}</div>
                    </div>
                    <div>
                      <div className="text-gray-900">Level {stats.currentLevel}</div>
                      <div className="text-gray-600 text-sm">Current Level</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-gray-900 text-right">Level {stats.currentLevel + 1}</div>
                      <div className="text-gray-600 text-sm text-right">Next Level</div>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <div className="text-xl">{stats.currentLevel + 1}</div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-sm">
                      {stats.currentXp - (stats.currentLevel * 500)} / {(stats.currentLevel + 1) * 500 - stats.currentLevel * 500} XP
                    </span>
                    <span className="text-gray-900">{Math.round(xpProgress)}%</span>
                  </div>
                  <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                </div>

                {/* XP needed */}
                <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                  <Star className="w-5 h-5 text-amber-600" />
                  <span className="text-amber-900">
                    {(stats.currentLevel + 1) * 500 - stats.currentXp} XP needed to level up
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Performance Chart */}
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Performance Trends
                  </CardTitle>
                  <CardDescription>Your progress over the last 6 weeks</CardDescription>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                  <Button
                    size="sm"
                    variant={selectedPeriod === 'week' ? 'default' : 'ghost'}
                    onClick={() => setSelectedPeriod('week')}
                  >
                    Week
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedPeriod === 'month' ? 'default' : 'ghost'}
                    onClick={() => setSelectedPeriod('month')}
                  >
                    Month
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedPeriod === 'week' && (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="week" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="quizScore"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', r: 5 }}
                      name="Quiz Score"
                    />
                    <Line
                      type="monotone"
                      dataKey="completionRate"
                      stroke="#14b8a6"
                      strokeWidth={3}
                      dot={{ fill: '#14b8a6', r: 5 }}
                      name="Completion Rate"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
              {selectedPeriod === 'month' && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Bar dataKey="xp" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#14b8a6" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              )}

              {/* Motivational Message */}
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-gray-900">Outstanding Progress!</div>
                    <p className="text-gray-600 text-sm">
                      You've improved your phishing detection accuracy by {stats.improvementRate}% this month! Keep up the great work.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Achievements */}
        <div className="space-y-6">
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Award className="w-5 h-5 text-purple-500" />
                Achievements
              </CardTitle>
              <CardDescription>
                {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        achievement.unlocked
                          ? `bg-gradient-to-br ${achievement.color} border-transparent text-white shadow-lg`
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            achievement.unlocked ? 'bg-white/20 backdrop-blur-sm' : 'bg-gray-200'
                          }`}
                        >
                          <Icon className={`w-6 h-6 ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`flex items-start justify-between gap-2 mb-1`}>
                            <h4 className={achievement.unlocked ? 'text-white' : 'text-gray-900'}>
                              {achievement.name}
                            </h4>
                            {achievement.unlocked && (
                              <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
                            )}
                            {!achievement.unlocked && (
                              <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                          </div>
                          <p className={`text-sm ${achievement.unlocked ? 'text-white/80' : 'text-gray-600'}`}>
                            {achievement.description}
                          </p>
                          {achievement.unlocked && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-white/70">
                              <Calendar className="w-3 h-3" />
                              <span>Earned {achievement.dateEarned.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {achievement.unlocked && (
                        <motion.div
                          className="absolute inset-0 bg-white/10 rounded-xl pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0.5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
