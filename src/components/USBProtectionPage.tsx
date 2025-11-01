import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Usb, Shield, AlertTriangle, CheckCircle2, XCircle, 
  HardDrive, Clock, Scan, Loader2 
} from 'lucide-react';

interface USBDevice {
  id: string;
  name: string;
  size: string;
  status: 'safe' | 'threat' | 'scanning' | 'unknown';
  lastScan: Date;
  threatsFound?: number;
}

const mockDevices: USBDevice[] = [
  {
    id: '1',
    name: 'Kingston DataTraveler',
    size: '32 GB',
    status: 'safe',
    lastScan: new Date(Date.now() - 1000 * 60 * 30),
    threatsFound: 0
  },
  {
    id: '2',
    name: 'SanDisk Ultra',
    size: '64 GB',
    status: 'threat',
    lastScan: new Date(Date.now() - 1000 * 60 * 60 * 2),
    threatsFound: 3
  },
  {
    id: '3',
    name: 'Samsung Flash Drive',
    size: '16 GB',
    status: 'safe',
    lastScan: new Date(Date.now() - 1000 * 60 * 60 * 24),
    threatsFound: 0
  },
];

export function USBProtectionPage() {
  const [devices, setDevices] = useState<USBDevice[]>(mockDevices);
  const [scanning, setScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<USBDevice | null>(null);

  const handleScan = (deviceId?: string) => {
    setScanning(true);
    
    if (deviceId) {
      setDevices(devices.map(d => 
        d.id === deviceId ? { ...d, status: 'scanning' } : d
      ));
    }

    setTimeout(() => {
      if (deviceId) {
        setDevices(devices.map(d => 
          d.id === deviceId 
            ? { ...d, status: Math.random() > 0.7 ? 'threat' : 'safe', lastScan: new Date(), threatsFound: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0 } 
            : d
        ));
      }
      setScanning(false);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
        return { bg: 'bg-green-500', text: 'text-green-700', border: 'border-green-200', light: 'bg-green-50' };
      case 'threat':
        return { bg: 'bg-red-500', text: 'text-red-700', border: 'border-red-200', light: 'bg-red-50' };
      case 'scanning':
        return { bg: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-200', light: 'bg-blue-50' };
      case 'unknown':
        return { bg: 'bg-gray-500', text: 'text-gray-700', border: 'border-gray-200', light: 'bg-gray-50' };
      default:
        return { bg: 'bg-gray-500', text: 'text-gray-700', border: 'border-gray-200', light: 'bg-gray-50' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'threat':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'scanning':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'unknown':
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
      default:
        return null;
    }
  };

  const totalDevices = devices.length;
  const safeDevices = devices.filter(d => d.status === 'safe').length;
  const threatDevices = devices.filter(d => d.status === 'threat').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">External Device Scan 🔌</h2>
        <p className="text-gray-600">Instantly scan and block infected USB drives</p>
      </div>

      {/* Alert if threats detected */}
      {threatDevices > 0 && (
        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <AlertDescription className="text-red-800">
            {threatDevices} device{threatDevices > 1 ? 's' : ''} detected with malware. Immediate action required.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl mb-1">{totalDevices}</div>
                <div className="text-blue-100 text-sm">Total Devices</div>
              </div>
              <Usb className="w-12 h-12 text-white/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl mb-1">{safeDevices}</div>
                <div className="text-green-100 text-sm">Safe Devices</div>
              </div>
              <CheckCircle2 className="w-12 h-12 text-white/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-red-500 to-orange-500 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl mb-1">{threatDevices}</div>
                <div className="text-red-100 text-sm">Threats Found</div>
              </div>
              <AlertTriangle className="w-12 h-12 text-white/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device List */}
        <div className="lg:col-span-2">
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <HardDrive className="w-5 h-5 text-blue-500" />
                    Connected Devices
                  </CardTitle>
                  <CardDescription>USB devices detected and scanned</CardDescription>
                </div>
                <Button
                  onClick={() => handleScan()}
                  disabled={scanning}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                >
                  {scanning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4 mr-2" />
                      Scan All
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {devices.map((device, index) => (
                  <motion.div
                    key={device.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedDevice(device)}
                  >
                    <div className="flex items-center gap-4">
                      {/* USB Icon with Status */}
                      <div className="relative">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${device.status === 'threat' ? 'from-red-500 to-orange-500' : 'from-blue-500 to-cyan-500'} flex items-center justify-center shadow-lg`}>
                          <Usb className="w-7 h-7 text-white" />
                        </div>
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(device.status).bg} border-2 border-white`}>
                          {device.status === 'scanning' && (
                            <motion.div
                              className="w-full h-full rounded-full bg-blue-500"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                          )}
                        </div>
                      </div>

                      {/* Device Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-gray-900">{device.name}</h4>
                          <Badge className={`${getStatusColor(device.status).light} ${getStatusColor(device.status).text} border ${getStatusColor(device.status).border}`}>
                            {device.status === 'safe' && 'Safe'}
                            {device.status === 'threat' && 'Threat Detected'}
                            {device.status === 'scanning' && 'Scanning...'}
                            {device.status === 'unknown' && 'Unknown'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{device.size}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Last scan: {new Date(device.lastScan).toLocaleString()}
                          </span>
                        </div>
                        {device.threatsFound !== undefined && device.threatsFound > 0 && (
                          <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                            <div className="flex items-center gap-2 text-red-700 text-sm">
                              <AlertTriangle className="w-4 h-4" />
                              <span>{device.threatsFound} threat{device.threatsFound > 1 ? 's' : ''} found</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Status Icon */}
                      <div className="flex items-center gap-2">
                        {getStatusIcon(device.status)}
                        {device.status !== 'scanning' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleScan(device.id);
                            }}
                            disabled={scanning}
                          >
                            <Scan className="w-4 h-4 mr-1" />
                            Scan
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {devices.length === 0 && (
                  <div className="text-center py-12">
                    <Usb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No USB devices connected</p>
                    <p className="text-gray-500 text-sm mt-2">Connect a device to scan for malware</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Protection Info */}
        <div className="space-y-6">
          {/* Real-time Protection */}
          <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white">Auto-Scan</h3>
                  <p className="text-purple-100 text-sm">Enabled</p>
                </div>
              </div>
              <p className="text-white/90 text-sm">
                All USB devices are automatically scanned on connection. Threats are quarantined instantly.
              </p>
            </CardContent>
          </Card>

          {/* Scan History */}
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Clock className="w-5 h-5 text-gray-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-green-900 text-sm">Clean scan</span>
                  </div>
                  <p className="text-green-700 text-xs">Kingston DataTraveler - 30 min ago</p>
                </div>

                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-red-900 text-sm">Threat blocked</span>
                  </div>
                  <p className="text-red-700 text-xs">SanDisk Ultra - 2 hours ago</p>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-green-900 text-sm">Clean scan</span>
                  </div>
                  <p className="text-green-700 text-xs">Samsung Flash Drive - 1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="backdrop-blur-sm bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1 text-sm">Security Tip</h4>
                  <p className="text-gray-700 text-xs">
                    Never plug unknown USB devices into your computer. Always scan before accessing files.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
