import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Bell, X, AlertTriangle, Shield, Usb, Mail, 
  Eye, CheckCircle2, XCircle, Clock 
} from 'lucide-react';

interface ThreatAlert {
  id: string;
  type: 'phishing' | 'usb' | 'login' | 'malware' | 'data';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  read: boolean;
}

const mockAlerts: ThreatAlert[] = [
  {
    id: '1',
    type: 'phishing',
    title: 'Phishing attempt blocked',
    description: 'Malicious email from paypa1-verify.com was quarantined',
    severity: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false
  },
  {
    id: '2',
    type: 'usb',
    title: 'USB malware detected',
    description: 'SanDisk Ultra device contained 3 threats - access blocked',
    severity: 'critical',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false
  },
  {
    id: '3',
    type: 'login',
    title: 'Suspicious login attempt',
    description: 'Login from unknown location (Russia) - MFA required',
    severity: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: true
  },
  {
    id: '4',
    type: 'phishing',
    title: 'Phishing URL detected',
    description: 'Browser shield blocked access to microsoft-security.net',
    severity: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    read: true
  },
  {
    id: '5',
    type: 'data',
    title: 'Unusual data access',
    description: 'Employee accessed 500+ customer records - flagged for review',
    severity: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    read: true
  },
];

interface ThreatAlertPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThreatAlertPanel({ isOpen, onClose }: ThreatAlertPanelProps) {
  const [alerts, setAlerts] = useState<ThreatAlert[]>(mockAlerts);

  const unreadCount = alerts.filter(a => !a.read).length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { bg: 'bg-red-500', text: 'text-red-700', border: 'border-red-200', light: 'bg-red-50' };
      case 'high':
        return { bg: 'bg-orange-500', text: 'text-orange-700', border: 'border-orange-200', light: 'bg-orange-50' };
      case 'medium':
        return { bg: 'bg-yellow-500', text: 'text-yellow-700', border: 'border-yellow-200', light: 'bg-yellow-50' };
      case 'low':
        return { bg: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-200', light: 'bg-blue-50' };
      default:
        return { bg: 'bg-gray-500', text: 'text-gray-700', border: 'border-gray-200', light: 'bg-gray-50' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'phishing':
        return <Mail className="w-4 h-4" />;
      case 'usb':
        return <Usb className="w-4 h-4" />;
      case 'login':
        return <Shield className="w-4 h-4" />;
      case 'malware':
        return <AlertTriangle className="w-4 h-4" />;
      case 'data':
        return <Eye className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(alerts.map(a => a.id === alertId ? { ...a, read: true } : a));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(alerts.filter(a => a.id !== alertId));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-teal-500">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-white" />
                  <h3 className="text-white">Threat Alerts</h3>
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
              <div className="flex items-center justify-between">
                <span className="text-blue-100 text-sm">
                  {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}
                </span>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-white hover:bg-white/20 text-xs h-7"
                  >
                    Mark all read
                  </Button>
                )}
              </div>
            </div>

            {/* Alerts List */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {alerts.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-600">No alerts</p>
                    <p className="text-gray-500 text-sm mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  alerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        !alert.read 
                          ? `${getSeverityColor(alert.severity).light} ${getSeverityColor(alert.severity).border}` 
                          : 'bg-gray-50 border-gray-200 opacity-75'
                      }`}
                      onClick={() => !alert.read && markAsRead(alert.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          !alert.read 
                            ? `bg-gradient-to-br ${getSeverityColor(alert.severity).bg.replace('bg-', 'from-')} ${getSeverityColor(alert.severity).bg.replace('bg-', 'to-')}-600` 
                            : 'bg-gray-300'
                        }`}>
                          <div className="text-white">
                            {getTypeIcon(alert.type)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`text-sm ${!alert.read ? 'text-gray-900' : 'text-gray-600'}`}>
                              {alert.title}
                            </h4>
                            {!alert.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className={`text-xs mb-2 ${!alert.read ? 'text-gray-700' : 'text-gray-500'}`}>
                            {alert.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className={`${getSeverityColor(alert.severity).light} ${getSeverityColor(alert.severity).text} border ${getSeverityColor(alert.severity).border} text-xs`}>
                                {alert.severity}
                              </Badge>
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 h-7 text-xs"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View Report
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                dismissAlert(alert.id);
                              }}
                              className="h-7 px-2"
                            >
                              <XCircle className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-600 text-center">
                Stay instantly informed on every cyber event
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
