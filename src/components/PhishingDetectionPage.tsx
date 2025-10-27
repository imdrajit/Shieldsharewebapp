import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScanLine, AlertTriangle, CheckCircle2, Clock, Link as LinkIcon, Mail, Sparkles, Shield } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { Scan } from '../App';

interface PhishingDetectionPageProps {
  scans: Scan[];
  addScan: (scan: Scan) => void;
}

export function PhishingDetectionPage({ scans, addScan }: PhishingDetectionPageProps) {
  const [url, setUrl] = useState('');
  const [emailText, setEmailText] = useState('');
  const [aiMode, setAiMode] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState<Scan | null>(null);

  const analyzeURL = (urlToCheck: string): Pick<Scan, 'risk_level' | 'reasons'> => {
    const reasons: string[] = [];
    let riskLevel: 'Safe' | 'Medium' | 'High' = 'Safe';

    // Check for HTTPS
    if (!urlToCheck.startsWith('https://')) {
      reasons.push('No HTTPS encryption detected');
      riskLevel = 'Medium';
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      { pattern: /\d/g, match: (m: RegExpMatchArray | null) => m && m.length > 3, reason: 'Excessive numbers in domain' },
      { pattern: /-/g, match: (m: RegExpMatchArray | null) => m && m.length > 2, reason: 'Multiple hyphens (suspicious)' },
      { pattern: /paypal|paypa1|amazon|amaz0n|microsoft|micr0soft|apple|app1e|google|g00gle/i, match: (m: RegExpMatchArray | null) => m !== null, reason: 'Possible brand impersonation' },
      { pattern: /verify|urgent|suspend|confirm|update|secure|account/i, match: (m: RegExpMatchArray | null) => m !== null, reason: 'Urgent action keywords detected' },
      { pattern: /\.tk|\.ml|\.ga|\.cf|\.gq/i, match: (m: RegExpMatchArray | null) => m !== null, reason: 'Suspicious TLD (free domain)' },
    ];

    suspiciousPatterns.forEach(({ pattern, match, reason }) => {
      const matches = urlToCheck.match(pattern);
      if (match(matches)) {
        reasons.push(reason);
        riskLevel = 'High';
      }
    });

    // Check URL length
    if (urlToCheck.length > 100) {
      reasons.push('Unusually long URL');
      riskLevel = riskLevel === 'High' ? 'High' : 'Medium';
    }

    // Check for IP address
    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(urlToCheck)) {
      reasons.push('IP address instead of domain name');
      riskLevel = 'High';
    }

    // If no issues found
    if (reasons.length === 0) {
      reasons.push('No suspicious patterns detected');
      reasons.push('Valid HTTPS certificate');
      reasons.push('Legitimate domain structure');
    }

    return { risk_level: riskLevel, reasons };
  };

  const analyzeEmail = (text: string): Pick<Scan, 'risk_level' | 'reasons'> => {
    const reasons: string[] = [];
    let riskLevel: 'Safe' | 'Medium' | 'High' = 'Safe';

    // Check for urgent language
    if (/urgent|immediately|suspend|verify now|act now|expire|limited time/i.test(text)) {
      reasons.push('Urgent or threatening language detected');
      riskLevel = 'High';
    }

    // Check for suspicious requests
    if (/password|credit card|social security|bank account|verify account|confirm identity/i.test(text)) {
      reasons.push('Requests for sensitive information');
      riskLevel = 'High';
    }

    // Check for generic greetings
    if (/dear (customer|user|member|sir|madam)/i.test(text)) {
      reasons.push('Generic greeting (not personalized)');
      riskLevel = riskLevel === 'High' ? 'High' : 'Medium';
    }

    // Check for poor grammar
    if (/\b(your|you're)\b.*\b(your|you're)\b/i.test(text) || /\s{2,}/.test(text)) {
      reasons.push('Poor grammar or formatting');
      riskLevel = riskLevel === 'High' ? 'High' : 'Medium';
    }

    // Check for links
    if (/http|www\./i.test(text)) {
      reasons.push('Contains links - verify before clicking');
      riskLevel = riskLevel === 'High' ? 'High' : 'Medium';
    }

    if (reasons.length === 0) {
      reasons.push('No obvious phishing indicators');
      reasons.push('Professional tone and formatting');
      reasons.push('No suspicious requests');
    }

    return { risk_level: riskLevel, reasons };
  };

  const handleScanURL = async () => {
    if (!url) {
      toast.error('Please enter a URL to scan');
      return;
    }

    setIsScanning(true);
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const analysis = analyzeURL(url);
    const newScan: Scan = {
      id: Date.now().toString(),
      url: url,
      risk_level: analysis.risk_level,
      reasons: analysis.reasons,
      created_at: new Date()
    };

    addScan(newScan);
    setLastResult(newScan);
    setIsScanning(false);
    
    if (newScan.risk_level === 'High') {
      toast.error('High risk detected! Do not proceed.');
    } else if (newScan.risk_level === 'Medium') {
      toast.warning('Medium risk - proceed with caution.');
    } else {
      toast.success('URL appears safe!');
    }
  };

  const handleScanEmail = async () => {
    if (!emailText) {
      toast.error('Please enter email text to analyze');
      return;
    }

    setIsScanning(true);
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const analysis = analyzeEmail(emailText);
    const newScan: Scan = {
      id: Date.now().toString(),
      url: 'Email Content Analysis',
      risk_level: analysis.risk_level,
      reasons: analysis.reasons,
      created_at: new Date()
    };

    addScan(newScan);
    setLastResult(newScan);
    setIsScanning(false);
    
    if (newScan.risk_level === 'High') {
      toast.error('High risk detected! This may be phishing.');
    } else if (newScan.risk_level === 'Medium') {
      toast.warning('Medium risk - verify sender.');
    } else {
      toast.success('Email appears legitimate!');
    }
  };

  const getRiskColor = (level: 'Safe' | 'Medium' | 'High') => {
    switch (level) {
      case 'Safe': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const getRiskIcon = (level: 'Safe' | 'Medium' | 'High') => {
    switch (level) {
      case 'Safe': return <CheckCircle2 className="w-5 h-5" />;
      case 'Medium': return <AlertTriangle className="w-5 h-5" />;
      case 'High': return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">Phishing Detection</h2>
        <p className="text-gray-600">Scan URLs and emails for potential phishing threats</p>
      </div>

      {/* Scanner Card */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-blue-500" />
                Threat Scanner
              </CardTitle>
              <CardDescription>
                Analyze suspicious links and email content
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="ai-mode" className="text-sm text-gray-600">
                AI Mode
              </Label>
              <Switch
                id="ai-mode"
                checked={aiMode}
                onCheckedChange={setAiMode}
              />
              {aiMode && <Sparkles className="w-4 h-4 text-amber-500" />}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="url" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Scan URL
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Analyze Email
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Suspicious URL</Label>
                <Input
                  id="url"
                  type="text"
                  placeholder="https://example.com/suspicious-link"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <Button
                onClick={handleScanURL}
                disabled={isScanning}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
              >
                {isScanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <ScanLine className="w-4 h-4 mr-2" />
                    Scan for Threats
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Content</Label>
                <Textarea
                  id="email"
                  placeholder="Paste suspicious email content here..."
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  rows={6}
                />
              </div>
              <Button
                onClick={handleScanEmail}
                disabled={isScanning}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
              >
                {isScanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <ScanLine className="w-4 h-4 mr-2" />
                    Analyze Email
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>

          {/* Last Result */}
          {lastResult && (
            <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-2 border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-gray-900">Scan Result</h3>
                <Badge className={getRiskColor(lastResult.risk_level)}>
                  {getRiskIcon(lastResult.risk_level)}
                  <span className="ml-1">{lastResult.risk_level} Risk</span>
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Analyzed:</p>
                  <p className="text-gray-900 break-all">{lastResult.url}</p>
                </div>
                
                <div>
                  <p className="text-gray-600 text-sm mb-2">
                    {aiMode && <><Sparkles className="w-3 h-3 inline mr-1" />AI </>}
                    Analysis:
                  </p>
                  <ul className="space-y-2">
                    {lastResult.reasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scan History */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            Scan History
          </CardTitle>
          <CardDescription>
            Recent threat scans and results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scans.length > 0 ? (
            <div className="space-y-3">
              {scans.map((scan) => (
                <div
                  key={scan.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 truncate">{scan.url}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(scan.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Badge className={getRiskColor(scan.risk_level)}>
                      {scan.risk_level}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {scan.reasons[0]}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No scans yet</p>
              <p className="text-sm mt-1">Start scanning URLs and emails above</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
