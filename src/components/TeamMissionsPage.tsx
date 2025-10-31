import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Users, Target, Clock, CheckCircle2, Play, MessageCircle, 
  Send, TrendingUp, Award, Shield, Zap, Flame, Trophy, Star 
} from 'lucide-react';

interface Mission {
  id: string;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  deadline: Date;
  progress: number;
  status: 'active' | 'pending' | 'completed';
  participants: number;
  maxParticipants: number;
  teamColor: string;
}

interface Comment {
  id: string;
  user: string;
  avatar: string;
  message: string;
  timestamp: Date;
}

const mockMissions: Mission[] = [
  {
    id: '1',
    name: 'Complete Phishing Simulation',
    description: 'All team members must complete and pass the phishing email identification test with 80% accuracy.',
    difficulty: 'Medium',
    xpReward: 500,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    progress: 65,
    status: 'active',
    participants: 13,
    maxParticipants: 20,
    teamColor: 'teal'
  },
  {
    id: '2',
    name: 'Weekly Cyber Quiz Challenge',
    description: 'Team challenge: Achieve a combined score of 1000 points across all weekly security quizzes.',
    difficulty: 'Easy',
    xpReward: 300,
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    progress: 85,
    status: 'active',
    participants: 17,
    maxParticipants: 20,
    teamColor: 'violet'
  },
  {
    id: '3',
    name: 'Security Awareness Training',
    description: 'Complete all 5 security awareness modules and achieve 90% or higher on the final assessment.',
    difficulty: 'Hard',
    xpReward: 800,
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    progress: 40,
    status: 'active',
    participants: 8,
    maxParticipants: 20,
    teamColor: 'cyan'
  },
  {
    id: '4',
    name: 'Password Audit Sprint',
    description: 'All team members must check and update passwords to meet new security standards.',
    difficulty: 'Easy',
    xpReward: 250,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    progress: 20,
    status: 'pending',
    participants: 4,
    maxParticipants: 20,
    teamColor: 'gray'
  },
  {
    id: '5',
    name: 'Report 10 Security Incidents',
    description: 'Team goal: Collectively identify and report 10 security incidents or suspicious activities.',
    difficulty: 'Medium',
    xpReward: 600,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    progress: 0,
    status: 'pending',
    participants: 0,
    maxParticipants: 20,
    teamColor: 'gray'
  },
  {
    id: '6',
    name: 'Master Email Security',
    description: 'Complete advanced email security training and identify 20 phishing attempts successfully.',
    difficulty: 'Hard',
    xpReward: 1000,
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    progress: 100,
    status: 'completed',
    participants: 20,
    maxParticipants: 20,
    teamColor: 'teal'
  },
];

const mockComments: Comment[] = [
  {
    id: '1',
    user: 'Sarah Johnson',
    avatar: 'SJ',
    message: 'Great progress team! Let\'s push for 100% completion by Friday 💪',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    user: 'Michael Chen',
    avatar: 'MC',
    message: 'Just completed mine! The quiz was trickier than I expected.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: '3',
    user: 'Emily Davis',
    avatar: 'ED',
    message: 'Anyone need help with question 7? Happy to share tips!',
    timestamp: new Date(Date.now() - 30 * 60 * 1000)
  },
];

const teamOfTheMonth = {
  name: 'Blue Shield Squad',
  members: 20,
  xpEarned: 12500,
  missionsCompleted: 15,
  avatar: 'BS'
};

export function TeamMissionsPage() {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(mockComments);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Hard':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTeamColorClass = (color: string) => {
    switch (color) {
      case 'teal':
        return 'from-teal-500 to-cyan-500';
      case 'violet':
        return 'from-violet-500 to-purple-500';
      case 'cyan':
        return 'from-cyan-500 to-blue-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Active</Badge>;
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>;
      default:
        return null;
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      user: 'You',
      avatar: 'YO',
      message: newComment,
      timestamp: new Date()
    };
    
    setComments([...comments, comment]);
    setNewComment('');
  };

  const activeMissions = mockMissions.filter(m => m.status === 'active');
  const pendingMissions = mockMissions.filter(m => m.status === 'pending');
  const completedMissions = mockMissions.filter(m => m.status === 'completed');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">Team Missions 🤝</h2>
        <p className="text-gray-600">Collaborate, compete, and conquer cybersecurity challenges together</p>
      </div>

      {/* Team of the Month */}
      <Card className="bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 text-white border-0 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Trophy className="w-6 h-6" />
            Team of the Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border-4 border-white/30 shadow-xl">
              <div className="text-3xl">{teamOfTheMonth.avatar}</div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl text-white mb-2">{teamOfTheMonth.name}</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xl">{teamOfTheMonth.members}</div>
                  <div className="text-yellow-100 text-sm">Members</div>
                </div>
                <div>
                  <div className="text-xl">{teamOfTheMonth.xpEarned.toLocaleString()}</div>
                  <div className="text-yellow-100 text-sm">XP Earned</div>
                </div>
                <div>
                  <div className="text-xl">{teamOfTheMonth.missionsCompleted}</div>
                  <div className="text-yellow-100 text-sm">Missions</div>
                </div>
              </div>
            </div>
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="w-24 h-24 text-white/30" />
            </motion.div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Missions List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Missions */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-orange-500" />
              <h3 className="text-gray-900">Active Missions</h3>
              <Badge className="bg-orange-100 text-orange-700 border-orange-200">{activeMissions.length}</Badge>
            </div>
            <div className="space-y-3">
              {activeMissions.map((mission, index) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="backdrop-blur-sm bg-white/90 border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                    onClick={() => setSelectedMission(mission)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Mission Icon */}
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getTeamColorClass(mission.teamColor)} flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <Target className="w-7 h-7 text-white" />
                        </div>

                        {/* Mission Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h4 className="text-gray-900 mb-1">{mission.name}</h4>
                              <p className="text-gray-600 text-sm">{mission.description}</p>
                            </div>
                            {getStatusBadge(mission.status)}
                          </div>

                          {/* Mission Stats */}
                          <div className="flex items-center gap-4 mt-3 mb-3">
                            <Badge className={getDifficultyColor(mission.difficulty)}>
                              {mission.difficulty}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Zap className="w-4 h-4 text-amber-500" />
                              <span>{mission.xpReward} XP</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Users className="w-4 h-4 text-blue-500" />
                              <span>{mission.participants}/{mission.maxParticipants}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span>{Math.ceil((mission.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days</span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">Team Progress</span>
                              <span className="text-sm text-gray-900">{mission.progress}%</span>
                            </div>
                            <div className="relative">
                              <Progress value={mission.progress} className="h-2" />
                              {mission.progress > 80 && (
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                  animate={{ x: ['-100%', '200%'] }}
                                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                />
                              )}
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="mt-4">
                            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:opacity-90">
                              <Play className="w-4 h-4 mr-2" />
                              Continue Mission
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pending Missions */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-500" />
              <h3 className="text-gray-900">Pending Missions</h3>
              <Badge className="bg-gray-100 text-gray-700 border-gray-200">{pendingMissions.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pendingMissions.map((mission, index) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-md hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Target className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm text-gray-900 truncate">{mission.name}</h4>
                          <Badge className={`${getDifficultyColor(mission.difficulty)} text-xs`}>
                            {mission.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{mission.xpReward} XP</span>
                        <Button size="sm" variant="outline">
                          <Play className="w-3 h-3 mr-1" />
                          Start
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Completed Missions */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h3 className="text-gray-900">Completed Missions</h3>
              <Badge className="bg-green-100 text-green-700 border-green-200">{completedMissions.length}</Badge>
            </div>
            <div className="space-y-2">
              {completedMissions.map((mission) => (
                <Card key={mission.id} className="backdrop-blur-sm bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm text-gray-900">{mission.name}</h4>
                        <p className="text-xs text-gray-600">Completed by {mission.participants} members</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        +{mission.xpReward} XP
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Team Chat & Stats */}
        <div className="space-y-4">
          {/* Team Stats */}
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <TrendingUp className="w-5 h-5 text-teal-500" />
                Team Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Active Members</span>
                    <span className="text-gray-900">18/20</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>

                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Missions Completed</span>
                    <span className="text-gray-900">15</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Total XP Earned</span>
                    <span className="text-gray-900">12,500</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-700">
                    <TrendingUp className="w-3 h-3" />
                    <span>+25% this week</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Discussion */}
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                Team Discussion
              </CardTitle>
              <CardDescription>Collaborate and share tips</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Comments */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-xs">
                          {comment.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-900 mb-1">{comment.user}</div>
                          <p className="text-sm text-gray-700">{comment.message}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment Input */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 min-h-[60px] resize-none"
                  />
                  <Button
                    onClick={handleAddComment}
                    className="bg-gradient-to-r from-blue-500 to-teal-500 text-white self-end"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Shield */}
          <Card className="backdrop-blur-sm bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-4 border-white/30"
                >
                  <Shield className="w-10 h-10 text-white" />
                </motion.div>
                <h4 className="text-white mb-2">Company Shield</h4>
                <p className="text-white/80 text-sm mb-4">
                  Complete 3 more missions to unlock the Platinum Shield!
                </p>
                <Progress value={60} className="h-2 bg-white/20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
