/**
 * VRA Tools Tab - Action Planning & Fertilization Recommendation
 * "What should the user do next?"
 */

import { motion } from 'motion/react';
import {
  Beaker, AlertTriangle, CheckCircle2, MapPin, Download,
  Clock, Zap, Target, Droplets, FileText, TrendingUp, Leaf
} from 'lucide-react';

const prescriptions = [
  {
    sector: 'Sector N-14',
    priority: 'High',
    issue: 'Yellowing trend increasing (+12% MoM)',
    recommendation: 'Increase Mg fertilization',
    dosage: '+15% MgSO₄',
    timeline: 'Within 72 hours',
    status: 'Pending',
    confidence: 94.2,
    reasoning: 'Chlorosis pattern consistent with Mg deficiency. Canopy reflectance drop confirmed via NDVI analysis.',
  },
  {
    sector: 'Sector Delta-9',
    priority: 'Critical',
    issue: 'Dead canopy cluster detected',
    recommendation: 'Emergency soil + root assessment',
    dosage: 'Full replanting protocol',
    timeline: 'Immediate',
    status: 'Pending',
    confidence: 91.5,
    reasoning: '15 dead trees concentrated in 200m² area. Possible Ganoderma infection or waterlogging root damage.',
  },
  {
    sector: 'Block B-05',
    priority: 'Medium',
    issue: 'Small canopy underperformance',
    recommendation: 'Apply NPK boost + foliar spray',
    dosage: '+10% NPK 15-15-15',
    timeline: 'Within 7 days',
    status: 'Scheduled',
    confidence: 88.7,
    reasoning: 'Young palms showing 23% below expected canopy diameter for age class. Nutrient supplementation likely to accelerate growth.',
  },
  {
    sector: 'Sector Echo-3',
    priority: 'Low',
    issue: 'Minor yellowing at boundary',
    recommendation: 'Monitor + preventive K application',
    dosage: '+5% KCl',
    timeline: 'Next cycle',
    status: 'Completed',
    confidence: 86.3,
    reasoning: 'Low-severity yellowing limited to boundary rows. Likely edge effect from adjacent drainage canal.',
  },
];

const vraZones = [
  { id: 'N-1', input: 'low' }, { id: 'N-2', input: 'medium' }, { id: 'N-3', input: 'high' }, { id: 'N-4', input: 'low' },
  { id: 'S-1', input: 'high' }, { id: 'S-2', input: 'high' }, { id: 'S-3', input: 'medium' }, { id: 'S-4', input: 'low' },
  { id: 'E-1', input: 'low' }, { id: 'E-2', input: 'medium' }, { id: 'E-3', input: 'low' }, { id: 'E-4', input: 'low' },
  { id: 'W-1', input: 'medium' }, { id: 'W-2', input: 'low' }, { id: 'W-3', input: 'medium' }, { id: 'W-4', input: 'low' },
];

const vraHistory = [
  { date: 'Oct 25, 2026', block: 'Sector N-14', issue: 'Mg Deficiency', action: 'Applied MgSO₄ +15%', status: 'Completed' },
  { date: 'Oct 20, 2026', block: 'Block C-02', issue: 'K Deficiency', action: 'Applied KCl +10%', status: 'Completed' },
  { date: 'Oct 15, 2026', block: 'Sector Alpha-1', issue: 'Preventive cycle', action: 'Standard NPK', status: 'Completed' },
  { date: 'Oct 10, 2026', block: 'Block B-05', issue: 'Small canopy', action: 'Foliar spray + NPK boost', status: 'In Progress' },
  { date: 'Oct 10, 2026', block: 'Block B-05', issue: 'Small canopy', action: 'Foliar spray + NPK boost', status: 'In Progress' },
  { date: 'Oct 10, 2026', block: 'Block B-05', issue: 'Small canopy', action: 'Foliar spray + NPK boost', status: 'In Progress' },
  { date: 'Oct 10, 2026', block: 'Block B-05', issue: 'Small canopy', action: 'Foliar spray + NPK boost', status: 'In Progress' },
   { date: 'Oct 25, 2026', block: 'Sector N-14', issue: 'Mg Deficiency', action: 'Applied MgSO₄ +15%', status: 'Completed' },
  { date: 'Oct 20, 2026', block: 'Block C-02', issue: 'K Deficiency', action: 'Applied KCl +10%', status: 'Completed' },
  { date: 'Oct 15, 2026', block: 'Sector Alpha-1', issue: 'Preventive cycle', action: 'Standard NPK', status: 'Completed' },
  { date: 'Oct 10, 2026', block: 'Block B-05', issue: 'Small canopy', action: 'Foliar spray + NPK boost', status: 'In Progress' },
  { date: 'Oct 10, 2026', block: 'Block B-05', issue: 'Small canopy', action: 'Foliar spray + NPK boost', status: 'In Progress' },
  { date: 'Oct 10, 2026', block: 'Block B-05', issue: 'Small canopy', action: 'Foliar spray + NPK boost', status: 'In Progress' },
  { date: 'Oct 10, 2026', block: 'Block B-05', issue: 'Small canopy', action: 'Foliar spray + NPK boost', status: 'In Progress' },
  
];

interface VRAToolsTabProps {
  hasData: boolean;
  onStartAnalysis: () => void;
}

export default function VRAToolsTab({ hasData, onStartAnalysis }: VRAToolsTabProps) {
  if (!hasData) {
    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
        className="min-h-[480px] w-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-[2rem] border border-[#e5e2d6] shadow-sm max-w-2xl mx-auto my-12">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 animate-pulse border border-emerald-100">
          <Beaker className="w-10 h-10 text-emerald-800" />
        </div>
        <h3 className="text-xl font-black text-[#04211a] mb-2">VRA Tools Belum Aktif</h3>
        <p className="text-slate-500 max-w-md font-semibold text-xs leading-relaxed mb-6">
          Rekomendasi pemupukan presisi belum tersedia. Jalankan analisis citra UAV terlebih dahulu agar sistem dapat menghasilkan preskripsi VRA.
        </p>
        <button onClick={onStartAnalysis}
          className="px-6 py-3.5 bg-[#04211a] text-white hover:bg-emerald-950 rounded-full font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all">
          <Target className="w-4 h-4 text-emerald-400" /> Mulai Analisis Baru
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div key="vra-tools" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">

      {/* 1. RECOMMENDATION SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-[1.5rem] border border-[#e5e2d6] shadow-sm">
          <div className="p-2.5 rounded-xl bg-red-50 w-fit mb-3"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
          <h4 className="text-2xl font-black text-[#04211a]">2</h4>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">High/Critical Zones</p>
          <p className="text-xs font-semibold text-red-600 mt-2">Immediate attention required</p>
        </div>
        <div className="bg-white p-5 rounded-[1.5rem] border border-[#e5e2d6] shadow-sm">
          <div className="p-2.5 rounded-xl bg-amber-50 w-fit mb-3"><Beaker className="w-5 h-5 text-amber-600" /></div>
          <h4 className="text-2xl font-black text-[#04211a]">4</h4>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Prescriptions</p>
          <p className="text-xs font-semibold text-amber-600 mt-2">3 pending, 1 scheduled</p>
        </div>
        <div className="bg-white p-5 rounded-[1.5rem] border border-[#e5e2d6] shadow-sm">
          <div className="p-2.5 rounded-xl bg-emerald-50 w-fit mb-3"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
          <h4 className="text-2xl font-black text-[#04211a]">12</h4>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Completed This Month</p>
          <p className="text-xs font-semibold text-emerald-600 mt-2">All verified & applied</p>
        </div>
      </div>

      {/* 2. PRESCRIPTION CARDS + FERTILIZATION MAP */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Prescription Cards */}
        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-base font-extrabold text-[#04211a] flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" /> VRA Prescriptions
          </h3>
          {prescriptions.map((rx, i) => (
            <div key={i} className={`bg-white p-5 rounded-2xl border shadow-sm transition-all hover:shadow-md ${
              rx.priority === 'Critical' ? 'border-l-4 border-l-red-500 border-r border-y border-[#e5e2d6]' :
              rx.priority === 'High' ? 'border-l-4 border-l-amber-500 border-r border-y border-[#e5e2d6]' :
              rx.priority === 'Medium' ? 'border-l-4 border-l-blue-400 border-r border-y border-[#e5e2d6]' :
              'border-[#e5e2d6]'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-extrabold text-[#04211a]">{rx.sector}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      rx.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                      rx.priority === 'High' ? 'bg-amber-100 text-amber-700' :
                      rx.priority === 'Medium' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>{rx.priority}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-600">{rx.issue}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shrink-0 ${
                  rx.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                  rx.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>{rx.status}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div className="bg-[#fcfbf7] p-3 rounded-xl border border-[#e5e2d6]">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Action</p>
                  <p className="text-xs font-bold text-[#04211a]">{rx.recommendation}</p>
                </div>
                <div className="bg-[#fcfbf7] p-3 rounded-xl border border-[#e5e2d6]">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Dosage</p>
                  <p className="text-xs font-bold text-[#04211a]">{rx.dosage}</p>
                </div>
                <div className="bg-[#fcfbf7] p-3 rounded-xl border border-[#e5e2d6]">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Timeline</p>
                  <p className="text-xs font-bold text-[#04211a] flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" />{rx.timeline}</p>
                </div>
              </div>

              {/* Reasoning */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> AI Reasoning — {rx.confidence}% confidence
                </p>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">{rx.reasoning}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Fertilization Map + Export */}
        <div className="space-y-6">
          {/* Map */}
          <div className="bg-[#04211a] p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/15 blur-3xl rounded-full pointer-events-none" />
            <h3 className="text-base font-extrabold text-white mb-5 flex items-center gap-2 relative z-10">
              <Droplets className="w-4 h-4 text-emerald-400" /> Fertilization Map
            </h3>
            <div className="grid grid-cols-4 gap-2 relative z-10">
              {vraZones.map((z) => (
                <div key={z.id} className={`aspect-square rounded-xl flex items-center justify-center border transition-all hover:scale-105 cursor-pointer ${
                  z.input === 'low' ? 'bg-emerald-950 border-emerald-800/50' :
                  z.input === 'medium' ? 'bg-amber-900/40 border-amber-600/50' :
                  'bg-red-900/50 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.25)]'
                }`}>
                  <span className={`text-[10px] font-black ${
                    z.input === 'low' ? 'text-emerald-600' :
                    z.input === 'medium' ? 'text-amber-400' : 'text-red-400'
                  }`}>{z.id}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 relative z-10 justify-center">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-emerald-950 border border-emerald-800" /> Low Input</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-amber-900/40 border border-amber-600" /> Medium</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-red-900/50 border border-red-500" /> High Input</div>
            </div>
          </div>

          {/* Export Actions */}
          {/* <div className="bg-white p-5 rounded-[2rem] border border-[#e5e2d6] shadow-sm">
            <h3 className="text-sm font-extrabold text-[#04211a] mb-4 flex items-center gap-2">
              <Download className="w-4 h-4 text-slate-500" /> Export Prescriptions
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Export PDF Report', icon: FileText, color: 'text-red-600 bg-red-50' },
                { label: 'Export CSV Data', icon: FileText, color: 'text-blue-600 bg-blue-50' },
                { label: 'Export VRA Map', icon: MapPin, color: 'text-emerald-600 bg-emerald-50' },
              ].map((exp, i) => (
                <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#e5e2d6] hover:bg-slate-50 hover:border-emerald-200 transition-all text-left group">
                  <div className={`p-2 rounded-lg ${exp.color}`}><exp.icon className="w-4 h-4" /></div>
                  <span className="text-xs font-bold text-[#04211a] group-hover:text-emerald-700 transition-colors">{exp.label}</span>
                  <Download className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                </button>
              ))}
            </div>
          </div> */}
        </div>
      </div>

      {/* 3. RECOMMENDATION HISTORY */}
      {/* <div className="bg-white rounded-[2rem] border border-[#e5e2d6] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e5e2d6]">
          <h3 className="text-base font-extrabold text-[#04211a] flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" /> Recommendation History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fcfbf7] border-b border-[#e5e2d6] text-xs font-bold text-slate-500 uppercase tracking-widest">
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Block / Zone</th>
                <th className="px-6 py-4 font-bold">Issue</th>
                <th className="px-6 py-4 font-bold">Action Taken</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e2d6]">
              {vraHistory.map((h, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{h.date}</td>
                  <td className="px-6 py-4 font-bold text-[#04211a] text-sm">{h.block}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700">{h.issue}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{h.action}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      h.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {h.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
      <div className="bg-white rounded-[2rem] border border-[#e5e2d6] shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-[#e5e2d6]">
        <h3 className="text-base font-extrabold text-[#04211a] flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" /> Recommendation History
        </h3>
      </div>
      
      <div className="overflow-x-auto max-h-[320px] overflow-y-auto scroll-smooth">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#fcfbf7] border-b border-[#e5e2d6] text-xs font-bold text-slate-500 uppercase tracking-widest sticky top-0 z-10 shadow-sm">
              <th className="px-6 py-4 font-bold bg-[#fcfbf7]">Date</th>
              <th className="px-6 py-4 font-bold bg-[#fcfbf7]">Block / Zone</th>
              <th className="px-6 py-4 font-bold bg-[#fcfbf7]">Issue</th>
              <th className="px-6 py-4 font-bold bg-[#fcfbf7]">Action Taken</th>
              <th className="px-6 py-4 font-bold bg-[#fcfbf7]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e2d6]">
            {vraHistory.map((h, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-600">{h.date}</td>
                <td className="px-6 py-4 font-bold text-[#04211a] text-sm">{h.block}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-700">{h.issue}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600">{h.action}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    h.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {h.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {h.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </motion.div>
  );
}
