import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Mail, Upload, AlertTriangle, CheckCircle2, Link as LinkIcon, FileText, Sparkles, Shield } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface EmailAnalysis {
  id: string;
  sender: string;
  subject: string;
  riskLevel: 'Safe' | 'Suspicious' | 'High Risk';
  probability: number;
  redFlags: string[];
  links: string[];
  tone: string[];
  aiReasoning: string;
  timestamp: Date;
}

export function EmailAnalyzerPage() {
  const [emailText, setEmailText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<EmailAnalysis | null>(null);
  const [showReasoning, setShowReasoning] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<EmailAnalysis[]>([]);

  const analyzeEmail = async () => {
    if (!emailText.trim()) {
      toast.error('Please enter email content to analyze');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Parse email
    const senderMatch = emailText.match(/From:.*?<(.+?)>|From:\s*(.+?)(?:\n|$)/i);
    const subjectMatch = emailText.match(/Subject:\s*(.+?)(?:\n|$)/i);
    const urlMatches = emailText.match(/https?:\/\/[^\s<>"]+/gi) || [];
    
    const sender = senderMatch ? (senderMatch[1] || senderMatch[2] || 'Unknown').trim() : 'Unknown';
    const subject = subjectMatch ? subjectMatch[1].trim() : 'No subject';

    // Detect tone and red flags
    const toneKeywords: string[] = [];
    const redFlags: string[] = [];
    let riskScore = 0;

    // Check for urgent/threatening tone
    if (/urgent|immediately|act now|expire|suspend|verify now|limited time|final notice/i.test(emailText)) {
      toneKeywords.push('Urgent');
      redFlags.push('Urgent/threatening language detected');
      riskScore += 25;
    }
    
    if (/fear|worried|concern|security alert|suspicious activity|unauthorized/i.test(emailText)) {
      toneKeywords.push('Fear-inducing');
      redFlags.push('Fear-based manipulation tactics');
      riskScore += 20;
    }

    // Check sender domain
    if (sender.includes('@')) {
      const domain = sender.split('@')[1];
      if (/\d/.test(domain) || domain.split('.').length > 3) {
        redFlags.push('Suspicious sender domain');
        riskScore += 30;
      }
      
      if (!/\.(com|org|net|edu|gov)$/i.test(domain)) {
        redFlags.push('Unusual domain extension');
        riskScore += 15;
      }
    } else {
      redFlags.push('Unverified sender address');
      riskScore += 35;
    }

    // Check for generic greetings
    if (/dear (customer|user|member|sir|madam|valued)/i.test(emailText)) {
      redFlags.push('Generic greeting (not personalized)');
      riskScore += 10;
    }

    // Check for requests for sensitive info
    if (/password|credit card|ssn|social security|bank account|pin code|verification code/i.test(emailText)) {
      redFlags.push('Requests for sensitive information');
      riskScore += 30;
    }

    // Check links
    if (urlMatches.length > 0) {
      redFlags.push(`Contains ${urlMatches.length} link(s) - verify before clicking`);
      riskScore += urlMatches.length * 5;
    }

    // Check for brand impersonation
    if (/paypal|paypa1|amazon|amaz0n|microsoft|micr0soft|apple|app1e|google|g00gle|netflix|bank/i.test(emailText)) {
      redFlags.push('Possible brand impersonation attempt');
      riskScore += 25;
    }

    // Determine risk level
    let riskLevel: 'Safe' | 'Suspicious' | 'High Risk';
    if (riskScore >= 50) riskLevel = 'High Risk';
    else if (riskScore >= 25) riskLevel = 'Suspicious';
    else {
      riskLevel = 'Safe';
      if (redFlags.length === 0) {
        redFlags.push('No obvious phishing indicators detected');
        redFlags.push('Sender domain appears legitimate');
        redFlags.push('Professional tone and formatting');
      }
    }

    // Generate AI reasoning
    const aiReasoning = `Based on advanced natural language processing and pattern recognition analysis:

• Sender Authenticity: ${riskScore > 30 ? 'The sender domain shows characteristics of spoofing or impersonation. Cross-reference with official sources.' : 'Sender domain appears legitimate with standard formatting.'}

• Content Analysis: ${toneKeywords.length > 0 ? `Detected ${toneKeywords.join(', ').toLowerCase()} tone which is commonly used in phishing campaigns.` : 'Content tone appears professional and non-threatening.'}

• Link Safety: ${urlMatches.length > 0 ? `Found ${urlMatches.length} embedded link(s). Hover over links to verify destination before clicking.` : 'No embedded links detected.'}

• Behavioral Patterns: ${riskScore >= 50 ? 'Email exhibits multiple red flags consistent with known phishing patterns.' : riskScore >= 25 ? 'Some suspicious elements detected. Exercise caution.' : 'Email structure follows legitimate communication patterns.'}

Overall Risk Assessment: ${Math.min(100, riskScore)}% phishing probability based on ${redFlags.length} indicators.

Recommendation: ${riskScore >= 50 ? 'DO NOT interact with this email. Report to IT/Security immediately.' : riskScore >= 25 ? 'Proceed with caution. Verify sender through alternative channels.' : 'Email appears safe, but always remain vigilant.'}`;

    const analysis: EmailAnalysis = {
      id: Date.now().toString(),
      sender,
      subject,
      riskLevel,
      probability: Math.min(100, riskScore),
      redFlags,
      links: urlMatches,
      tone: toneKeywords.length > 0 ? toneKeywords : ['Professional'],
      aiReasoning,
      timestamp: new Date()
    };

    setCurrentAnalysis(analysis);
    setAnalysisHistory([analysis, ...analysisHistory]);
    setIsAnalyzing(false);
    
    if (riskLevel === 'High Risk') {
      toast.error('High risk phishing detected!');
    } else if (riskLevel === 'Suspicious') {
      toast.warning('Suspicious email - proceed with caution');
    } else {
      toast.success('Email appears safe');
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Safe': return 'bg-green-100 text-green-700 border-green-200';
      case 'Suspicious': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'High Risk': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'Safe': return <CheckCircle2 className="w-5 h-5" />;
      case 'Suspicious': return <AlertTriangle className="w-5 h-5" />;
      case 'High Risk': return <AlertTriangle className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const sampleEmail = `From: security-team@paypa1-secure.com
Subject: URGENT: Verify Your Account Now

Dear Valued Customer,

We have detected suspicious activity on your account. Your account will be suspended in 24 hours unless you verify your identity immediately.

Click here to verify: http://paypa1-verify.tk/secure

This is a final notice. Act now to prevent account closure.

Best regards,
PayPal Security Team`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">Smart Email Analyzer</h2>
        <p className="text-gray-600">AI-powered phishing detection and email safety analysis</p>
      </div>

      {/* Analyzer Card */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            Email Analysis Tool
          </CardTitle>
          <CardDescription>
            Upload .eml file or paste raw email content for analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="paste" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paste" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Paste Email
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload .eml
              </TabsTrigger>
            </TabsList>

            <TabsContent value="paste" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">Email Content</label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEmailText(sampleEmail)}
                  >
                    Load Sample
                  </Button>
                </div>
                <Textarea
                  placeholder="Paste full email content including headers (From, Subject, etc.)..."
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>

              <Button
                onClick={analyzeEmail}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze Email
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 mb-2">Drop .eml file here or click to browse</p>
                <p className="text-sm text-gray-500">Supports .eml, .msg formats</p>
                <Button variant="outline" className="mt-4">
                  Select File
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Analysis Results */}
          {currentAnalysis && (
            <div className="mt-6 space-y-4">
              <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-2 border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-gray-900">Analysis Results</h3>
                  <Badge className={getRiskColor(currentAnalysis.riskLevel)}>
                    {getRiskIcon(currentAnalysis.riskLevel)}
                    <span className="ml-1">{currentAnalysis.riskLevel}</span>
                  </Badge>
                </div>

                {/* Phishing Probability */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Phishing Probability</span>
                    <span className="text-sm text-gray-900">{currentAnalysis.probability}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        currentAnalysis.probability >= 50 ? 'bg-red-500' :
                        currentAnalysis.probability >= 25 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${currentAnalysis.probability}%` }}
                    />
                  </div>
                </div>

                {/* Email Details */}
                <div className="space-y-2 mb-4">
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Sender</div>
                    <div className="text-sm text-gray-900 break-all">{currentAnalysis.sender}</div>
                  </div>
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Subject</div>
                    <div className="text-sm text-gray-900">{currentAnalysis.subject}</div>
                  </div>
                  {currentAnalysis.tone.length > 0 && (
                    <div className="p-3 bg-white rounded border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Detected Tone</div>
                      <div className="flex gap-2">
                        {currentAnalysis.tone.map((tone, i) => (
                          <Badge key={i} variant="outline">{tone}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Red Flags */}
                <div>
                  <h4 className="text-sm text-gray-700 mb-2">Key Red Flags:</h4>
                  <ul className="space-y-2">
                    {currentAnalysis.redFlags.map((flag, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          currentAnalysis.riskLevel === 'High Risk' ? 'bg-red-500' :
                          currentAnalysis.riskLevel === 'Suspicious' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`} />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Links Found */}
                {currentAnalysis.links.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Links Found ({currentAnalysis.links.length})
                    </h4>
                    <div className="space-y-1">
                      {currentAnalysis.links.map((link, i) => (
                        <div key={i} className="p-2 bg-white rounded border border-gray-200 text-xs text-gray-600 break-all">
                          {link}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Reasoning */}
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowReasoning(!showReasoning)}
                    className="w-full"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {showReasoning ? 'Hide' : 'Show'} AI Reasoning
                  </Button>
                  
                  {showReasoning && (
                    <div className="mt-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                      <h5 className="text-purple-900 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        AI Analysis Report
                      </h5>
                      <div className="text-sm text-purple-800 whitespace-pre-line leading-relaxed">
                        {currentAnalysis.aiReasoning}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis History */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Analysis History</CardTitle>
          <CardDescription>Recent email analyses</CardDescription>
        </CardHeader>
        <CardContent>
          {analysisHistory.length > 0 ? (
            <div className="space-y-3">
              {analysisHistory.map((analysis) => (
                <div
                  key={analysis.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setCurrentAnalysis(analysis)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 truncate">{analysis.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">{analysis.sender}</p>
                      <p className="text-xs text-gray-400">{analysis.timestamp.toLocaleString()}</p>
                    </div>
                    <Badge className={getRiskColor(analysis.riskLevel)}>
                      {analysis.riskLevel}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {analysis.probability}% phishing probability • {analysis.redFlags.length} red flags
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No analyses yet</p>
              <p className="text-sm mt-1">Analyze your first email above</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
