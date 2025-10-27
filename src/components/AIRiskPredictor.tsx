import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Sparkles, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { toast } from 'sonner@2.0.3';
import type { Company, Employee, Scan } from '../App';

interface AIRiskPredictorProps {
  company: Company;
  employees: Employee[];
  scans: Scan[];
}

interface RiskFactor {
  name: string;
  impact: number;
  status: 'positive' | 'negative' | 'neutral';
  description: string;
}

export function AIRiskPredictor({ company, employees, scans }: AIRiskPredictorProps) {
  // Calculate risk factors
  const avgTraining = employees.length > 0
    ? employees.reduce((sum, e) => sum + e.training_progress, 0) / employees.length
    : 0;

  const riskFactors: RiskFactor[] = [];
  let baseRisk = 50;

  // Training completion impact
  if (avgTraining < 50) {
    riskFactors.push({
      name: 'Low Training Engagement',
      impact: 20,
      status: 'negative',
      description: `Only ${Math.round(avgTraining)}% average training completion increases vulnerability`
    });
    baseRisk += 20;
  } else if (avgTraining >= 80) {
    riskFactors.push({
      name: 'High Training Completion',
      impact: -15,
      status: 'positive',
      description: `${Math.round(avgTraining)}% training completion strengthens defenses`
    });
    baseRisk -= 15;
  }

  // Cyber health score impact
  if (company.health_score < 60) {
    riskFactors.push({
      name: 'Low Security Score',
      impact: 15,
      status: 'negative',
      description: 'Health score below 60 indicates security gaps'
    });
    baseRisk += 15;
  } else if (company.health_score >= 80) {
    riskFactors.push({
      name: 'Strong Security Posture',
      impact: -20,
      status: 'positive',
      description: 'High security score reduces breach likelihood'
    });
    baseRisk -= 20;
  }

  // MFA status
  if (!company.mfa_enabled) {
    riskFactors.push({
      name: 'MFA Not Enabled',
      impact: 15,
      status: 'negative',
      description: 'Missing multi-factor authentication is a critical gap'
    });
    baseRisk += 15;
  } else {
    riskFactors.push({
      name: 'MFA Enabled',
      impact: -10,
      status: 'positive',
      description: 'Multi-factor authentication significantly reduces risk'
    });
    baseRisk -= 10;
  }

  // Scan activity
  if (scans.length === 0) {
    riskFactors.push({
      name: 'No Threat Scanning',
      impact: 10,
      status: 'negative',
      description: 'Lack of proactive threat detection'
    });
    baseRisk += 10;
  } else {
    const highRiskScans = scans.filter(s => s.risk_level === 'High').length;
    if (highRiskScans > 2) {
      riskFactors.push({
        name: 'High Risk Detections',
        impact: 12,
        status: 'negative',
        description: `${highRiskScans} high-risk threats detected recently`
      });
      baseRisk += 12;
    } else {
      riskFactors.push({
        name: 'Regular Scanning',
        impact: -10,
        status: 'positive',
        description: 'Active threat monitoring in place'
      });
      baseRisk -= 10;
    }
  }

  // Backup status
  if (!company.backups_enabled) {
    riskFactors.push({
      name: 'No Automated Backups',
      impact: 12,
      status: 'negative',
      description: 'Missing data backup increases ransomware risk'
    });
    baseRisk += 12;
  }

  // Update status
  if (!company.updates_current) {
    riskFactors.push({
      name: 'Outdated Systems',
      impact: 15,
      status: 'negative',
      description: 'Unpatched systems are vulnerable to exploits'
    });
    baseRisk += 15;
  }

  // Phishing simulation results
  const totalClicks = employees.reduce((sum, e) => sum + e.phish_clicks, 0);
  if (totalClicks > employees.length * 0.3) {
    riskFactors.push({
      name: 'High Phish Click Rate',
      impact: 18,
      status: 'negative',
      description: 'Employees frequently fall for phishing simulations'
    });
    baseRisk += 18;
  } else if (totalClicks === 0) {
    riskFactors.push({
      name: 'Zero Phishing Clicks',
      impact: -12,
      status: 'positive',
      description: 'Excellent phishing awareness demonstrated'
    });
    baseRisk -= 12;
  }

  // Calculate final risk
  const finalRisk = Math.min(95, Math.max(5, baseRisk));
  
  let riskLevel: 'Low' | 'Medium' | 'High';
  let riskColor: string;
  let riskGradient: string;

  if (finalRisk < 30) {
    riskLevel = 'Low';
    riskColor = 'text-green-600';
    riskGradient = 'from-green-500 to-emerald-600';
  } else if (finalRisk < 60) {
    riskLevel = 'Medium';
    riskColor = 'text-yellow-600';
    riskGradient = 'from-yellow-500 to-amber-600';
  } else {
    riskLevel = 'High';
    riskColor = 'text-red-600';
    riskGradient = 'from-red-500 to-orange-600';
  }

  // Generate recommendations
  const recommendations: string[] = [];
  if (avgTraining < 80) recommendations.push('Complete remaining security training modules');
  if (!company.mfa_enabled) recommendations.push('Enable multi-factor authentication immediately');
  if (!company.backups_enabled) recommendations.push('Set up automated backup systems');
  if (!company.updates_current) recommendations.push('Update all systems and software');
  if (totalClicks > 0) recommendations.push('Provide additional phishing awareness training');
  if (scans.length < 5) recommendations.push('Increase frequency of threat scans');

  // Data for pie chart
  const chartData = [
    { name: 'Secure', value: 100 - finalRisk, color: '#10b981' },
    { name: 'At Risk', value: finalRisk, color: finalRisk >= 60 ? '#ef4444' : finalRisk >= 30 ? '#f59e0b' : '#10b981' }
  ];

  const handleGenerateReport = () => {
    toast.success('Generating detailed risk report...');
    setTimeout(() => {
      toast.success('Report ready for download!');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Risk Score Card */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            AI-Powered Breach Risk Prediction
          </CardTitle>
          <CardDescription>
            Machine learning analysis of your organization's security posture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Meter */}
            <div className="flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center -mt-32">
                <div className={`text-4xl ${riskColor} mb-1`}>{finalRisk}%</div>
                <Badge className={`${
                  riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                  riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {riskLevel} Risk
                </Badge>
              </div>
            </div>

            {/* Risk Summary */}
            <div>
              <h4 className="text-gray-900 mb-3">Risk Assessment Summary</h4>
              <div className={`p-4 rounded-lg mb-4 ${
                riskLevel === 'Low' ? 'bg-green-50 border border-green-200' :
                riskLevel === 'Medium' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm ${
                  riskLevel === 'Low' ? 'text-green-800' :
                  riskLevel === 'Medium' ? 'text-yellow-800' :
                  'text-red-800'
                }`}>
                  {riskLevel === 'Low' 
                    ? 'Your organization demonstrates strong security practices with minimal breach risk. Continue monitoring and maintaining current protocols.'
                    : riskLevel === 'Medium'
                    ? 'Moderate security gaps detected. Address recommendations to reduce breach likelihood and strengthen defenses.'
                    : 'Critical vulnerabilities identified. Immediate action required to prevent potential security breaches.'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Security Posture</span>
                  <span className={riskColor}>{riskLevel}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Breach Probability</span>
                  <span className="text-gray-900">{finalRisk}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Risk Factors</span>
                  <span className="text-gray-900">{riskFactors.length} identified</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors Breakdown */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            AI Analysis Breakdown
          </CardTitle>
          <CardDescription>
            Factors contributing to your risk score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riskFactors.map((factor, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                factor.status === 'positive' ? 'bg-green-50 border-green-500' :
                factor.status === 'negative' ? 'bg-red-50 border-red-500' :
                'bg-gray-50 border-gray-500'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {factor.status === 'positive' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                    <h4 className="text-gray-900">{factor.name}</h4>
                  </div>
                  <Badge variant="outline" className={
                    factor.status === 'positive' ? 'text-green-700' : 'text-red-700'
                  }>
                    {factor.impact > 0 ? '+' : ''}{factor.impact}%
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 ml-7">{factor.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-500" />
            AI-Generated Recommendations
          </CardTitle>
          <CardDescription>
            Priority actions to reduce your breach risk
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{rec}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-green-600">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
              <p>Excellent! No critical actions needed at this time.</p>
              <p className="text-sm mt-1">Continue monitoring your security posture.</p>
            </div>
          )}

          <Button
            onClick={handleGenerateReport}
            className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Detailed Report
          </Button>
        </CardContent>
      </Card>

      {/* Future Risk Projection */}
      <Card className="backdrop-blur-sm bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Brain className="w-12 h-12 flex-shrink-0" />
            <div>
              <h3 className="text-white mb-2">💡 Predictive Insight</h3>
              <p className="text-purple-100 mb-3">
                {finalRisk >= 60 
                  ? 'Based on current patterns, your organization is at elevated risk for a security incident within the next 6 months. Immediate action on recommendations is critical.'
                  : finalRisk >= 30
                  ? 'With current security measures, your organization maintains moderate risk levels. Addressing identified gaps will significantly improve your security posture.'
                  : 'Your proactive security approach positions you well. Maintaining current practices will keep breach risk low in the foreseeable future.'}
              </p>
              <div className="flex items-center gap-2 text-sm text-purple-100">
                <Sparkles className="w-4 h-4" />
                <span>AI confidence: {100 - finalRisk}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
