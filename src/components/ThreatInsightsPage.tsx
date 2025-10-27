import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Globe, AlertTriangle, TrendingUp, MapPin, Clock, Shield, Target } from 'lucide-react';

interface ThreatData {
  id: string;
  title: string;
  description: string;
  targetedIndustries: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  region: 'Global' | 'India';
  dateDetected: Date;
  affectedUsers: number;
}

const threats: ThreatData[] = [
  {
    id: '1',
    title: 'CEO Fraud Email Campaign',
    description: 'Sophisticated phishing emails impersonating C-level executives requesting urgent wire transfers',
    targetedIndustries: ['Finance', 'Technology', 'Healthcare'],
    riskLevel: 'High',
    region: 'Global',
    dateDetected: new Date(Date.now() - 86400000),
    affectedUsers: 12500
  },
  {
    id: '2',
    title: 'Microsoft 365 Credential Harvesting',
    description: 'Fake Office 365 login pages designed to steal corporate credentials',
    targetedIndustries: ['Professional Services', 'Education', 'Government'],
    riskLevel: 'High',
    region: 'Global',
    dateDetected: new Date(Date.now() - 172800000),
    affectedUsers: 8900
  },
  {
    id: '3',
    title: 'UPI Payment Scam',
    description: 'Fraudulent UPI payment requests disguised as government refunds or cashback offers',
    targetedIndustries: ['Retail', 'E-commerce', 'Banking'],
    riskLevel: 'Medium',
    region: 'India',
    dateDetected: new Date(Date.now() - 259200000),
    affectedUsers: 5400
  },
  {
    id: '4',
    title: 'Ransomware Delivery via PDF',
    description: 'Malicious PDF attachments claiming to be invoices or shipping documents',
    targetedIndustries: ['Manufacturing', 'Logistics', 'Wholesale'],
    riskLevel: 'High',
    region: 'Global',
    dateDetected: new Date(Date.now() - 345600000),
    affectedUsers: 15200
  },
  {
    id: '5',
    title: 'WhatsApp Business Impersonation',
    description: 'Scammers impersonating popular brands on WhatsApp Business accounts',
    targetedIndustries: ['Retail', 'Telecommunications', 'Banking'],
    riskLevel: 'Medium',
    region: 'India',
    dateDetected: new Date(Date.now() - 432000000),
    affectedUsers: 3800
  },
  {
    id: '6',
    title: 'LinkedIn Job Offer Phishing',
    description: 'Fake job offers leading to credential theft and identity fraud',
    targetedIndustries: ['Technology', 'Professional Services', 'Finance'],
    riskLevel: 'Medium',
    region: 'Global',
    dateDetected: new Date(Date.now() - 518400000),
    affectedUsers: 6700
  },
  {
    id: '7',
    title: 'GST Refund Scam Emails',
    description: 'Phishing emails claiming GST refunds with malicious links',
    targetedIndustries: ['All SMEs', 'Retail', 'Services'],
    riskLevel: 'High',
    region: 'India',
    dateDetected: new Date(Date.now() - 604800000),
    affectedUsers: 9100
  },
  {
    id: '8',
    title: 'Supply Chain Attack via Email',
    description: 'Compromised vendor emails distributing malware to partners',
    targetedIndustries: ['Manufacturing', 'Technology', 'Healthcare'],
    riskLevel: 'High',
    region: 'Global',
    dateDetected: new Date(Date.now() - 691200000),
    affectedUsers: 4200
  }
];

export function ThreatInsightsPage() {
  const [regionFilter, setRegionFilter] = useState<'Global' | 'India' | 'All'>('All');

  const filteredThreats = regionFilter === 'All' 
    ? threats 
    : threats.filter(t => t.region === regionFilter);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const highRiskCount = filteredThreats.filter(t => t.riskLevel === 'High').length;
  const mediumRiskCount = filteredThreats.filter(t => t.riskLevel === 'Medium').length;
  const totalAffected = filteredThreats.reduce((sum, t) => sum + t.affectedUsers, 0);

  // Top targeted industries
  const industryCount: Record<string, number> = {};
  filteredThreats.forEach(t => {
    t.targetedIndustries.forEach(ind => {
      industryCount[ind] = (industryCount[ind] || 0) + 1;
    });
  });
  const topIndustries = Object.entries(industryCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">Threat Insights Dashboard</h2>
        <p className="text-gray-600">Real-time intelligence on emerging cybersecurity threats</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <Badge className="bg-red-100 text-red-700">Active</Badge>
            </div>
            <div className="text-3xl text-gray-900">{highRiskCount}</div>
            <div className="text-sm text-gray-600">High Risk Threats</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="text-3xl text-gray-900">{mediumRiskCount}</div>
            <div className="text-sm text-gray-600">Medium Risk Threats</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-3xl text-gray-900">{totalAffected.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Users Affected</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-teal-500" />
            </div>
            <div className="text-3xl text-gray-900">{filteredThreats.length}</div>
            <div className="text-sm text-gray-600">Active Campaigns</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Threat Feed */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                Live Threat Feed
              </CardTitle>
              <CardDescription>Latest phishing and cyber threat intelligence</CardDescription>
            </div>
            <Tabs value={regionFilter} onValueChange={(v) => setRegionFilter(v as any)} className="w-auto">
              <TabsList>
                <TabsTrigger value="All">All Regions</TabsTrigger>
                <TabsTrigger value="Global">
                  <Globe className="w-4 h-4 mr-1" />
                  Global
                </TabsTrigger>
                <TabsTrigger value="India">
                  <MapPin className="w-4 h-4 mr-1" />
                  India
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredThreats.map((threat) => (
              <Card key={threat.id} className="border-l-4" style={{
                borderLeftColor: threat.riskLevel === 'High' ? '#ef4444' : 
                               threat.riskLevel === 'Medium' ? '#f59e0b' : '#10b981'
              }}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">{threat.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{threat.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        {threat.targetedIndustries.map((industry, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {industry}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {threat.dateDetected.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {threat.region}
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {threat.affectedUsers.toLocaleString()} affected
                        </div>
                      </div>
                    </div>

                    <Badge className={getRiskColor(threat.riskLevel)}>
                      {threat.riskLevel}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Threat Table View */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Detailed Threat Analysis</CardTitle>
          <CardDescription>Comprehensive threat data table</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Threat</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Industries</TableHead>
                <TableHead>Affected</TableHead>
                <TableHead>Detected</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredThreats.map((threat) => (
                <TableRow key={threat.id}>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="text-sm text-gray-900">{threat.title}</div>
                      <div className="text-xs text-gray-500 truncate">{threat.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRiskColor(threat.riskLevel)}>
                      {threat.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{threat.region}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {threat.targetedIndustries.slice(0, 2).join(', ')}
                      {threat.targetedIndustries.length > 2 && ` +${threat.targetedIndustries.length - 2}`}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {threat.affectedUsers.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {threat.dateDetected.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Targeted Industries */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Most Targeted Industries
          </CardTitle>
          <CardDescription>Industries at highest risk based on current threats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topIndustries.map(([industry, count], index) => (
              <div key={industry} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                  index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900">{industry}</span>
                    <span className="text-sm text-gray-600">{count} threats</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                      style={{ width: `${(count / threats.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regional Heatmap Placeholder */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-500" />
            Global Threat Heatmap
          </CardTitle>
          <CardDescription>Geographic distribution of active threats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg border-2 border-dashed border-blue-200 flex items-center justify-center">
            <div className="text-center">
              <Globe className="w-16 h-16 text-blue-300 mx-auto mb-3" />
              <p className="text-gray-600">Interactive threat heatmap</p>
              <p className="text-sm text-gray-500 mt-1">Visualizing threat density by region</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
