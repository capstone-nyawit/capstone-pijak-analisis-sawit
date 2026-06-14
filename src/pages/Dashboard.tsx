/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
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
  Leaf,
  Mail,
  Building,
  Menu
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
import AccountSettingsTab from '../components/dashboard/AccountSettingsTab';

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
  const [activeTab, setActiveTab] = useState<'Overview' | 'Inference' | 'Tree Health' | 'VRA' | 'Logs' | 'Reports' | 'Settings'>('Overview');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeTab]);

  // Notification System States
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: 'success' | 'info' | 'error' }[]>([]);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [inboxNotifications, setInboxNotifications] = useState([
    { id: 'welcome', message: 'Selamat datang di Nyawit AI! Sistem siap memproses citra drone UAV.', time: '09:00 AM', read: true, type: 'success' }
  ]);

  // User profile states
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [fullName, setFullName] = useState("");
  const [isOrganizationUser, setIsOrganizationUser] = useState(false);

  useEffect(() => {
    const loadUserData = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const u = JSON.parse(userStr);
        setFullName(u.full_name || u.username || "Unknown User");
        setEmail(u.email || "");
        setCompany(u.company_name || "PT. Sawit Nusantara");
        setIsOrganizationUser(!!u.company_id || !!u.company_name);
        setProfilePhoto(u.profile_photo || null);
      }
    };
    
    loadUserData();
    window.addEventListener('profile_updated', loadUserData);
    return () => {
      window.removeEventListener('profile_updated', loadUserData);
    };
  }, []);

  const inboxRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inboxRef.current && !inboxRef.current.contains(event.target as Node)) {
        setIsInboxOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const tempId = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id: tempId, message, type }]);

    // Persist to backend so it shows up after refresh
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    if (token) {
      fetch(`${apiUrl}/user-notifications/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, type })
      }).then(res => res.ok ? res.json() : null).then(data => {
        if (data) {
          const newInboxItem = {
            id: data.id.toString(),
            message,
            time: new Date(data.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            read: false,
            type
          };
          setInboxNotifications(prev => [newInboxItem, ...prev]);
        }
      }).catch(() => {
        // Fallback: add local-only inbox item
        const newInboxItem = {
          id: tempId,
          message,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          read: false,
          type
        };
        setInboxNotifications(prev => [newInboxItem, ...prev]);
      });
    }

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== tempId));
    }, 4000);
  };

  const markAsRead = async (id: string) => {
    setInboxNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      await fetch(`${apiUrl}/user-notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setInboxNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      await fetch(`${apiUrl}/user-notifications/read-all`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setInboxNotifications(prev => prev.filter(n => n.id !== id));
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      await fetch(`${apiUrl}/user-notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const clearAllNotifications = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setInboxNotifications([]);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      await fetch(`${apiUrl}/user-notifications/all/clear`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Interactive Live Data States
  const [logs, setLogs] = useState<typeof initialHistory>([]);
  
  const deleteLog = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      await fetch(`${apiUrl}/logs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setLogs(prev => prev.filter(l => l.id !== id));
      showNotification('Log analisis berhasil dihapus permanen.', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Gagal menghapus log analisis.', 'error');
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${apiUrl}/reports/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setReports(prev => prev.filter(r => r.id !== id));
        showNotification('Laporan berhasil dihapus.', 'success');
      } else {
        throw new Error('Gagal menghapus laporan dari database');
      }
    } catch (err) {
      console.error(err);
      showNotification('Gagal menghapus laporan.', 'error');
    }
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

  const [dashboardStats, setDashboardStats] = useState<any>(null);

  // WebSocket Integration for Real-time presence
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const wsUrl = apiUrl.replace('http', 'ws') + `/ws/presence?token=${token}`;
    
    const ws = new WebSocket(wsUrl);
    
    return () => {
      ws.close();
    };
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const headers = { 'Authorization': `Bearer ${token}` };
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

      const [statsRes, logsRes, reportsRes, notifRes] = await Promise.all([
        fetch(`${apiUrl}/dashboard/stats`, { headers }),
        fetch(`${apiUrl}/logs/`, { headers }),
        fetch(`${apiUrl}/reports/`, { headers }),
        fetch(`${apiUrl}/user-notifications/`, { headers })
      ]);

      let logsList: any[] = [];
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        logsList = logsData;

        // Sort chronologically (oldest first) to assign suffixes
        const sortedLogs = [...logsData].sort((a: any, b: any) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        // Detect duplicates
        const logNameCounts: { [key: string]: number } = {};
        sortedLogs.forEach((l: any) => {
          const key = l.block_name.toLowerCase();
          logNameCounts[key] = (logNameCounts[key] || 0) + 1;
        });

        const logNameIndices: { [key: string]: number } = {};
        const mappedLogsRaw = sortedLogs.map((l: any) => {
          const key = l.block_name.toLowerCase();
          let suffix = '';
          if (logNameCounts[key] > 1) {
            const index = (logNameIndices[key] || 0) + 1;
            logNameIndices[key] = index;
            const letter = String.fromCharCode(64 + index); // 'A', 'B'...
            suffix = ` ${letter}`;
          }
          return {
            id: l.log_code,
            date: new Date(l.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            block: `${l.block_name}${suffix}`,
            originalBlock: l.block_name,
            trees: l.trees_count,
            status: l.status,
            confidence: `${l.confidence_score}%`,
            thumb: l.image_url || 'https://images.unsplash.com/photo-1627883907153-61b453e00cc2?auto=format&fit=crop&w=100&q=80',
            predictions: l.results_json,
            createdAt: l.created_at
          };
        });

        // Sort back to descending order (newest first)
        mappedLogsRaw.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setLogs(mappedLogsRaw);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setDashboardStats(statsData);
        if (statsData.kpiStats && statsData.kpiStats.length > 0) {
          const t = statsData.kpiStats.find((k: any) => k.label === 'Total Trees')?.val.replace(/,/g, '') || "0";
          const h = statsData.kpiStats.find((k: any) => k.label === 'Healthy')?.val.replace(/,/g, '') || "0";
          const s = statsData.kpiStats.find((k: any) => k.label === 'Small Canopy')?.val.replace(/,/g, '') || "0";
          const y = statsData.kpiStats.find((k: any) => k.label === 'Yellowing')?.val.replace(/,/g, '') || "0";
          const d = statsData.kpiStats.find((k: any) => k.label === 'Dead / Missing')?.val.replace(/,/g, '') || "0";
          
          setStats({
            totalTrees: parseInt(t),
            healthy: parseInt(h),
            smallCanopy: parseInt(s),
            yellowing: parseInt(y),
            deadMissing: parseInt(d)
          });
        }
      }

      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();

        // Sort chronologically (oldest first)
        const sortedReports = [...reportsData].sort((a: any, b: any) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        // Map reports and use database properties directly
        const mappedRawReports = sortedReports.map((r: any) => {
          const total = r.healthy_count + r.small_count + r.yellow_count + r.dead_count;
          const h = r.healthy_count;
          const s = r.small_count;
          const y = r.yellow_count;
          const d = r.dead_count;
          
          let highPriority: any[] = [];
          let preds: any[] = [];
          if (typeof r.results_json === 'string') {
            try { preds = JSON.parse(r.results_json); } catch(e) {}
          } else if (Array.isArray(r.results_json)) {
            preds = r.results_json;
          }
          
          const priorityTrees = preds.filter((p: any) => p.class_id === 0 || p.class_id === 4 || p.class === 0 || p.class === 4);
          highPriority = priorityTrees.slice(0, 10).map((p: any, index: number) => {
            const cond = (p.class_id === 0 || p.class === 0) ? 'Dead' : 'Yellowing';
            const box = p.box || p.bbox || [0.5, 0.5];
            const xc = box[0];
            const yc = box[1];
            const lat = (0.5082 + (yc - 0.5) * 0.005).toFixed(5);
            const lon = (101.4421 + (xc - 0.5) * 0.005).toFixed(5);
            return {
              id: `T-${100 + index}`,
              condition: cond,
              coords: `(${lat}, ${lon})`
            };
          });

          return {
            id: r.report_code,
            originalName: r.name,
            date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            totalTrees: total || 100, 
            healthy: h || 86,
            yellowing: y || 14,
            dead: d || 0,
            analysisDate: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            thumb: r.image_url || 'https://images.unsplash.com/photo-1590682121342-eb4c798725ee?auto=format&fit=crop&w=150&q=80',
            satelliteMap: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80',
            highPriority: highPriority,
            predictions: preds,
            createdAt: r.created_at,
            inferenceLogId: r.inference_log_id,
            logCode: r.log_code
          };
        });

        // Detect duplicates and assign suffixes
        const reportNameCounts: { [key: string]: number } = {};
        mappedRawReports.forEach((r: any) => {
          const key = r.originalName.toLowerCase();
          reportNameCounts[key] = (reportNameCounts[key] || 0) + 1;
        });

        const reportNameIndices: { [key: string]: number } = {};
        const mappedReports = mappedRawReports.map((r: any) => {
          const key = r.originalName.toLowerCase();
          let suffix = '';
          if (reportNameCounts[key] > 1) {
            const index = (reportNameIndices[key] || 0) + 1;
            reportNameIndices[key] = index;
            const letter = String.fromCharCode(64 + index);
            suffix = ` ${letter}`;
          }
          return {
            ...r,
            block: `${r.originalName}${suffix}`
          };
        });

        // Sort back to descending order (newest first)
        mappedReports.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setReports(mappedReports);
      }

      if (notifRes.ok) {
        const notifData = await notifRes.json();
        const mappedNotif = notifData.map((n: any) => ({
          id: n.id.toString(),
          message: n.message,
          time: new Date(n.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          read: n.is_read,
          type: n.type || 'info'
        }));
        setInboxNotifications(mappedNotif);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Inference Form States
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const menu = [
    { icon: LayoutDashboard, label: 'Overview', value: 'Overview' as const, active: activeTab === 'Overview' },
    { icon: Leaf, label: 'Tree Health', value: 'Tree Health' as const, active: activeTab === 'Tree Health' },
    { icon: Map, label: 'VRA Tools', value: 'VRA' as const, active: activeTab === 'VRA' },
    { icon: CloudLightning, label: 'Inference Log', value: 'Logs' as const, active: activeTab === 'Logs' },
    { icon: FileText, label: 'Reports', value: 'Reports' as const, active: activeTab === 'Reports' },
  ];

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
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
      setImageFile(file);
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
    setImageFile(null);
    setAnalysisProgress(0);
    setAnalysisStep(0);
    setIsAnalyzing(false);
    setError(null);
    setActiveTab('Inference');
  };
  const runInference = async (blockName: string) => {
    if (!image || !imageFile) {
      setError("Silakan pilih atau unggah citra UAV terlebih dahulu.");
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisProgress(10);
    setAnalysisStep(1);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('block_name', blockName || 'Block Alpha Sector');
      
      setAnalysisProgress(40);
      setAnalysisStep(2);

      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi server untuk prediksi.');
      }

      setAnalysisProgress(80);
      const data = await response.json();
      
      setAnalysisProgress(100);
      setAnalysisStep(3);

      setTimeout(async () => {
        // Clear state & fetch updated stats, reports, logs from backend
        await fetchData();

        // Save the image in localStorage mapped by the block name
        try {
          if (image) {
            localStorage.setItem(`analysis_img_${blockName.toLowerCase()}`, image);
            localStorage.setItem('last_uploaded_image', image);
          }
        } catch (e) {
          console.error("Failed to save image to localStorage:", e);
        }

        // Reset inference states
        setIsAnalyzing(false);
        setImage(null);
        setImageFile(null);

        // Automatically navigate to overview
        setActiveTab('Overview');
        showNotification(`Analisis UAV Drone untuk ${blockName} berhasil diselesaikan!`, 'success');
      }, 500);

    } catch (err: any) {
      console.error(err);
      setError("Analysis failed: " + err.message);
      setIsAnalyzing(false);
    }
  };

  const stepsList = [
    'Membangun tautan telemetri & membaca data UAV...',
    'Menyelaraskan koordinat ortofoto & kalibrasi multispektral...',
    'Menganalisis densitas mahkota kelapa sawit & indeks klorofil...',
    'Menyusun peta zonasi kesehatan & model preskripsi pemupukan (VRA)...'
  ];

  const [showConfirm, setShowConfirm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


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
      
      {/* Sidebar Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar ------------------------------------------------- */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#04211a] text-white flex flex-col shadow-2xl transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 shrink-0`}>
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
              onClick={() => {
                setActiveTab(item.value);
                setIsMobileMenuOpen(false);
              }}
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


      </div>

      {/* Main Content ------------------------------------------ */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-[#e5e2d6] flex items-center justify-between px-4 md:px-8 z-30 shrink-0 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#04211a] tracking-tight">
              {activeTab === 'Settings' ? 'Account Settings' : 'Analysis Dashboard'}
            </h1>
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
            <div className="relative" ref={inboxRef}>
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
                  <div className="px-4 py-3 border-b border-[#e5e2d6] flex justify-between items-center bg-[#fcfbf7]">
                    <span className="text-[10px] font-black text-[#04211a] uppercase tracking-wider">Notifikasi</span>
                    <div className="flex items-center gap-3">
                      {inboxNotifications.filter(n => !n.read).length > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                        >
                          Tandai semua dibaca
                        </button>
                      )}
                      {inboxNotifications.length > 0 && (
                        <button 
                          onClick={clearAllNotifications}
                          className="text-[10px] font-bold text-red-500 hover:underline cursor-pointer"
                        >
                          Hapus Semua
                        </button>
                      )}
                    </div>
                  </div>

                  {/* List */}
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {inboxNotifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`p-4 flex gap-3 cursor-pointer hover:bg-slate-50 transition-all group ${!notif.read ? 'bg-[#f1faf5]' : 'bg-white'}`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.read ? 'bg-emerald-500' : 'bg-transparent'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-semibold text-slate-700 leading-relaxed break-words pr-6">{notif.message}</p>
                          <span className="text-[9px] font-bold text-slate-400 block mt-1">{notif.time}</span>
                        </div>
                        <button
                          onClick={(e) => deleteNotification(e, notif.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Hapus Notifikasi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border border-[#e5e2d6] hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
              >
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-[#e5e2d6]" />
                ) : (
                  <div className="w-8 h-8 bg-[#04211a]/5 rounded-full flex items-center justify-center text-[#04211a] font-bold text-xs uppercase border border-[#e5e2d6]">
                    {fullName.charAt(0)}
                  </div>
                )}
                <div className="flex flex-col items-start hidden sm:flex">
                  <span className="text-xs font-bold text-[#04211a] leading-none">{fullName}</span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">#NYA-10231</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#e5e2d6] shadow-[0_15px_30px_rgba(4,33,26,0.15)] z-50 overflow-hidden py-1">
                  <div className="p-4 border-b border-[#e5e2d6] bg-[#fcfbf7]">
                    <span className="text-sm font-bold text-[#04211a] block truncate">{fullName}</span>
                    <span className="text-[10px] text-slate-500 font-medium truncate">{email}</span>
                  </div>
                  <div className="p-1">
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        setActiveTab('Settings');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#04211a] rounded-xl transition-all cursor-pointer text-left"
                    >
                      <Settings className="w-4 h-4" /> Account Settings
                    </button>
                  </div>
                  <div className="p-1 border-t border-[#e5e2d6]">
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        setShowConfirm(true);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer text-left"
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
        <div ref={scrollContainerRef} data-lenis-prevent className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth bg-[#fcfbf7]">
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW PANEL */}
            {activeTab === 'Overview' && (
              <UserOverviewTab 
                logs={logs}
                stats={stats}
                priorityZones={dashboardStats?.priorityZones || []}
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
                logs={logs}
                onStartAnalysis={() => setActiveTab('Inference')}
                deleteReport={deleteReport}
              />
            )}

            {/* TREE HEALTH TAB */}
            {activeTab === 'Tree Health' && (
              <TreeHealthTab
                stats={stats}
                reports={reports}
                hasData={logs.length > 0}
                onStartAnalysis={() => setActiveTab('Inference')}
              />
            )}

            {/* VRA TOOLS TAB */}
            {activeTab === 'VRA' && (
              <VRAToolsTab
                hasData={logs.length > 0}
                logs={logs}
                onStartAnalysis={() => setActiveTab('Inference')}
              />
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'Settings' && (
              <AccountSettingsTab showCompany={isOrganizationUser} />
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

      {/* Sign Out Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 bg-[#04211a]/40 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100"
            >
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-center text-[#04211a] mb-2">Sign Out</h3>
              <p className="text-sm font-semibold text-slate-500 text-center mb-6">Are you sure you want to sign out of your account?</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 hover:bg-[#04211a] hover:text-white text-slate-600 text-sm font-bold rounded-xl transition-colors cursor-pointer border-none"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const token = localStorage.getItem('token');
                    if (token) {
                      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/logout`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` }
                      }).catch(() => {});
                    }
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('role');
                    navigate('/auth');
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-700 hover:bg-[#04211a] text-white text-sm font-bold rounded-xl transition-colors cursor-pointer border-none shadow-md shadow-red-600/20"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>

      {/* Mobile FAB - New Analysis */}
      <button
        onClick={triggerNewAnalysis}
        className="md:hidden fixed bottom-24 right-5 z-40 flex items-center gap-2 bg-[#04211a] text-white pl-4 pr-5 py-3.5 rounded-full text-sm font-bold shadow-2xl shadow-[#04211a]/40 active:scale-95 transition-all"
      >
        <PlaySquare className="w-5 h-5 text-emerald-400" />
        New Analysis
      </button>

      {/* Mobile Bottom Nav Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#e5e2d6] flex items-center justify-around px-2 py-2 safe-area-pb shadow-[0_-4px_20px_rgba(4,33,26,0.06)]">
        {menu.slice(0, 5).map((item) => (
          <button
            key={item.label}
            onClick={() => { setActiveTab(item.value); setIsMobileMenuOpen(false); }}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
              item.active ? 'text-emerald-700' : 'text-slate-400'
            }`}
          >
            <item.icon className={`w-5 h-5 ${item.active ? 'text-emerald-700' : 'text-slate-400'}`} />
            <span className={`text-[9px] font-black uppercase tracking-wider ${item.active ? 'text-emerald-700' : 'text-slate-400'}`}>
              {item.label.length > 7 ? item.label.slice(0, 6) + '…' : item.label}
            </span>
          </button>
        ))}
      </nav>

    </>
  );
}
