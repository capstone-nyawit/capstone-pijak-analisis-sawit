/**
 * User Overview Tab - Dashboard Overview
 * Displays live detection bounding boxes, KPIs, priority zones, risk heatmap, and recent inference history.
 */

import { motion } from 'motion/react';
import { 
  Sprout, Leaf, Activity, CheckCircle2, ArrowUpRight, ArrowDownRight, 
  AlertTriangle, Map, PlaySquare, MapPin 
} from 'lucide-react';

interface Log {
  id: string;
  date: string;
  block: string;
  trees: number;
  status: string;
  confidence: string;
  thumb: string;
}

interface Stats {
  totalTrees: number;
  healthy: number;
  smallCanopy: number;
  yellowing: number;
  deadMissing: number;
}

interface UserOverviewTabProps {
  logs: Log[];
  stats: Stats;
  setActiveTab: (tab: 'Overview' | 'Inference' | 'Tree Health' | 'VRA' | 'Logs' | 'Reports') => void;
  triggerNewAnalysis: () => void;
}

const riskHeatmap = [
  { id: 'N-01', risk: 'low' }, { id: 'N-02', risk: 'low' }, { id: 'N-03', risk: 'medium' }, { id: 'N-04', risk: 'low' },
  { id: 'S-01', risk: 'medium' }, { id: 'S-02', risk: 'critical' }, { id: 'S-03', risk: 'medium' }, { id: 'S-04', risk: 'low' },
  { id: 'E-01', risk: 'low' }, { id: 'E-02', risk: 'medium' }, { id: 'E-03', risk: 'low' }, { id: 'E-04', risk: 'low' },
];

export default function UserOverviewTab({ logs, stats, setActiveTab, triggerNewAnalysis }: UserOverviewTabProps) {
  if (logs.length === 0) {
    return (
      <motion.div
        key="overview-empty-state"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3 }}
        className="min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-white rounded-[2rem] border border-[#e5e2d6] shadow-sm max-w-2xl mx-auto my-12"
      >
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-700 shadow-inner border border-emerald-100">
          <Sprout className="w-12 h-12 text-[#04211a] animate-pulse" />
        </div>
        <h3 className="text-2xl font-black text-[#04211a] mb-3">Sistem Menunggu Analisis Pertama</h3>
        <p className="text-slate-500 max-w-md font-medium text-sm leading-relaxed mb-8">
          Dashboard analitik, peta sebaran kesehatan tajuk sawit, dan preskripsi pupuk otomatis VRA belum tersedia karena sistem belum memproses citra UAV.
        </p>
        
        <button 
          onClick={() => setActiveTab('Inference')}
          className="px-8 py-4 bg-[#04211a] text-white hover:bg-emerald-950 rounded-full font-bold text-sm flex items-center gap-3 cursor-pointer shadow-md active:scale-95 transition-all shadow-[0_4px_20px_rgba(4,33,26,0.15)] hover:shadow-[0_4px_25px_rgba(4,33,26,0.25)] hover:-translate-y-0.5"
        >
          <PlaySquare className="w-4 h-4 text-emerald-400" />
          Mulai Analisis Baru
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="overview-pane"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* 1. HERO PREVIEW SECTION */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        className="bg-slate-900 rounded-[2rem] border border-[#e5e2d6] shadow-2xl overflow-hidden flex flex-col relative"
      >
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none"></div>
        
        <div className="relative flex-1 min-h-[500px] overflow-hidden group">
          {/* Simulated Aerial Image */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1627883907153-61b453e00cc2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity opacity-90 transition-transform duration-1000 group-hover:scale-105"></div>
          <div className="absolute inset-0 bg-[#04211a]/20"></div>

          {/* Top Header / Metadata */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex items-center gap-3">
                <Activity className="w-6 h-6 text-emerald-400" />
                <div>
                  <h2 className="text-white font-black text-xl tracking-tight leading-none">Block Alpha Sector</h2>
                  <p className="text-emerald-400/80 text-[10px] font-bold uppercase tracking-widest mt-1">Live Detection</p>
                </div>
              </div>
              <div className="hidden md:flex gap-2">
                <span className="bg-black/50 backdrop-blur text-white text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-white/10">
                  ALT: 120m
                </span>
                <span className="bg-black/50 backdrop-blur text-white text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-white/10">
                  GSD: 2.5cm/px
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" /> Scan Complete
                </span>
              </div>
            </div>

            <div className="bg-black/70 backdrop-blur-lg border border-white/10 rounded-2xl p-4 hidden md:block w-48 shadow-2xl">
               <div className="flex justify-between items-center mb-3">
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Model</span>
                 <span className="text-xs text-white font-mono font-bold">Nyawit-v4</span>
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                     <span className="text-xs text-slate-300 font-medium">Healthy</span>
                   </div>
                   <span className="text-xs text-white font-bold">84%</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                     <span className="text-xs text-slate-300 font-medium">Yellowing</span>
                   </div>
                   <span className="text-xs text-white font-bold">12%</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Simulated Bounding Boxes */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-10 transition-opacity">
            {/* Healthy */}
            <div className="absolute top-[20%] left-[30%] w-24 h-24 border-2 border-emerald-500 bg-emerald-500/10 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] backdrop-blur-[1px]">
              <span className="absolute -top-6 left-[-2px] bg-emerald-500 text-[#04211a] text-[10px] font-black px-2 py-1 rounded-t-sm shadow-lg flex items-center gap-1">H <span className="font-mono">0.98</span></span>
            </div>
            <div className="absolute top-[45%] left-[60%] w-20 h-20 border-2 border-emerald-500 bg-emerald-500/10 rounded-lg backdrop-blur-[1px]">
              <span className="absolute -top-6 left-[-2px] bg-emerald-500 text-[#04211a] text-[10px] font-black px-2 py-1 rounded-t-sm shadow-lg flex items-center gap-1">H <span className="font-mono">0.95</span></span>
            </div>
            {/* Yellow (Warning) */}
            <div className="absolute top-[30%] left-[75%] w-20 h-20 border-2 border-amber-500 bg-amber-50/20 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.4)] backdrop-blur-[1px]">
              <span className="absolute -top-6 left-[-2px] bg-amber-500 text-amber-950 text-[10px] font-black px-2 py-1 rounded-t-sm shadow-lg flex items-center gap-1">Y <span className="font-mono">0.88</span></span>
            </div>
            {/* Dead (Critical) */}
            <div className="absolute top-[60%] left-[45%] w-12 h-12 border-2 border-red-500 bg-red-50/30 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.5)] backdrop-blur-[2px]">
              <span className="absolute -top-6 left-[-2px] bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-t-sm shadow-lg flex items-center gap-1">D <span className="font-mono">0.96</span></span>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 z-20 flex gap-3">
            <button 
              onClick={triggerNewAnalysis}
              className="bg-emerald-500 text-[#04211a] px-5 py-2.5 rounded-xl text-sm font-extrabold shadow-[0_10px_25px_rgba(0,0,0,0.3)] hover:bg-emerald-400 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <PlaySquare className="w-4 h-4 text-[#04211a]" />
              Mulai Analisis Baru
            </button>
            <button className="bg-white/95 backdrop-blur text-[#04211a] px-5 py-2.5 rounded-xl text-sm font-bold shadow-[0_10px_25px_rgba(0,0,0,0.3)] hover:bg-white hover:scale-105 transition-all flex items-center gap-2">
              <PlaySquare className="w-4 h-4 text-emerald-600" />
              View Interactive Map
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* 2. BALANCED KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Trees', val: stats.totalTrees.toLocaleString(), trend: '+1.2%', trendUp: true, color: 'text-[#04211a]', border: 'border-slate-200', icon: Leaf },
          { label: 'Healthy', val: stats.healthy.toLocaleString(), trend: '+2.4%', trendUp: true, color: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 },
          { label: 'Small Canopy', val: stats.smallCanopy.toLocaleString(), trend: '-0.5%', trendUp: false, color: 'text-blue-700', border: 'border-blue-200', icon: Sprout },
          { label: 'Yellowing', val: stats.yellowing.toLocaleString(), trend: '+12.4%', trendUp: false, color: 'text-amber-700', border: 'border-amber-200', icon: AlertTriangle },
          { label: 'Dead / Missing', val: stats.deadMissing.toLocaleString(), trend: '-2.1%', trendUp: true, color: 'text-red-700', border: 'border-red-200', icon: AlertTriangle },
        ].map((stat, i) => (
          <motion.div 
           key={stat.label}
           initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + (i * 0.05) }}
           className="bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden relative group"
          >
             <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl bg-slate-50 border border-slate-200 border-opacity-50`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${stat.trendUp ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                  {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </span>
             </div>
             <h4 className={`text-3xl font-black ${stat.color} mb-1 tracking-tight`}>{stat.val}</h4>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
             
             <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-110 transition-transform pointer-events-none" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* 3. PRIORITY ZONE ANALYSIS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-[2rem] border border-[#e5e2d6] shadow-sm flex flex-col"
        >
          <h3 className="text-lg font-extrabold text-[#04211a] mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Priority Zone Analysis
          </h3>
          
          <div className="space-y-4 flex-1">
            <div className="p-4 rounded-2xl border-l-4 border-l-red-500 bg-red-50/50 border-r border-y border-[#e5e2d6]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-extrabold text-red-950">Block S-02 (South Sector)</span>
                <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200">Critical</span>
              </div>
              <p className="text-xs font-medium text-red-900/70 mb-3 leading-relaxed">
                12% increase in Yellowing. High risk of Mg deficiency spreading to adjacent sectors.
              </p>
              <button onClick={() => setActiveTab('VRA')} className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                Generate VRA Prescription
              </button>
            </div>

            <div className="p-4 rounded-2xl border-l-4 border-l-amber-500 bg-amber-50/50 border-r border-y border-[#e5e2d6]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-extrabold text-amber-950">Block E-04 (Boundary)</span>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">Monitor</span>
              </div>
              <p className="text-xs font-medium text-amber-900/70 mb-3 leading-relaxed">
                Higher concentration of Small canopies detected. Check soil moisture sensors.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 4. PLANTATION RISK HEATMAP */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-[#04211a] p-6 rounded-[2rem] border border-[#e5e2d6]/10 shadow-xl flex flex-col relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Map className="w-5 h-5 text-emerald-400" />
              Risk Heatmap
            </h3>
            <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest border border-emerald-500/30 px-2 py-1 rounded-md bg-emerald-500/10">Live Matrix</span>
          </div>
          
          <div className="flex-1 flex flex-col justify-center relative z-10">
            <div className="grid grid-cols-4 gap-2">
              {riskHeatmap.map((cell) => (
                <div 
                  key={cell.id} 
                  className={`aspect-square rounded-xl flex items-center justify-center border transition-all hover:scale-105 cursor-pointer relative group ${
                    cell.risk === 'low' ? 'bg-emerald-950 border-emerald-800/50 hover:bg-emerald-900' :
                    cell.risk === 'medium' ? 'bg-amber-900/40 border-amber-700/50 hover:bg-amber-800/60' :
                    'bg-red-900/60 border-red-500/50 hover:bg-red-800 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  }`}
                >
                  <span className={`text-xs font-black ${
                    cell.risk === 'low' ? 'text-emerald-600' :
                    cell.risk === 'medium' ? 'text-amber-500' : 'text-red-400'
                  }`}>
                    {cell.id}
                  </span>
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-[#04211a] text-[10px] font-bold px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                    {cell.id} - Risk: {cell.risk.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 relative z-10 justify-center">
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-emerald-950 border border-emerald-800" /> Low</div>
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-amber-900/40 border border-amber-700" /> Medium</div>
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-red-900/60 border border-red-500" /> Critical</div>
          </div>
        </motion.div>
        
        {/* 5. VRA RECOMMENDATION PANEL */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-[2rem] border border-[#e5e2d6] shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-extrabold text-[#04211a] flex items-center gap-2">
              <Map className="w-5 h-5 text-blue-600" />
              VRA Recommendations
            </h3>
            <button onClick={() => setActiveTab('VRA')} className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer">View Map</button>
          </div>
          
          <div className="space-y-4 flex-1">
            <div className="p-4 rounded-2xl border-2 border-red-100 bg-red-50/30">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-extrabold text-[#04211a]">Sector N-14</span>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase tracking-wider">High Priority</span>
              </div>
              <p className="text-xs font-medium text-slate-600 mb-3">Increase Mg fertilization by 15% to address yellowing trend.</p>
              <button onClick={() => setActiveTab('VRA')} className="text-xs font-bold text-[#04211a] underline hover:text-emerald-700 cursor-pointer">Send to Sprayer Drone</button>
            </div>

            <div className="p-4 rounded-2xl border border-amber-100 bg-[#fcfbf7]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-extrabold text-[#04211a]">Sector S-02</span>
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider">Monitor</span>
              </div>
              <p className="text-xs font-medium text-slate-600 mb-3">Small canopy sizes detected. Schedule soil moisture analysis.</p>
              <button onClick={() => setActiveTab('VRA')} className="text-xs font-bold text-slate-500 hover:text-[#04211a] cursor-pointer">Log Task</button>
            </div>
          </div>
        </motion.div>

        {/* 6. RECENT ANALYSIS / HISTORY */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="lg:col-span-3 bg-white rounded-[2rem] border border-[#e5e2d6] shadow-sm overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-[#e5e2d6] flex justify-between items-center bg-[#fcfbf7]">
            <h3 className="text-lg font-extrabold text-[#04211a]">Recent Inference Logs</h3>
            <button 
              onClick={() => setActiveTab('Logs')}
              className="text-xs font-bold text-[#04211a] hover:text-emerald-700 bg-white border border-[#e5e2d6] px-3 py-1.5 rounded-lg shadow-sm cursor-pointer active:scale-95 transition-all"
            >
              View All Logs
            </button>
          </div>
          <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fcfbf7] border-b border-[#e5e2d6] sticky top-0 z-10 shadow-sm">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 pl-6 uppercase tracking-widest w-20">Preview</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analysis ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Block / Zone</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest pr-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 3).map((row) => (
                  <tr key={row.id} className="border-b border-[#e5e2d6]/50 hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden relative border border-slate-200 shadow-sm">
                        <img src={row.thumb} alt={row.id} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-[#04211a]/10"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[#04211a] block">{row.id}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-700 block">{row.block}</span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mt-1 inline-block">{row.trees} trees • Conf {row.confidence}</span>
                    </td>
                    <td className="px-6 py-4 pr-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
                        row.status === 'Completed' ? 'bg-emerald-100/50 border border-emerald-200 text-emerald-700' : 'bg-blue-100/50 border border-blue-200 text-blue-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${row.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
