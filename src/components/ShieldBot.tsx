import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { X, Send, Bot, User, Sparkles, Mic, MicOff } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ShieldBotProps {
  onClose: () => void;
}

export function ShieldBot({ onClose }: ShieldBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! I\'m Cyra, your voice-enabled cybersecurity assistant. I can help you with security questions, explain features, and provide guidance. Try saying "Hey Cyra, scan this link" or "What\'s my risk level?" How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const quickQuestions = [
    'Is this email suspicious?',
    'How do I enable MFA?',
    'What\'s my security score?',
    'How do phishing simulations work?',
  ];

  const getBotResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();

    // Security score queries
    if (lower.includes('security score') || lower.includes('health score') || lower.includes('my score')) {
      return 'Your Cyber Health Score is displayed on the main dashboard. It\'s calculated based on your security configuration (40%), employee training readiness (30%), and threat detection activity (30%). You can improve it by completing the 2-minute cyber health check and ensuring all employees complete their training.';
    }

    // MFA queries
    if (lower.includes('mfa') || lower.includes('multi-factor') || lower.includes('two-factor') || lower.includes('2fa')) {
      return 'Multi-Factor Authentication (MFA) adds an extra layer of security beyond passwords. To enable MFA: 1) Go to Settings → Security, 2) Click "Enable Two-Factor Authentication", 3) Follow the setup wizard. I highly recommend enabling this for all accounts!';
    }

    // Suspicious email/phishing
    if (lower.includes('suspicious') || lower.includes('phishing') || lower.includes('email safe')) {
      return 'To check if an email is suspicious, use our Phishing Detection tool! Look for red flags like: urgent language, generic greetings ("Dear customer"), mismatched sender domains, requests for passwords or personal info, and suspicious links. When in doubt, verify with the sender through a different channel.';
    }

    // Phishing simulation
    if (lower.includes('simulation') || lower.includes('test email') || lower.includes('fake phishing')) {
      return 'Phishing simulations help train your team to recognize threats. Go to the Phishing Simulation page, select a template (like "Password Reset"), choose target employees, and send. The system tracks who clicks the link so you can provide additional training where needed. It\'s completely safe - no real harm occurs!';
    }

    // Training queries
    if (lower.includes('training') || lower.includes('lesson') || lower.includes('learn')) {
      return 'Our Training Portal offers 5 micro-lessons covering key security topics. Complete each lesson and pass the quiz to unlock the next one. Topics include: Recognizing Phishing, Safe Links & Attachments, Passwords & MFA, Data Handling, and Reporting Incidents. Completing training boosts your team\'s readiness score!';
    }

    // Scan/detection queries
    if (lower.includes('scan') || lower.includes('url') || lower.includes('link check')) {
      return 'Use the Phishing Detection tool to scan suspicious URLs or email content. Our AI-powered scanner checks for patterns like mismatched domains, suspicious TLDs, urgent keywords, and other phishing indicators. You can toggle AI Mode for enhanced detection. All scans are saved to your history.';
    }

    // Reports
    if (lower.includes('report') || lower.includes('analytics') || lower.includes('export')) {
      return 'The Reports page shows comprehensive analytics including your health score trend, training completion, simulation outcomes, and department leaderboards. You can export a PDF summary by clicking the "Export PDF" button at the top of the Reports page.';
    }

    // General help
    if (lower.includes('help') || lower.includes('how') || lower.includes('what')) {
      return 'I can help with: checking if emails are suspicious, explaining your security score, guiding you through MFA setup, explaining phishing simulations, and answering questions about training. Try asking me something specific, or use one of the quick questions below!';
    }

    // Default response
    return 'That\'s a great question! I can help you with: security scores, MFA setup, phishing detection, training modules, simulations, and reports. Could you provide more details or try one of the quick questions below?';
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate bot thinking delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getBotResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 600);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  const handleVoiceInput = () => {
    if (!voiceEnabled) return;
    
    setIsListening(true);
    
    // Simulate voice recognition
    setTimeout(() => {
      const voiceCommands = [
        'Hey Cyra, scan this link',
        'What\'s my risk level?',
        'How do I enable MFA?',
        'Is this email safe?',
      ];
      const randomCommand = voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
      setInput(randomCommand);
      setIsListening(false);
      setTimeout(() => handleSend(), 500);
    }, 2000);
  };

  return (
    <Card className="backdrop-blur-md bg-white/95 border-0 shadow-2xl h-[600px] flex flex-col">
      <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                Cyra Voice
                <Sparkles className="w-4 h-4" />
              </CardTitle>
              <CardDescription className="text-blue-100">
                Voice-Interactive AI Assistant
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Voice Mode Toggle */}
        <div className="flex items-center justify-between mt-3 p-2 bg-white/10 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-white" />
            <span className="text-white text-sm">Enable Voice Mode</span>
          </div>
          <Switch
            checked={voiceEnabled}
            onCheckedChange={setVoiceEnabled}
            className="data-[state=checked]:bg-white data-[state=unchecked]:bg-blue-400"
          />
        </div>
        
        {voiceEnabled && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-blue-100 text-xs mt-2 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            Say — "Hey Cyra, scan this link" or "What's my risk level?"
          </motion.p>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
                  message.type === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-teal-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={voiceEnabled ? "Ask me anything or use voice..." : "Ask me anything..."}
              className="flex-1"
            />
            
            {/* Voice Input Button */}
            {voiceEnabled && (
              <Button
                onClick={handleVoiceInput}
                disabled={isListening}
                variant="outline"
                className={`relative ${isListening ? 'border-blue-500' : ''}`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4 text-blue-500" />
                    {/* Voice Wave Animation */}
                    <motion.div
                      className="absolute inset-0 rounded-md bg-blue-500/20"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </>
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            )}
            
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {isListening && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 flex items-center justify-center gap-2 text-blue-600 text-sm"
            >
              <motion.div
                className="flex items-center gap-1"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-1 h-3 bg-blue-500 rounded-full" />
                <div className="w-1 h-5 bg-blue-500 rounded-full" />
                <div className="w-1 h-4 bg-blue-500 rounded-full" />
                <div className="w-1 h-6 bg-blue-500 rounded-full" />
                <div className="w-1 h-4 bg-blue-500 rounded-full" />
                <div className="w-1 h-5 bg-blue-500 rounded-full" />
                <div className="w-1 h-3 bg-blue-500 rounded-full" />
              </motion.div>
              <span>Listening...</span>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
