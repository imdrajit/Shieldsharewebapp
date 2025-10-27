import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Trophy, Clock, Target, CheckCircle2, XCircle, Play, RotateCcw, Sparkles } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Email {
  id: number;
  from: string;
  subject: string;
  preview: string;
  isPhishing: boolean;
  explanation: string;
}

interface GameScore {
  name: string;
  score: number;
  date: Date;
}

const emailBank: Email[] = [
  {
    id: 1,
    from: 'security@paypa1-verify.com',
    subject: 'URGENT: Verify Your Account Now',
    preview: 'Dear valued customer, we have detected suspicious activity. Click here immediately to verify your account or it will be suspended.',
    isPhishing: true,
    explanation: '❌ Phishing! Red flags: Mismatched domain (paypa1 instead of paypal), urgent language, generic greeting, threats of suspension.'
  },
  {
    id: 2,
    from: 'newsletter@company.com',
    subject: 'Your Monthly Newsletter - December 2024',
    preview: 'Hi Sarah, here\'s your monthly company newsletter with updates on projects, team events, and upcoming holidays.',
    isPhishing: false,
    explanation: '✅ Legitimate! Professional tone, personalized greeting, expected communication from known sender, no urgent threats.'
  },
  {
    id: 3,
    from: 'admin@secure-bank-login.tk',
    subject: 'Security Alert: Unusual Activity Detected',
    preview: 'Your account has been locked due to suspicious login attempts. Verify your identity here: bit.ly/bank123',
    isPhishing: true,
    explanation: '❌ Phishing! Red flags: Suspicious .tk domain, shortened URL, fear-based urgency, requests for verification.'
  },
  {
    id: 4,
    from: 'hr@yourcompany.com',
    subject: 'Team Meeting Tomorrow at 2 PM',
    preview: 'Reminder: We have our quarterly review meeting tomorrow at 2 PM in Conference Room B. Please bring your project updates.',
    isPhishing: false,
    explanation: '✅ Legitimate! Internal company email, reasonable request, no suspicious links, professional formatting.'
  },
  {
    id: 5,
    from: 'microsoft-security@outlook-verify.net',
    subject: 'Microsoft Account: Unusual Sign-in Activity',
    preview: 'We noticed a sign-in from an unusual location. Click here to review your account activity and secure your account now.',
    isPhishing: true,
    explanation: '❌ Phishing! Red flags: Mismatched domain (not @microsoft.com), generic branding, urgent action required.'
  },
  {
    id: 6,
    from: 'support@amazon.com',
    subject: 'Your Order #123-4567890 Has Shipped',
    preview: 'Good news! Your order has been shipped and will arrive by Friday. Track your package here.',
    isPhishing: false,
    explanation: '✅ Legitimate! Official Amazon domain, order confirmation, specific tracking information.'
  },
  {
    id: 7,
    from: 'winner@prize-notification.biz',
    subject: 'Congratulations! You\'ve Won $10,000!',
    preview: 'Dear lucky winner, you have been selected to receive $10,000. Claim your prize now by providing your bank details.',
    isPhishing: true,
    explanation: '❌ Phishing! Red flags: Too good to be true, suspicious domain, requests for banking information, unsolicited prize.'
  },
  {
    id: 8,
    from: 'calendar@google.com',
    subject: 'Invitation: Project Planning Meeting @ Wed Jan 15 3pm',
    preview: 'You have been invited to a meeting. View event details and RSVP.',
    isPhishing: false,
    explanation: '✅ Legitimate! Official Google domain, calendar invitation, professional format, no suspicious requests.'
  },
  {
    id: 9,
    from: 'IT-Support@company-helpdesk.info',
    subject: 'Password Expiration Notice',
    preview: 'Your password will expire in 24 hours. Click here to update your password immediately to avoid account lockout.',
    isPhishing: true,
    explanation: '❌ Phishing! Red flags: Unusual domain (.info), password reset request via email, urgent deadline, external link.'
  },
  {
    id: 10,
    from: 'linkedin@e.linkedin.com',
    subject: 'You appeared in 15 searches this week',
    preview: 'Hi there, your profile is getting attention. See who\'s viewed your profile this week.',
    isPhishing: false,
    explanation: '✅ Legitimate! Official LinkedIn domain (e.linkedin.com is their email subdomain), expected notification.'
  }
];

export function SpotThePhishGame() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [gameEmails, setGameEmails] = useState<Email[]>([]);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [leaderboard, setLeaderboard] = useState<GameScore[]>([
    { name: 'Alex Chen', score: 95, date: new Date(Date.now() - 86400000) },
    { name: 'Sarah Johnson', score: 90, date: new Date(Date.now() - 172800000) },
    { name: 'Mike Davis', score: 85, date: new Date(Date.now() - 259200000) },
    { name: 'Emily Wilson', score: 80, date: new Date(Date.now() - 345600000) },
    { name: 'James Brown', score: 75, date: new Date(Date.now() - 432000000) },
  ]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  const startGame = () => {
    // Shuffle and select 5 random emails
    const shuffled = [...emailBank].sort(() => Math.random() - 0.5).slice(0, 5);
    setGameEmails(shuffled);
    setCurrentEmailIndex(0);
    setAnswers([]);
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    setShowConfetti(false);
  };

  const handleAnswer = (isPhishing: boolean) => {
    const currentEmail = gameEmails[currentEmailIndex];
    const isCorrect = isPhishing === currentEmail.isPhishing;
    
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(score + 10);
      toast.success('Correct! +10 points');
    } else {
      setScore(Math.max(0, score - 5));
      toast.error('Wrong! -5 points');
    }

    if (currentEmailIndex < gameEmails.length - 1) {
      setCurrentEmailIndex(currentEmailIndex + 1);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    setGameState('finished');
    
    // Add to leaderboard if score is high enough
    const finalScore = score;
    if (finalScore >= 70) {
      setShowConfetti(true);
      toast.success('🎉 High score! You made the leaderboard!');
      const newScore: GameScore = {
        name: 'You',
        score: finalScore,
        date: new Date()
      };
      setLeaderboard([newScore, ...leaderboard].sort((a, b) => b.score - a.score).slice(0, 5));
    }
  };

  const currentEmail = gameEmails[currentEmailIndex];
  const progress = ((currentEmailIndex) / gameEmails.length) * 100;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">Spot the Phish 🎣</h2>
        <p className="text-gray-600">Test your phishing detection skills in this interactive game</p>
      </div>

      {/* Game Card */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                {gameState === 'idle' && 'Ready to Play?'}
                {gameState === 'playing' && 'Identify the Email'}
                {gameState === 'finished' && 'Game Over!'}
              </CardTitle>
              <CardDescription>
                {gameState === 'idle' && 'Identify 5 emails as real or phishing in 60 seconds'}
                {gameState === 'playing' && `Email ${currentEmailIndex + 1} of ${gameEmails.length}`}
                {gameState === 'finished' && `Your final score: ${score} points`}
              </CardDescription>
            </div>
            {gameState === 'playing' && (
              <div className="text-center">
                <div className="flex items-center gap-2 text-2xl text-gray-900">
                  <Clock className="w-6 h-6 text-blue-500" />
                  {timeLeft}s
                </div>
                <div className="text-sm text-gray-600">Score: {score}</div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {gameState === 'idle' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-gray-900 mb-3">How to Play</h3>
              <div className="max-w-md mx-auto space-y-3 text-left mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">1</div>
                  <p className="text-gray-700">You'll see 5 email previews</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">2</div>
                  <p className="text-gray-700">Mark each as "Real" or "Phishing"</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">3</div>
                  <p className="text-gray-700">Complete all 5 within 60 seconds</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">+</div>
                  <p className="text-gray-700">+10 points for correct, -5 for wrong</p>
                </div>
              </div>
              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Game
              </Button>
            </div>
          )}

          {gameState === 'playing' && currentEmail && (
            <div className="space-y-6">
              <Progress value={progress} className="h-2" />

              {/* Email Card */}
              <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-2 border-gray-200">
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">From:</div>
                    <div className="text-sm text-gray-900 font-mono">{currentEmail.from}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Subject:</div>
                    <div className="text-gray-900">{currentEmail.subject}</div>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{currentEmail.preview}</p>
                  </div>
                </div>
              </div>

              {/* Answer Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleAnswer(false)}
                  className="h-16 bg-green-500 hover:bg-green-600 text-white"
                  size="lg"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Real Email
                </Button>
                <Button
                  onClick={() => handleAnswer(true)}
                  className="h-16 bg-red-500 hover:bg-red-600 text-white"
                  size="lg"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Phishing
                </Button>
              </div>
            </div>
          )}

          {gameState === 'finished' && (
            <div className="text-center py-8">
              {showConfetti && (
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
              )}
              
              <div className="mb-6">
                <div className={`text-6xl ${score >= 70 ? 'text-green-600' : score >= 40 ? 'text-yellow-600' : 'text-red-600'} mb-2`}>
                  {score}
                </div>
                <div className="text-gray-600 mb-4">out of 100 points</div>
                
                <Badge className={`text-lg px-4 py-2 ${
                  score >= 90 ? 'bg-green-100 text-green-700' :
                  score >= 70 ? 'bg-blue-100 text-blue-700' :
                  score >= 40 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {score >= 90 ? '🏆 Phishing Expert!' :
                   score >= 70 ? '⭐ Great Eye for Scams!' :
                   score >= 40 ? '👍 Good Effort!' :
                   '📚 Keep Learning!'}
                </Badge>
              </div>

              {/* Results Breakdown */}
              <div className="max-w-md mx-auto mb-6">
                <h4 className="text-gray-900 mb-3">Your Answers:</h4>
                <div className="space-y-2">
                  {gameEmails.map((email, i) => (
                    <div key={email.id} className={`p-3 rounded-lg text-left ${
                      answers[i] ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-sm text-gray-900 flex-1">{email.subject}</span>
                        {answers[i] ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{email.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={startGame}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
          <CardDescription>Top phishing detectors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg flex items-center justify-between ${
                  entry.name === 'You' ? 'bg-gradient-to-r from-blue-50 to-teal-50 border-2 border-blue-300' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                    index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-gray-900 flex items-center gap-2">
                      {entry.name}
                      {entry.name === 'You' && <Sparkles className="w-4 h-4 text-blue-500" />}
                    </div>
                    <div className="text-xs text-gray-500">{entry.date.toLocaleDateString()}</div>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-700">{entry.score} pts</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
