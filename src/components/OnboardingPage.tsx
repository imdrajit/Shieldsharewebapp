import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Shield, Building, Users, Briefcase } from 'lucide-react';

interface OnboardingPageProps {
  onComplete: (data: { name: string; industry: string; size: string }) => void;
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName && industry && size) {
      onComplete({ name: companyName, industry, size });
    }
  };

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Retail',
    'Manufacturing',
    'Education',
    'Professional Services',
    'Other'
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-100 employees',
    '101-250 employees',
    '250+ employees'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">Welcome to ShieldShare</h1>
          <p className="text-gray-600">Let's set up your cybersecurity dashboard</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  s <= step
                    ? 'bg-gradient-to-br from-blue-500 to-teal-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-1 transition-all ${
                    s < step ? 'bg-gradient-to-r from-blue-500 to-teal-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Onboarding Card */}
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
          <CardHeader>
            <CardTitle>
              {step === 1 && 'Company Information'}
              {step === 2 && 'Industry & Size'}
              {step === 3 && 'Review & Complete'}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'Tell us about your organization'}
              {step === 2 && 'Help us customize your experience'}
              {step === 3 && 'Confirm your details to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="companyName"
                        type="text"
                        placeholder="Acme Corporation"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                      <Select value={industry} onValueChange={setIndustry} required>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((ind) => (
                            <SelectItem key={ind} value={ind}>
                              {ind}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Company Size</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                      <Select value={size} onValueChange={setSize} required>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          {companySizes.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Company Name:</span>
                      <span className="text-gray-900">{companyName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Industry:</span>
                      <span className="text-gray-900">{industry}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="text-gray-900">{size}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-blue-900 mb-2">What's Next?</h3>
                    <ul className="space-y-2 text-blue-800">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                        <span>Complete your 2-minute cyber health check</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                        <span>Scan for phishing threats</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                        <span>Start employee security training</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                    disabled={
                      (step === 1 && !companyName) ||
                      (step === 2 && (!industry || !size))
                    }
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                  >
                    Complete Setup
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
