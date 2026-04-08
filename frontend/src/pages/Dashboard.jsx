import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  Zap,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { analyticsService } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../components/ui';
import { cn } from '../components/utils';

// eslint-disable-next-line no-unused-vars
const StatCard = ({ title, value, Icon, description, trend, trendValue }) => (
  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-primary/10">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center text-xs font-bold px-2 py-1 rounded-full",
            trend === 'up' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
          )}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-3xl font-bold tracking-tight mt-1">{value}</h3>
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await analyticsService.getStats();
        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Zap className="w-10 h-10 text-primary animate-pulse" /></div>;
  }

  const chartData = stats?.timeseries?.map(item => ({
    time: new Date(item.executed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    latency: item.execution_time_ms
  })) || [];

  const pieData = [
    { name: 'Fast', value: (stats?.totalQueries || 0) - (stats?.slowQueries || 0) },
    { name: 'Slow', value: stats?.slowQueries || 0 }
  ];

  const COLORS = ['#10b981', '#f43f5e'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">System Performance Overview</h2>
          <p className="text-muted-foreground">Monitor real-time query execution metrics and health.</p>
        </div>
        <Badge variant="outline" className="px-4 py-1.5 text-sm font-semibold border-primary/20 bg-background/50 backdrop-blur-sm self-start">
           Live Monitoring: Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Queries" 
          value={stats?.totalQueries} 
          Icon={BarChart3} 
          description="Total queries executed"
          trend="up"
          trendValue="+12%"
        />
        <StatCard 
          title="Avg Latency" 
          value={`${stats?.avgExecutionTime}ms`} 
          Icon={Clock} 
          description="Avg response time"
        />
        <StatCard 
          title="Slow Queries" 
          value={stats?.slowQueries} 
          Icon={AlertTriangle} 
          description="Queries exceeding 100ms"
          trend="down"
          trendValue="-5%"
        />
        <StatCard 
          title="Error Rate" 
          value={stats?.errorQueries} 
          Icon={CheckCircle2} 
          description="Failed query executions"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Execution Time Trends (ms)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
             <ResponsiveContainer width="100%" height={400}>
               <AreaChart data={chartData}>
                 <defs>
                   <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                 <XAxis 
                   dataKey="time" 
                   stroke="hsl(var(--muted-foreground))" 
                   fontSize={12} 
                   tickLine={false} 
                   axisLine={false}
                 />
                 <YAxis 
                   stroke="hsl(var(--muted-foreground))" 
                   fontSize={12} 
                   tickLine={false} 
                   axisLine={false}
                   tickFormatter={(val) => `${val}ms`}
                 />
                 <Tooltip 
                   contentStyle={{ 
                     backgroundColor: 'hsl(var(--card))', 
                     borderColor: 'hsl(var(--border))',
                     borderRadius: '8px',
                     color: 'hsl(var(--foreground))'
                   }} 
                 />
                 <Area 
                   type="monotone" 
                   dataKey="latency" 
                   stroke="hsl(var(--primary))" 
                   strokeWidth={3}
                   fillOpacity={1} 
                   fill="url(#colorLatency)" 
                 />
               </AreaChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Performance Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium">Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span className="text-sm font-medium">Slow</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
