import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Trophy, Medal, Award, Shield, Crown, Target, Zap, Star, Flame } from 'lucide-react';
import { Progress } from './ui/progress';

interface LeaderboardUser {
  id: string;
  name: string;
  xp: number;
  level: number;
  badges: string[];
  department: string;
  avatar: string;
}

type FilterPeriod = 'weekly' | 'monthly' | 'alltime';

const BADGE_ICONS: { [key: string]: any } = {
  'Phish Buster': Target,
  'Firewall Guardian': Shield,
  'Zero-Click Hero': Zap,
  'Cyber Champion': Trophy,
  'Security Scholar': Award,
  'Vigilant Defender': Medal,
};

const mockLeaderboardData: LeaderboardUser[] = [
  { id: '1', name: 'Sarah Johnson', xp: 4850, level: 12, badges: ['Phish Buster', 'Firewall Guardian', 'Cyber Champion'], department: 'Engineering', avatar: 'SJ' },
  { id: '2', name: 'Michael Chen', xp: 4520, level: 11, badges: ['Phish Buster', 'Security Scholar'], department: 'Sales', avatar: 'MC' },
  { id: '3', name: 'Emily Davis', xp: 4210, level: 10, badges: ['Zero-Click Hero', 'Vigilant Defender'], department: 'Marketing', avatar: 'ED' },
  { id: '4', name: 'James Wilson', xp: 3890, level: 10, badges: ['Phish Buster'], department: 'Sales', avatar: 'JW' },
  { id: '5', name: 'Lisa Anderson', xp: 3650, level: 9, badges: ['Security Scholar', 'Firewall Guardian'], department: 'HR', avatar: 'LA' },
  { id: '6', name: 'David Martinez', xp: 3420, level: 9, badges: ['Cyber Champion'], department: 'Engineering', avatar: 'DM' },
  { id: '7', name: 'Rachel Lee', xp: 3180, level: 8, badges: ['Phish Buster', 'Zero-Click Hero'], department: 'Marketing', avatar: 'RL' },
  { id: '8', name: 'Tom Brown', xp: 2950, level: 8, badges: ['Vigilant Defender'], department: 'Sales', avatar: 'TB' },
];

const allBadges = [
  { name: 'Phish Buster', description: 'Detected 50+ phishing attempts', icon: Target, color: 'from-blue-500 to-cyan-500' },
  { name: 'Firewall Guardian', description: 'Completed security configuration', icon: Shield, color: 'from-emerald-500 to-teal-500' },
  { name: 'Zero-Click Hero', description: 'Perfect score on 10 quizzes', icon: Zap, color: 'from-yellow-500 to-amber-500' },
  { name: 'Cyber Champion', description: 'Reached level 10', icon: Trophy, color: 'from-purple-500 to-pink-500' },
  { name: 'Security Scholar', description: 'Completed all training modules', icon: Award, color: 'from-red-500 to-orange-500' },
  { name: 'Vigilant Defender', description: 'Reported 20+ security incidents', icon: Medal, color: 'from-indigo-500 to-blue-500' },
];

export function LeaderboardPage() {
  const [filter, setFilter] = useState<FilterPeriod>('weekly');
  const [showCelebration, setShowCelebration] = useState(false);

  const currentUser = mockLeaderboardData[0]; // Assuming current user is first
  const nextLevelXp = (currentUser.level + 1) * 500;
  const currentLevelXp = currentUser.level * 500;
  const xpProgress = ((currentUser.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-400" />;
      default:
        return null;
    }
  };

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-amber-500';
      case 2:
        return 'from-gray-300 to-gray-400';
      case 3:
        return 'from-orange-400 to-amber-600';
      default:
        return 'from-gray-100 to-gray-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-2">Leaderboard & Rewards 🏆</h2>
          <p className="text-gray-600">Top Cyber Defenders</p>
        </div>
        
        {/* Period Filter */}
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm p-1 rounded-xl shadow-md">
          {(['weekly', 'monthly', 'alltime'] as FilterPeriod[]).map((period) => (
            <Button
              key={period}
              variant={filter === period ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter(period)}
              className={filter === period ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white' : ''}
            >
              {period === 'weekly' && 'Weekly'}
              {period === 'monthly' && 'Monthly'}
              {period === 'alltime' && 'All-Time'}
            </Button>
          ))}
        </div>
      </div>

      {/* Your Stats Card */}
      <Card className="bg-gradient-to-br from-blue-500 via-blue-600 to-teal-600 text-white border-0 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Star className="w-6 h-6" />
            Your Ranking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Rank Circle */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-4 border-white/30">
                <div className="text-center">
                  <div className="text-4xl">#1</div>
                  <div className="text-sm text-blue-100">Rank</div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <Crown className="w-5 h-5 text-yellow-900" />
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl">{currentUser.xp.toLocaleString()}</div>
                  <div className="text-blue-100 text-sm">Total XP</div>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl">Level {currentUser.level}</div>
                  <div className="text-blue-100 text-sm">Current</div>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl">{currentUser.badges.length}</div>
                  <div className="text-blue-100 text-sm">Badges</div>
                </div>
              </div>

              {/* XP Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-100 text-sm">Progress to Level {currentUser.level + 1}</span>
                  <span className="text-white text-sm">{currentUser.xp - currentLevelXp} / {nextLevelXp - currentLevelXp} XP</span>
                </div>
                <div className="relative">
                  <Progress value={xpProgress} className="h-3 bg-blue-400" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard Rankings */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Trophy className="w-5 h-5 text-teal-500" />
                Top Defenders
              </CardTitle>
              <CardDescription>
                {filter === 'weekly' && 'This week\'s top performers'}
                {filter === 'monthly' && 'This month\'s champions'}
                {filter === 'alltime' && 'All-time leaderboard'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockLeaderboardData.map((user, index) => {
                  const rank = index + 1;
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md ${
                        rank <= 3 ? `bg-gradient-to-r ${getRankGradient(rank)} text-white` : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {/* Rank */}
                      <div className="flex items-center justify-center w-10 h-10 relative">
                        {getRankIcon(rank)}
                        {!getRankIcon(rank) && (
                          <span className={rank <= 3 ? 'text-white' : 'text-gray-600'}>
                            #{rank}
                          </span>
                        )}
                      </div>

                      {/* Avatar */}
                      <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                        <AvatarFallback className={rank <= 3 ? 'bg-white/20 text-white' : 'bg-gradient-to-br from-blue-500 to-teal-500 text-white'}>
                          {user.avatar}
                        </AvatarFallback>
                      </Avatar>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className={rank <= 3 ? 'text-white' : 'text-gray-900'}>{user.name}</div>
                        <div className={`text-sm ${rank <= 3 ? 'text-white/80' : 'text-gray-500'}`}>
                          {user.department} • Level {user.level}
                        </div>
                      </div>

                      {/* XP with animated ring */}
                      <div className="relative">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke={rank <= 3 ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'}
                            strokeWidth="4"
                            fill="none"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke={rank <= 3 ? 'white' : '#00C6AE'}
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 28}`}
                            strokeDashoffset={`${2 * Math.PI * 28 * (1 - (user.xp % 500) / 500)}`}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className={`text-xs ${rank <= 3 ? 'text-white' : 'text-gray-900'}`}>
                              {user.xp.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="hidden sm:flex items-center gap-1">
                        {user.badges.slice(0, 3).map((badge, i) => {
                          const BadgeIcon = BADGE_ICONS[badge] || Award;
                          return (
                            <div
                              key={i}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                rank <= 3 ? 'bg-white/20' : 'bg-gradient-to-br from-blue-500 to-teal-500'
                              }`}
                              title={badge}
                            >
                              <BadgeIcon className={`w-4 h-4 ${rank <= 3 ? 'text-white' : 'text-white'}`} />
                            </div>
                          );
                        })}
                        {user.badges.length > 3 && (
                          <div className={`text-xs ${rank <= 3 ? 'text-white/80' : 'text-gray-500'}`}>
                            +{user.badges.length - 3}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badge Showcase & Rewards */}
        <div className="space-y-4">
          {/* Badge Showcase */}
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Award className="w-5 h-5 text-purple-500" />
                Badge Collection
              </CardTitle>
              <CardDescription>
                {currentUser.badges.length} of {allBadges.length} unlocked
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {allBadges.map((badge, index) => {
                  const Icon = badge.icon;
                  const isUnlocked = currentUser.badges.includes(badge.name);
                  return (
                    <motion.div
                      key={badge.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="group relative"
                    >
                      <div
                        className={`p-4 rounded-xl border-2 transition-all ${
                          isUnlocked
                            ? `bg-gradient-to-br ${badge.color} border-transparent shadow-lg cursor-pointer`
                            : 'bg-gray-100 border-gray-200 opacity-50'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              isUnlocked ? 'bg-white/20 backdrop-blur-sm' : 'bg-gray-200'
                            }`}
                          >
                            <Icon className={`w-6 h-6 ${isUnlocked ? 'text-white' : 'text-gray-400'}`} />
                          </div>
                          <div className={`text-xs text-center ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                            {badge.name}
                          </div>
                        </div>
                        {isUnlocked && (
                          <motion.div
                            className="absolute inset-0 bg-white/20 rounded-xl"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                          />
                        )}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {badge.description}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Rewards Summary */}
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Flame className="w-5 h-5 text-orange-500" />
                Next Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">Team Leader</div>
                      <div className="text-xs text-gray-600">150 XP to unlock</div>
                      <Progress value={67} className="h-1 mt-1" />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">Master Guardian</div>
                      <div className="text-xs text-gray-600">450 XP to unlock</div>
                      <Progress value={23} className="h-1 mt-1" />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">100 Day Streak</div>
                      <div className="text-xs text-gray-600">73 days to go</div>
                      <Progress value={27} className="h-1 mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 0, x: 0, opacity: 1 }}
                animate={{
                  y: [0, -300],
                  x: [0, Math.random() * 400 - 200],
                  opacity: [1, 0],
                }}
                transition={{ duration: 2, delay: i * 0.05 }}
                className="absolute text-4xl"
              >
                🎉
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
