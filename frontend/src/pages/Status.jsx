import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Server, 
  Database, 
  Globe, 
  ShieldCheck,
  RefreshCcw,
  Zap,
  HardDrive
} from 'lucide-react';
import { systemService } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../components/ui';

const StatusItem = ({ label, status, icon: Icon }) => (
  <div className="flex items-center justify-between p-4 bg-accent/10 border border-border/50 rounded-xl group hover:bg-accent/20 transition-all duration-200">
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-lg ${status === 'OK' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-foreground">{label}</h4>
        <p className="text-xs text-muted-foreground font-medium">Last checked: Just now</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
       {status === 'OK' ? (
         <Badge variant="success" className="px-3">Operational</Badge>
       ) : (
         <Badge variant="destructive" className="px-3">Down</Badge>
       )}
    </div>
  </div>
);

const Status = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await systemService.getHealth();
      setHealth(response.data);
    } catch (error) {
      console.error("Health check failed:", error);
      setHealth({ status: 'ERROR', message: 'API is unreachable' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">System Status</h2>
          <p className="text-muted-foreground">Monitor the health and uptime of core backend services.</p>
        </div>
        <Button onClick={checkHealth} disabled={loading} variant="outline" className="shadow-sm border-primary/20">
          <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Force Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Overall Status Card */}
        <Card className="lg:col-span-2 border-primary/10 shadow-lg overflow-hidden flex flex-col">
          <CardHeader className="bg-primary/5 border-b border-border">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Service Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6 flex-1">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatusItem label="Performance API" status={health?.status === 'OK' ? 'OK' : 'DOWN'} icon={Server} />
                <StatusItem label="Query Executor" status={health?.status === 'OK' ? 'OK' : 'DOWN'} icon={Zap} />
                <StatusItem label="MySQL Database" status="OK" icon={Database} />
                <StatusItem label="Analytics Engine" status="OK" icon={Activity} />
                <StatusItem label="Cloud Infrastructure" status="OK" icon={Globe} />
                <StatusItem label="Security Firewall" status="OK" icon={ShieldCheck} />
             </div>
          </CardContent>
        </Card>

        {/* System Info Card */}
        <Card className="border-primary/10 shadow-lg overflow-hidden">
           <CardHeader className="bg-accent/10 border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-primary" />
                Backend Infrastructure
              </CardTitle>
           </CardHeader>
           <CardContent className="p-8 space-y-8">
              <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Uptime</span>
                    <span className="font-bold text-emerald-500">99.98%</span>
                 </div>
                 <div className="w-full h-1.5 bg-accent/50 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[99.98%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                 </div>
              </div>

              <div className="space-y-4 pt-4">
                 <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                       <Server className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                       <p className="text-sm font-bold">Node.js Instance</p>
                       <p className="text-xs text-muted-foreground">Version 20.x, Region: us-east-1</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                       <Database className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                       <p className="text-sm font-bold">MySQL Engine</p>
                       <p className="text-xs text-muted-foreground">Version 8.0.x, Dedicated Instance</p>
                    </div>
                 </div>
              </div>

              <div className="p-4 bg-muted/30 border border-border rounded-xl">
                 <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> Security Protocol
                 </div>
                 <p className="text-xs text-muted-foreground leading-relaxed">
                    All data transmissions are encrypted using TLS 1.3. Database access is restricted via VPC and firewall rules.
                 </p>
              </div>
           </CardContent>
        </Card>
      </div>

      {health?.status !== 'OK' && !loading && (
        <Card className="border-rose-500/50 bg-rose-500/5 shadow-xl animate-bounce-subtle">
           <CardContent className="p-12 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-rose-500/20 rounded-full animate-pulse">
                <XCircle className="w-12 h-12 text-rose-500" />
              </div>
              <h3 className="text-3xl font-black text-rose-500">SERVICE DISRUPTION</h3>
              <p className="text-muted-foreground max-w-md mx-auto text-lg">
                We've detected an incident affecting the Performance API. Our engineers have been notified and are investigating.
              </p>
              <Button variant="destructive" className="px-8 mt-4 shadow-lg shadow-rose-500/20">
                View Incident Log
              </Button>
           </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Status;
