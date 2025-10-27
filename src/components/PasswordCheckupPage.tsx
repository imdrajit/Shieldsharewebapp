import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Lock, Eye, EyeOff, CheckCircle2, XCircle, AlertTriangle, Shield, Sparkles } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PasswordStrength {
  score: number;
  level: 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
  feedback: string[];
  color: string;
  gradient: string;
}

export function PasswordCheckupPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [strength, setStrength] = useState<PasswordStrength | null>(null);

  const analyzePassword = (pwd: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (pwd.length >= 12) {
      score += 25;
    } else if (pwd.length >= 8) {
      score += 15;
      feedback.push('Increase length to 12+ characters for better security');
    } else {
      feedback.push('Password too short - use at least 12 characters');
    }

    // Uppercase letters
    if (/[A-Z]/.test(pwd)) {
      score += 15;
    } else {
      feedback.push('Add uppercase letters (A-Z)');
    }

    // Lowercase letters
    if (/[a-z]/.test(pwd)) {
      score += 15;
    } else {
      feedback.push('Add lowercase letters (a-z)');
    }

    // Numbers
    if (/\d/.test(pwd)) {
      score += 15;
    } else {
      feedback.push('Add numbers (0-9)');
    }

    // Special characters
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
      score += 20;
    } else {
      feedback.push('Add special characters (!@#$%^&*)');
    }

    // Check for common patterns
    const commonPasswords = ['password', '12345678', 'qwerty', 'admin', 'letmein', 'welcome'];
    if (commonPasswords.some(common => pwd.toLowerCase().includes(common))) {
      score = Math.max(0, score - 30);
      feedback.push('Avoid common words and patterns');
    }

    // Check for repeated characters
    if (/(.)\1{2,}/.test(pwd)) {
      score = Math.max(0, score - 10);
      feedback.push('Avoid repeating characters');
    }

    // Check for sequential characters
    if (/abc|bcd|cde|123|234|345/.test(pwd.toLowerCase())) {
      score = Math.max(0, score - 10);
      feedback.push('Avoid sequential patterns');
    }

    // Bonus for length
    if (pwd.length >= 16) score += 10;

    let level: 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
    let color: string;
    let gradient: string;

    if (score >= 80) {
      level = 'Very Strong';
      color = 'text-green-600';
      gradient = 'from-green-500 to-emerald-600';
      if (feedback.length === 0) {
        feedback.push('Excellent password strength!');
        feedback.push('This password is highly secure');
      }
    } else if (score >= 60) {
      level = 'Strong';
      color = 'text-blue-600';
      gradient = 'from-blue-500 to-cyan-600';
      if (feedback.length === 0) {
        feedback.push('Good password strength');
      }
    } else if (score >= 40) {
      level = 'Medium';
      color = 'text-yellow-600';
      gradient = 'from-yellow-500 to-amber-600';
    } else {
      level = 'Weak';
      color = 'text-red-600';
      gradient = 'from-red-500 to-orange-600';
    }

    return { score, level, feedback, color, gradient };
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value.length > 0) {
      setStrength(analyzePassword(value));
    } else {
      setStrength(null);
    }
  };

  const handleMFAToggle = (enabled: boolean) => {
    setMfaEnabled(enabled);
    if (enabled) {
      toast.success('MFA enabled! +10 security points');
    }
  };

  const totalScore = strength ? strength.score + (mfaEnabled ? 10 : 0) : 0;
  const maxScore = 100 + (mfaEnabled ? 10 : 0);

  const tips = [
    { icon: '🔤', title: 'Use a mix of characters', description: 'Combine uppercase, lowercase, numbers, and symbols' },
    { icon: '📏', title: 'Make it long', description: 'Aim for at least 12-16 characters' },
    { icon: '🚫', title: 'Avoid personal info', description: 'Don\'t use names, birthdays, or common words' },
    { icon: '🔄', title: 'Use unique passwords', description: 'Never reuse passwords across accounts' },
    { icon: '🔐', title: 'Consider a passphrase', description: 'Use a memorable phrase with mixed characters' },
    { icon: '📱', title: 'Enable MFA', description: 'Add an extra layer of security beyond passwords' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">Password Checkup</h2>
        <p className="text-gray-600">Test your password strength and improve your security</p>
      </div>

      {/* Password Tester */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-500" />
            Password Strength Analyzer
          </CardTitle>
          <CardDescription>
            Enter a password to test its security strength
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">Test Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="Enter password to test..."
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              ⚠️ Never enter your real password. This is for testing purposes only.
            </p>
          </div>

          {strength && (
            <div className="space-y-4">
              {/* Strength Meter */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Password Strength</span>
                  <Badge className={`${
                    strength.level === 'Very Strong' ? 'bg-green-100 text-green-700' :
                    strength.level === 'Strong' ? 'bg-blue-100 text-blue-700' :
                    strength.level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {strength.level}
                  </Badge>
                </div>
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${strength.gradient} transition-all duration-1000`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Weak</span>
                  <span>Strong</span>
                </div>
              </div>

              {/* Score Animation */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border-2 border-blue-200 text-center">
                <div className={`text-6xl ${strength.color} mb-2 animate-pulse`}>
                  {strength.score}
                </div>
                <div className="text-gray-700">Security Score</div>
                <div className="text-sm text-gray-500 mt-1">out of 100 points</div>
              </div>

              {/* Feedback */}
              <div>
                <h4 className="text-sm text-gray-700 mb-3">Recommendations:</h4>
                <ul className="space-y-2">
                  {strength.feedback.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      {item.includes('Excellent') || item.includes('Good') ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : item.includes('Avoid') ? (
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Character Requirements Checklist */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm text-gray-700 mb-3">Requirements:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className={`flex items-center gap-2 ${password.length >= 12 ? 'text-green-600' : 'text-gray-400'}`}>
                    {password.length >= 12 ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span className="text-sm">12+ characters</span>
                  </div>
                  <div className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                    {/[A-Z]/.test(password) ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span className="text-sm">Uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                    {/[a-z]/.test(password) ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span className="text-sm">Lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${/\d/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                    {/\d/.test(password) ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span className="text-sm">Number</span>
                  </div>
                  <div className={`flex items-center gap-2 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                    {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span className="text-sm">Special character</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MFA Toggle */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-purple-500" />
                <div>
                  <h4 className="text-gray-900">Multi-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra security layer (+10 bonus points)</p>
                </div>
              </div>
              <Switch checked={mfaEnabled} onCheckedChange={handleMFAToggle} />
            </div>
            {mfaEnabled && (
              <div className="mt-3 p-3 bg-white rounded border border-purple-200">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>MFA Enabled - Your security is significantly improved!</span>
                </div>
              </div>
            )}
          </div>

          {/* Total Security Score */}
          {password && (
            <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg text-white">
              <div className="flex items-center justify-between mb-3">
                <h4 className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Total Security Score
                </h4>
                <Badge className="bg-white/20 text-white border-white/30">
                  {totalScore} / {maxScore}
                </Badge>
              </div>
              <Progress value={(totalScore / maxScore) * 100} className="h-3 bg-gray-700" />
              <p className="text-sm text-gray-300 mt-2">
                {totalScore >= 90 ? '🏆 Exceptional security!' :
                 totalScore >= 70 ? '✨ Very good security' :
                 totalScore >= 50 ? '👍 Decent security' :
                 '⚠️ Needs improvement'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Password Security Best Practices</CardTitle>
          <CardDescription>Expert tips for creating strong passwords</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip, i) => (
              <div key={i} className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">{tip.icon}</div>
                <h4 className="text-gray-900 mb-1">{tip.title}</h4>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Password Manager Recommendation */}
      <Card className="backdrop-blur-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Lock className="w-12 h-12 flex-shrink-0" />
            <div>
              <h3 className="text-white mb-2">💡 Pro Tip: Use a Password Manager</h3>
              <p className="text-blue-100 mb-3">
                Password managers generate and store strong, unique passwords for all your accounts. 
                Popular options include 1Password, LastPass, Bitwarden, and Dashlane.
              </p>
              <Button variant="secondary" className="bg-white text-purple-600 hover:bg-blue-50">
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
