import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Mail, CheckCircle2, AlertTriangle, XCircle, 
  Inbox, Shield, TrendingUp, Clock, Link as LinkIcon 
} from 'lucide-react';

interface EmailScan {
  id: string;
  from: string;
  subject: string;
  status: 'safe' | 'suspicious' | 'blocked';
  timestamp: Date;
}

const scannedEmails: EmailScan[] = [
  {
    id: '1',
    from: 'support@paypal.com',
    subject: 'Your account has been limited',
    status: 'blocked',
    timestamp: new Date(Date.now() - 1000 * 60 * 10)
  },
  {
    id: '2',
    from: 'hr@company.com',
    subject: 'Updated employee benefits',
    status: 'safe',
    timestamp: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: '3',
    from: 'no-reply@banking-secure.net',
    subject: 'Urgent: Verify your identity',
    status: 'suspicious',
    timestamp: new Date(Date.now() - 1000 * 60 * 45)
  },
  {
    id: '4',
    from: 'team@slack.com',
    subject: 'Weekly digest',
    status: 'safe',
    timestamp: new Date(Date.now() - 1000 * 60 * 60)
  },
  {
    id: '5',
    from: 'admin@microsoft-security.com',
    subject: 'Action required: Verify account',
    status: 'blocked',
    timestamp: new Date(Date.now() - 1000 * 60 * 90)
  },
  {
    id: '6',
    from: 'newsletter@techcrunch.com',
    subject: 'Latest tech news',
    status: 'safe',
    timestamp: new Date(Date.now() - 1000 * 60 * 120)
  },
];

export function EmailSecuritySyncPage() {
  const [gmailConnected, setGmailConnected] = useState(false);
  const [outlookConnected, setOutlookConnected] = useState(false);
  const [scanning, setScanning] = useState(false);

  const totalEmails = 1247;
  const scannedCount = 1180;
  const scanProgress = Math.round((scannedCount / totalEmails) * 100);

  const safeCount = scannedEmails.filter(e => e.status === 'safe').length;
  const suspiciousCount = scannedEmails.filter(e => e.status === 'suspicious').length;
  const blockedCount = scannedEmails.filter(e => e.status === 'blocked').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'suspicious':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'blocked':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
        return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
      case 'suspicious':
        return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
      case 'blocked':
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  const handleConnect = (provider: 'gmail' | 'outlook') => {
    setScanning(true);
    setTimeout(() => {
      if (provider === 'gmail') {
        setGmailConnected(true);
      } else {
        setOutlookConnected(true);
      }
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">Email Security Sync 📧</h2>
        <p className="text-gray-600">Automatically flags and quarantines risky emails</p>
      </div>

      {/* Connection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gmail */}
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Mail className="w-5 h-5 text-red-500" />
              Gmail Integration
            </CardTitle>
            <CardDescription>Connect your Gmail account for real-time protection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!gmailConnected ? (
                <div className="text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm mb-4">
                    Not connected
                  </p>
                  <Button
                    onClick={() => handleConnect('gmail')}
                    disabled={scanning}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    {scanning ? 'Connecting...' : 'Connect Gmail'}
                  </Button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="text-green-900">Connected</div>
                      <div className="text-green-700 text-sm">Actively monitoring</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700">Last scan: 2 min ago</span>
                    <Button size="sm" variant="outline" className="text-green-700 border-green-300">
                      Disconnect
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Outlook */}
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Mail className="w-5 h-5 text-blue-500" />
              Outlook Integration
            </CardTitle>
            <CardDescription>Connect your Outlook account for real-time protection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!outlookConnected ? (
                <div className="text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm mb-4">
                    Not connected
                  </p>
                  <Button
                    onClick={() => handleConnect('outlook')}
                    disabled={scanning}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    {scanning ? 'Connecting...' : 'Connect Outlook'}
                  </Button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="text-green-900">Connected</div>
                      <div className="text-green-700 text-sm">Actively monitoring</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700">Last scan: 1 min ago</span>
                    <Button size="sm" variant="outline" className="text-green-700 border-green-300">
                      Disconnect
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scan Progress */}
      <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-500 via-blue-600 to-teal-600 text-white border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Progress Ring */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="10"
                  fill="none"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="white"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - scanProgress / 100)}`}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - scanProgress / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl text-white">{scanProgress}%</div>
                  <div className="text-blue-100 text-xs">Scanned</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1">
              <h3 className="text-xl text-white mb-3">Inbox Protection Status</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl text-white">{scannedCount}</div>
                  <div className="text-blue-100 text-sm">Scanned</div>
                </div>
                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl text-white">{totalEmails - scannedCount}</div>
                  <div className="text-blue-100 text-sm">Pending</div>
                </div>
                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl text-white">{blockedCount}</div>
                  <div className="text-blue-100 text-sm">Blocked</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email List */}
        <div className="lg:col-span-2">
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Inbox className="w-5 h-5 text-blue-500" />
                Recent Email Scans
              </CardTitle>
              <CardDescription>Latest emails analyzed by ShieldShare</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {scannedEmails.map((email, index) => (
                  <motion.div
                    key={email.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border ${getStatusColor(email.status).border} ${getStatusColor(email.status).bg} hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start gap-3">
                      {getStatusIcon(email.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm text-gray-900 truncate">{email.from}</span>
                          <Badge className={`${getStatusColor(email.status).bg} ${getStatusColor(email.status).text} border ${getStatusColor(email.status).border} flex-shrink-0`}>
                            {email.status === 'safe' && '✅ Safe'}
                            {email.status === 'suspicious' && '⚠️ Suspicious'}
                            {email.status === 'blocked' && '🚫 Blocked'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-700 mb-2 truncate">{email.subject}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(email.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Panel */}
        <div className="space-y-6">
          {/* Summary */}
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Shield className="w-5 h-5 text-teal-500" />
                Protection Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-700 text-sm">Safe Emails</span>
                    <span className="text-green-900">{safeCount}</span>
                  </div>
                  <Progress value={(safeCount / scannedEmails.length) * 100} className="h-2" />
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-700 text-sm">Suspicious</span>
                    <span className="text-yellow-900">{suspiciousCount}</span>
                  </div>
                  <Progress value={(suspiciousCount / scannedEmails.length) * 100} className="h-2 [&>div]:bg-yellow-500" />
                </div>

                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-red-700 text-sm">Blocked</span>
                    <span className="text-red-900">{blockedCount}</span>
                  </div>
                  <Progress value={(blockedCount / scannedEmails.length) * 100} className="h-2 [&>div]:bg-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-700 text-sm">Emails Scanned</span>
                  <span className="text-blue-900">1,180</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-red-700 text-sm">Threats Blocked</span>
                  <span className="text-red-900">47</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-green-700 text-sm">Protection Rate</span>
                  <span className="text-green-900">96%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
