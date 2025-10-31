import { useState } from 'react';
import { Shield, LayoutDashboard, Search, ScanLine, GraduationCap, Mail, BarChart3, Settings, Menu, X, User, Sparkles, MessageCircle, MailOpen, Globe, Lock, Target, Brain, Trophy, Users, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ShieldBot } from './ShieldBot';
import { CyberTipWidget } from './CyberTipWidget';
import type { User as UserType } from '../App';

interface DashboardLayoutProps {
  user: UserType;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  children: React.ReactNode;
  isDemoMode?: boolean;
}

export function DashboardLayout({ user, currentPage, setCurrentPage, children, isDemoMode }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [cyberTipVisible, setCyberTipVisible] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'phishing-detection', label: 'Phishing Detection', icon: ScanLine },
    { id: 'email-analyzer', label: 'Email Analyzer', icon: MailOpen },
    { id: 'threat-insights', label: 'Threat Insights', icon: Globe },
    { id: 'training', label: 'Training Portal', icon: GraduationCap },
    { id: 'simulation', label: 'Phishing Simulation', icon: Mail },
    { id: 'password-checkup', label: 'Password Checkup', icon: Lock },
    { id: 'spot-the-phish', label: 'Spot the Phish', icon: Target },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'team-missions', label: 'Team Missions', icon: Users },
    { id: 'my-progress', label: 'My Progress', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/30">
      {/* Top Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">ShieldShare</h1>
                {isDemoMode && (
                  <div className="flex items-center gap-1 text-amber-600">
                    <Sparkles className="w-3 h-3" />
                    <span className="text-xs">Demo Mode</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 w-64 bg-gray-50"
              />
            </div>
            
            <Avatar>
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-[57px] left-0 h-[calc(100vh-57px)] bg-white/80 backdrop-blur-md border-r border-gray-200 transition-all duration-300 z-30 ${
            sidebarOpen ? 'w-64' : 'w-0 lg:w-16'
          } overflow-hidden`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Chatbot Button */}
      <button
        onClick={() => setChatbotOpen(!chatbotOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 text-white rounded-full shadow-2xl hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chatbot */}
      {chatbotOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] z-50">
          <ShieldBot onClose={() => setChatbotOpen(false)} />
        </div>
      )}

      {/* Cyber Tip Widget */}
      {cyberTipVisible && !chatbotOpen && (
        <div className="fixed bottom-24 right-6 w-80 max-w-[calc(100vw-3rem)] z-40">
          <CyberTipWidget onClose={() => setCyberTipVisible(false)} />
        </div>
      )}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}