import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Mail, Send, AlertTriangle, CheckCircle2, User, Plus, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { Employee, Simulation } from '../App';

interface PhishingSimulationPageProps {
  employees: Employee[];
  simulations: Simulation[];
  addSimulation: (simulation: Simulation) => void;
}

const templates = [
  { id: 'password-reset', name: 'Password Reset Request', description: 'Urgent password reset from IT department' },
  { id: 'package-delivery', name: 'Package Delivery Notice', description: 'Failed delivery notification with tracking link' },
  { id: 'account-verify', name: 'Account Verification', description: 'Verify your account to prevent suspension' },
  { id: 'invoice-payment', name: 'Invoice Payment Due', description: 'Urgent payment request from finance' },
  { id: 'hr-document', name: 'HR Document Review', description: 'Review and sign important HR documents' },
];

export function PhishingSimulationPage({ employees, simulations, addSimulation }: PhishingSimulationPageProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [newEmployeeDialogOpen, setNewEmployeeDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSelectAllEmployees = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(e => e.id));
    }
  };

  const handleToggleEmployee = (id: string) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter(e => e !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const handleSendSimulation = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a phishing template');
      return;
    }
    if (selectedEmployees.length === 0) {
      toast.error('Please select at least one employee');
      return;
    }

    setIsSending(true);
    
    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate random results (some employees click, some don't)
    const results = selectedEmployees.map(empId => ({
      employee_id: empId,
      clicked: Math.random() > 0.6 // 40% click rate
    }));

    const newSimulation: Simulation = {
      id: Date.now().toString(),
      template: templates.find(t => t.id === selectedTemplate)?.name || selectedTemplate,
      sent_at: new Date(),
      results: results
    };

    addSimulation(newSimulation);
    setIsSending(false);
    setSelectedTemplate('');
    setSelectedEmployees([]);
    
    const clickedCount = results.filter(r => r.clicked).length;
    toast.success(`Simulation sent to ${results.length} employees. ${clickedCount} clicked the phishing link.`);
  };

  const latestSimulation = simulations[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">Phishing Simulation</h2>
        <p className="text-gray-600">Test and train your employees with realistic phishing scenarios</p>
      </div>

      {/* Create Simulation Card */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            Create New Simulation
          </CardTitle>
          <CardDescription>
            Select a template and target employees
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-2">
            <Label>Choose Phishing Template</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    <div>
                      <div>{template.name}</div>
                      <div className="text-xs text-gray-500">{template.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Template Preview */}
          {selectedTemplate && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border border-blue-200">
              <h4 className="text-blue-900 mb-2">Template Preview</h4>
              <div className="p-3 bg-white rounded border text-sm space-y-2">
                <div><strong>From:</strong> IT Security &lt;security@company-internal.com&gt;</div>
                <div><strong>Subject:</strong> {templates.find(t => t.id === selectedTemplate)?.name}</div>
                <div className="pt-2 border-t">
                  <p className="text-gray-700">{templates.find(t => t.id === selectedTemplate)?.description}</p>
                  <p className="mt-2 text-blue-600 underline cursor-pointer">Click here to proceed →</p>
                </div>
              </div>
              <p className="text-blue-700 text-xs mt-2">
                ⚠️ This is a safe simulation - no real harm will occur
              </p>
            </div>
          )}

          {/* Employee Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Select Target Employees</Label>
              <Button variant="outline" size="sm" onClick={handleSelectAllEmployees}>
                {selectedEmployees.length === employees.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
              {employees.map(employee => (
                <div
                  key={employee.id}
                  onClick={() => handleToggleEmployee(employee.id)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedEmployees.includes(employee.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedEmployees.includes(employee.id) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm text-gray-900">{employee.name}</div>
                        <div className="text-xs text-gray-500">{employee.department}</div>
                      </div>
                    </div>
                    {employee.phish_clicks > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {employee.phish_clicks} clicks
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-600">
              {selectedEmployees.length} employee{selectedEmployees.length !== 1 ? 's' : ''} selected
            </p>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendSimulation}
            disabled={isSending || !selectedTemplate || selectedEmployees.length === 0}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Sending Simulation...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Phishing Simulation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Latest Results */}
      {latestSimulation && (
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Latest Simulation Results
            </CardTitle>
            <CardDescription>
              {latestSimulation.template} - {new Date(latestSimulation.sent_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl text-blue-600">{latestSimulation.results.length}</div>
                  <div className="text-sm text-blue-900">Emails Sent</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-2xl text-red-600">
                    {latestSimulation.results.filter(r => r.clicked).length}
                  </div>
                  <div className="text-sm text-red-900">Clicked Link</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl text-green-600">
                    {latestSimulation.results.filter(r => !r.clicked).length}
                  </div>
                  <div className="text-sm text-green-900">Did Not Click</div>
                </div>
              </div>

              {/* Employee Results */}
              <div>
                <h4 className="text-gray-900 mb-3">Employee Results</h4>
                <div className="space-y-2">
                  {latestSimulation.results.map(result => {
                    const employee = employees.find(e => e.id === result.employee_id);
                    if (!employee) return null;

                    return (
                      <div
                        key={result.employee_id}
                        className={`p-3 rounded-lg border ${
                          result.clicked
                            ? 'bg-red-50 border-red-200'
                            : 'bg-green-50 border-green-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              result.clicked ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'
                            }`}>
                              {employee.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm text-gray-900">{employee.name}</div>
                              <div className="text-xs text-gray-500">{employee.email}</div>
                            </div>
                          </div>
                          {result.clicked ? (
                            <div className="flex items-center gap-2">
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Clicked
                              </Badge>
                            </div>
                          ) : (
                            <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Safe
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations */}
              {latestSimulation.results.some(r => r.clicked) && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="text-amber-900 mb-2">⚠️ Recommendations</h4>
                  <ul className="space-y-1 text-amber-800 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5" />
                      <span>Provide additional training to employees who clicked</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5" />
                      <span>Review phishing recognition best practices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5" />
                      <span>Run follow-up simulations in 2-4 weeks</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Simulation History */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Simulation History</CardTitle>
          <CardDescription>
            Past phishing simulation campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {simulations.length > 0 ? (
            <div className="space-y-3">
              {simulations.map((sim, index) => {
                const clicked = sim.results.filter(r => r.clicked).length;
                const total = sim.results.length;
                const percentage = Math.round((clicked / total) * 100);

                return (
                  <div key={sim.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-gray-900">{sim.template}</h4>
                        <p className="text-xs text-gray-500">
                          {new Date(sim.sent_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge className={percentage > 30 ? 'bg-red-100 text-red-700' : percentage > 15 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}>
                        {percentage}% clicked
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {clicked} of {total} employees clicked the phishing link
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No simulations sent yet</p>
              <p className="text-sm mt-1">Create your first simulation above</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}