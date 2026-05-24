/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Map, 
  TreePalm, 
  Sprout, 
  FileText, 
  FileSpreadsheet,
  LogOut, 
  Search, 
  Bell, 
  Calendar, 
  ChevronDown, 
  Download, 
  MoreHorizontal,
  CloudLightning,
  Trash2,
  AlertTriangle,
  PlaySquare,
  Users,
  User,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CheckCircle2,
  Image as ImageIcon,
  Upload,
  RefreshCcw,
  Brain,
  Check,
  Loader2,
  MapPin,
  TrendingUp,
  Droplets,
  Clock,
  Eye,
  Target,
  Zap,
  Beaker,
  Leaf
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import TreeHealthTab from '../components/dashboard/user/TreeHealthTab';
import VRAToolsTab from '../components/dashboard/user/VRAToolsTab';
import UserOverviewTab from '../components/dashboard/user/UserOverviewTab';
import InferenceTab from '../components/dashboard/user/InferenceTab';
import UserLogsTab from '../components/dashboard/user/UserLogsTab';
import UserReportsTab from '../components/dashboard/user/UserReportsTab';

// Mock Data
const classDistribution = [
  { name: 'Healthy', value: 8420, color: '#10b981' }, // emerald-500
  { name: 'Small', value: 1240, color: '#3b82f6' }, // blue-500
  { name: 'Yellow', value: 315, color: '#f59e0b' }, // amber-500
  { name: 'Dead', value: 45, color: '#ef4444' } // red-500
];

const riskHeatmap = [
  { id: 'N-01', risk: 'low' }, { id: 'N-02', risk: 'low' }, { id: 'N-03', risk: 'medium' }, { id: 'N-04', risk: 'low' },
  { id: 'S-01', risk: 'medium' }, { id: 'S-02', risk: 'critical' }, { id: 'S-03', risk: 'medium' }, { id: 'S-04', risk: 'low' },
  { id: 'E-01', risk: 'low' }, { id: 'E-02', risk: 'medium' }, { id: 'E-03', risk: 'low' }, { id: 'E-04', risk: 'low' },
];

const initialHistory = [
  { id: 'ANL-2391', date: 'Oct 24, 2026', block: 'Block A - North', trees: 2450, status: 'Completed', confidence: '94.2%', thumb: 'https://images.unsplash.com/photo-1627883907153-61b453e00cc2?auto=format&fit=crop&w=100&q=80' },
  { id: 'ANL-2390', date: 'Oct 23, 2026', block: 'Block C - East', trees: 3150, status: 'Completed', confidence: '89.1%', thumb: 'https://images.unsplash.com/photo-1589920153093-fa1199321fde?auto=format&fit=crop&w=100&q=80' },
  { id: 'ANL-2389', date: 'Oct 20, 2026', block: 'Block B - South', trees: 1840, status: 'Completed', confidence: '96.5%', thumb: 'https://images.unsplash.com/photo-1611326490697-7c703b44bdf9?auto=format&fit=crop&w=100&q=80' },
  { id: 'ANL-2388', date: 'Oct 18, 2026', block: 'Block D - West', trees: 2580, status: 'Reviewed', confidence: '91.8%', thumb: 'https://images.unsplash.com/photo-1590682121342-eb4c798725ee?auto=format&fit=crop&w=100&q=80' }
];

const initialReports = [
  {
    id: 'REP-B05',
    block: 'Block B-05',
    date: 'Oct 24, 2026',
    totalTrees: 2450,
    healthy: 2100,
    yellowing: 300,
    dead: 50,
    analysisDate: 'Oct 24, 2026',
    thumb: 'https://images.unsplash.com/photo-1627883907153-61b453e00cc2?auto=format&fit=crop&w=150&q=80',
    satelliteMap: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80',
    highPriority: [
      { id: 'T-124', condition: 'Dead', coords: '(1.2345, 103.4567)' },
      { id: 'T-356', condition: 'Yellow', coords: '(1.2389, 103.4591)' },
      { id: 'T-098', condition: 'Dead', coords: '(1.2402, 103.4612)' },
      { id: 'T-521', condition: 'Yellow', coords: '(1.2430, 103.4645)' },
    ]
  },
  {
    id: 'REP-A12',
    block: 'Block A-12',
    date: 'Oct 26, 2026',
    totalTrees: 3150,
    healthy: 2800,
    yellowing: 250,
    dead: 100,
    analysisDate: 'Oct 26, 2026',
    thumb: 'https://images.unsplash.com/photo-1589920153093-fa1199321fde?auto=format&fit=crop&w=150&q=80',
    satelliteMap: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80',
    highPriority: [
      { id: 'T-211', condition: 'Dead', coords: '(1.2501, 103.4712)' },
      { id: 'T-894', condition: 'Yellow', coords: '(1.2543, 103.4754)' },
    ]
  },
  {
    id: 'REP-C02',
    block: 'Block C-02',
    date: 'Oct 22, 2026',
    totalTrees: 1840,
    healthy: 1690,
    yellowing: 110,
    dead: 40,
    analysisDate: 'Oct 22, 2026',
    thumb: 'https://images.unsplash.com/photo-1611326490697-7c703b44bdf9?auto=format&fit=crop&w=150&q=80',
    satelliteMap: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
    highPriority: [
      { id: 'T-043', condition: 'Yellow', coords: '(1.2212, 103.4190)' },
      { id: 'T-076', condition: 'Dead', coords: '(1.2234, 103.4215)' },
    ]
  },
  {
    id: 'REP-D09',
    block: 'Block D-09',
    date: 'Oct 18, 2026',
    totalTrees: 2580,
    healthy: 2340,
    yellowing: 190,
    dead: 50,
    analysisDate: 'Oct 18, 2026',
    thumb: 'https://images.unsplash.com/photo-1590682121342-eb4c798725ee?auto=format&fit=crop&w=150&q=80',
    satelliteMap: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80',
    highPriority: [
      { id: 'T-609', condition: 'Dead', coords: '(1.2612, 103.4901)' },
      { id: 'T-711', condition: 'Yellow', coords: '(1.2643, 103.4942)' },
    ]
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Layout Tab State
  const [activeTab, setActiveTab] = useState<'Overview' | 'Inference' | 'Tree Health' | 'VRA' | 'Logs' | 'Reports'>('Overview');

  // Notification System States
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: 'success' | 'info' | 'error' }[]>([]);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [inboxNotifications, setInboxNotifications] = useState([
    { id: 'welcome', message: 'Selamat datang di Nyawit AI! Sistem siap memproses citra drone UAV.', time: '09:00 AM', read: true, type: 'success' }
  ]);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);

    // Auto prepend to persistent inbox notifications dropdown
    const newInboxItem = {
      id,
      message,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: type === 'error' ? 'info' : type
    };
    setInboxNotifications(prev => [newInboxItem, ...prev]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const markAsRead = (id: string) => {
    setInboxNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInboxNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Interactive Live Data States
  const [logs, setLogs] = useState<typeof initialHistory>([]);
  
  const deleteLog = (id: string) => {
    setLogs(prev => prev.filter(l => l.id !== id));
  };

  // Reports Workspace States
  const [reports, setReports] = useState<typeof initialReports>([]);
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [downloadingFormat, setDownloadingFormat] = useState<{ block: string, format: string } | null>(null);

  const triggerDownload = (block: string, format: string) => {
    setDownloadingFormat({ block, format });
    setTimeout(() => {
      setDownloadingFormat(null);
      showNotification(`Berkas ${format} untuk ${block} berhasil diekspor dan diunduh ke sistem lokal Anda!`, 'success');
    }, 2000);
  };

  // Premium Global Empty State Panel
  const renderEmptyState = (title: string, description: string) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="min-h-[480px] w-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-[2rem] border border-[#e5e2d6] shadow-sm max-w-2xl mx-auto my-12"
    >
      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-700 shadow-inner border border-emerald-100/50 animate-pulse">
        <TreePalm className="w-10 h-10 text-emerald-800" />
      </div>
      <h3 className="text-xl font-black text-[#04211a] mb-2">{title}</h3>
      <p className="text-slate-500 max-w-md font-semibold text-xs leading-relaxed mb-6">
        {description}
      </p>
      
      <button 
        onClick={() => setActiveTab('Inference')}
        className="px-6 py-3.5 bg-[#04211a] text-white hover:bg-emerald-950 rounded-full font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all shadow-[0_4px_20px_rgba(4,33,26,0.12)]"
      >
        <PlaySquare className="w-4 h-4 text-emerald-400" />
        Mulai Analisis Baru
      </button>
    </motion.div>
  );

  const [stats, setStats] = useState({
    totalTrees: 0,
    healthy: 0,
    smallCanopy: 0,
    yellowing: 0,
    deadMissing: 0
  });

  // Inference Form States
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const menu = [
    { icon: LayoutDashboard, label: 'Dashboard / Overview', value: 'Overview' as const, active: activeTab === 'Overview' },
    // { icon: PlaySquare, label: 'Proses Inferensi', value: 'Inference' as const, active: activeTab === 'Inference' },
    { icon: Leaf, label: 'Tree Health', value: 'Tree Health' as const, active: activeTab === 'Tree Health' },
    { icon: Map, label: 'VRA Tools', value: 'VRA' as const, active: activeTab === 'VRA' },
    { icon: CloudLightning, label: 'Inference Log', value: 'Logs' as const, active: activeTab === 'Logs' },
    { icon: FileText, label: 'Reports', value: 'Reports' as const, active: activeTab === 'Reports' },
  ];

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerNewAnalysis = () => {
    setImage(null);
    setAnalysisProgress(0);
    setAnalysisStep(0);
    setIsAnalyzing(false);
    setError(null);
    setActiveTab('Inference');
  };

  const runInference = () => {
    if (!image) {
      setError("Silakan pilih atau unggah citra UAV terlebih dahulu.");
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStep(0);
    setError(null);

    const duration = 4000; // 4 seconds of gorgeous simulation
    const intervalTime = 40;
    const increment = 100 / (duration / intervalTime);

    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += increment;

      if (currentProgress >= 100) {
        clearInterval(timer);
        setAnalysisProgress(100);
        setAnalysisStep(3);

        setTimeout(() => {
          // Inference complete! Prepend to recent history logs
          const addedTrees = Math.floor(1200 + Math.random() * 2000);
          const addedYellow = Math.floor(15 + Math.random() * 25);
          const addedDead = Math.floor(1 + Math.random() * 4);
          const addedHealthy = addedTrees - addedYellow - addedDead;

          const randomBlocks = ['Block A - North', 'Sector S-02', 'Sector N-14', 'Block C - East', 'Block B - South'];
          const randomBlock = randomBlocks[Math.floor(Math.random() * randomBlocks.length)];

          const newLog = {
            id: `ANL-${Math.floor(2400 + Math.random() * 200)}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            block: randomBlock,
            trees: addedTrees,
            status: 'Completed',
            confidence: `${(92 + Math.random() * 7).toFixed(1)}%`,
            thumb: image
          };

          setLogs((prevLogs) => [newLog, ...prevLogs]);

          // Dynamically generate a premium report record matching this analysis
          const newReport = {
            id: `REP-${newLog.id.split('-')[1]}`,
            block: randomBlock,
            date: newLog.date,
            totalTrees: addedTrees,
            healthy: addedHealthy,
            yellowing: addedYellow,
            dead: addedDead,
            analysisDate: newLog.date,
            thumb: image || 'https://images.unsplash.com/photo-1627883907153-61b453e00cc2?auto=format&fit=crop&w=150&q=80',
            satelliteMap: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80',
            highPriority: [
              { id: `T-${Math.floor(100 + Math.random() * 800)}`, condition: 'Dead', coords: `(1.23${Math.floor(Math.random() * 9)}, 103.45${Math.floor(Math.random() * 9)})` },
              { id: `T-${Math.floor(100 + Math.random() * 800)}`, condition: 'Yellow', coords: `(1.23${Math.floor(Math.random() * 9)}, 103.45${Math.floor(Math.random() * 9)})` }
            ]
          };
          setReports((prev) => [newReport, ...prev]);
          setSelectedReportId(newReport.id);

          // Dynamically increment the stats
          setStats((prevStats) => ({
            totalTrees: prevStats.totalTrees + addedTrees,
            healthy: prevStats.healthy + addedHealthy,
            smallCanopy: prevStats.smallCanopy + Math.floor(addedTrees * 0.12),
            yellowing: prevStats.yellowing + addedYellow,
            deadMissing: prevStats.deadMissing + addedDead
          }));

          // Reset inference states
          setIsAnalyzing(false);
          setImage(null);

          // Automatically navigate to overview
          setActiveTab('Overview');
          showNotification(`Analisis UAV Drone untuk ${randomBlock} berhasil diselesaikan! Data statistik kebun telah diperbarui.`, 'success');
        }, 800);
      } else {
        setAnalysisProgress(currentProgress);
        // Update steps dynamically
        if (currentProgress > 75) {
          setAnalysisStep(3);
        } else if (currentProgress > 50) {
          setAnalysisStep(2);
        } else if (currentProgress > 25) {
          setAnalysisStep(1);
        }
      }
    }, intervalTime);
  };

  const stepsList = [
    'Membangun tautan telemetri & membaca data UAV...',
    'Menyelaraskan koordinat ortofoto & kalibrasi multispektral...',
    'Menganalisis densitas mahkota kelapa sawit & indeks klorofil...',
    'Menyusun peta zonasi kesehatan & model preskripsi pemupukan (VRA)...'
  ];

  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <>
      {/* TOP FLOATING NOTIFICATION SYSTEM */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[10000] space-y-3 pointer-events-none w-full max-w-md px-4">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-white border border-[#e5e2d6] shadow-[0_15px_30px_rgba(4,33,26,0.12)] p-4 rounded-2xl pointer-events-auto flex items-start gap-3 border-l-4 border-l-emerald-500"
            >
              <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-xl shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-bounce" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-black text-[#04211a] tracking-tight">Notifikasi Sistem</h4>
                <p className="text-[10px] text-slate-600 font-semibold leading-relaxed mt-1">{notif.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="min-h-screen bg-[#fcfbf7] flex font-sans text-slate-800 relative">
      
      {/* Dynamic Keyframes Injection */}
      <style>{`
        @keyframes scan-line {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 0.8; }
          100% { top: 0%; opacity: 0.8; }
        }
        .animate-spin-hover:hover {
          transform: rotate(360deg);
          transition: transform 0.6s ease;
        }
      `}</style>
      
      {/* Sidebar ------------------------------------------------- */}
      <div className="w-72 bg-[#04211a] text-white flex flex-col shadow-2xl relative z-20 shrink-0">
        <button onClick={() => setActiveTab('Overview')} className="p-8 flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer text-left focus:outline-none">
          <div className="w-10 h-10 bg-brand-900 rounded-xl flex items-center justify-center shadow-lg shadow-brand-900/10 shrink-0">
            <TreePalm className="text-brand-500 w-6 h-6" />
          </div>
          <div>
            <span className="font-black text-2xl tracking-tighter text-white block">
              Nyawit<span className="text-brand-500">AI</span>
            </span>
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest block opacity-80 mt-0.5">Plantation Intelligence</span>
          </div>
        </button>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {menu.map((item) => (
            <button 
              key={item.label}
              onClick={() => setActiveTab(item.value)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                item.active 
                  ? 'bg-emerald-600/20 text-emerald-400 shadow-inner border border-emerald-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? 'text-emerald-400' : 'opacity-70'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <button 
            onClick={() => navigate('/auth')}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all border border-transparent"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content ------------------------------------------ */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-[#e5e2d6] flex items-center justify-between px-8 z-30 shrink-0 sticky top-0">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-extrabold text-[#04211a] tracking-tight">Analysis Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2 hidden md:flex">
              {logs.length > 0 ? (
                <>
                  <span className="text-sm font-bold text-[#04211a]">Last Analysis</span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {logs[0].date}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm font-bold text-[#04211a]">No analysis yet</span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    Ready to begin your first analysis
                  </span>
                </>
              )}
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsInboxOpen(!isInboxOpen)}
                className="w-10 h-10 rounded-full border border-[#e5e2d6] flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors relative cursor-pointer active:scale-95"
              >
                <Bell className="w-5 h-5" />
                {inboxNotifications.filter(n => !n.read).length > 0 && (
                  <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-[1.5px] border-white animate-pulse" />
                )}
              </button>
              
              {isInboxOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-[#e5e2d6] shadow-[0_15px_30px_rgba(4,33,26,0.15)] z-50 overflow-hidden py-1">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-[#e5e2d6] flex justify-between items-center bg-[#fcfbf7]">
                    <span className="text-[10px] font-black text-[#04211a] uppercase tracking-wider">Notifikasi Kebun</span>
                    {inboxNotifications.filter(n => !n.read).length > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                      >
                        Tandai semua dibaca
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {inboxNotifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`p-4 flex gap-3 cursor-pointer hover:bg-slate-50 transition-all ${!notif.read ? 'bg-[#f1faf5]' : 'bg-white'}`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.read ? 'bg-emerald-500' : 'bg-transparent'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-semibold text-slate-700 leading-relaxed break-words">{notif.message}</p>
                          <span className="text-[9px] font-bold text-slate-400 block mt-1">{notif.time}</span>
                        </div>
                      </div>
                    ))}

                    {inboxNotifications.length === 0 && (
                      <div className="p-8 text-center text-slate-400 font-medium text-xs">
                        Belum ada notifikasi baru.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border border-[#e5e2d6] hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
              >
                <div className="w-8 h-8 bg-[#04211a]/5 rounded-full flex items-center justify-center text-[#04211a] font-bold text-xs uppercase border border-[#e5e2d6]">
                  N
                </div>
                <div className="flex flex-col items-start hidden sm:flex">
                  <span className="text-xs font-bold text-[#04211a] leading-none">Profile</span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">#NYA-10231</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#e5e2d6] shadow-[0_15px_30px_rgba(4,33,26,0.15)] z-50 overflow-hidden py-1">
                  <div className="p-4 border-b border-[#e5e2d6] bg-[#fcfbf7]">
                    <span className="text-sm font-bold text-[#04211a] block">User Profile</span>
                    <span className="text-[10px] text-slate-500 font-medium">NYA-10231</span>
                  </div>
                  <div className="p-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#04211a] rounded-xl transition-all cursor-pointer">
                      <User className="w-4 h-4" /> My Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#04211a] rounded-xl transition-all cursor-pointer">
                      <Settings className="w-4 h-4" /> Account Settings
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#04211a] rounded-xl transition-all cursor-pointer">
                      <Bell className="w-4 h-4" /> Notifications
                    </button>
                  </div>
                  <div className="p-1 border-t border-[#e5e2d6]">
                    <button 
                      onClick={() => navigate('/auth')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={triggerNewAnalysis}
              className="hidden md:flex ml-2 items-center gap-2 bg-[#04211a] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-emerald-950 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <PlaySquare className="w-4 h-4" />
              New Analysis
            </button>
          </div>
        </header>

        {/* Dashboard Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth bg-[#fcfbf7]">
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW PANEL */}
            {activeTab === 'Overview' && (
              <UserOverviewTab 
                logs={logs}
                stats={stats}
                setActiveTab={setActiveTab}
                triggerNewAnalysis={triggerNewAnalysis}
              />
            )}

            {/* INFERENCE WORKSPACE */}
            {activeTab === 'Inference' && (
              <InferenceTab 
                image={image}
                isAnalyzing={isAnalyzing}
                error={error}
                fileInputRef={fileInputRef}
                handleImageUpload={handleImageUpload}
                handleDrop={handleDrop}
                runInference={runInference}
                setActiveTab={setActiveTab}
              />
            )}

            {/* INFERENCE LOG DEDICATED VIEW */}
            {activeTab === 'Logs' && (
              <UserLogsTab 
                logs={logs}
                deleteLog={deleteLog}
                triggerDownload={triggerDownload}
              />
            )}

            {/* REPORTS & BUSINESS OPERATIONALS VIEW */}
            {activeTab === 'Reports' && (
              <UserReportsTab 
                reports={reports}
                selectedReportId={selectedReportId}
                setSelectedReportId={setSelectedReportId}
                triggerDownload={triggerDownload}
              />
            )}

            {/* TREE HEALTH TAB */}
            {activeTab === 'Tree Health' && (
              <TreeHealthTab
                key="tree-health"
                stats={stats}
                hasData={logs.length > 0}
                onStartAnalysis={() => setActiveTab('Inference')}
              />
            )}

            {/* VRA TOOLS TAB */}
            {activeTab === 'VRA' && (
              <VRAToolsTab
                key="vra-tools"
                hasData={logs.length > 0}
                onStartAnalysis={() => setActiveTab('Inference')}
              />
            )}

          </AnimatePresence>

          {/* Floating Satisfaction Download Toast Notification */}
          <AnimatePresence>
            {downloadingFormat && (
              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed bottom-6 right-6 z-50 bg-[#04211a] text-white px-6 py-4 rounded-3xl shadow-[0_15px_40px_rgba(4,33,26,0.3)] border border-emerald-500/20 flex items-center gap-3.5 text-xs font-bold"
              >
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                <div>
                  <span className="block text-white font-extrabold">Ekspor Laporan Berjalan</span>
                  <span className="block text-slate-300 font-semibold text-[10px] mt-0.5">Menyiapkan berkas {downloadingFormat.format} untuk {downloadingFormat.block}...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 transition-all">
          <div className="bg-[#021611] border border-emerald-500/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl shadow-black/50">

            <p className="text-white text-sm mb-6 leading-relaxed">
              Apakah Anda yakin ingin keluar? Sesi Anda saat ini akan diakhiri.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2.5 text-sm font-bold text-emerald-500/50 hover:bg-white/5 hover:text-white rounded-xl transition-all"
              >
                Batal
              </button>
              
              <button
                onClick={() => {
                  setShowConfirm(false); 
                  navigate('/auth');    
                }}
                className="px-5 py-2.5 text-sm font-bold bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl border border-red-500/20 hover:border-transparent transition-all"
              >
                Keluar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
    </>
  );
}
