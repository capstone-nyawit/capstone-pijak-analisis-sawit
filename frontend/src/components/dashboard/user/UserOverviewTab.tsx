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

interface Log {
  id: string;
  date: string;
  block: string;
  trees: number;
  status: string;
  confidence: string;
  thumb: string;
  predictions?: any[];
}

interface Stats {
  totalTrees: number;
  healthy: number;
  smallCanopy: number;
  yellowing: number;
  deadMissing: number;
}
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
  const [isWideLayout, setIsWideLayout] = useState(false);

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
    switch (priority?.toUpperCase()) {
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

  const mainLog = logs[0];
  const getHighRes = (url: string) => {
    if (!url) return "";
    return url.replace('w=100', 'w=1200').replace('w=150', 'w=1200');
  };
  const cachedImg = mainLog ? localStorage.getItem(`analysis_img_${(mainLog.originalBlock || mainLog.block).toLowerCase()}`) : null;
  const lastImage = cachedImg || (mainLog ? getHighRes(mainLog.thumb) : "https://images.unsplash.com/photo-1627883907153-61b453e00cc2?q=80&w=2070&auto=format&fit=crop");

  const [imageRatio, setImageRatio] = useState<number | null>(null);

  useEffect(() => {
    if (!lastImage) return;
    const img = new Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      setImageRatio(ratio);
      setIsWideLayout(ratio > 1.2);
    };
    img.src = lastImage;
  }, [lastImage]);

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



  const renderBoundingBoxes = (isMini = false) => {
    if (!logs[0]?.predictions) return null;
    let preds: any[] = [];
    if (typeof logs[0].predictions === 'string') {
      try { preds = JSON.parse(logs[0].predictions); } catch (e) {}
    } else if (Array.isArray(logs[0].predictions)) {
      preds = logs[0].predictions;
    }

    return preds.map((pred: any, idx: number) => {
      const box = pred.box || pred.bbox;
      if (!box) return null;
      // Support normalized [x, y, w, h] or old [xmin, ymin, xmax, ymax]
      const [xmin, ymin, xmax, ymax] = box;
      
      let leftPct, topPct, widthPct, heightPct;
      
      if (xmin <= 1 && ymin <= 1 && xmax <= 1 && ymax <= 1) {
        // Normalized YOLO [x_topleft, y_topleft, w, h] (0.0 to 1.0)
        leftPct = xmin * 100;
        topPct = ymin * 100;
        widthPct = xmax * 100; // xmax is actually w
        heightPct = ymax * 100; // ymax is actually h
      } else {
        // Fallback for old/absolute format mapped to 1024
        const w = xmax > xmin ? xmax - xmin : xmax;
        const h = ymax > ymin ? ymax - ymin : ymax;
        leftPct = (xmin / 1024) * 100;
        topPct = (ymin / 1024) * 100;
        widthPct = (w / 1024) * 100;
        heightPct = (h / 1024) * 100;
      }

      
      const class_id = pred.class_id || pred.class;
      const score = (pred.score || pred.confidence || 0.90).toFixed(2);
      
      let borderColor = 'border-[#2eb886]/60'; // Premium teal border
      let bgColor = 'bg-[#2eb886]/10'; // Subtle fill
      let labelBg = 'bg-[#2eb886]/80';
      let labelColor = 'text-white';
      let labelText = isMini ? 'H' : 'Healthy';

      if (class_id === 0) { // Dead
        borderColor = 'border-red-500/60';
        bgColor = 'bg-red-500/10';
        labelBg = 'bg-red-500/80';
        labelColor = 'text-white';
        labelText = isMini ? 'D' : 'Dead';
      } else if (class_id === 4) { // Yellowing
        borderColor = 'border-amber-500/60';
        bgColor = 'bg-amber-500/10';
        labelBg = 'bg-amber-500/80';
        labelColor = 'text-white';
        labelText = isMini ? 'Y' : 'Yellow';
      } else if (class_id === 3) { // Small Canopy
        borderColor = 'border-blue-500/60';
        bgColor = 'bg-blue-500/10';
        labelBg = 'bg-blue-500/80';
        labelColor = 'text-white';
        labelText = isMini ? 'S' : 'Small';
      }

      return (
        <div 
          key={idx}
          className={`absolute border-2 ${borderColor} ${bgColor} transition-all duration-300 rounded-[2px] group hover:z-20`}
          style={{
            left: `${leftPct}%`,
            top: `${topPct}%`,
            width: `${widthPct}%`,
            height: `${heightPct}%`,
          }}
        >
          <span className={`absolute -top-4 left-[-2px] ${labelBg} ${labelColor} text-[8px] font-bold px-1 py-0.5 whitespace-nowrap z-10 hidden group-hover:block md:block`}>
            {labelText} {score}
          </span>
        </div>
      );
    });
  };

  return (
    <motion.div
      key="overview-pane"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* MAIN CONTENT: DYNAMIC LAYOUT BASED ON ASPECT RATIO */}
      {isWideLayout ? (
        <div className="space-y-6">
        
        {/* TOP: DETECTION OUTPUT (Gambar) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="w-full bg-[#0b1120] rounded-[24px] overflow-hidden shadow-xl relative"
        >
          {/* Floating Header */}
          <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
            <div className="flex items-center gap-4">
               {/* Block Name Badge */}
               <div className="bg-[#111827]/90 backdrop-blur-md border border-slate-700/50 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-lg pointer-events-auto">
                 <Activity className="w-5 h-5 text-emerald-400" />
                 <div>
                   <span className="text-white font-bold text-sm block leading-tight">{mainLog.block}</span>
                   <span className="text-emerald-400 font-bold text-[9px] uppercase tracking-widest mt-0.5 block">Live Detection</span>
                 </div>
               </div>
               
               {/* Info badges */}
               <div className="hidden md:flex items-center gap-2 pointer-events-auto">
                 <span className="bg-[#111827]/80 backdrop-blur-md border border-slate-700/50 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg">ALT: 120m</span>
                 <span className="bg-[#111827]/80 backdrop-blur-md border border-slate-700/50 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg">GSD: 2.5cm/px</span>
                 <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
                   <CheckCircle2 className="w-3.5 h-3.5" /> Scan Complete
                 </span>
               </div>
            </div>
            
            {/* Right Top Legend */}
            <div className="hidden md:block bg-[#111827]/90 backdrop-blur-md border border-slate-700/50 rounded-2xl p-3.5 shadow-lg pointer-events-auto">
               <div className="flex justify-between items-center mb-2.5 gap-6">
                 <span className="text-slate-400 font-bold text-[9px] uppercase tracking-widest">Model</span>
                 <span className="text-white font-bold text-[11px]">Nyawit-v4</span>
               </div>
               <div className="space-y-1.5">
                 <div className="flex justify-between items-center gap-6 text-[11px]">
                   <span className="text-slate-300 font-medium flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#2eb886]" /> Healthy</span>
                   <span className="text-white font-bold">{stats.totalTrees > 0 ? ((stats.healthy / stats.totalTrees) * 100).toFixed(0) : 0}%</span>
                 </div>
                 <div className="flex justify-between items-center gap-6 text-[11px]">
                   <span className="text-slate-300 font-medium flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Yellowing</span>
                   <span className="text-white font-bold">{stats.totalTrees > 0 ? ((stats.yellowing / stats.totalTrees) * 100).toFixed(0) : 0}%</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Floating Actions (Fullscreen) */}
          <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
            <button
              onClick={() => setIsFullscreen(true)}
              title="Lihat Fullscreen"
              className="p-3 rounded-full bg-[#111827]/80 backdrop-blur-md text-white/90 hover:bg-emerald-500 hover:text-white hover:scale-110 transition-all cursor-pointer shadow-lg border border-slate-700/50 flex items-center justify-center"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Image Container */}
          <div className="w-full flex justify-center items-center bg-[#0b1120] min-h-[400px] overflow-hidden rounded-[24px]">
            {/* Tight wrapper to ensure bounding boxes align perfectly */}
            <div className="relative inline-block max-w-full max-h-[75vh]">
               <img
                 src={lastImage}
                 alt="Detection output"
                 className="max-w-full max-h-[75vh] block"
                 onDragStart={(e) => e.preventDefault()}
               />
               <div className="absolute inset-0 pointer-events-none">
                 {renderBoundingBoxes()}
               </div>
            </div>
          </div>
        </motion.div>

        {/* BOTTOM: STAT CARDS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Hero Bar: Total Trees */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="col-span-2 lg:col-span-1 bg-white p-5 rounded-[16px] border border-slate-200 flex flex-col justify-between shadow-none"
          >
             <div className="flex items-center gap-2 mb-3">
               <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/50">
                 <Leaf className="w-4 h-4 text-slate-500" />
               </div>
               <h4 className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Total Trees</h4>
             </div>
             <div className="flex flex-col gap-1">
               <span className="text-3xl font-black text-slate-900 leading-none tracking-tight">{stats.totalTrees.toLocaleString()}</span>
               <span className="text-[11px] font-bold text-slate-400 mt-1 uppercase">Active Census</span>
             </div>
          </motion.div>

          {[
            { label: 'Healthy', val: stats.healthy, pct: stats.totalTrees > 0 ? ((stats.healthy / stats.totalTrees) * 100).toFixed(1) : '84.0', trend: '+2.4%', trendUp: true, dotColor: 'bg-[#2eb886]', textCol: 'text-[#2eb886]', bgHover: 'hover:border-[#2eb886]/30' },
            { label: 'Small Canopy', val: stats.smallCanopy, pct: stats.totalTrees > 0 ? ((stats.smallCanopy / stats.totalTrees) * 100).toFixed(1) : '12.0', trend: '-0.5%', trendUp: false, dotColor: 'bg-blue-500', textCol: 'text-blue-600', bgHover: 'hover:border-blue-500/30' },
            { label: 'Yellowing', val: stats.yellowing, pct: stats.totalTrees > 0 ? ((stats.yellowing / stats.totalTrees) * 100).toFixed(1) : '3.0', trend: '+12.4%', trendUp: false, dotColor: 'bg-amber-500', textCol: 'text-amber-600', isAlert: true, bgHover: 'hover:border-amber-500/30' },
            { label: 'Dead / Missing', val: stats.deadMissing, pct: stats.totalTrees > 0 ? ((stats.deadMissing / stats.totalTrees) * 100).toFixed(1) : '1.0', trend: '-2.1%', trendUp: true, dotColor: 'bg-red-500', textCol: 'text-red-600', bgHover: 'hover:border-red-500/30' },
          ].map((stat, i) => (
            <motion.div 
             key={stat.label}
             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.05) }}
             className={`bg-white p-5 rounded-[16px] border border-slate-200 flex flex-col justify-between shadow-none transition-colors ${stat.bgHover}`}
            >
               <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${stat.dotColor}`} />
                     <h4 className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</h4>
                  </div>
               </div>
               <div className="flex flex-col gap-2">
                 <span className={`text-3xl font-black ${stat.textCol} leading-none tracking-tight`}>{stat.val.toLocaleString()}</span>
                 <div className="flex justify-between items-center mt-1">
                   <span className="text-[11px] font-bold text-slate-400">{stat.pct}%</span>
                   <span className={`text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                      stat.isAlert 
                        ? 'bg-red-50 text-red-600' 
                        : 'bg-slate-50 text-slate-500'
                    }`}>
                      {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.trend}
                    </span>
                 </div>
               </div>
            </motion.div>
          ))}
        </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* LEFT COLUMN: DETECTION OUTPUT (Gambar) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-[10px] border border-slate-200 overflow-hidden shadow-none lg:sticky lg:top-6"
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

            {/* Compact Square Detection Viewer */}
            <div className="relative w-full bg-[#0b1120] overflow-hidden group flex justify-center items-center" style={{ aspectRatio: '1/1' }}>
                {/* Tight wrapper */}
                <div className="relative inline-block max-w-full max-h-full">
                  <img src={lastImage} alt="Main Block" className="max-w-full max-h-full object-contain transition-transform duration-1000 group-hover:scale-105" onDragStart={(e) => e.preventDefault()} />
                  
                  {/* Mini bounding boxes */}
                  <div className="absolute inset-0 pointer-events-none transition-transform duration-1000 group-hover:scale-105">
                    {renderBoundingBoxes(true)}
                  </div>
                </div>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 pointer-events-none z-10" />
                
                {/* Fullscreen button */}
                <button
                  onClick={() => setIsFullscreen(true)}
                  title="Lihat Fullscreen"
                  className="absolute top-4 right-4 z-20 p-2.5 rounded-xl bg-black/40 backdrop-blur-md text-white/90 hover:bg-black/80 hover:scale-110 transition-all cursor-pointer shadow-lg border border-white/10"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                
                {/* Bottom label */}
                <div className="absolute bottom-5 left-5 right-5 z-20 flex justify-between items-end">
                  <div>
                    <span className="text-white font-black text-3xl block leading-none tracking-tight drop-shadow-md">{stats.totalTrees.toLocaleString()}</span>
                    <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-1 block">Objek Terdeteksi</span>
                  </div>
                </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: STAT CARDS */}
          <div className="space-y-4">
            {/* Hero Bar: Total Trees */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
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
        </div>
      )}

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
                  const displayStatus = row.status?.toUpperCase() === 'FLAGGED' ? 'Pending' : (row.status || 'Completed');
                  
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
              className="fixed inset-0 z-[99999] bg-[#0b1120]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
              onClick={() => setIsFullscreen(false)}
            >
              <button 
                className="absolute top-6 right-6 text-white/70 hover:text-white bg-[#111827]/80 p-3 rounded-full transition-all hover:scale-110 border border-slate-700/50 cursor-pointer z-50 shadow-xl"
                onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
                title="Close Fullscreen"
              >
                <X className="w-6 h-6" />
              </button>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative max-w-full max-h-full inline-block flex justify-center items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative inline-block max-w-[90vw] max-h-[90vh]">
                  <img 
                    src={logs[0] ? (localStorage.getItem(`analysis_img_${(logs[0].originalBlock || logs[0].block).toLowerCase()}`) || logs[0].thumb) : ""} 
                    alt="Fullscreen Preview" 
                    className="max-w-full max-h-[90vh] block rounded-xl shadow-2xl border border-slate-800"
                    onDragStart={(e) => e.preventDefault()}
                  />
                  <div className="absolute inset-0 pointer-events-none">
                    {renderBoundingBoxes(false)}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}
