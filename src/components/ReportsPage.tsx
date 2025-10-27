import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BarChart3, Download, TrendingUp, TrendingDown, Shield } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner@2.0.3';
import { AIRiskPredictor } from './AIRiskPredictor';
import type { Company, Employee, Scan, Simulation } from '../App';

interface ReportsPageProps {
  company: Company;
  employees: Employee[];
  scans: Scan[];
  simulations: Simulation[];
}

export function ReportsPage({ company, employees, scans, simulations }: ReportsPageProps) {
  // Generate health score over time data
  const healthScoreData = [
    { month: 'Jan', score: 45 },
    { month: 'Feb', score: 52 },
    { month: 'Mar', score: 58 },
    { month: 'Apr', score: 65 },
    { month: 'May', score: company.health_score },
  ];

  // Training completion by employee
  const trainingData = employees.map(emp => ({
    name: emp.name.split(' ')[0],
    progress: emp.training_progress,
  }));

  // Simulation outcomes
  const allSimulationResults = simulations.flatMap(s => s.results);
  const simulationData = [
    { name: 'Did Not Click', value: allSimulationResults.filter(r => !r.clicked).length, color: '#10b981' },
    { name: 'Clicked', value: allSimulationResults.filter(r => r.clicked).length, color: '#ef4444' },
  ];

  // Scan results
  const scanData = [
    { name: 'Safe', value: scans.filter(s => s.risk_level === 'Safe').length, color: '#10b981' },
    { name: 'Medium Risk', value: scans.filter(s => s.risk_level === 'Medium').length, color: '#f59e0b' },
    { name: 'High Risk', value: scans.filter(s => s.risk_level === 'High').length, color: '#ef4444' },
  ];

  const handleExportPDF = () => {
    toast.success('Generating PDF report... This will download shortly.');
    // In a real app, this would generate and download a PDF
    setTimeout(() => {
      toast.success('Report downloaded successfully!');
    }, 1500);
  };

  const avgTrainingProgress = employees.length > 0
    ? Math.round(employees.reduce((sum, e) => sum + e.training_progress, 0) / employees.length)
    : 0;

  const totalPhishClicks = employees.reduce((sum, e) => sum + e.phish_clicks, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-2">Security Reports</h2>
          <p className="text-gray-600">Analytics and insights for {company.name}</p>
        </div>
        <Button onClick={handleExportPDF} className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600">
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 text-blue-500" />
              <Badge className={company.health_score >= 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                {company.health_score >= 70 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {company.health_score >= 70 ? 'Good' : 'Needs Work'}
              </Badge>
            </div>
            <div className="text-3xl text-gray-900">{company.health_score}</div>
            <div className="text-sm text-gray-600">Security Score</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-3xl text-gray-900">{avgTrainingProgress}%</div>
            <div className="text-sm text-gray-600 mb-2">Avg. Training Progress</div>
            <div className="text-xs text-gray-500">
              {employees.filter(e => e.training_progress === 100).length}/{employees.length} completed
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-3xl text-gray-900">{scans.length}</div>
            <div className="text-sm text-gray-600 mb-2">Total Scans</div>
            <div className="text-xs text-gray-500">
              {scans.filter(s => s.risk_level === 'High').length} high risk detected
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-3xl text-gray-900">{simulations.length}</div>
            <div className="text-sm text-gray-600 mb-2">Simulations Sent</div>
            <div className="text-xs text-gray-500">
              {totalPhishClicks} total clicks
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Score Over Time */}
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Cyber Health Score Trend
            </CardTitle>
            <CardDescription>Security score over the last 5 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={healthScoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Training Completion */}
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-500" />
              Training Completion by Employee
            </CardTitle>
            <CardDescription>Individual progress across the team</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trainingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="progress" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Simulation Outcomes */}
        {simulationData.some(d => d.value > 0) && (
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Phishing Simulation Outcomes</CardTitle>
              <CardDescription>Employee response to simulated phishing</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={simulationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {simulationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Threat Detection Results */}
        {scanData.some(d => d.value > 0) && (
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Threat Detection Results</CardTitle>
              <CardDescription>Distribution of scan risk levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={scanData.filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {scanData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Department Leaderboard */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Department Leaderboard</CardTitle>
          <CardDescription>Training progress by department</CardDescription>
        </CardHeader>
        <CardContent>
          {(() => {
            const departments = [...new Set(employees.map(e => e.department))];
            const deptStats = departments.map(dept => {
              const deptEmployees = employees.filter(e => e.department === dept);
              const avgProgress = deptEmployees.reduce((sum, e) => sum + e.training_progress, 0) / deptEmployees.length;
              const avgClicks = deptEmployees.reduce((sum, e) => sum + e.phish_clicks, 0) / deptEmployees.length;
              return {
                department: dept,
                avgProgress: Math.round(avgProgress),
                avgClicks: avgClicks.toFixed(1),
                employeeCount: deptEmployees.length
              };
            }).sort((a, b) => b.avgProgress - a.avgProgress);

            return (
              <div className="space-y-3">
                {deptStats.map((dept, index) => (
                  <div key={dept.department} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                          index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-gray-900">{dept.department}</h4>
                          <p className="text-xs text-gray-500">{dept.employeeCount} employees</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl text-gray-900">{dept.avgProgress}%</div>
                        <div className="text-xs text-gray-500">{dept.avgClicks} avg clicks</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Security Badges */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Security Achievements</CardTitle>
          <CardDescription>Badges earned by your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {company.health_score >= 70 && (
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 text-center">
                <div className="text-4xl mb-2">🏆</div>
                <div className="text-sm text-green-900">Security Champion</div>
                <div className="text-xs text-green-600">70+ Health Score</div>
              </div>
            )}
            {avgTrainingProgress === 100 && (
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200 text-center">
                <div className="text-4xl mb-2">🎓</div>
                <div className="text-sm text-blue-900">Training Complete</div>
                <div className="text-xs text-blue-600">100% Team Trained</div>
              </div>
            )}
            {scans.length >= 10 && (
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 text-center">
                <div className="text-4xl mb-2">🔍</div>
                <div className="text-sm text-purple-900">Threat Hunter</div>
                <div className="text-xs text-purple-600">10+ Scans</div>
              </div>
            )}
            {company.mfa_enabled && company.password_policy && company.backups_enabled && (
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 text-center">
                <div className="text-4xl mb-2">🛡️</div>
                <div className="text-sm text-amber-900">Well Protected</div>
                <div className="text-xs text-amber-600">Security Basics</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Risk Predictor Section */}
      <AIRiskPredictor company={company} employees={employees} scans={scans} />
    </div>
  );
}