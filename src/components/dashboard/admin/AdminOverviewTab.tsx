/**
 * Admin Overview Tab
 * Displays executive summary KPIs, recent inference activity, and global plantation health ratio.
 */

import { motion } from 'motion/react';
import { Activity, Sprout, Users, AlertTriangle, MapPin, CheckCircle2 } from 'lucide-react';

interface UserDetail {
  name: string;
  role: string;
}

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
  getUserDetails: (userName: string) => UserDetail;
  setActiveTab: (tab: 'Overview' | 'Logs' | 'Users' | 'Reports') => void;
}

export default function AdminOverviewTab({ logs, getUserDetails, setActiveTab }: AdminOverviewTabProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Analyses', val: '1,248', trend: '+12 this week', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Trees Analyzed', val: '142.5k', trend: '+4.2k this week', icon: Sprout, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Active Users', val: '24', trend: '2 currently online', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'High-Risk Alerts', val: '3', trend: 'Needs attention', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-[#e5e2d6] shadow-sm flex flex-col relative overflow-hidden">
             <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
             </div>
             <h4 className="text-3xl font-black text-[#04211a] mb-1">{stat.val}</h4>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
             <div className="mt-4 text-xs font-semibold text-slate-400">{stat.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-[2rem] border border-[#e5e2d6] shadow-sm p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-[#04211a]">Recent Inference Activity</h3>
            <button onClick={() => setActiveTab('Logs')} className="text-sm font-bold text-emerald-600 hover:text-emerald-700">View All Logs</button>
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
                <div className="text-right hidden sm:block">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    log.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {log.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plantation Health Summary */}
        <div className="bg-[#04211a] rounded-[2rem] border border-transparent shadow-xl p-6 flex flex-col relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />
          <h3 className="text-lg font-extrabold text-white mb-6 relative z-10 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            Global Plantation Health
          </h3>
          <div className="flex-1 flex flex-col justify-center space-y-6 relative z-10">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                <span>Healthy Canopy</span>
                <span className="text-emerald-400">82%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                <span>Yellowing / Nutrient Deficient</span>
                <span className="text-amber-400">14%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '14%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                <span>Dead / Missing</span>
                <span className="text-red-400">4%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '4%' }}></div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Based on the last 30 days of UAV inference logs across all active sectors.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
