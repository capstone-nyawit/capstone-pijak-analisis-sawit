/**
 * Tree Health Tab - Condition Monitoring Page
 * Displays dynamic tree health class distributions, block summaries, and AI recommendations.
 */

import { motion } from 'motion/react';
import {
  Leaf, Sprout, AlertTriangle, CheckCircle2, MapPin,
  TrendingUp, Eye, Target, Activity
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

const blockTable = [
  { block: 'Sector Alpha-1', total: 2495, healthy: 2100, yellow: 80, dead: 5, small: 310, severity: 'Low', lastAnalyzed: 'Oct 25, 2026' },
  { block: 'Block B-05', total: 2207, healthy: 1850, yellow: 65, dead: 12, small: 280, severity: 'Medium', lastAnalyzed: 'Oct 24, 2026' },
  { block: 'Block C-02', total: 1953, healthy: 1690, yellow: 45, dead: 8, small: 210, severity: 'Low', lastAnalyzed: 'Oct 23, 2026' },
  { block: 'Sector Delta-9', total: 1905, healthy: 1480, yellow: 90, dead: 15, small: 320, severity: 'Critical', lastAnalyzed: 'Oct 24, 2026' },
  { block: 'Sector Echo-3', total: 1460, healthy: 1300, yellow: 35, dead: 5, small: 120, severity: 'Low', lastAnalyzed: 'Oct 23, 2026' },
];

interface TreeHealthTabProps {
  stats: { totalTrees: number; healthy: number; smallCanopy: number; yellowing: number; deadMissing: number };
  reports?: any[];
  hasData: boolean;
  onStartAnalysis: () => void;
}

export default function TreeHealthTab({ stats, reports, hasData, onStartAnalysis }: TreeHealthTabProps) {
  if (!hasData) {
    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
        className="min-h-[480px] w-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-[10px] border border-slate-200 shadow-none max-w-2xl mx-auto my-12">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 animate-pulse border border-emerald-100">
          <Leaf className="w-10 h-10 text-emerald-800" />
        </div>
        <h3 className="text-xl font-black text-[#04211a] mb-2">Tree Health Belum Aktif</h3>
        <p className="text-slate-500 max-w-md font-semibold text-xs leading-relaxed mb-6">
          Visualisasi kesehatan tajuk sawit belum dapat ditampilkan. Silakan jalankan analisis citra UAV terlebih dahulu.
        </p>
        <button onClick={onStartAnalysis}
          className="px-6 py-3.5 bg-[#04211a] text-white hover:bg-emerald-950 rounded-full font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all border-none">
          <Target className="w-4 h-4 text-emerald-400" /> Mulai Analisis Baru
        </button>
      </motion.div>
    );
  }

  // Calculate dynamic stats
  const dynamicDist = stats.totalTrees > 0 ? [
    { name: 'Healthy', value: stats.healthy, color: '#10b981' },
    { name: 'Small Canopy', value: stats.smallCanopy, color: '#3b82f6' },
    { name: 'Yellowing', value: stats.yellowing, color: '#f59e0b' },
    { name: 'Dead', value: stats.deadMissing, color: '#ef4444' },
  ] : distributionData;

  const totalAll = dynamicDist.reduce((s, d) => s + d.value, 0);
  const healthIndex = ((dynamicDist[0].value / (totalAll || 1)) * 100).toFixed(1);

  const dynamicBlockData = reports && reports.length > 0 ? reports.map(r => {
    const total = r.totalTrees || 1;
    const pDead = (r.dead / total) * 100;
    const pYellow = (r.yellowing / total) * 100;
    const severity = (pDead > 5 || pYellow > 30) ? 'Critical' : (pDead > 2 || pYellow > 15) ? 'Medium' : 'Low';
    
    return {
      block: r.block,
      name: r.block,
      total: r.totalTrees,
      healthy: r.healthy,
      yellow: r.yellowing,
      dead: r.dead,
      small: Math.max(0, r.totalTrees - r.healthy - r.yellowing - r.dead),
      severity,
      lastAnalyzed: r.analysisDate || r.date
    };
  }) : blockTable.map(b => ({ ...b, name: b.block }));

  return (
    <motion.div key="tree-health" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">

      {/* Top Header Area */}
      <div className="pb-4 border-b border-slate-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#04211a] tracking-tight">Tree Health Monitoring</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Visualisasi sebaran kesehatan tajuk kelapa sawit dan perbandingan status antar blok perkebunan.
          </p>
        </div>
        
        <div className="flex items-center gap-6 bg-white py-2 px-5 rounded-[10px] border border-slate-200 shadow-none">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-450 uppercase tracking-widest block">Total Pohon</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-[#04211a] leading-none">{totalAll.toLocaleString()}</span>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-widest block">Kesehatan</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-emerald-700 leading-none">{healthIndex}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DISTRIBUTION + BLOCK BAR CHART (2 Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Donut Chart with Inline Legend on Right Side */}
        <div className="bg-white p-6 rounded-[10px] border border-slate-200 shadow-none flex flex-col justify-between">
          <div>
            <h3 className="text-[13px] font-bold text-slate-500 mb-6 border-b border-slate-100 pb-3 uppercase tracking-wider">
              Komposisi Kondisi Pohon
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Donut Chart container with 180px diameter */}
              <div className="h-44 w-44 relative shrink-0">
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[18px] font-bold text-[#04211a] leading-none">
                    {totalAll.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Total</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={dynamicDist} cx="50%" cy="50%" 
                      innerRadius={55} outerRadius={75} dataKey="value" paddingAngle={3} strokeWidth={0}
                    >
                      {dynamicDist.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                    </Pie>
                    <Tooltip formatter={(val: number) => val.toLocaleString()} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e2d6', fontSize: '11px', fontWeight: 600 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Inline Legend (Right Side) */}
              <div className="flex-1 space-y-3 w-full">
                {dynamicDist.map((d, i) => {
                  const pct = totalAll > 0 ? ((d.value / totalAll) * 100).toFixed(1) : '0.0';
                  return (
                    <div key={i} className="flex items-center justify-between text-[13px] font-semibold text-slate-600 border-b border-slate-50 pb-1.5 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        <span>{d.name}</span>
                      </div>
                      <span className="font-bold text-[#04211a]">{d.value.toLocaleString()} <span className="text-slate-450 text-[11px]">({pct}%)</span></span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart per Block - 4 Classifications Comparison */}
        <div className="bg-white p-6 rounded-[10px] border border-slate-200 shadow-none flex flex-col justify-between">
          <div>
            <h3 className="text-[13px] font-bold text-slate-500 mb-6 border-b border-slate-100 pb-3 uppercase tracking-wider">
              Perbandingan Kesehatan per Blok
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dynamicBlockData} barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f0e8" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e2d6', fontSize: '11px', fontWeight: 600 }} />
                  <Bar dataKey="healthy" fill="#10b981" radius={[3,3,0,0]} name="Healthy" />
                  <Bar dataKey="small" fill="#3b82f6" radius={[3,3,0,0]} name="Small Canopy" />
                  <Bar dataKey="yellow" fill="#f59e0b" radius={[3,3,0,0]} name="Yellowing" />
                  <Bar dataKey="dead" fill="#ef4444" radius={[3,3,0,0]} name="Dead / Missing" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex justify-center flex-wrap gap-4 text-[11px] font-semibold text-slate-450 mt-4 border-t border-slate-50 pt-3">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Healthy</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Small Canopy</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Yellowing</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /> Dead / Missing</div>
          </div>
        </div>

      </div>

      {/* 3. BLOCK TABLE */}
      <div className="bg-white rounded-[10px] border border-slate-200 shadow-none overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-[#fcfbf7]">
          <h3 className="text-base font-extrabold text-[#04211a]">
            Ringkasan Kesehatan per Blok (Block Summary)
          </h3>
        </div>
        <div className="overflow-x-auto max-h-[270px] overflow-y-auto scroll-smooth">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fcfbf7] border-b border-slate-200 text-[11px] font-bold text-slate-450 uppercase tracking-widest sticky top-0 z-10 shadow-sm">
                <th className="px-6 py-3 font-bold bg-[#fcfbf7]">Block / Zone</th>
                <th className="px-6 py-3 font-bold bg-[#fcfbf7]">Total</th>
                <th className="px-6 py-3 font-bold bg-[#fcfbf7]">Healthy</th>
                <th className="px-6 py-3 font-bold bg-[#fcfbf7]">Small Canopy</th>
                <th className="px-6 py-3 font-bold bg-[#fcfbf7]">Yellowing</th>
                <th className="px-6 py-3 font-bold bg-[#fcfbf7]">Dead</th>
                <th className="px-6 py-3 font-bold bg-[#fcfbf7]">Severity (Micro Progress Bar)</th>
                <th className="px-6 py-3 font-bold bg-[#fcfbf7]">Last Analyzed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] font-semibold text-slate-650">
              {dynamicBlockData.map((b) => {
                const percentHealthy = b.total > 0 ? ((b.healthy / b.total) * 100).toFixed(1) : '0.0';
                const healthVal = parseFloat(percentHealthy);
                const barColor = healthVal > 85 ? 'bg-emerald-500' : healthVal > 70 ? 'bg-amber-500' : 'bg-red-500';

                return (
                  <tr key={b.block} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100/50">
                    <td className="px-6 py-4 font-bold text-[#04211a] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {b.block}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-500">{b.total.toLocaleString()} pohon</td>
                    <td className="px-6 py-4 font-bold text-emerald-700">{b.healthy.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-blue-700">{b.small.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-amber-600">{b.yellow}</td>
                    <td className="px-6 py-4 font-bold text-red-655">{b.dead}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden shrink-0">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentHealthy}%` }} />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500 leading-none">{percentHealthy}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-semibold text-slate-400">{b.lastAnalyzed}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </motion.div>
  );
}
