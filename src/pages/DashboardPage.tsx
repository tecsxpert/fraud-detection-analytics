import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { apiService } from '../services/apiService';
import { StatsResponse } from '../types/api.types';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const COLORS = ['#1B4F8A', '#3b82f6', '#60a5fa', '#93c5fd'];

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse p-6">
        <div className="h-16 w-64 bg-slate-200 rounded-xl mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-96 bg-white rounded-3xl border border-slate-100"></div>
          <div className="lg:col-span-4 h-96 bg-white rounded-3xl border border-slate-100"></div>
        </div>
      </div>
    );
  }

  const kpis = [
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, trend: '+12.5%', isUp: true, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Projects', value: stats?.activeProjects || 0, icon: Users, trend: '+3', isUp: true, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Avg. Project Score', value: `${stats?.averageScore}%`, icon: Award, trend: '-1.2%', isUp: false, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'System Health', value: '99.9%', icon: Activity, trend: 'Optimal', isUp: true, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const handleGenerateReport = () => {
    if (!stats) return;
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalRevenue: stats.totalRevenue,
        activeProjects: stats.activeProjects,
        averageScore: stats.averageScore
      },
      distribution: stats.categoryDistribution
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `executive_report_${new Date().getTime()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    alert("Executive Report generated and downloaded successfully.");
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-10">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-[#1B4F8A] uppercase tracking-[0.2em] mb-1">
            <div className="w-1.5 h-1.5 bg-[#1B4F8A] rounded-full animate-pulse"></div>
            Live Operational Intel
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Global monitoring & real-time performance analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-bold text-slate-600">
            <Calendar className="w-4 h-4 text-slate-400" />
            May 14, 2026
          </div>
          <button 
            onClick={handleGenerateReport}
            className="px-5 py-2.5 bg-[#1B4F8A] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            GENERATE REPORT
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={cn("p-3 rounded-2xl transition-colors", kpi.bg)}>
                <kpi.icon className={cn("w-5 h-5", kpi.color)} />
              </div>
              <div className={cn(
                "flex items-center text-[10px] font-black px-2 py-1 rounded-lg",
                kpi.isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                {kpi.isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {kpi.trend}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.value}</p>
            </div>
            {/* Absolute deco */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 blur-2xl group-hover:bg-[#1B4F8A]/5 transition-colors"></div>
          </motion.div>
        ))}
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart Card */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Category Distribution</h2>
              <p className="text-sm font-medium text-slate-500">Resource allocation by project sector</p>
            </div>
            <div className="flex gap-2">
              {['WEEK', 'MONTH', 'YEAR'].map(period => (
                <button 
                  key={period}
                  className={cn(
                    "px-3 py-1.5 text-[10px] font-black rounded-lg transition-all",
                    period === 'MONTH' ? "bg-[#1B4F8A] text-white shadow-md shadow-blue-900/20" : "bg-slate-50 text-slate-400 hover:text-slate-600"
                  )}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.categoryDistribution}>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc', radius: 12 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 ring-4 ring-slate-900/5">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{payload[0].payload.name}</p>
                          <p className="text-xl font-black text-[#1B4F8A]">{payload[0].value} <span className="text-sm font-bold text-slate-400">Projects</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[12, 12, 12, 12]}
                  barSize={50}
                >
                  {stats?.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI & Quick Insights Side Column */}
        <div className="lg:col-span-4 space-y-8">
          {/* AI Banner */}
          <div className="bg-[#1B4F8A] text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest">Autonomous Insight</p>
              </div>
              <h2 className="text-2xl font-black mb-3 tracking-tighter leading-tight">Optimization Threshold Detected</h2>
              <p className="text-blue-100/80 text-sm font-medium leading-relaxed mb-8">
                Your current growth velocity is 4.2% above the quarterly baseline. High-risk vectors identified in "Hardware" sector.
              </p>
              <button className="w-full py-4 bg-white text-[#1B4F8A] font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-50 transition-all shadow-lg active:scale-[0.98]">
                Deploy Recommendations
              </button>
            </div>
            
            {/* Animated deco */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-700"></div>
          </div>

          {/* Quick List - Recent Status Changes */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex-1">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Critical Alerts</h3>
            <div className="space-y-4">
              {[
                { title: 'Server Latency', status: 'Elevated', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
                { title: 'New Fraud Vector', status: 'Neutralized', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { title: 'Batch Processing', status: 'In Progress', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
              ].map((alert, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-slate-50 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl", alert.bg)}>
                      <alert.icon className={cn("w-4 h-4", alert.color)} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{alert.title}</p>
                      <p className="text-[10px] font-medium text-slate-400">{alert.status}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                </div>
              ))}
            </div>
            <button className="w-full mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#1B4F8A] transition-colors">
              View All System Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
