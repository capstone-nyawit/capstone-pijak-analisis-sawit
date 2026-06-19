/**
 * VRA Tools Tab - Action Planning & Fertilization Recommendation
 * Displays dynamic VRA Recommendations fetched from the database based on the selected block.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Beaker, AlertTriangle, CheckCircle2, MapPin, 
  Clock, Zap, Target, Leaf, Loader2
} from 'lucide-react';

interface VRAToolsTabProps {
  hasData: boolean;
  logs: any[];
  onStartAnalysis: () => void;
}

export default function VRAToolsTab({ hasData, logs, onStartAnalysis }: VRAToolsTabProps) {
  const [selectedLogCode, setSelectedLogCode] = useState<string>('');
  const [recommendation, setRecommendation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'Prescription' | 'History'>('Prescription');

  useEffect(() => {
    if (logs && logs.length > 0) {
      // Default to the most recent log
      setSelectedLogCode(logs[0].id);
    }
  }, [logs]);

  useEffect(() => {
    if (!selectedLogCode) return;

    const fetchRecommendation = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const headers = { 'Authorization': `Bearer ${token}` };
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

        const res = await fetch(`${apiUrl}/vra/recommendation/log/${selectedLogCode}`, { headers });
        if (res.ok) {
          const data = await res.json();
          setRecommendation(data);
        }
      } catch (err) {
        console.error("Failed to fetch recommendation details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendation();
  }, [selectedLogCode]);

  if (!hasData || logs.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
        className="min-h-[480px] w-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-[10px] border border-slate-200 shadow-none max-w-2xl mx-auto my-12">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 animate-pulse border border-emerald-100">
          <Beaker className="w-10 h-10 text-emerald-800" />
        </div>
        <h3 className="text-xl font-black text-[#04211a] mb-2">VRA Tools Belum Aktif</h3>
        <p className="text-slate-500 max-w-md font-semibold text-xs leading-relaxed mb-6">
          Rekomendasi pemupukan presisi belum tersedia. Jalankan analisis citra UAV terlebih dahulu agar sistem dapat menghasilkan preskripsi VRA.
        </p>
        <button onClick={onStartAnalysis}
          className="px-6 py-3.5 bg-[#04211a] text-white hover:bg-emerald-950 rounded-full font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all border-none">
          <Target className="w-4 h-4 text-emerald-400" /> Mulai Analisis Baru
        </button>
      </motion.div>
    );
  }

  // Priority calculation helper based on backend rules
  const getPriority = (pct: number, type: 'healthy' | 'yellowing' | 'small_canopy' | 'dead') => {
    if (type === 'healthy') return 'Low';
    if (type === 'dead') {
      if (pct <= 1.0) return 'Low';
      if (pct <= 3.0) return 'Medium';
      if (pct <= 5.0) return 'High';
      return 'Critical';
    }
    // yellowing & small
    if (pct <= 5.0) return 'Low';
    if (pct <= 15.0) return 'Medium';
    if (pct <= 30.0) return 'High';
    return 'Critical';
  };

  const getProgram = (type: 'healthy' | 'yellowing' | 'small_canopy' | 'dead') => {
    switch (type) {
      case 'healthy': return 'Routine Monitoring Program';
      case 'yellowing': return 'Corrective Fertilization Program';
      case 'small_canopy': return 'Growth Enhancement Program';
      case 'dead': return 'Replanting Assessment Program';
    }
  };

  // Helper to format program titles to look extremely premium
  const formatProgramDesc = (program: string) => {
    switch (program.trim()) {
      case "Replanting Assessment Program":
        return "Evaluasi intensif kesuburan tanah, drainase, dan potensi infeksi patogen untuk menyusun rencana penanaman ulang pohon sawit baru.";
      case "Corrective Fertilization Program":
        return "Pemberian dosis pupuk mikro korektif (MgSO₄ / KCl) untuk mengatasi defisiensi hara spesifik pada daun sawit yang menguning.";
      case "Growth Enhancement Program":
        return "Pemberian NPK booster dengan tambahan zat pengatur tumbuh organik guna mempercepat perluasan kanopi daun sawit muda.";
      case "Routine Monitoring Program":
        return "Pemantauan rutin dan pemupukan standar periodik. Tidak diperlukan tindakan korektif darurat saat ini.";
      default:
        return "Program manajemen kebun presisi terintegrasi.";
    }
  };

  const getBadgeStyles = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
        return 'bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5]';
      case 'MEDIUM':
        return 'bg-[#FEF3C7] text-[#92400E] border-[#FCD34D]';
      case 'LOW':
        return 'bg-[#D1FAE5] text-[#065F46] border-[#6EE7B7]';
      case 'COMPLETED':
        return 'bg-[#DCFCE7] text-[#166534] border-[#86EFAC]';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const selectedLog = logs.find(l => l.id === selectedLogCode);

  return (
    <motion.div key="vra-tools" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
      
      {/* Top Header / Selector Area */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-[#04211a] tracking-tight">
            VRA Prescription Tools
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Preskripsi Variable Rate Application berdasarkan analisis citra kesehatan tajuk UAV.
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-white px-4 py-2 rounded-[10px] border border-slate-200 shrink-0 self-end sm:self-auto shadow-none">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Blok:</span>
          <select
            value={selectedLogCode}
            onChange={(e) => setSelectedLogCode(e.target.value)}
            className="px-2.5 py-1 bg-[#fcfbf7] border border-slate-200 rounded-lg text-xs font-bold text-[#04211a] focus:outline-none focus:border-emerald-600 cursor-pointer min-w-[150px]"
          >
            {logs.map((log) => (
              <option key={log.id} value={log.id}>
                {log.block} ({log.date})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveSubTab('Prescription')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-none ${
            activeSubTab === 'Prescription'
              ? 'bg-white text-[#04211a] shadow-sm'
              : 'text-slate-500 hover:text-slate-800 bg-transparent'
          }`}
        >
          Prescription Plans
        </button>
        <button
          onClick={() => setActiveSubTab('History')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-none ${
            activeSubTab === 'History'
              ? 'bg-white text-[#04211a] shadow-sm'
              : 'text-slate-500 hover:text-slate-800 bg-transparent'
          }`}
        >
          Prescription History
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-[#04211a] animate-spin opacity-85" />
          <p className="text-slate-500 font-bold text-xs mt-3">Mengambil data preskripsi...</p>
        </div>
      ) : (
        activeSubTab === 'Prescription' ? (
          recommendation && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Column 1: Analysis & Recommendation (Left Side) */}
              <div className="xl:col-span-2 bg-white p-6 rounded-[10px] border border-slate-200 shadow-none space-y-6">
                <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">
                  Analysis & Recommendation
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { type: 'healthy' as const, label: 'Healthy', val: recommendation.healthy_count, icon: CheckCircle2, iconColor: 'text-emerald-500', bg: 'bg-emerald-50/40', border: 'border-emerald-100' },
                    { type: 'yellowing' as const, label: 'Yellowing', val: recommendation.yellowing_count, icon: AlertTriangle, iconColor: 'text-amber-500', bg: 'bg-amber-50/40', border: 'border-amber-100' },
                    { type: 'small_canopy' as const, label: 'Small Canopy', val: recommendation.small_canopy_count, icon: Leaf, iconColor: 'text-blue-500', bg: 'bg-blue-50/40', border: 'border-blue-100' },
                    { type: 'dead' as const, label: 'Dead / Missing', val: recommendation.dead_count, icon: AlertTriangle, iconColor: 'text-red-500', bg: 'bg-red-50/40', border: 'border-red-100' },
                  ].map(item => {
                    const total = (recommendation.healthy_count + recommendation.small_canopy_count + recommendation.yellowing_count + recommendation.dead_count) || 1;
                    const pct = (item.val / total) * 100.0;
                    const priority = getPriority(pct, item.type);
                    return { ...item, pct, priority };
                  }).sort((a, b) => {
                    const pMap = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                    if (pMap[a.priority] !== pMap[b.priority]) {
                      return pMap[b.priority] - pMap[a.priority]; // Highest priority first
                    }
                    return b.pct - a.pct; // Then highest percentage first
                  }).map((item) => {
                    const { pct, priority } = item;
                    const program = getProgram(item.type);
                    
                    let llmRecs: any = null;
                    if (recommendation?.recommended_programs) {
                      try {
                        llmRecs = JSON.parse(recommendation.recommended_programs);
                      } catch(e) {}
                    }
                    
                    const desc = (llmRecs && llmRecs[item.type]) 
                      ? llmRecs[item.type] 
                      : formatProgramDesc(program);
                    
                    const isHighPrio = priority === 'Critical' || priority === 'High' || priority === 'Medium';
                    const borderAccent = isHighPrio 
                      ? (priority === 'Critical' ? 'border-l-[3px] border-l-red-500' : priority === 'High' ? 'border-l-[3px] border-l-amber-500' : 'border-l-[3px] border-l-blue-500')
                      : 'border-l-[3px] border-l-slate-200';
                    
                    const bgTint = isHighPrio 
                      ? (priority === 'Critical' ? 'bg-red-50/10' : priority === 'High' ? 'bg-amber-50/10' : 'bg-blue-50/10')
                      : 'bg-white';

                    return (
                      <div 
                        key={item.label} 
                        className={`p-5 rounded-[10px] border border-slate-200 flex flex-col justify-between transition-all hover:bg-slate-50/50 shadow-none ${borderAccent} ${bgTint}`}
                      >
                        {/* Diagnostic Metrics */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${
                                item.type === 'healthy' ? 'bg-emerald-500' :
                                item.type === 'yellowing' ? 'bg-amber-500' :
                                item.type === 'small_canopy' ? 'bg-blue-500' :
                                'bg-red-500'
                              }`} />
                              <span className="text-[13px] font-bold text-slate-700">{item.label}</span>
                            </div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getBadgeStyles(priority)}`}>
                              {priority}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-[28px] font-extrabold text-slate-900 leading-none tracking-tight">
                              {pct.toFixed(1)}%
                            </span>
                            <span className="text-[11px] font-extrabold text-slate-450">populasi</span>
                          </div>
                        </div>

                        {/* Prescriptive Recommendation Action Box */}
                        <div className={`mt-4 p-4 rounded-[8px] border ${item.bg} ${item.border} space-y-2 flex flex-col justify-between`}>
                          <div>
                            <h5 className="text-[13px] font-bold text-[#04211a] flex items-center gap-1">
                              <Zap className="w-3.5 h-3.5 text-emerald-600" />
                              {program}
                            </h5>
                            <p className="text-[11px] text-slate-600 font-semibold leading-relaxed mt-1 whitespace-pre-line">
                              {desc.length > 150 ? desc.substring(0, 150) + '...' : desc}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100/50 text-[10px] font-semibold text-slate-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              Zona: {selectedLog?.block || 'Kebun'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Leaf className="w-3.5 h-3.5" />
                              {item.val.toLocaleString()} pohon
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Column 2: Health Distribution (Right Side) */}
              <div className="bg-white p-6 rounded-[10px] border border-slate-200 shadow-none space-y-6 h-fit">
                <h4 className="text-[13px] font-bold text-slate-500 border-b border-slate-100 pb-3 uppercase tracking-widest">
                  Health Distribution
                </h4>
                <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                  Rincian sebaran tajuk pohon sawit hasil deteksi ortofoto udara di **{selectedLog?.block || 'Kebun'}**:
                </p>

                <div className="space-y-4">
                  {[
                    { label: 'Healthy', val: recommendation.healthy_count, color: 'bg-emerald-500' },
                    { label: 'Small Canopy', val: recommendation.small_canopy_count, color: 'bg-blue-500' },
                    { label: 'Yellowing', val: recommendation.yellowing_count, color: 'bg-amber-500' },
                    { label: 'Dead / Missing', val: recommendation.dead_count, color: 'bg-red-500' },
                  ].map((item) => {
                    const total = (recommendation.healthy_count + recommendation.small_canopy_count + recommendation.yellowing_count + recommendation.dead_count) || 1;
                    const pct = ((item.val / total) * 100).toFixed(1);
                    return (
                      <div key={item.label} className="space-y-1.5">
                        <div className="flex justify-between items-center text-[13px] font-semibold text-slate-700">
                          <span className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${item.color}`} />
                            {item.label}
                          </span>
                          <span className="text-[#04211a] font-bold text-[13px]">{item.val.toLocaleString()} <span className="text-slate-400 text-[11px]">({pct}%)</span></span>
                        </div>
                        <div className="w-full bg-slate-50 h-1.5 rounded-full border border-slate-100 overflow-hidden">
                          <div className={`h-full rounded-full ${item.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )
        ) : (
          /* VRA History Table View when activeSubTab is 'History' */
          <div className="bg-white rounded-[10px] border border-slate-200 shadow-none overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-[#fcfbf7]">
              <h3 className="text-base font-extrabold text-[#04211a]">
                Riwayat Preskripsi (VRA History)
              </h3>
            </div>
            
            <div className="overflow-x-auto max-h-[480px] overflow-y-auto scroll-smooth">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fcfbf7] border-b border-slate-200 text-[11px] font-bold text-slate-450 uppercase tracking-widest sticky top-0 z-10 shadow-sm">
                    <th className="px-6 py-3 pl-6">Tanggal</th>
                    <th className="px-6 py-3">Zona / Blok</th>
                    <th className="px-6 py-3">Jumlah Pohon</th>
                    <th className="px-6 py-3">Prioritas Blok</th>
                    <th className="px-6 py-3 pr-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[13px] font-semibold text-slate-650">
                  {logs.map((log, i) => {
                    const total = log.trees;
                    const dead = Math.floor(total * 0.005);
                    const yellow = Math.floor(total * 0.03);
                    const prio = (yellow / total) * 100 > 30 || (dead / total) * 100 > 5 ? "Critical" :
                                 (yellow / total) * 100 > 15 || (dead / total) * 100 > 3 ? "High" : "Medium";
                    
                    return (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100/50">
                        <td className="px-6 py-4 font-semibold text-slate-400">{log.date}</td>
                        <td className="px-6 py-4 font-bold text-[#04211a] flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {log.block}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700">{total.toLocaleString()} pohon</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getBadgeStyles(prio)}`}>
                            {prio}
                          </span>
                        </td>
                        <td className="px-6 py-4 pr-6">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getBadgeStyles('COMPLETED')}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Completed
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </motion.div>
  );
}
