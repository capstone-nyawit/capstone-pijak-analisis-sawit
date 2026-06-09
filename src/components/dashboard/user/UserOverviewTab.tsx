/**
 * User Overview Tab - Dashboard Overview
 * Displays live detection bounding boxes, KPIs, priority zones, tree health statistics, and recent inference history.
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, Leaf, Activity, CheckCircle2, ArrowUpRight, ArrowDownRight, 
  AlertTriangle, Map, PlaySquare, MapPin, Maximize2, X, Zap
} from 'lucide-react';

interface UserOverviewTabProps {
  logs: any[];
  stats: any;
  priorityZones?: any[];
  setActiveTab: (tab: 'Overview' | 'Inference' | 'Tree Health' | 'VRA' | 'Logs' | 'Reports' | 'Settings') => void;
  triggerNewAnalysis: () => void;
}

export default function UserOverviewTab({ logs, stats, priorityZones = [], setActiveTab, triggerNewAnalysis }: UserOverviewTabProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDetectionFullscreen, setIsDetectionFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
        setIsDetectionFullscreen(false);
      }
    };
    if (isFullscreen || isDetectionFullscreen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, isDetectionFullscreen]);

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

  if (logs.length === 0) {
    return (
      <motion.div
        key="overview-empty-state"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3 }}
        className="min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-white rounded-[10px] border border-slate-200 shadow-none max-w-2xl mx-auto my-12"
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

  const mainLog = logs[0];
  const getHighRes = (url: string) => {
    if (!url) return "";
    return url.replace('w=100', 'w=1200').replace('w=150', 'w=1200');
  };
  const cachedImg = mainLog ? localStorage.getItem(`analysis_img_${(mainLog.originalBlock || mainLog.block).toLowerCase()}`) : null;
  const lastImage = cachedImg || (mainLog ? getHighRes(mainLog.thumb) : "https://images.unsplash.com/photo-1627883907153-61b453e00cc2?q=80&w=2070&auto=format&fit=crop");

  return (
    <motion.div
      key="overview-pane"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* 1. HERO PREVIEW SECTION */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        className="bg-slate-900 rounded-[10px] border border-slate-200 overflow-hidden flex flex-col relative"
      >
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none"></div>
        
        {/* Large detection output viewer */}
        <div className="relative flex-1 h-[420px] overflow-hidden group">
          {/* Simulated Aerial Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: `url('${lastImage}')` }}
          ></div>

          {/* Top Header / Metadata Overlay */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
            <div className="flex items-center gap-2">
              <div className="bg-black/60 backdrop-blur-md border border-white/10 p-2.5 rounded-lg flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                <div>
                  <h3 className="text-white font-bold text-xs leading-none">{mainLog.block}</h3>
                  <p className="text-emerald-400/80 text-[8px] font-bold uppercase tracking-widest mt-0.5">Live Detection</p>
                </div>
              </div>
              <div className="hidden md:flex gap-1.5">
                <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] font-mono font-bold px-2 py-1.5 rounded-md">
                  ALT: 120m
                </span>
                <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] font-mono font-bold px-2 py-1.5 rounded-md">
                  GSD: 2.5cm/px
                </span>
              </div>
            </div>

            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-md flex items-center gap-1 backdrop-blur-md">
              <CheckCircle2 className="w-3 h-3" /> Scan Complete
            </span>
          </div>

          {/* Mini Legend Overlay inside the UAV viewer (left bottom) */}
          <div className="absolute bottom-4 left-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-3 text-[11px] text-white/95">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Healthy</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Small Canopy</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Yellowing</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Dead</span>
            </div>
          </div>

          {/* Bottom gradient for depth */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />

          {/* Detection Bounding Boxes */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-10 transition-opacity">
            {/* Healthy boxes */}
            <div className="absolute top-[12%] left-[8%] w-24 h-24 border-2 border-emerald-400 bg-emerald-500/10 rounded shadow-[0_0_16px_rgba(16,185,129,0.4)] backdrop-blur-[0.5px]">
              <span className="absolute -top-5 left-[-1px] bg-emerald-500 text-[#04211a] text-[9px] font-bold px-1.5 py-0.5 rounded-t shadow flex items-center gap-1">H <span className="font-mono">0.98</span></span>
            </div>
            <div className="absolute top-[45%] left-[18%] w-20 h-20 border-2 border-emerald-400 bg-emerald-500/10 rounded shadow-[0_0_14px_rgba(16,185,129,0.3)] backdrop-blur-[0.5px]">
              <span className="absolute -top-5 left-[-1px] bg-emerald-500 text-[#04211a] text-[9px] font-bold px-1.5 py-0.5 rounded-t shadow flex items-center gap-1">H <span className="font-mono">0.95</span></span>
            </div>
            <div className="absolute top-[20%] left-[35%] w-24 h-24 border-2 border-emerald-400 bg-emerald-500/10 rounded shadow-[0_0_14px_rgba(16,185,129,0.3)] backdrop-blur-[0.5px]">
              <span className="absolute -top-5 left-[-1px] bg-emerald-500 text-[#04211a] text-[9px] font-bold px-1.5 py-0.5 rounded-t shadow flex items-center gap-1">H <span className="font-mono">0.97</span></span>
            </div>
            <div className="absolute top-[58%] left-[55%] w-20 h-20 border-2 border-emerald-400 bg-emerald-500/10 rounded backdrop-blur-[0.5px]">
              <span className="absolute -top-5 left-[-1px] bg-emerald-500 text-[#04211a] text-[9px] font-bold px-1.5 py-0.5 rounded-t shadow flex items-center gap-1">H <span className="font-mono">0.93</span></span>
            </div>
            <div className="absolute top-[10%] left-[55%] w-20 h-20 border-2 border-emerald-400 bg-emerald-500/10 rounded backdrop-blur-[0.5px]">
              <span className="absolute -top-5 left-[-1px] bg-emerald-500 text-[#04211a] text-[9px] font-bold px-1.5 py-0.5 rounded-t shadow flex items-center gap-1">H <span className="font-mono">0.96</span></span>
            </div>
            {/* Small Canopy */}
            <div className="absolute top-[65%] left-[28%] w-16 h-16 border-2 border-blue-400 bg-blue-500/15 rounded shadow-[0_0_14px_rgba(59,130,246,0.4)] backdrop-blur-[0.5px]">
              <span className="absolute -top-5 left-[-1px] bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-t shadow flex items-center gap-1">S <span className="font-mono">0.91</span></span>
            </div>
            <div className="absolute top-[30%] left-[80%] w-16 h-16 border-2 border-blue-400 bg-blue-500/15 rounded shadow-[0_0_12px_rgba(59,130,246,0.3)] backdrop-blur-[0.5px]">
              <span className="absolute -top-5 left-[-1px] bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-t shadow flex items-center gap-1">S <span className="font-mono">0.87</span></span>
            </div>
            {/* Yellowing */}
            <div className="absolute top-[15%] left-[68%] w-18 h-18 border-2 border-amber-400 bg-amber-50/20 rounded shadow-[0_0_16px_rgba(245,158,11,0.5)] backdrop-blur-[0.5px]">
              <span className="absolute -top-5 left-[-1px] bg-amber-500 text-amber-950 text-[9px] font-bold px-1.5 py-0.5 rounded-t shadow flex items-center gap-1">Y <span className="font-mono">0.88</span></span>
            </div>
            <div className="absolute top-[50%] left-[72%] w-16 h-16 border-2 border-amber-400 bg-amber-50/20 rounded shadow-[0_0_14px_rgba(245,158,11,0.4)] backdrop-blur-[0.5px]">
              <span className="absolute -top-5 left-[-1px] bg-amber-500 text-amber-950 text-[9px] font-bold px-1.5 py-0.5 rounded-t shadow flex items-center gap-1">Y <span className="font-mono">0.82</span></span>
            </div>
            {/* Dead (Critical) */}
            <div className="absolute top-[38%] left-[44%] w-14 h-14 border-2 border-red-500 bg-red-50/30 rounded shadow-[0_0_18px_rgba(239,68,68,0.6)] backdrop-blur-[1px]">
              <span className="absolute -top-5 left-[-1px] bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-t shadow flex items-center gap-1">D <span className="font-mono">0.96</span></span>
            </div>
            <div className="absolute top-[70%] left-[82%] w-12 h-12 border-2 border-red-500 bg-red-50/30 rounded shadow-[0_0_14px_rgba(239,68,68,0.5)] backdrop-blur-[1px]">
              <span className="absolute -top-5 left-[-1px] bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-t shadow flex items-center gap-1">D <span className="font-mono">0.91</span></span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 z-20 flex gap-3">
            <button 
              onClick={() => setIsFullscreen(true)}
              title="Full Image Preview"
              className="p-2.5 rounded-full bg-black/20 backdrop-blur-sm text-white/90 hover:bg-black/40 hover:text-white hover:scale-110 transition-all flex items-center justify-center cursor-pointer active:scale-95 border border-white/10"
            >
              <Maximize2 className="w-5 h-5 drop-shadow-md" />
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* 2. DETECTION OUTPUT PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
        className="bg-white rounded-[10px] border border-slate-200 overflow-hidden shadow-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-[#fcfbf7]">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-extrabold text-[#04211a]">Detection Output</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-full">
              {mainLog.block}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400">Analisis: {mainLog.date}</span>
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Selesai
            </span>
          </div>
        </div>

        {/* Full-width detection image */}
        <div className="relative w-full h-[480px] bg-slate-900 overflow-hidden group">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-90"
              style={{ backgroundImage: `url('${lastImage}')` }}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            {/* Mini bounding boxes */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[12%] left-[10%] w-14 h-14 border-2 border-emerald-400 bg-emerald-500/10 rounded">
                <span className="absolute -top-5 left-0 bg-emerald-500 text-[9px] font-bold text-[#04211a] px-1.5 py-0.5 rounded-t">H 0.98</span>
              </div>
              <div className="absolute top-[40%] left-[30%] w-12 h-12 border-2 border-emerald-400 bg-emerald-500/10 rounded">
                <span className="absolute -top-5 left-0 bg-emerald-500 text-[9px] font-bold text-[#04211a] px-1.5 py-0.5 rounded-t">H 0.95</span>
              </div>
              <div className="absolute top-[18%] left-[65%] w-12 h-12 border-2 border-amber-400 bg-amber-400/20 rounded shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                <span className="absolute -top-5 left-0 bg-amber-500 text-[9px] font-bold text-amber-950 px-1.5 py-0.5 rounded-t">Y 0.88</span>
              </div>
              <div className="absolute top-[55%] left-[55%] w-10 h-10 border-2 border-red-500 bg-red-500/20 rounded shadow-[0_0_12px_rgba(239,68,68,0.5)]">
                <span className="absolute -top-5 left-0 bg-red-500 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-t">D 0.96</span>
              </div>
              <div className="absolute top-[60%] left-[18%] w-10 h-10 border-2 border-blue-400 bg-blue-500/15 rounded">
                <span className="absolute -top-5 left-0 bg-blue-500 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-t">S 0.91</span>
              </div>
              <div className="absolute top-[30%] left-[80%] w-10 h-10 border-2 border-blue-400 bg-blue-500/15 rounded">
                <span className="absolute -top-5 left-0 bg-blue-500 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-t">S 0.87</span>
              </div>
              <div className="absolute top-[72%] left-[42%] w-10 h-10 border-2 border-amber-400 bg-amber-400/20 rounded shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                <span className="absolute -top-5 left-0 bg-amber-500 text-[9px] font-bold text-amber-950 px-1.5 py-0.5 rounded-t">Y 0.82</span>
              </div>
            </div>
            {/* Fullscreen button */}
            <button
              onClick={() => setIsDetectionFullscreen(true)}
              title="Lihat Fullscreen"
              className="absolute top-3 right-3 z-20 p-2 rounded-lg bg-black/40 backdrop-blur-sm text-white/80 hover:bg-black/70 hover:text-white hover:scale-110 transition-all cursor-pointer border border-white/10 flex items-center gap-1.5"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="text-[10px] font-bold">Fullscreen</span>
            </button>
            {/* Bottom label */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end">
              <div>
                <span className="text-white font-extrabold text-2xl block leading-none drop-shadow">{stats.totalTrees.toLocaleString()}</span>
                <span className="text-white/70 text-[11px] font-semibold">objek terdeteksi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-black/50 backdrop-blur-sm text-white/80 text-[10px] font-mono font-bold px-2 py-1 rounded border border-white/10">CONF &gt; 0.80</span>
                <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">YOLOv8</span>
              </div>
            </div>
        </div>
      </motion.div>

      {/* Detection Output Fullscreen Portal */}
      {createPortal(
        <AnimatePresence>
          {isDetectionFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-sm flex flex-col"
              onClick={() => setIsDetectionFullscreen(false)}
            >
              {/* Fullscreen Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-extrabold text-base">Detection Output — {mainLog.block}</span>
                  <span className="text-slate-400 text-[11px] font-semibold">{mainLog.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full">YOLOv8 · CONF &gt; 0.80</span>
                  <button
                    onClick={() => setIsDetectionFullscreen(false)}
                    className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer border border-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Fullscreen Image */}
              <div className="flex-1 relative overflow-hidden" onClick={e => e.stopPropagation()}>
                <motion.div
                  initial={{ scale: 0.97, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.97, opacity: 0 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${lastImage}')` }}
                />
                {/* Fullscreen bounding boxes */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-[12%] left-[8%] w-24 h-24 border-2 border-emerald-400 bg-emerald-500/10 rounded-sm shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                    <span className="absolute -top-6 left-0 bg-emerald-500 text-[11px] font-bold text-[#04211a] px-2 py-0.5 rounded-t">Healthy · 0.98</span>
                  </div>
                  <div className="absolute top-[40%] left-[25%] w-20 h-20 border-2 border-emerald-400 bg-emerald-500/10 rounded-sm">
                    <span className="absolute -top-6 left-0 bg-emerald-500 text-[11px] font-bold text-[#04211a] px-2 py-0.5 rounded-t">Healthy · 0.95</span>
                  </div>
                  <div className="absolute top-[10%] left-[52%] w-20 h-20 border-2 border-emerald-400 bg-emerald-500/10 rounded-sm">
                    <span className="absolute -top-6 left-0 bg-emerald-500 text-[11px] font-bold text-[#04211a] px-2 py-0.5 rounded-t">Healthy · 0.96</span>
                  </div>
                  <div className="absolute top-[55%] left-[60%] w-20 h-20 border-2 border-emerald-400 bg-emerald-500/10 rounded-sm">
                    <span className="absolute -top-6 left-0 bg-emerald-500 text-[11px] font-bold text-[#04211a] px-2 py-0.5 rounded-t">Healthy · 0.93</span>
                  </div>
                  <div className="absolute top-[18%] left-[70%] w-16 h-16 border-2 border-amber-400 bg-amber-400/20 rounded-sm shadow-[0_0_18px_rgba(245,158,11,0.5)]">
                    <span className="absolute -top-6 left-0 bg-amber-500 text-[11px] font-bold text-amber-950 px-2 py-0.5 rounded-t">Yellowing · 0.88</span>
                  </div>
                  <div className="absolute top-[65%] left-[38%] w-16 h-16 border-2 border-amber-400 bg-amber-400/20 rounded-sm shadow-[0_0_14px_rgba(245,158,11,0.4)]">
                    <span className="absolute -top-6 left-0 bg-amber-500 text-[11px] font-bold text-amber-950 px-2 py-0.5 rounded-t">Yellowing · 0.82</span>
                  </div>
                  <div className="absolute top-[38%] left-[44%] w-14 h-14 border-2 border-red-500 bg-red-500/20 rounded-sm shadow-[0_0_20px_rgba(239,68,68,0.6)]">
                    <span className="absolute -top-6 left-0 bg-red-500 text-[11px] font-bold text-white px-2 py-0.5 rounded-t">Dead · 0.96</span>
                  </div>
                  <div className="absolute top-[72%] left-[80%] w-12 h-12 border-2 border-red-500 bg-red-500/20 rounded-sm shadow-[0_0_16px_rgba(239,68,68,0.5)]">
                    <span className="absolute -top-6 left-0 bg-red-500 text-[11px] font-bold text-white px-2 py-0.5 rounded-t">Dead · 0.91</span>
                  </div>
                  <div className="absolute top-[60%] left-[14%] w-14 h-14 border-2 border-blue-400 bg-blue-500/15 rounded-sm shadow-[0_0_14px_rgba(59,130,246,0.4)]">
                    <span className="absolute -top-6 left-0 bg-blue-500 text-[11px] font-bold text-white px-2 py-0.5 rounded-t">Small Canopy · 0.91</span>
                  </div>
                  <div className="absolute top-[28%] left-[82%] w-12 h-12 border-2 border-blue-400 bg-blue-500/15 rounded-sm">
                    <span className="absolute -top-6 left-0 bg-blue-500 text-[11px] font-bold text-white px-2 py-0.5 rounded-t">Small Canopy · 0.87</span>
                  </div>
                </div>
                {/* Bottom stats bar */}
                <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-sm border-t border-white/10 px-6 py-3 flex items-center gap-6" onClick={e => e.stopPropagation()}>
                  {[
                    { label: 'Healthy', count: stats.healthy, color: 'text-emerald-400', dot: 'bg-emerald-500' },
                    { label: 'Small Canopy', count: stats.smallCanopy, color: 'text-blue-400', dot: 'bg-blue-500' },
                    { label: 'Yellowing', count: stats.yellowing, color: 'text-amber-400', dot: 'bg-amber-500' },
                    { label: 'Dead / Missing', count: stats.deadMissing, color: 'text-red-400', dot: 'bg-red-500' },
                  ].map(s => (
                    <div key={s.label} className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                      <span className="text-white/60 text-[11px] font-semibold">{s.label}</span>
                      <span className={`font-extrabold text-sm ${s.color}`}>{s.count.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="ml-auto text-white/40 text-[10px] font-semibold">Tekan ESC untuk menutup</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* 3. RESTUCTURED STAT CARDS: 1 HERO + 2x2 GRID */}
      <div className="space-y-4">
        {/* Hero Bar: Total Trees */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white px-6 py-4 rounded-[10px] border border-slate-200 flex items-center justify-between shadow-none"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/50">
              <Leaf className="w-4 h-4 text-[#04211a]" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-slate-500">TOTAL TREES</h4>
              <p className="text-[11px] font-semibold text-slate-400 block mt-0.5">Sensus populasi kelapa sawit aktif</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[28px] font-extrabold text-[#04211a] leading-none tracking-tight">{stats.totalTrees.toLocaleString()}</span>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200/50 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-450" />
              +1.2%
            </span>
          </div>
        </motion.div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Healthy', val: stats.healthy, pct: stats.totalTrees > 0 ? ((stats.healthy / stats.totalTrees) * 100).toFixed(1) : '84.0', trend: '+2.4%', trendUp: true, dotColor: 'bg-emerald-500' },
            { label: 'Small Canopy', val: stats.smallCanopy, pct: stats.totalTrees > 0 ? ((stats.smallCanopy / stats.totalTrees) * 100).toFixed(1) : '12.0', trend: '-0.5%', trendUp: false, dotColor: 'bg-blue-500' },
            { label: 'Yellowing', val: stats.yellowing, pct: stats.totalTrees > 0 ? ((stats.yellowing / stats.totalTrees) * 100).toFixed(1) : '3.0', trend: '+12.4%', trendUp: false, dotColor: 'bg-amber-500', isAlert: true },
            { label: 'Dead / Missing', val: stats.deadMissing, pct: stats.totalTrees > 0 ? ((stats.deadMissing / stats.totalTrees) * 100).toFixed(1) : '1.0', trend: '-2.1%', trendUp: true, dotColor: 'bg-red-500' },
          ].map((stat, i) => (
            <motion.div 
             key={stat.label}
             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.05) }}
             className="bg-white p-5 rounded-[10px] border border-slate-200 flex flex-col justify-between shadow-none"
            >
               <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                     <span className={`w-2.5 h-2.5 rounded-full ${stat.dotColor}`} />
                     <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</h4>
                  </div>
                  {/* Color trend semantik hanya jika alert / perubahan besar (>10%) */}
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-0.5 ${
                    stat.isAlert 
                      ? getBadgeStyles('MEDIUM') 
                      : 'text-slate-505 bg-slate-50 border border-slate-200/50'
                  }`}>
                    {stat.trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {stat.trend}
                  </span>
               </div>
               <div className="flex items-baseline gap-2">
                 <span className="text-[28px] font-extrabold text-slate-900 leading-none tracking-tight">{stat.val.toLocaleString()}</span>
                 <span className="text-[11px] font-semibold text-slate-400">({stat.pct}%)</span>
               </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* 3. TREE HEALTH STATISTICS (Standing alone, wider: xl:col-span-1) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-[10px] border border-slate-200 shadow-none flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-extrabold text-[#04211a]">
                Tree Health Statistics
              </h3>
              <button 
                onClick={() => setActiveTab('Tree Health')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer border-none bg-transparent"
              >
                View Details
              </button>
            </div>
            
            <div className="space-y-5">
              {[
                { label: 'Healthy', val: stats.healthy, color: 'bg-emerald-500' },
                { label: 'Small Canopy', val: stats.smallCanopy, color: 'bg-blue-500' },
                { label: 'Yellowing', val: stats.yellowing, color: 'bg-amber-500' },
                { label: 'Dead / Missing', val: stats.deadMissing, color: 'bg-red-500' },
              ].map((item) => {
                const total = stats.totalTrees || 1;
                const pct = ((item.val / total) * 100).toFixed(1);
                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between items-center text-[13px] font-semibold text-slate-700">
                      <span className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
                        {item.label}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">{item.val.toLocaleString()} <span className="text-slate-400">({pct}%)</span></span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 mt-6 flex justify-between items-center">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Condition Index</span>
            <span className="text-[11px] font-bold text-emerald-750 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
              {stats.totalTrees > 0 ? ((stats.healthy / stats.totalTrees) * 100).toFixed(1) : '84.0'}% Good
            </span>
          </div>
        </motion.div>

        {/* 4. MERGED PRIORITY & VRA PANEL (xl:col-span-2) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="xl:col-span-2 bg-white p-6 rounded-[10px] border border-slate-200 shadow-none flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-extrabold text-[#04211a]">
              Priority & VRA Recommendations
            </h3>
            <button onClick={() => setActiveTab('VRA')} className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer border-none bg-transparent">View Plans</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            {/* Left side: Priority Zone Analysis */}
            <div className="space-y-4 flex flex-col justify-start">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Priority Zones</span>
              <div className="space-y-3">
                {priorityZones && priorityZones.length > 0 ? (
                  priorityZones.map((zone: any) => {
                    const theme: any = {
                      'Critical': { borderL: 'border-l-red-500', bg: 'bg-red-50/10' },
                      'High': { borderL: 'border-l-amber-500', bg: 'bg-amber-50/10' },
                      'Medium': { borderL: 'border-l-blue-500', bg: 'bg-blue-50/10' },
                      'Low': { borderL: 'border-l-emerald-500', bg: 'bg-emerald-50/10' }
                    }[zone.priority] || { borderL: 'border-l-slate-500', bg: 'bg-slate-50/10' };

                    return (
                      <div key={zone.block} className={`p-4 rounded-[10px] border-l-4 ${theme.borderL} ${theme.bg} border-r border-y border-slate-200`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[13px] font-bold text-slate-800">{zone.block}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getBadgeStyles(zone.priority)}`}>
                            {zone.priority}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                          {zone.primary_concern !== 'None' ? zone.primary_concern : 'Kondisi tajuk relatif sehat.'}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 rounded-[10px] border-l-4 border-l-emerald-500 bg-emerald-50/50 border-r border-y border-slate-200 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="text-[13px] font-bold text-emerald-950 block">Seluruh Zona Aman</span>
                      <span className="text-[11px] font-semibold text-emerald-800/80">Tidak ada zona dengan prioritas tinggi saat ini.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right side: VRA recommendations */}
            <div className="space-y-4 flex flex-col justify-start">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Prescriptions</span>
              <div className="space-y-3">
                {(() => {
                  const total = stats.totalTrees || 1;
                  const pctDead = (stats.deadMissing / total) * 100;
                  const pctYellow = (stats.yellowing / total) * 100;
                  const pctSmall = (stats.smallCanopy / total) * 100;

                  const getPrioDead = (pct: number) => {
                    if (pct > 5.0) return 'Critical';
                    if (pct > 3.0) return 'High';
                    if (pct > 1.0) return 'Medium';
                    return 'Low';
                  };

                  const getPrioOther = (pct: number) => {
                    if (pct > 30.0) return 'Critical';
                    if (pct > 15.0) return 'High';
                    if (pct > 5.0) return 'Medium';
                    return 'Low';
                  };

                  const recs = [];
                  const deadPrio = getPrioDead(pctDead);
                  if (deadPrio !== 'Low') {
                    recs.push({
                      program: 'Replanting Assessment',
                      priority: deadPrio,
                      desc: `Evaluasi area untuk penanaman sawit baru pada ${stats.deadMissing.toLocaleString()} titik kosong (${pctDead.toFixed(1)}%).`,
                      theme: { borderLeft: 'border-l-red-500', bg: 'bg-red-50/40', badgeBg: 'bg-red-50 border-red-200', badgeText: 'text-red-750', icon: AlertTriangle, iconColor: 'text-red-650' }
                    });
                  }

                  const yellowPrio = getPrioOther(pctYellow);
                  if (yellowPrio !== 'Low') {
                    recs.push({
                      program: 'Corrective Fertilization',
                      priority: yellowPrio,
                      desc: `Dosis mikro korektif untuk mengatasi defisiensi hara pada ${stats.yellowing.toLocaleString()} pohon (${pctYellow.toFixed(1)}%).`,
                      theme: { borderLeft: 'border-l-amber-500', bg: 'bg-amber-50/40', badgeBg: 'bg-amber-50 border-amber-200', badgeText: 'text-amber-750', icon: Zap, iconColor: 'text-amber-650' }
                    });
                  }

                  const smallPrio = getPrioOther(pctSmall);
                  if (smallPrio !== 'Low') {
                    recs.push({
                      program: 'Growth Enhancement',
                      priority: smallPrio,
                      desc: `NPK booster untuk pacu perluasan kanopi pada ${stats.smallCanopy.toLocaleString()} pohon (${pctSmall.toFixed(1)}%).`,
                      theme: { borderLeft: 'border-l-blue-500', bg: 'bg-blue-50/40', badgeBg: 'bg-blue-50 border-blue-200', badgeText: 'text-blue-750', icon: Leaf, iconColor: 'text-blue-650' }
                    });
                  }

                  const pMap: any = { 'Critical': 3, 'High': 2, 'Medium': 1 };
                  recs.sort((a, b) => pMap[b.priority] - pMap[a.priority]);

                  if (recs.length === 0) {
                    return (
                      <div className="p-4 rounded-[10px] border border-slate-200 bg-slate-50 flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <div>
                          <span className="text-[13px] font-bold text-slate-800 block">Routine Monitoring</span>
                          <span className="text-[11px] font-semibold text-slate-500">Kebun sehat. Lakukan pemupukan rutin standar.</span>
                        </div>
                      </div>
                    );
                  }

                  return recs.map((rec, i) => {
                    const Icon = rec.theme.icon;
                    return (
                      <div key={i} className={`p-4 rounded-[10px] border-l-4 ${rec.theme.borderLeft} border-r border-y border-slate-200 ${rec.theme.bg}`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[13px] font-bold text-[#04211a] flex items-center gap-1.5">
                            <Icon className={`w-3.5 h-3.5 ${rec.theme.iconColor}`} />
                            {rec.program}
                          </span>
                          <span className={`px-2 py-0.5 ${getBadgeStyles(rec.priority)} text-[10px] font-bold rounded border uppercase`}>
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-550 leading-relaxed">
                          {rec.desc}
                        </p>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 5. RECENT ANALYSIS / HISTORY */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.6 }}
        className="bg-white rounded-[10px] border border-slate-200 shadow-none overflow-hidden flex flex-col"
      >
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-[#fcfbf7]">
          <h3 className="text-base font-extrabold text-[#04211a]">Recent Inference Logs</h3>
          <button 
            onClick={() => setActiveTab('Logs')}
            className="text-xs font-bold text-[#04211a] hover:text-emerald-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-none cursor-pointer active:scale-95 transition-all"
          >
            View All Logs
          </button>
        </div>
        
        <div className="overflow-x-auto max-h-[320px] overflow-y-auto scroll-smooth">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fcfbf7] border-b border-slate-200 sticky top-0 z-10 shadow-sm text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-3 pl-6 w-20">Preview</th>
                <th className="px-6 py-3">Analysis ID</th>
                <th className="px-6 py-3">Block / Zone</th>
                <th className="px-6 py-3 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] font-semibold">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm font-medium text-slate-400 bg-white">
                    No data available
                  </td>
                </tr>
              ) : (
                logs.map((row) => {
                  const displayStatus = row.status.toUpperCase() === 'FLAGGED' ? 'Pending' : row.status;
                  
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-3.5">
                        <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden relative border border-slate-200 shadow-none">
                          <img src={localStorage.getItem(`analysis_img_${(row.originalBlock || row.block).toLowerCase()}`) || row.thumb} alt={row.id} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-0 bg-[#04211a]/10"></div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="font-bold text-[#04211a] block">{row.id}</span>
                        <span className="text-[11px] font-semibold text-slate-400">{row.date}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="font-bold text-slate-700 block">{row.block}</span>
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mt-1 inline-block">
                          {row.trees} trees • Conf {row.confidence}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 pr-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                          displayStatus.toLowerCase() === 'completed' 
                            ? getBadgeStyles('COMPLETED') 
                            : getBadgeStyles('MEDIUM')
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            displayStatus.toLowerCase() === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}></span>
                          {displayStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {createPortal(
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-12"
              onClick={() => setIsFullscreen(false)}
            >
              <button 
                className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-all hover:scale-110 border-none cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
              >
                <X className="w-8 h-8" />
              </button>
              <motion.img 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                src={logs[0] ? (localStorage.getItem(`analysis_img_${(logs[0].originalBlock || logs[0].block).toLowerCase()}`) || logs[0].thumb) : ""} 
                alt="Fullscreen Preview" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}
