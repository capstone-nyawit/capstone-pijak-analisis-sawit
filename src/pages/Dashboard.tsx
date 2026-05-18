/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Map, 
  Leaf, 
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
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CheckCircle2,
  Image as ImageIcon,
  Upload,
  RefreshCcw,
  Brain,
  Check,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
        <Leaf className="w-10 h-10 text-emerald-800" />
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
    { icon: PlaySquare, label: 'Proses Inferensi', value: 'Inference' as const, active: activeTab === 'Inference' },
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

    const timer = setInterval(() => {
      setAnalysisProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
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
          return 100;
        }

        // Update steps dynamically
        if (next > 75) {
          setAnalysisStep(3);
        } else if (next > 50) {
          setAnalysisStep(2);
        } else if (next > 25) {
          setAnalysisStep(1);
        }

        return next;
      });
    }, intervalTime);
  };

  const stepsList = [
    'Membangun tautan telemetri & membaca data UAV...',
    'Menyelaraskan koordinat ortofoto & kalibrasi multispektral...',
    'Menganalisis densitas mahkota kelapa sawit & indeks klorofil...',
    'Menyusun peta zonasi kesehatan & model preskripsi pemupukan (VRA)...'
  ];

  return (
    <div className="min-h-screen bg-[#fcfbf7] flex font-sans text-slate-800 relative">
      
      {/* TOP FLOATING NOTIFICATION SYSTEM */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 space-y-3 pointer-events-none w-full max-w-md px-4">
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
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Sprout className="text-white w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight block">Nyawit AI</span>
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest block opacity-80 mt-0.5">Plantation Intelligence</span>
          </div>
        </div>

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
        <header className="h-20 bg-white border-b border-[#e5e2d6] flex items-center justify-between px-8 z-[9999] shrink-0 sticky top-0">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-extrabold text-[#04211a] tracking-tight">Analysis Dashboard</h1>
            <div className="hidden lg:flex items-center gap-2 bg-[#fcfbf7] px-4 py-2.5 rounded-full border border-[#e5e2d6] text-sm">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search blocks, zones..." 
                className="bg-transparent border-none outline-none w-48 font-medium text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2 hidden md:flex">
              <span className="text-sm font-bold text-[#04211a]">Block Alpha Analysis</span>
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Oct 24 - Oct 25, 2026
              </span>
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
            <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border border-[#e5e2d6] hover:bg-slate-50 transition-all">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 font-bold text-xs uppercase">
                OP
              </div>
              <span className="text-sm font-bold text-[#04211a] hidden sm:block">Operator 1</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
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
              logs.length === 0 ? (
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
              ) : (
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
                      <div className="absolute top-[30%] left-[75%] w-20 h-20 border-2 border-amber-500 bg-amber-500/20 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.4)] backdrop-blur-[1px]">
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
                        <button className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
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
                      <button className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer">View Map</button>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                      <div className="p-4 rounded-2xl border-2 border-red-100 bg-red-50/30">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-extrabold text-[#04211a]">Sector N-14</span>
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase tracking-wider">High Priority</span>
                        </div>
                        <p className="text-xs font-medium text-slate-600 mb-3">Increase Mg fertilization by 15% to address yellowing trend.</p>
                        <button className="text-xs font-bold text-[#04211a] underline hover:text-emerald-700 cursor-pointer">Send to Sprayer Drone</button>
                      </div>

                      <div className="p-4 rounded-2xl border border-amber-100 bg-[#fcfbf7]">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-extrabold text-[#04211a]">Sector S-02</span>
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider">Monitor</span>
                        </div>
                        <p className="text-xs font-medium text-slate-600 mb-3">Small canopy sizes detected. Schedule soil moisture analysis.</p>
                        <button className="text-xs font-bold text-slate-500 hover:text-[#04211a] cursor-pointer">Log Task</button>
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
                          {logs.length === 0 && (
                            <tr>
                              <td colSpan={4} className="text-center py-8 text-slate-400 font-medium">
                                Tidak ada riwayat analisis ditemukan.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>

                </div>
              </motion.div>
            ))}

            {/* INFERENCE PROCESS WORKSPACE */}
            {activeTab === 'Inference' && (
              <motion.div
                key="inference-pane"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 max-w-6xl mx-auto"
              >
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center min-h-[480px] space-y-4">
                    <Loader2 className="w-12 h-12 text-[#04211a] animate-spin opacity-80" />
                    <p className="text-[#04211a] font-extrabold text-lg tracking-tight">Waiting for analyzing...</p>
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e5e2d6] pb-6">
                      <div>
                        <h2 className="text-3xl font-black text-[#04211a] tracking-tight">Mulai Analisis Kebun</h2>
                        <p className="text-slate-500 font-semibold mt-1">Unggah citra drone untuk menjalankan deteksi dan analisis kondisi pohon sawit.</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('Overview')}
                        className="self-start md:self-auto px-5 py-2.5 border border-[#e5e2d6] bg-white rounded-xl hover:bg-slate-50 text-sm font-bold text-[#04211a] transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 animate-pulse-hover"
                      >
                        Batal
                      </button>
                    </div>

                    <div className="max-w-2xl mx-auto space-y-6 pt-6">
                      
                      {/* Upload Card */}
                      <div className="bg-white border border-[#e5e2d6] rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">Citra Udara UAV</span>
                          {image && (
                            <span className="text-[10px] font-bold text-slate-400">Dimensi Optimal Terbaca</span>
                          )}
                        </div>
                        
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleDrop}
                          className={`relative group cursor-pointer border-2 border-dashed rounded-2xl transition-all aspect-video flex flex-col items-center justify-center p-6 overflow-hidden min-h-[260px]
                            ${image ? 'border-emerald-500 bg-emerald-50/10' : 'border-[#e5e2d6] bg-[#fcfbf7]/40 hover:border-emerald-500 hover:bg-emerald-50/5'}
                          `}
                        >
                          {image ? (
                            <>
                              <img src={image} className="absolute inset-0 w-full h-full object-cover" alt="Preview UAV" />
                              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <RefreshCcw className="text-white w-10 h-10 mb-2 animate-spin-hover" />
                                <span className="text-white font-bold text-sm">Ganti Gambar UAV</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-center space-y-4">
                              <div className="w-16 h-16 bg-[#04211a]/5 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                <Upload className="text-[#04211a] w-8 h-8 opacity-80" />
                              </div>
                              <div>
                                <p className="text-[#04211a] font-extrabold text-base">Klik atau seret citra drone di sini</p>
                                <p className="text-slate-400 text-xs mt-1.5 font-medium">PNG, JPG, WEBP • Resolusi Maksimal 20MB</p>
                              </div>
                            </div>
                          )}
                          <input 
                            ref={fileInputRef}
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </div>

                        {/* File Details / Status Area (Only shown if file exists) */}
                        {image && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-[#fcfbf7] rounded-xl border border-[#e5e2d6] space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                                  <ImageIcon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-xs font-bold text-[#04211a] block truncate">uav_orthomosaic_snapshot.png</span>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Format: PNG • Ready</span>
                                </div>
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" /> Validated
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Upload Operational Tips Card (Directly under input file) */}
                      <div className="bg-[#faf8f0] border border-[#e5e2d6] rounded-[2rem] p-6 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-emerald-800 flex items-center gap-1.5">
                          <Leaf className="w-4 h-4 text-emerald-600" />
                          Tips Hasil Optimal
                        </h3>
                        
                        <ul className="space-y-3.5 text-[10px] font-semibold text-slate-600 leading-relaxed list-none">
                          <li className="flex gap-2">
                            <span className="text-emerald-600 text-xs mt-0.5">▪</span>
                            Pastikan citra diambil tegak lurus (nadir snapshot) untuk kalkulasi radius mahkota yang akurat.
                          </li>
                          <li className="flex gap-2">
                            <span className="text-emerald-600 text-xs mt-0.5">▪</span>
                            Gunakan pencahayaan optimal (pukul 10:00 - 14:00) untuk meminimalkan distorsi bayangan pelepah sawit.
                          </li>
                          <li className="flex gap-2">
                            <span className="text-emerald-600 text-xs mt-0.5">▪</span>
                            Hindari snapshot citra yang tertutup awan atau kabut tebal guna memastikan indeks klorofil terbaca sempurna.
                          </li>
                        </ul>
                      </div>

                      {/* Primary CTA Action Block */}
                      <div className="flex flex-col items-center pt-2">
                        <button
                          onClick={runInference}
                          disabled={!image}
                          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md
                            ${image 
                              ? 'bg-[#04211a] text-white hover:bg-emerald-950 cursor-pointer shadow-[0_4px_25px_rgba(4,33,26,0.15)]' 
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}
                          `}
                        >
                          <PlaySquare className={`w-5 h-5 ${image ? 'text-emerald-400' : 'text-slate-400'}`} />
                          Jalankan Analisis
                        </button>
                        
                        {error && (
                          <p className="text-red-500 text-xs font-bold text-center mt-3 flex items-center justify-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {error}
                          </p>
                        )}
                      </div>

                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* INFERENCE LOG DEDICATED VIEW */}
            {activeTab === 'Logs' && (
              logs.length === 0 ? (
                renderEmptyState(
                  "Riwayat Inferensi Kosong",
                  "Belum ada log aktivitas perekaman data drone UAV yang terdeteksi di kebun kelapa sawit Anda. Mulai analisis pertama untuk merekam riwayat kerja."
                )
              ) : (
                <motion.div
                  key="inference-logs-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                {/* Title Header */}
                <div>
                  <h2 className="text-2xl font-black text-[#04211a] tracking-tight">Inference Logs</h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">Daftar riwayat lengkap analisis citra drone UAV, deteksi mahkota kelapa sawit, dan preskripsi VRA.</p>
                </div>

                {/* Full Logs Card */}
                <div className="bg-white rounded-[2rem] border border-[#e5e2d6] shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-[#e5e2d6] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#fcfbf7]">
                    <div className="flex items-center gap-2">
                      <CloudLightning className="w-5 h-5 text-emerald-600" />
                      <span className="font-extrabold text-[#04211a]">Total Analisis: {logs.length} Snapshot</span>
                    </div>
                    
                    {/* Search/Filter Bar */}
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#e5e2d6] text-xs max-w-xs w-full shadow-sm">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Cari ID atau Blok..."
                        className="bg-transparent border-none outline-none w-full font-medium text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#fcfbf7] border-b border-[#e5e2d6]">
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 pl-6 uppercase tracking-widest w-20">Preview</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analysis ID</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Block / Zone</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right pr-6">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((row) => (
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
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mt-1 inline-block">{row.trees} trees</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
                                row.status === 'Completed' ? 'bg-emerald-100/50 border border-emerald-200 text-emerald-700' : 'bg-blue-100/50 border border-blue-200 text-blue-700'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${row.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
                                {row.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-mono font-bold text-emerald-800">{row.confidence}</span>
                            </td>
                            <td className="px-6 py-4 text-right pr-6">
                              <div className="flex items-center justify-end gap-2">
                                 <button 
                                   onClick={() => triggerDownload(row.block, 'PDF')}
                                   className="p-2.5 text-slate-400 border border-slate-200 bg-white hover:text-[#04211a] hover:border-[#04211a] rounded-xl transition-all shadow-sm cursor-pointer" 
                                   title="Download PDF Report"
                                 >
                                   <Download className="w-4 h-4" />
                                 </button>
                                 <button className="p-2.5 text-slate-400 border border-slate-200 bg-white hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all shadow-sm cursor-pointer" onClick={() => deleteLog(row.id)} title="Hapus Riwayat">
                                   <Trash2 className="w-4 h-4" />
                                 </button>
                                 <button className="p-2.5 text-white bg-[#04211a] hover:bg-emerald-950 rounded-xl transition-all shadow-sm font-bold text-xs px-4 cursor-pointer active:scale-95">
                                   Details
                                 </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {logs.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                              Tidak ada riwayat analisis ditemukan. Silakan jalankan analisis UAV baru.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                </motion.div>
              )
            )}

            {/* REPORTS & BUSINESS OPERATIONALS VIEW */}
            {activeTab === 'Reports' && (
              logs.length === 0 ? (
                renderEmptyState(
                  "Laporan Bisnis Belum Tersedia",
                  "Dokumen bisnis, ringkasan kesehatan tajuk, dan pencatatan operasional kebun baru akan diterbitkan setelah Anda menyelesaikan setidaknya satu kali analisis citra UAV drone."
                )
              ) : (
                <motion.div
                  key="reports-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                {/* Title Header */}
                <div>
                  <h2 className="text-2xl font-black text-[#04211a] tracking-tight">Reports & Records</h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">Kelola data bisnis operasional kebun, ringkasan zonasi kesehatan, dan ekspor laporan kerja.</p>
                </div>

                {/* Two-column Reports Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pt-2 items-start">
                  
                  {/* Left Column: List of Plantation Block Reports (5 cols) */}
                  <div className="xl:col-span-5 space-y-4 max-h-[680px] overflow-y-auto pr-1">
                    {reports.map((rep) => {
                      const isSelected = selectedReportId === rep.id;
                      return (
                        <motion.div 
                          key={rep.id}
                          onClick={() => setSelectedReportId(rep.id)}
                          whileHover={{ scale: 1.01 }}
                          className={`p-4 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between gap-4 bg-white
                            ${isSelected 
                              ? 'border-emerald-600 bg-emerald-50/15 shadow-[0_8px_30px_rgba(4,33,26,0.06)]' 
                              : 'border-[#e5e2d6] hover:border-emerald-600/40 hover:bg-slate-50/30 shadow-sm'}
                          `}
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            {/* Satellite Thumb Preview */}
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 shadow-inner shrink-0 relative">
                              <img src={rep.thumb} className="w-full h-full object-cover" alt={rep.block} />
                              <div className="absolute inset-0 bg-[#04211a]/5" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-extrabold text-[#04211a] truncate">{rep.block}</h4>
                              <p className="text-[10px] text-slate-400 font-bold tracking-tight mt-1">{rep.date}</p>
                            </div>
                          </div>

                          {/* Action Export Buttons */}
                          <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => triggerDownload(rep.block, 'PDF')}
                              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black shadow-sm transition-all active:scale-95 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-200" />
                              PDF
                            </button>
                            <button 
                              onClick={() => triggerDownload(rep.block, 'XLSX')}
                              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black shadow-sm transition-all active:scale-95 cursor-pointer"
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
                              XLSX
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Right Column: Printed Sheet Preview (7 cols) */}
                  {(() => {
                    const selectedReport = reports.find(r => r.id === selectedReportId) || reports[0];
                    return (
                      <div className="xl:col-span-7 bg-white rounded-[2rem] border border-[#e5e2d6] shadow-sm p-6 md:p-8 space-y-6 relative overflow-hidden">
                        
                        {/* Decorative top colored border */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-[#04211a]" />
                        
                        {/* Sheet Header */}
                        <div className="text-center pb-6 border-b border-slate-200">
                          <h3 className="text-xl font-extrabold text-[#04211a]">Plantation Status Report</h3>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1.5">{selectedReport.block} • Snapshot</p>
                        </div>

                        {/* Summary Grid & Small Ratio Pie Chart */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 bg-[#fcfbf7] rounded-2xl border border-[#e5e2d6] relative">
                          <div className="md:col-span-7 grid grid-cols-2 gap-y-5 gap-x-4 border-r border-[#e5e2d6]/80 pr-4">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Trees</span>
                              <span className="text-lg font-black text-[#04211a]">{selectedReport.totalTrees.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Healthy</span>
                              <span className="text-lg font-black text-emerald-600">{selectedReport.healthy.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Yellowing</span>
                              <span className="text-lg font-black text-amber-600">{selectedReport.yellowing.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Dead Trees</span>
                              <span className="text-lg font-black text-red-600">{selectedReport.dead.toLocaleString()}</span>
                            </div>
                            <div className="col-span-2 pt-2.5 border-t border-[#e5e2d6]/50">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Analysis Date</span>
                              <span className="text-xs font-bold text-slate-700">{selectedReport.analysisDate}</span>
                            </div>
                          </div>

                          {/* Small Ratio Pie Chart */}
                          <div className="md:col-span-5 flex flex-col items-center justify-center">
                            <div className="w-24 h-24 relative">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={[
                                      { name: 'Healthy', value: selectedReport.healthy },
                                      { name: 'Yellowing', value: selectedReport.yellowing },
                                      { name: 'Dead', value: selectedReport.dead }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={20}
                                    outerRadius={36}
                                    paddingAngle={2}
                                    dataKey="value"
                                  >
                                    <Cell fill="#10b981" />
                                    <Cell fill="#f59e0b" />
                                    <Cell fill="#ef4444" />
                                  </Pie>
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">Condition Ratio</span>
                          </div>
                        </div>

                        {/* High-Priority Locations Table */}
                        <div className="space-y-3.5">
                          <h4 className="text-xs font-black uppercase tracking-widest text-[#04211a] flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            High-Priority Locations
                          </h4>
                          <div className="overflow-hidden border border-[#e5e2d6] rounded-2xl shadow-inner bg-white">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-[#fcfbf7] border-b border-[#e5e2d6] font-bold text-slate-400 uppercase text-[9px] tracking-widest">
                                  <th className="px-5 py-3 pl-5">Tree ID</th>
                                  <th className="px-5 py-3">Condition</th>
                                  <th className="px-5 py-3 pr-5">Coordinates</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedReport.highPriority.map((tree, idx) => (
                                  <tr key={idx} className="border-b border-[#e5e2d6]/50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                    <td className="px-5 py-3 font-mono font-bold text-slate-700">{tree.id}</td>
                                    <td className="px-5 py-3">
                                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                        tree.condition === 'Dead' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                                      }`}>
                                        {tree.condition}
                                      </span>
                                    </td>
                                    <td className="px-5 py-3 font-mono text-slate-500">{tree.coords}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Bottom recommendations and Satellite map marker */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-2">
                          <div className="p-4 bg-[#faf8f0] border border-[#e5e2d6] rounded-2xl space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#04211a] flex items-center gap-1.5">
                              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                              Rekomendasi Pemupukan
                            </span>
                            <p className="text-[10px] text-slate-600 font-semibold leading-relaxed">
                              Dosis VRA Pelepah: Naikkan 15% Mg pada zona merah. Berikan pengairan teratur di area pinggiran {selectedReport.block} untuk mengembalikan vitalitas pelepah sawit.
                            </p>
                          </div>

                          {/* Satellite snapshot container */}
                          <div className="h-28 rounded-2xl overflow-hidden border border-[#e5e2d6] shadow-sm relative group">
                            <img src={selectedReport.satelliteMap} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Satellite Preview" />
                            <div className="absolute inset-0 bg-[#04211a]/20 group-hover:bg-[#04211a]/10 transition-colors" />
                            <div className="absolute top-2 left-2 bg-[#04211a]/95 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-white/10">
                              Sector Map
                            </div>
                            
                            {/* Satellite Target Marker Pin */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                              <div className="w-3.5 h-3.5 bg-red-500 rounded-full border border-white shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" />
                              <span className="text-[8px] font-black text-white bg-black/85 px-1 py-0.5 rounded shadow mt-1">{selectedReport.block}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })()}

                </div>

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

                </motion.div>
              )
            )}

            {/* UNCONSTRUCTED / AUXILIARY VIEWS */}
            {activeTab !== 'Overview' && activeTab !== 'Inference' && activeTab !== 'Logs' && activeTab !== 'Reports' && (
              logs.length === 0 ? (
                renderEmptyState(
                  `${activeTab} Belum Aktif`,
                  `Metrik peta digital dan visualisasi analitik untuk modul ${activeTab} belum dapat dipetakan. Silakan unggah citra UAV dan jalankan analisis pertama Anda terlebih dahulu.`
                )
              ) : (
                <motion.div
                  key="under-construction"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-white rounded-[2rem] border border-[#e5e2d6] shadow-sm"
                >
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-600">
                  <Sprout className="w-10 h-10 animate-bounce" />
                </div>
                <h3 className="text-2xl font-black text-[#04211a] mb-2">{activeTab} Workspace</h3>
                <p className="text-slate-500 max-w-md font-medium">
                  Modul ini sedang disiapkan oleh kecerdasan buatan kami. Silakan kembali ke Overview atau lakukan analisis citra UAV baru.
                </p>
                <button 
                  onClick={() => setActiveTab('Overview')}
                  className="mt-6 px-6 py-3 bg-[#04211a] text-white rounded-full font-bold text-sm hover:bg-emerald-950 transition-all active:scale-95 shadow-md cursor-pointer"
                >
                  Kembali ke Overview
                </button>
                </motion.div>
              )
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
