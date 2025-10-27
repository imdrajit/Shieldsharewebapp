import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Progress } from './ui/progress';
import { Shield, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { Company } from '../App';

interface CyberHealthCheckModalProps {
  open: boolean;
  onClose: () => void;
  company: Company;
  updateCompany: (updates: Partial<Company>) => void;
}

interface Question {
  id: keyof Company;
  question: string;
  description: string;
}

const questions: Question[] = [
  {
    id: 'mfa_enabled',
    question: 'Is Multi-Factor Authentication (MFA) enabled for all users?',
    description: 'MFA adds an extra layer of security beyond passwords'
  },
  {
    id: 'password_policy',
    question: 'Do you have a strong password policy in place?',
    description: 'Requiring complex passwords and regular updates'
  },
  {
    id: 'backups_enabled',
    question: 'Are automated backups configured and tested regularly?',
    description: 'Regular backups protect against data loss and ransomware'
  },
  {
    id: 'updates_current',
    question: 'Are all systems and software kept up to date?',
    description: 'Updates include critical security patches'
  },
  {
    id: 'antivirus_enabled',
    question: 'Is antivirus/anti-malware protection active on all devices?',
    description: 'Real-time protection against malicious software'
  },
  {
    id: 'security_training',
    question: 'Do employees receive regular security awareness training?',
    description: 'Educated employees are your first line of defense'
  }
];

export function CyberHealthCheckModal({ open, onClose, company, updateCompany }: CyberHealthCheckModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [isComplete, setIsComplete] = useState(false);

  const handleAnswer = (value: string) => {
    const questionId = questions[currentQuestion].id;
    setAnswers({ ...answers, [questionId]: value === 'yes' });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Complete the check
      const updates: Partial<Company> = {};
      questions.forEach(q => {
        updates[q.id] = answers[q.id] ?? company[q.id];
      });
      updateCompany(updates);
      setIsComplete(true);
      toast.success('Cyber Health Check completed! Your score has been updated.');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleClose = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
    onClose();
  };

  const currentAnswer = answers[questions[currentQuestion]?.id];
  const progress = ((currentQuestion + (currentAnswer !== undefined ? 1 : 0)) / questions.length) * 100;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        {!isComplete ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                2-Minute Cyber Health Check
              </DialogTitle>
              <DialogDescription>
                Question {currentQuestion + 1} of {questions.length}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <Progress value={progress} className="h-2" />

              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-900 mb-2">
                    {questions[currentQuestion].question}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {questions[currentQuestion].description}
                  </p>
                </div>

                <RadioGroup
                  value={currentAnswer === true ? 'yes' : currentAnswer === false ? 'no' : ''}
                  onValueChange={handleAnswer}
                >
                  <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes" className="flex-1 cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no" className="flex-1 cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex gap-3">
                {currentQuestion > 0 && (
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={currentAnswer === undefined}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                >
                  {currentQuestion < questions.length - 1 ? 'Next' : 'Complete Check'}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                Health Check Complete!
              </DialogTitle>
              <DialogDescription>
                Your cyber health score has been updated
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg text-center">
                <div className="text-5xl text-green-600 mb-2">✓</div>
                <h3 className="text-green-900 mb-2">Assessment Complete</h3>
                <p className="text-green-700">
                  We've analyzed your responses and updated your security score
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-gray-900">Results Summary:</h4>
                {questions.map((q) => (
                  <div key={q.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 text-sm">{q.question}</span>
                    {answers[q.id] ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <span className="text-red-500 flex-shrink-0">✗</span>
                    )}
                  </div>
                ))}
              </div>

              <Button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
              >
                Return to Dashboard
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
