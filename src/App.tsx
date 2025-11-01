import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { OnboardingPage } from "./components/OnboardingPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardPage } from "./components/DashboardPage";
import { BrowserProtectionPage } from "./components/BrowserProtectionPage";
import { EmailSecuritySyncPage } from "./components/EmailSecuritySyncPage";
import { USBProtectionPage } from "./components/USBProtectionPage";
import { AutoDataErasePage } from "./components/AutoDataErasePage";
import { PhishingDetectionPage } from "./components/PhishingDetectionPage";
import { EmailAnalyzerPage } from "./components/EmailAnalyzerPage";
import { ThreatInsightsPage } from "./components/ThreatInsightsPage";
import { TrainingPage } from "./components/TrainingPage";
import { PhishingSimulationPage } from "./components/PhishingSimulationPage";
import { PasswordCheckupPage } from "./components/PasswordCheckupPage";
import { SpotThePhishGame } from "./components/SpotThePhishGame";
import { LeaderboardPage } from "./components/LeaderboardPage";
import { TeamMissionsPage } from "./components/TeamMissionsPage";
import { MyProgressPage } from "./components/MyProgressPage";
import { ReportsPage } from "./components/ReportsPage";
import { SettingsPage } from "./components/SettingsPage";
import { Toaster } from "./components/ui/sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company_id: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  health_score: number;
  mfa_enabled: boolean;
  password_policy: boolean;
  backups_enabled: boolean;
  updates_current: boolean;
  antivirus_enabled: boolean;
  security_training: boolean;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  training_progress: number;
  phish_clicks: number;
  department: string;
}

export interface Scan {
  id: string;
  url: string;
  risk_level: "Safe" | "Medium" | "High";
  reasons: string[];
  created_at: Date;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  quiz: QuizQuestion[];
  completed: boolean;
  score?: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface Simulation {
  id: string;
  template: string;
  sent_at: Date;
  results: {
    employee_id: string;
    clicked: boolean;
  }[];
}

export default function App() {
  const [currentPage, setCurrentPage] =
    useState<string>("login");
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [scans, setScans] = useState<Scan[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [simulations, setSimulations] = useState<Simulation[]>(
    [],
  );
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Initialize demo data
  useEffect(() => {
    if (company) {
      // Initialize employees
      setEmployees([
        {
          id: "1",
          name: "Sarah Johnson",
          email: "sarah@company.com",
          training_progress: 100,
          phish_clicks: 0,
          department: "Engineering",
        },
        {
          id: "2",
          name: "Michael Chen",
          email: "michael@company.com",
          training_progress: 80,
          phish_clicks: 1,
          department: "Sales",
        },
        {
          id: "3",
          name: "Emily Davis",
          email: "emily@company.com",
          training_progress: 60,
          phish_clicks: 0,
          department: "Marketing",
        },
        {
          id: "4",
          name: "James Wilson",
          email: "james@company.com",
          training_progress: 40,
          phish_clicks: 2,
          department: "Sales",
        },
        {
          id: "5",
          name: "Lisa Anderson",
          email: "lisa@company.com",
          training_progress: 20,
          phish_clicks: 1,
          department: "HR",
        },
      ]);

      // Initialize lessons
      setLessons([
        {
          id: "1",
          title: "Recognize Phishing",
          duration: "5 min",
          completed: false,
          content:
            "Learn to identify common phishing tactics including suspicious URLs, urgent language, and mismatched sender addresses.",
          quiz: [
            {
              question:
                "What is a common sign of a phishing email?",
              options: [
                "Professional greeting",
                "Urgent action required",
                "Clear company logo",
                "Personalized content",
              ],
              correct: 1,
            },
            {
              question:
                "What should you check in a suspicious link?",
              options: [
                "Link color",
                "URL domain",
                "Link length",
                "Number of words",
              ],
              correct: 1,
            },
            {
              question:
                "Who should you report phishing attempts to?",
              options: [
                "Your friends",
                "IT/Security team",
                "Social media",
                "Nobody",
              ],
              correct: 1,
            },
          ],
        },
        {
          id: "2",
          title: "Safe Links & Attachments",
          duration: "4 min",
          completed: false,
          content:
            "Understand how to safely handle links and attachments in emails. Learn about malware risks and verification techniques.",
          quiz: [
            {
              question: "Before clicking a link, you should:",
              options: [
                "Click immediately",
                "Hover to preview URL",
                "Share with colleagues",
                "Delete the email",
              ],
              correct: 1,
            },
            {
              question: "Which file type is generally safest?",
              options: [
                ".exe",
                ".zip",
                ".pdf from known sender",
                ".scr",
              ],
              correct: 2,
            },
            {
              question:
                "What should you do with unexpected attachments?",
              options: [
                "Open immediately",
                "Verify with sender",
                "Forward to everyone",
                "Download and scan later",
              ],
              correct: 1,
            },
          ],
        },
        {
          id: "3",
          title: "Passwords & MFA",
          duration: "6 min",
          completed: false,
          content:
            "Master password best practices and multi-factor authentication. Create strong, unique passwords and understand 2FA benefits.",
          quiz: [
            {
              question: "A strong password should include:",
              options: [
                "Only letters",
                "Personal information",
                "Mix of characters, numbers, symbols",
                "Your birthday",
              ],
              correct: 2,
            },
            {
              question: "What does MFA stand for?",
              options: [
                "My First Authentication",
                "Multi-Factor Authentication",
                "Manual File Access",
                "Main Function Array",
              ],
              correct: 1,
            },
            {
              question:
                "How often should you change passwords?",
              options: [
                "Never",
                "Every day",
                "Every 3-6 months",
                "Every 10 years",
              ],
              correct: 2,
            },
          ],
        },
        {
          id: "4",
          title: "Data Handling",
          duration: "5 min",
          completed: false,
          content:
            "Learn proper data classification, storage, and sharing practices. Understand compliance requirements and data protection.",
          quiz: [
            {
              question: "Sensitive data should be:",
              options: [
                "Shared publicly",
                "Encrypted and protected",
                "Emailed freely",
                "Printed and left out",
              ],
              correct: 1,
            },
            {
              question:
                "Before sharing customer data, you should:",
              options: [
                "Check authorization",
                "Post on social media",
                "Email to anyone",
                "Print copies",
              ],
              correct: 0,
            },
            {
              question:
                "How should you dispose of sensitive documents?",
              options: [
                "Regular trash",
                "Shred them",
                "Leave on desk",
                "Give to anyone",
              ],
              correct: 1,
            },
          ],
        },
        {
          id: "5",
          title: "Reporting Incidents",
          duration: "4 min",
          completed: false,
          content:
            "Know how and when to report security incidents. Understand the importance of timely reporting and proper channels.",
          quiz: [
            {
              question:
                "When should you report a security incident?",
              options: [
                "Next month",
                "Immediately",
                "Never",
                "After vacation",
              ],
              correct: 1,
            },
            {
              question: "Who should receive incident reports?",
              options: [
                "Social media",
                "IT/Security team",
                "Competitors",
                "Nobody",
              ],
              correct: 1,
            },
            {
              question:
                "What information should an incident report include?",
              options: [
                "Just your name",
                "All relevant details",
                "Only the time",
                "Nothing specific",
              ],
              correct: 1,
            },
          ],
        },
      ]);

      // Initialize some sample scans
      setScans([
        {
          id: "1",
          url: "https://secure-banking-login.com",
          risk_level: "Safe",
          reasons: [
            "Legitimate domain",
            "Valid SSL certificate",
            "No suspicious patterns",
          ],
          created_at: new Date(Date.now() - 86400000),
        },
        {
          id: "2",
          url: "http://paypa1-secure.com/verify",
          risk_level: "High",
          reasons: [
            "Mismatched domain (PayPal with number 1)",
            "No HTTPS",
            'Suspicious "verify" path',
          ],
          created_at: new Date(Date.now() - 172800000),
        },
      ]);
    }
  }, [company]);

  const handleLogin = (
    email: string,
    isDemo: boolean = false,
  ) => {
    const newUser: User = {
      id: "1",
      name: isDemo ? "Demo User" : email.split("@")[0],
      email: email,
      role: "Admin",
      company_id: "1",
    };
    setUser(newUser);
    setIsDemoMode(isDemo);

    if (isDemo) {
      // Skip onboarding for demo mode with pre-filled company
      const demoCompany: Company = {
        id: "1",
        name: "Demo Tech Inc",
        industry: "Technology",
        size: "50-100",
        health_score: 72,
        mfa_enabled: true,
        password_policy: true,
        backups_enabled: true,
        updates_current: false,
        antivirus_enabled: true,
        security_training: false,
      };
      setCompany(demoCompany);
      setCurrentPage("dashboard");
    } else {
      setCurrentPage("onboarding");
    }
  };

  const handleOnboarding = (companyData: {
    name: string;
    industry: string;
    size: string;
  }) => {
    const newCompany: Company = {
      id: "1",
      name: companyData.name,
      industry: companyData.industry,
      size: companyData.size,
      health_score: 50,
      mfa_enabled: false,
      password_policy: false,
      backups_enabled: false,
      updates_current: false,
      antivirus_enabled: false,
      security_training: false,
    };
    setCompany(newCompany);
    setCurrentPage("dashboard");
  };

  const calculateHealthScore = (
    comp: Company,
    emp: Employee[],
    lessonsData: Lesson[],
  ): number => {
    // Configuration score (40%)
    const configItems = [
      comp.mfa_enabled,
      comp.password_policy,
      comp.backups_enabled,
      comp.updates_current,
      comp.antivirus_enabled,
      comp.security_training,
    ];
    const configScore =
      (configItems.filter(Boolean).length /
        configItems.length) *
      40;

    // Employee readiness (30%)
    const avgTraining =
      emp.length > 0
        ? emp.reduce((sum, e) => sum + e.training_progress, 0) /
          emp.length
        : 0;
    const trainingScore = (avgTraining / 100) * 30;

    // Threat detection (30%) - based on recent scans and low risk
    const recentScans = scans.slice(0, 10);
    const safeScans = recentScans.filter(
      (s) => s.risk_level === "Safe",
    ).length;
    const threatScore =
      recentScans.length > 0
        ? (safeScans / recentScans.length) * 30
        : 15; // Default middle score

    return Math.round(
      configScore + trainingScore + threatScore,
    );
  };

  const updateHealthScore = () => {
    if (company) {
      const newScore = calculateHealthScore(
        company,
        employees,
        lessons,
      );
      setCompany({ ...company, health_score: newScore });
    }
  };

  const updateCompany = (updates: Partial<Company>) => {
    if (company) {
      const updated = { ...company, ...updates };
      setCompany(updated);
      const newScore = calculateHealthScore(
        updated,
        employees,
        lessons,
      );
      setCompany({ ...updated, health_score: newScore });
    }
  };

  const addScan = (scan: Scan) => {
    setScans([scan, ...scans]);
    updateHealthScore();
  };

  const updateLesson = (
    lessonId: string,
    updates: Partial<Lesson>,
  ) => {
    setLessons(
      lessons.map((l) =>
        l.id === lessonId ? { ...l, ...updates } : l,
      ),
    );
    // Recalculate employee progress
    const completedCount = lessons.filter((l) =>
      l.id === lessonId ? updates.completed : l.completed,
    ).length;
    const progress = Math.round(
      (completedCount / lessons.length) * 100,
    );

    if (user && employees.length > 0) {
      setEmployees(
        employees.map((e) =>
          e.id === "1"
            ? { ...e, training_progress: progress }
            : e,
        ),
      );
    }
    updateHealthScore();
  };

  const addSimulation = (simulation: Simulation) => {
    setSimulations([simulation, ...simulations]);
  };

  const updateEmployees = (newEmployees: Employee[]) => {
    setEmployees(newEmployees);
    updateHealthScore();
  };

  if (!user) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  if (!company) {
    return (
      <>
        <OnboardingPage onComplete={handleOnboarding} />
        <Toaster />
      </>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <DashboardPage
            company={company}
            employees={employees}
            scans={scans}
            lessons={lessons}
            updateCompany={updateCompany}
            onNavigate={setCurrentPage}
          />
        );
      case "phishing-detection":
        return (
          <PhishingDetectionPage
            scans={scans}
            addScan={addScan}
          />
        );
      case "email-analyzer":
        return <EmailAnalyzerPage />;
      case "threat-insights":
        return <ThreatInsightsPage />;
      case "training":
        return (
          <TrainingPage
            lessons={lessons}
            updateLesson={updateLesson}
          />
        );
      case "simulation":
        return (
          <PhishingSimulationPage
            employees={employees}
            simulations={simulations}
            addSimulation={addSimulation}
          />
        );
      case "password-checkup":
        return <PasswordCheckupPage />;
      case "spot-the-phish":
        return <SpotThePhishGame />;
      case "browser-protection":
        return <BrowserProtectionPage />;
      case "email-security":
        return <EmailSecuritySyncPage />;
      case "usb-protection":
        return <USBProtectionPage />;
      case "auto-data-erase":
        return <AutoDataErasePage />;
      case "leaderboard":
        return <LeaderboardPage />;
      case "team-missions":
        return <TeamMissionsPage />;
      case "my-progress":
        return <MyProgressPage />;
      case "reports":
        return (
          <ReportsPage
            company={company}
            employees={employees}
            scans={scans}
            simulations={simulations}
          />
        );
      case "settings":
        return (
          <SettingsPage
            user={user}
            company={company}
            employees={employees}
            updateCompany={updateCompany}
            updateEmployees={updateEmployees}
          />
        );
      default:
        return (
          <DashboardPage
            company={company}
            employees={employees}
            scans={scans}
            lessons={lessons}
            updateCompany={updateCompany}
          />
        );
    }
  };

  return (
    <>
      <DashboardLayout
        user={user}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isDemoMode={isDemoMode}
      >
        {renderPage()}
      </DashboardLayout>
      <Toaster />
    </>
  );
}