/**
 * Tree Health Tab - Condition Monitoring Page
 * "What is the condition of the trees right now?"
 */

import { motion } from 'motion/react';
import {
  Leaf, Sprout, AlertTriangle, CheckCircle2, MapPin,
  TrendingUp, Eye, Target, Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const distributionData = [
  { name: 'Healthy', value: 8420, color: '#10b981' },
  { name: 'Small Canopy', value: 1240, color: '#3b82f6' },
  { name: 'Yellowing', value: 315, color: '#f59e0b' },
  { name: 'Dead', value: 45, color: '#ef4444' },
];

const blockData = [
  { name: 'Alpha-1', healthy: 2100, yellow: 80, dead: 5, small: 310 },
  { name: 'B-05', healthy: 1850, yellow: 65, dead: 12, small: 280 },
  { name: 'C-02', healthy: 1690, yellow: 45, dead: 8, small: 210 },
  { name: 'Delta-9', healthy: 1480, yellow: 90, dead: 15, small: 320 },
  { name: 'Echo-3', healthy: 1300, yellow: 35, dead: 5, small: 120 },
];

const blockTable = [
  { block: 'Sector Alpha-1', total: 2495, healthy: 2100, yellow: 80, dead: 5, severity: 'Low', lastAnalyzed: 'Oct 25, 2026' },
  { block: 'Block B-05', total: 2207, healthy: 1850, yellow: 65, dead: 12, severity: 'Medium', lastAnalyzed: 'Oct 24, 2026' },
  { block: 'Block C-02', total: 1953, healthy: 1690, yellow: 45, dead: 8, severity: 'Low', lastAnalyzed: 'Oct 23, 2026' },
  { block: 'Sector Delta-9', total: 1905, healthy: 1480, yellow: 90, dead: 15, severity: 'Critical', lastAnalyzed: 'Oct 24, 2026' },
  { block: 'Sector Echo-3', total: 1460, healthy: 1300, yellow: 35, dead: 5, severity: 'Low', lastAnalyzed: 'Oct 23, 2026' },
];

const zoneGrid = [
  { id: 'A-1', health: 'good' }, { id: 'A-2', health: 'good' }, { id: 'A-3', health: 'warning' }, { id: 'A-4', health: 'good' },
  { id: 'B-1', health: 'warning' }, { id: 'B-2', health: 'critical' }, { id: 'B-3', health: 'warning' }, { id: 'B-4', health: 'good' },
  { id: 'C-1', health: 'good' }, { id: 'C-2', health: 'good' }, { id: 'C-3', health: 'good' }, { id: 'C-4', health: 'warning' },
  { id: 'D-1', health: 'good' }, { id: 'D-2', health: 'warning' }, { id: 'D-3', health: 'good' }, { id: 'D-4', health: 'good' },
];

interface TreeHealthTabProps {
  stats: { totalTrees: number; healthy: number; smallCanopy: number; yellowing: number; deadMissing: number };
  hasData: boolean;
  onStartAnalysis: () => void;
}

export default function TreeHealthTab({ stats, hasData, onStartAnalysis }: TreeHealthTabProps) {
  if (!hasData) {
    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
        className="min-h-[480px] w-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-[2rem] border border-[#e5e2d6] shadow-sm max-w-2xl mx-auto my-12">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 animate-pulse border border-emerald-100">
          <Leaf className="w-10 h-10 text-emerald-800" />
        </div>
        <h3 className="text-xl font-black text-[#04211a] mb-2">Tree Health Belum Aktif</h3>
        <p className="text-slate-500 max-w-md font-semibold text-xs leading-relaxed mb-6">
          Visualisasi kesehatan tajuk sawit belum dapat ditampilkan. Silakan jalankan analisis citra UAV terlebih dahulu.
        </p>
        <button onClick={onStartAnalysis}
          className="px-6 py-3.5 bg-[#04211a] text-white hover:bg-emerald-950 rounded-full font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all">
          <Target className="w-4 h-4 text-emerald-400" /> Mulai Analisis Baru
        </button>
      </motion.div>
    );
  }

  const totalAll = distributionData.reduce((s, d) => s + d.value, 0);
  const healthIndex = ((distributionData[0].value / totalAll) * 100).toFixed(1);

  return (
    <motion.div key="tree-health" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">

      {/* 1. SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Trees', val: stats.totalTrees > 0 ? stats.totalTrees.toLocaleString() : totalAll.toLocaleString(), icon: Sprout, color: 'text-[#04211a]' },
          { label: 'Healthy', val: stats.healthy > 0 ? stats.healthy.toLocaleString() : '8,420', icon: CheckCircle2, color: 'text-emerald-700' },
          { label: 'Small Canopy', val: stats.smallCanopy > 0 ? stats.smallCanopy.toLocaleString() : '1,240', icon: Leaf, color: 'text-blue-600' },
          { label: 'Yellowing', val: stats.yellowing > 0 ? stats.yellowing.toLocaleString() : '315', icon: AlertTriangle, color: 'text-amber-600' },
          { label: 'Dead / Missing', val: stats.deadMissing > 0 ? stats.deadMissing.toLocaleString() : '45', icon: AlertTriangle, color: 'text-red-600' },
          { label: 'Health Index', val: `${healthIndex}%`, icon: Activity, color: 'text-emerald-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-[1.5rem] border border-[#e5e2d6] shadow-sm">
            <div className={`p-2 rounded-xl bg-slate-50 border border-slate-100 w-fit mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <h4 className={`text-2xl font-black ${s.color} mb-0.5 tracking-tight`}>{s.val}</h4>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 2. DISTRIBUTION + ZONING */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-[2rem] border border-[#e5e2d6] shadow-sm">
          <h3 className="text-base font-extrabold text-[#04211a] mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" /> Class Distribution
          </h3>
          <div className="h-64 relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
              <span className="text-xl font-black text-[#04211a] leading-none">
                {distributionData.reduce((a, b) => a + b.value, 0).toLocaleString()}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Trees</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={distributionData} cx="50%" cy="50%" 
                  innerRadius={65} outerRadius={85} dataKey="value" paddingAngle={3} strokeWidth={0}
                  labelLine={{ stroke: '#cbd5e1', strokeWidth: 1.5, strokeOpacity: 0.5 }}
                  label={({ cx, cy, x, y, value, name, percent }) => {
                    if (percent < 0.01) return null; // hide for <1%
                    return (
                      <text x={x} y={y} fill="#475569" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11} fontWeight="bold">
                        {`${Math.round(percent * 100)}%`}
                      </text>
                    );
                  }}
                >
                  {distributionData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                </Pie>
                <Tooltip formatter={(val: number) => val.toLocaleString()} contentStyle={{ borderRadius: '12px', border: '1px solid #e5e2d6', fontSize: '12px', fontWeight: 700 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {distributionData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart per Block */}
        <div className="bg-white p-6 rounded-[2rem] border border-[#e5e2d6] shadow-sm">
          <h3 className="text-base font-extrabold text-[#04211a] mb-6 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" /> Health per Block
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={blockData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e2d6" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e2d6', fontSize: '11px', fontWeight: 600 }} />
                <Bar dataKey="healthy" fill="#10b981" radius={[4,4,0,0]} />
                <Bar dataKey="yellow" fill="#f59e0b" radius={[4,4,0,0]} />
                <Bar dataKey="dead" fill="#ef4444" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health Zone Map */}
        <div className="bg-[#04211a] p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/15 blur-3xl rounded-full pointer-events-none" />
          <h3 className="text-base font-extrabold text-white mb-6 flex items-center gap-2 relative z-10">
            <Target className="w-4 h-4 text-emerald-400" /> Plantation Zoning
          </h3>
          <div className="grid grid-cols-4 gap-2 relative z-10">
            {zoneGrid.map((z) => (
              <div key={z.id} className={`aspect-square rounded-xl flex items-center justify-center border transition-all hover:scale-105 cursor-pointer ${
                z.health === 'good' ? 'bg-emerald-950 border-emerald-800/50' :
                z.health === 'warning' ? 'bg-amber-900/40 border-amber-700/50' :
                'bg-red-900/60 border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
              }`}>
                <span className={`text-xs font-black ${
                  z.health === 'good' ? 'text-emerald-600' :
                  z.health === 'warning' ? 'text-amber-500' : 'text-red-400'
                }`}>{z.id}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 relative z-10 justify-center">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-emerald-950 border border-emerald-800" /> Healthy</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-amber-900/40 border border-amber-700" /> Warning</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-red-900/60 border border-red-500" /> Critical</div>
          </div>
        </div>
      </div>

      {/* 3. BLOCK TABLE */}
      <div className="bg-white rounded-[2rem] border border-[#e5e2d6] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e5e2d6]">
          <h3 className="text-base font-extrabold text-[#04211a] flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-600" /> Block Health Summary
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fcfbf7] border-b border-[#e5e2d6] text-xs font-bold text-slate-500 uppercase tracking-widest">
                <th className="px-6 py-4 font-bold">Block / Zone</th>
                <th className="px-6 py-4 font-bold">Total</th>
                <th className="px-6 py-4 font-bold">Healthy</th>
                <th className="px-6 py-4 font-bold">Yellow</th>
                <th className="px-6 py-4 font-bold">Dead</th>
                <th className="px-6 py-4 font-bold">Severity</th>
                <th className="px-6 py-4 font-bold">Last Analyzed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e2d6]">
              {blockTable.map((b) => (
                <tr key={b.block} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#04211a] text-sm">{b.block}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700 text-sm">{b.total.toLocaleString()}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-700 text-sm">{b.healthy.toLocaleString()}</td>
                  <td className="px-6 py-4 font-semibold text-amber-600 text-sm">{b.yellow}</td>
                  <td className="px-6 py-4 font-semibold text-red-600 text-sm">{b.dead}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      b.severity === 'Low' ? 'bg-emerald-100 text-emerald-700' :
                      b.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>{b.severity}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">{b.lastAnalyzed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. INSIGHT PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border-l-4 border-l-red-500 bg-red-50/50 border border-[#e5e2d6]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-extrabold text-red-900 mb-1">Sector Delta-9 — Critical Risk</h4>
              <p className="text-xs font-medium text-red-800/70 leading-relaxed">
                Highest concentration of yellowing (90 trees) and dead canopies (15 trees). Possible Mg deficiency spreading from adjacent waterlogged zones. Immediate VRA intervention recommended.
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 rounded-2xl border-l-4 border-l-amber-500 bg-amber-50/50 border border-[#e5e2d6]">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-extrabold text-amber-900 mb-1">Block B-05 — Yellowing Trend Rising</h4>
              <p className="text-xs font-medium text-amber-800/70 leading-relaxed">
                12% increase in yellowing since last month. Monitor soil moisture and consider targeted fertilization within the next 7 days.
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 rounded-2xl border-l-4 border-l-emerald-500 bg-emerald-50/50 border border-[#e5e2d6]">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-extrabold text-emerald-900 mb-1">Sector Alpha-1 — Strongest Health</h4>
              <p className="text-xs font-medium text-emerald-800/70 leading-relaxed">
                84% healthy canopy with minimal yellowing. This sector outperforms all other blocks and can serve as a baseline reference for future comparisons.
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 rounded-2xl border-l-4 border-l-blue-500 bg-blue-50/50 border border-[#e5e2d6]">
          <div className="flex items-start gap-3">
            <Eye className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-extrabold text-blue-900 mb-1">Cross-Block Comparison</h4>
              <p className="text-xs font-medium text-blue-800/70 leading-relaxed">
                Sectors on the south boundary show 2.3× higher yellowing rates vs. northern blocks. Consider drainage and soil pH testing for southern sectors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
