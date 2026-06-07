/**
 * Admin Overview Tab
 * Displays executive summary KPIs, recent inference activity, and global plantation health ratio.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Sprout, Users, AlertTriangle, MapPin, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface UserDetail {
  name: string;
  role: string;
}

const TREE_DATA = [
  { name: 'Healthy Canopy', value: 99750, color: '#10b981', bg: 'bg-emerald-500', text: 'text-emerald-600', percent: '70%' },
  { name: 'Small Canopy', value: 17100, color: '#14b8a6', bg: 'bg-teal-500', text: 'text-teal-600', percent: '12%' },
  { name: 'Yellowing / Nutrient Deficient', value: 19950, color: '#f59e0b', bg: 'bg-amber-500', text: 'text-amber-600', percent: '14%' },
  { name: 'Dead / Missing', value: 5700, color: '#ef4444', bg: 'bg-red-500', text: 'text-red-600', percent: '4%' },
];

interface Log {
  id: string;
  user: string;
  role: string;
  date: string;
  block: string;
  trees: number;
  confidence: number;
  status: string;
}

interface AdminOverviewTabProps {
  logs: Log[];
  users: any[];
  getUserDetails: (userName: string) => UserDetail;
  setActiveTab: (tab: 'Overview' | 'Logs' | 'Users' | 'Reports') => void;
  stats?: any;
}

export default function AdminOverviewTab({ logs, users = [], getUserDetails, setActiveTab, stats }: AdminOverviewTabProps) {
  const navigate = useNavigate();
  const [reviewPanelLog, setReviewPanelLog] = useState<Log | null>(null);
  const [isTreeModalOpen, setIsTreeModalOpen] = useState(false);

  const dynamicTreeData = stats?.classDistribution?.map((cd: any) => {
    let bg = 'bg-emerald-500';
    let text = 'text-emerald-600';
    if (cd.name === 'Small') { bg = 'bg-teal-500'; text = 'text-teal-600'; }
    if (cd.name === 'Yellow') { bg = 'bg-amber-500'; text = 'text-amber-600'; }
    if (cd.name === 'Dead') { bg = 'bg-red-500'; text = 'text-red-600'; }
    
    // Default percentage if stats isn't fully loaded or total is 0
    let pct = 0;
    const totalRaw = stats?.kpiStats?.find((k: any) => k.label === 'Total Trees')?.val?.replace(/,/g, '');
    const total = totalRaw ? parseInt(totalRaw) : 0;
    if (total > 0) {
      pct = Math.round((cd.value / total) * 100);
    }
    
    return {
      name: cd.name === 'Small' ? 'Small Canopy' : cd.name === 'Yellow' ? 'Yellowing / Nutrient Deficient' : cd.name === 'Dead' ? 'Dead / Missing' : 'Healthy Canopy',
      value: cd.value,
      color: cd.color,
      bg, text, percent: `${pct}%`
    };
  }) || TREE_DATA;

  const handleCardClick = (label: string) => {
    switch (label) {
      case 'Active Users':
        navigate('/user-management');
        break;
      case 'High-Risk Alerts':
        navigate('/inference-logs?filter=high-risk');
        break;
      case 'Trees Analyzed':
        setIsTreeModalOpen(true);
        break;
      case 'Total Analyses':
        navigate('/reports');
        break;
      default:
        break;
    }
  };
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="flex flex-col">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#e5e2d6] border-b border-[#e5e2d6]">
        {[
          { label: 'Total Analyses', val: '1,248', trend: '+12 this week', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Trees Analyzed', val: '142.5k', trend: '+4.2k this week', icon: Sprout, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Active Users', val: users.filter(u => u.status === 'Active').length.toString(), trend: `${users.filter(u => u.status === 'Active').length} active`, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'High-Risk Alerts', val: '3', trend: 'Needs attention', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div 
            key={i} 
            className="bg-white p-6 md:p-8 flex flex-col relative overflow-hidden transition-all duration-300 pointer-events-auto"
          >
             <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} transition-transform`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
             </div>
             <h3 className="text-3xl font-black text-[#04211a] tracking-tight">{stats?.kpiStats?.find((k:any) => k.label === 'Total Trees')?.val || '0'}</h3>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
             <div className="mt-4 text-xs font-semibold text-slate-400">{stat.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#e5e2d6] border-b border-[#e5e2d6]">
        {/* Recent Activity */}
        <div className="bg-white p-6 md:p-8 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-[#04211a]">Recent Inference Activity</h3>
          </div>
          <div className="flex-1 space-y-4">
            {logs.slice(0, 4).map(log => (
              <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#04211a]">{log.block}</h4>
                    <p className="text-xs font-semibold text-slate-500">{getUserDetails(log.user).name} ({getUserDetails(log.user).role}) • {log.date}</p>
                  </div>
                </div>
                <div className="text-right hidden sm:flex items-center justify-end gap-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    log.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {log.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {log.status}
                  </span>
                  
                  {log.status === 'Flagged' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setReviewPanelLog(log); }}
                      className="px-3 py-1.5 bg-white border border-[#e5e2d6] text-xs font-bold text-slate-600 rounded-lg shadow-sm hover:bg-slate-50 hover:text-[#04211a] hover:border-slate-300 transition-all cursor-pointer active:scale-95"
                    >
                      Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100 flex justify-center">
            <button 
              onClick={() => setActiveTab('Logs')} 
              className="text-xs font-bold text-slate-500 hover:text-[#04211a] transition-colors flex items-center gap-2 cursor-pointer"
            >
              Show All {logs.length} Logs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column Wrapper */}
        <div className="flex flex-col divide-y divide-[#e5e2d6] bg-white">
          {/* Plantation Health Summary */}
        <div 
          onClick={() => setIsTreeModalOpen(true)}
          className="bg-white p-6 md:p-8 flex flex-col relative overflow-hidden group hover:bg-slate-50 transition-colors cursor-pointer pointer-events-auto active:scale-95"
        >
          <h2 className="text-lg font-extrabold text-[#04211a] mb-6 relative z-10 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            Overview Plantation (Tree)
          </h2>
          <div className="flex-1 flex flex-col justify-center space-y-5 relative z-10">
            {dynamicTreeData.map((item: any) => (
              <div key={item.name}>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>{item.name}</span>
                  <span className={item.text}>{item.percent}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`${item.bg} h-2 rounded-full`} style={{ width: item.percent }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 relative z-10">
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Based on the last 30 days of UAV inference logs across all active sectors.
            </p>
          </div>
        </div>

      </div>
      </div>

      {/* Review Panel Mockup */}
      <AnimatePresence>
        {reviewPanelLog && (
          <div className="fixed inset-0 z-[9999] flex justify-end bg-[#04211a]/40 backdrop-blur-sm transition-all">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-[#e5e2d6] flex justify-between items-center bg-[#fcfbf7]">
                <h3 className="text-lg font-black text-[#04211a]">Review Flagged Analysis</h3>
                <button 
                  onClick={() => setReviewPanelLog(null)}
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="mb-6">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Log ID</label>
                  <p className="text-sm font-semibold text-slate-800">{reviewPanelLog.id}</p>
                </div>
                <div className="mb-6">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Block / Zone</label>
                  <p className="text-sm font-semibold text-slate-800">{reviewPanelLog.block}</p>
                </div>
                <div className="mb-6">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issue Details</label>
                  <div className="mt-2 p-4 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-sm font-semibold text-red-700">Anomali deteksi kanopi terdeteksi.</p>
                    <p className="text-xs text-red-600 mt-1">Sistem mendeteksi area yang secara signifikan tidak sesuai dengan pola historis blok ini.</p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-[#e5e2d6] bg-[#fcfbf7] flex gap-3">
                <button 
                  onClick={() => setReviewPanelLog(null)}
                  className="flex-1 py-3 bg-white border border-[#e5e2d6] text-sm font-bold text-slate-600 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
                <button 
                  onClick={() => setReviewPanelLog(null)}
                  className="flex-1 py-3 bg-[#04211a] text-white text-sm font-bold rounded-xl hover:bg-emerald-950 transition-colors shadow-md cursor-pointer"
                >
                  Confirm Flag
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tree Modal */}
      <AnimatePresence>
        {isTreeModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsTreeModalOpen(false)}
              className="absolute inset-0 bg-[#04211a]/40 backdrop-blur-sm transition-all"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-[2rem] border border-[#e5e2d6] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-[#e5e2d6] flex justify-between items-center bg-[#fcfbf7]">
                <h3 className="text-lg font-black text-[#04211a]">Global Tree Distribution</h3>
                <button 
                  onClick={() => setIsTreeModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  
                  {/* Kolom 1: Visualisasi Chart (Donut) */}
                  <div className="relative h-64 md:h-72 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={TREE_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {TREE_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Teks di tengah Donut Chart */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="font-bold text-3xl text-[#04211a]">142,500</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Trees Scanned</span>
                    </div>
                  </div>

                  {/* Kolom 2: Detail Data & System Insight */}
                  <div className="flex flex-col justify-center">
                    <div className="space-y-5 mb-8">
                      {TREE_DATA.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3.5 h-3.5 rounded ${item.bg}`} />
                            <span className="text-sm font-bold text-slate-700">{item.name}</span>
                          </div>
                          <div className={`text-sm font-black ${item.text}`}>
                            {item.percent} <span className="text-slate-400 font-semibold ml-1">({item.value.toLocaleString()})</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
                      <p className="text-xs font-semibold text-emerald-800 leading-relaxed">
                        <span className="mr-1">📋</span> <span className="font-bold">Insight:</span> 18% dari vegetasi global terindikasi mengalami degradasi nutrisi atau stres tanaman. Sektor Delta-9 direkomendasikan sebagai prioritas utama tindakan VRA.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
