import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { X, Lightbulb, Heart, RotateCcw } from 'lucide-react';

const cyberTips = [
  "Never click on unexpected email attachments, even from known contacts",
  "Use unique, strong passwords for every account you own",
  "Always check for HTTPS and the padlock icon before logging in",
  "Enable two-factor authentication (2FA) wherever possible",
  "Be suspicious of emails creating urgency or fear",
  "Hover over links before clicking to verify the actual destination",
  "Keep your software and operating system up to date",
  "Back up your important data regularly to prevent loss",
  "Use a password manager to generate and store complex passwords",
  "Never share passwords over email, text, or phone calls",
  "Be cautious of public Wi-Fi - use a VPN when possible",
  "Check sender email addresses carefully for slight misspellings",
  "Don't trust caller ID - scammers can fake phone numbers",
  "Review your account privacy settings regularly",
  "Use different email addresses for banking vs. social media",
  "Shred sensitive documents before throwing them away",
  "Lock your computer when stepping away from your desk",
  "Be wary of too-good-to-be-true offers and prizes",
  "Verify requests for sensitive info through a separate channel",
  "Use biometric authentication (fingerprint/face ID) when available",
  "Don't overshare personal information on social media",
  "Check your bank and credit card statements regularly",
  "Use encryption for sensitive files and communications",
  "Create strong security questions with non-public answers",
  "Be cautious of downloading free software from unknown sources",
  "Never send money to someone you've only met online",
  "Use separate browsers for personal vs. work accounts",
  "Clear your browser cache and cookies periodically",
  "Disable auto-fill for passwords on shared computers",
  "Be skeptical of friend requests from people you already know",
  "Report phishing attempts to your IT or security team",
  "Use credit cards instead of debit cards for online shopping",
  "Set up account alerts for suspicious activity",
  "Never plug in found USB drives or external devices",
  "Use private/incognito mode for sensitive browsing",
  "Verify software updates are from official sources",
  "Don't use the same security questions across sites",
  "Log out of accounts when finished, especially on shared devices",
  "Be cautious of QR codes from unknown sources",
  "Use app-based 2FA instead of SMS when possible",
  "Check app permissions and revoke unnecessary access",
  "Create strong PINs - avoid birthdays and sequential numbers",
  "Enable remote wipe features on mobile devices",
  "Be wary of tech support calls claiming issues with your computer",
  "Use a separate credit card for online purchases",
  "Verify charity organizations before donating",
  "Don't click 'Remember Me' on public or shared computers",
  "Review third-party app access to your accounts regularly",
  "Use encrypted messaging apps for sensitive conversations",
  "Keep your antivirus software up to date and running"
];

interface CyberTipWidgetProps {
  onClose?: () => void;
}

export function CyberTipWidget({ onClose }: CyberTipWidgetProps) {
  const [currentTip, setCurrentTip] = useState('');
  const [saved, setSaved] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Get a random tip on mount
    const randomTip = cyberTips[Math.floor(Math.random() * cyberTips.length)];
    setCurrentTip(randomTip);
    
    // Check if widget was dismissed today
    const dismissedDate = localStorage.getItem('cyberTipDismissed');
    const today = new Date().toDateString();
    if (dismissedDate === today) {
      setDismissed(true);
    }
  }, []);

  const handleNewTip = () => {
    const randomTip = cyberTips[Math.floor(Math.random() * cyberTips.length)];
    setCurrentTip(randomTip);
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    // In a real app, save to user's favorites
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDismiss = () => {
    const today = new Date().toDateString();
    localStorage.setItem('cyberTipDismissed', today);
    setDismissed(true);
    if (onClose) onClose();
  };

  if (dismissed) return null;

  return (
    <Card className="backdrop-blur-md bg-gradient-to-r from-blue-500 to-teal-500 text-white border-0 shadow-2xl w-80 animate-in slide-in-from-bottom-5">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-300" />
            <h3 className="text-white">Cyber Tip of the Day</h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-blue-50 text-sm leading-relaxed mb-4 min-h-[60px]">
          💡 {currentTip}
        </p>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSave}
            className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            {saved ? (
              <>
                <Heart className="w-4 h-4 mr-1 fill-current" />
                Saved!
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-1" />
                Save Tip
              </>
            )}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleNewTip}
            className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            New Tip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
