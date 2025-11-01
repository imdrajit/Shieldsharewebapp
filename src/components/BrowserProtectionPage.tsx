import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { 
  Shield, Globe, AlertTriangle, CheckCircle2, XCircle, 
  TrendingUp, Clock, Eye, Lock, Zap 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const weeklyThreatsData = [
  { day: 'Mon', threats: 3 },
  { day: 'Tue', threats: 7 },
  { day: 'Wed', threats: 5 },
  { day: 'Thu', threats: 12 },
  { day: 'Fri', threats: 8 },
  { day: 'Sat', threats: 2 },
  { day: 'Sun', threats: 1 },
];

interface ScanStatus {
  url: string;
  status: 'safe' | 'suspicious' | 'blocked';
  timestamp: Date;
}

const recentScans: ScanStatus[] = [
  { url: 'https://mybank.com', status: 'safe', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  { url: 'http://paypa1-verify.com', status: 'blocked', timestamp: new Date(Date.now() - 1000 * 60 * 15) },
  { url: 'https://amazon.com', status: 'safe', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  { url: 'https://suspiciou5-login.net', status: 'suspicious', timestamp: new Date(Date.now() - 1000 * 60 * 45) },
  { url: 'https://google.com', status: 'safe', timestamp: new Date(Date.now() - 1000 * 60 * 60) },
];

export function BrowserProtectionPage() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [currentScan, setCurrentScan] = useState<ScanStatus | null>(recentScans[0]);
  const [scanning, setScanning] = useState(false);

  const totalThreatsBlocked = weeklyThreatsData.reduce((sum, day) => sum + day.threats, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
        return { bg: 'bg-green-500', text: 'text-green-700', border: 'border-green-200', light: 'bg-green-50' };
      case 'suspicious':
        return { bg: 'bg-yellow-500', text: 'text-yellow-700', border: 'border-yellow-200', light: 'bg-yellow-50' };
      case 'blocked':
        return { bg: 'bg-red-500', text: 'text-red-700', border: 'border-red-200', light: 'bg-red-50' };
      default:
        return { bg: 'bg-gray-500', text: 'text-gray-700', border: 'border-gray-200', light: 'bg-gray-50' };
    }
  };

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

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setCurrentScan(recentScans[Math.floor(Math.random() * recentScans.length)]);
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">Real-Time Web Shield 🛡️</h2>
        <p className="text-gray-600">Monitors URLs while you browse — detects phishing instantly</p>
      </div>

      {/* Enable/Disable Toggle */}
      <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-500 via-blue-600 to-teal-600 text-white border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl text-white mb-1">Browser Protection</h3>
                <p className="text-blue-100 text-sm">
                  {isEnabled ? 'Active - You are protected' : 'Disabled - Turn on for protection'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-3">
                <div className="text-sm text-blue-100">Status</div>
                <div className="text-white">{isEnabled ? 'Enabled' : 'Disabled'}</div>
              </div>
              <Switch
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
                className="data-[state=checked]:bg-white data-[state=unchecked]:bg-blue-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Browser Simulation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Simulated Browser */}
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Globe className="w-5 h-5 text-blue-500" />
                Live Site Scanner
              </CardTitle>
              <CardDescription>Real-time protection as you browse</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Browser Frame */}
              <div className="space-y-3">
                {/* Browser Bar */}
                <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-t-xl border-b-2 border-gray-300">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-white rounded-lg">
                    {isEnabled && currentScan && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`w-2 h-2 rounded-full ${getStatusColor(currentScan.status).bg}`}
                      />
                    )}
                    <Lock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 flex-1 truncate">
                      {currentScan?.url || 'https://example.com'}
                    </span>
                  </div>
                  <Button size="sm" onClick={simulateScan} disabled={scanning || !isEnabled}>
                    {scanning ? 'Scanning...' : 'Test Scan'}
                  </Button>
                </div>

                {/* Browser Content */}
                <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-b-xl border border-gray-200 overflow-hidden">
                  {!isEnabled && (
                    <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-10">
                      <div className="text-center text-white">
                        <Shield className="w-16 h-16 mx-auto mb-3 opacity-50" />
                        <p className="text-lg">Protection Disabled</p>
                        <p className="text-sm text-gray-300 mt-1">Enable shield to start monitoring</p>
                      </div>
                    </div>
                  )}

                  {isEnabled && scanning && (
                    <motion.div
                      className="absolute inset-0 bg-blue-500/10 flex items-center justify-center z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Eye className="w-16 h-16 text-blue-600 mx-auto mb-3" />
                        </motion.div>
                        <p className="text-blue-700">Scanning for threats...</p>
                      </div>
                    </motion.div>
                  )}

                  {isEnabled && currentScan && !scanning && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6"
                    >
                      <div className={`p-4 rounded-xl border-2 ${getStatusColor(currentScan.status).border} ${getStatusColor(currentScan.status).light}`}>
                        <div className="flex items-start gap-3">
                          {getStatusIcon(currentScan.status)}
                          <div className="flex-1">
                            <h4 className={`${getStatusColor(currentScan.status).text} mb-1`}>
                              {currentScan.status === 'safe' && 'Site is Safe'}
                              {currentScan.status === 'suspicious' && 'Suspicious Activity Detected'}
                              {currentScan.status === 'blocked' && 'Site Blocked'}
                            </h4>
                            <p className="text-gray-700 text-sm">
                              {currentScan.status === 'safe' && 'This website has been verified and is safe to use.'}
                              {currentScan.status === 'suspicious' && 'This website shows signs of phishing. Proceed with caution.'}
                              {currentScan.status === 'blocked' && 'This website has been identified as a phishing threat and blocked.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Simulated page content */}
                  <div className="p-6 opacity-40">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-3" />
                    <div className="h-32 bg-gray-300 rounded w-full mb-3" />
                    <div className="h-4 bg-gray-300 rounded w-2/3" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Scans */}
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Clock className="w-5 h-5 text-gray-500" />
                Recent Scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentScans.map((scan, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {getStatusIcon(scan.status)}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900 truncate">{scan.url}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(scan.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(scan.status).light} ${getStatusColor(scan.status).text} border ${getStatusColor(scan.status).border}`}>
                      {scan.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats & Chart */}
        <div className="space-y-6">
          {/* Threats Blocked */}
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Shield className="w-5 h-5 text-red-500" />
                Threats Blocked
              </CardTitle>
              <CardDescription>This week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <motion.div
                  className="text-5xl text-red-600 mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  {totalThreatsBlocked}
                </motion.div>
                <p className="text-gray-600 text-sm">Phishing attempts blocked</p>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={weeklyThreatsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="threats"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Protection Stats */}
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Protection Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Safe Sites</span>
                  <span className="text-green-600">67%</span>
                </div>
                <Progress value={67} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Suspicious Sites</span>
                  <span className="text-yellow-600">18%</span>
                </div>
                <Progress value={18} className="h-2 [&>div]:bg-yellow-500" />

                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Blocked Sites</span>
                  <span className="text-red-600">15%</span>
                </div>
                <Progress value={15} className="h-2 [&>div]:bg-red-500" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1 text-sm">Pro Tip</h4>
                  <p className="text-gray-700 text-xs">
                    Always check the URL before entering sensitive information. Look for HTTPS and verify the domain spelling.
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
