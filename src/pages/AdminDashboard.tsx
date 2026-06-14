/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  LogOut, 
  Activity,
  AlertTriangle,
  Leaf,
  Sprout,
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Download,
  Filter,
  Plus,
  History,
  MapPin,
  ChevronDown,
  Bell,
  Eye,
  Edit,
  Trash2,
  User,
  Settings,
  TreePalm,
  Menu
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AdminOverviewTab from '../components/dashboard/admin/AdminOverviewTab';
import AdminLogsTab from '../components/dashboard/admin/AdminLogsTab';
import AdminUsersTab from '../components/dashboard/admin/AdminUsersTab';
import AdminReportsTab from '../components/dashboard/admin/AdminReportsTab';
import AccountSettingsTab from '../components/dashboard/AccountSettingsTab';

// MOCK DATA ----------------------------------------------------

const mockLogs = [
  { id: 'ANL-8422', user: 'Sarah Connor', role: 'Operator', date: 'Oct 25, 2026 09:15', block: 'Sector Alpha-1', trees: 3450, confidence: 95.2, status: 'Completed' },
  { id: 'ANL-8421', user: 'Mike Jenkins', role: 'Agronomist', date: 'Oct 24, 2026 14:30', block: 'Block B-05', trees: 2100, confidence: 91.8, status: 'Completed' },
  { id: 'ANL-8420', user: 'System Auto', role: 'System', date: 'Oct 24, 2026 02:00', block: 'Sector Delta-9', trees: 4200, confidence: 88.5, status: 'Flagged' },
  { id: 'ANL-8419', user: 'Sarah Connor', role: 'Operator', date: 'Oct 23, 2026 11:45', block: 'Block C-02', trees: 1840, confidence: 96.1, status: 'Completed' },
  { id: 'ANL-8418', user: 'David Chen', role: 'Operator', date: 'Oct 23, 2026 08:20', block: 'Sector Echo-3', trees: 5600, confidence: 93.4, status: 'Completed' },
];

const mockUsers = [
  { id: 'USR-01', name: 'Sarah Connor', email: 'sarah.c@nyawit.ai', role: 'Operator', status: 'Active', lastActive: '2 mins ago' },
  { id: 'USR-02', name: 'Mike Jenkins', email: 'mike.j@nyawit.ai', role: 'Agronomist', status: 'Active', lastActive: '1 hour ago' },
  { id: 'USR-03', name: 'David Chen', email: 'david.c@nyawit.ai', role: 'Operator', status: 'Active', lastActive: '3 hours ago' },
  { id: 'USR-04', name: 'Elena Rodriguez', email: 'elena.r@nyawit.ai', role: 'Manager', status: 'Active', lastActive: '1 day ago' },
  { id: 'USR-05', name: 'James Wilson', email: 'james.w@nyawit.ai', role: 'Viewer', status: 'Inactive', lastActive: '2 weeks ago' },
];

const mockReports = [
  { id: 'RPT-104', name: 'Monthly Organization Summary', type: 'PDF', date: 'Nov 1, 2026', size: '2.4 MB' },
  { id: 'RPT-103', name: 'Q3 Plantation Health Overview', type: 'PDF', date: 'Oct 15, 2026', size: '5.1 MB' },
  { id: 'RPT-102', name: 'High-Risk Zones Export', type: 'CSV', date: 'Oct 10, 2026', size: '850 KB' },
  { id: 'RPT-101', name: 'User Activity Log (Sept)', type: 'XLSX', date: 'Oct 1, 2026', size: '1.2 MB' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Logs' | 'Users' | 'Reports' | 'Settings'>('Overview');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: 'success' | 'info' | 'error' }[]>([]);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [inboxNotifications, setInboxNotifications] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string>('');

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
        if (selectedReportId === id) {
          setSelectedReportId('');
        }
      }
    } catch (err) {
      console.error("Failed to delete report", err);
    }
  };

  const deleteLog = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      
      const res = await fetch(`${apiUrl}/logs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        setLogs(prev => prev.filter(l => l.id !== id));
        showNotification('Log inference berhasil dihapus.', 'success');
      } else {
        const text = await res.text();
        showNotification(`Gagal menghapus log: ${text}`, 'error');
      }
    } catch (err) {
      console.error("Failed to delete log", err);
      showNotification('Terjadi kesalahan saat menghapus log.', 'error');
    }
  };

  const inboxRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadUserData = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr));
        } catch(e) {}
      }
    };
    loadUserData();
    window.addEventListener('profile_updated', loadUserData);
    return () => {
      window.removeEventListener('profile_updated', loadUserData);
    };
  }, []);

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
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);

    const newInboxItem = {
      id,
      message,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type
    };
    setInboxNotifications(prev => [newInboxItem, ...prev]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const markAsRead = async (id: string) => {
    setInboxNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      await fetch(`${apiUrl}/notifications/${id}/read`, {
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
      await fetch(`${apiUrl}/notifications/read-all`, {
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
      await fetch(`${apiUrl}/notifications/${id}`, {
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
      await fetch(`${apiUrl}/notifications/all/clear`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const triggerDownload = async (blockName: string, format: string) => {
    // Always download user-activity-xlsx from admin endpoint
    if (format === 'xlsx') {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          showNotification('Sesi login tidak ditemukan. Silakan login ulang.', 'error');
          return;
        }
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        showNotification('Mempersiapkan berkas Excel...', 'info');
        
        console.log('[Download] Fetching:', `${apiUrl}/admin/reports/user-activity-xlsx`);
        const res = await fetch(`${apiUrl}/admin/reports/user-activity-xlsx`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('[Download] Response status:', res.status, res.statusText);
        
        if (res.ok) {
          const blob = await res.blob();
          console.log('[Download] Blob size:', blob.size, 'type:', blob.type);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `User_Activity_Audit_Log_${new Date().toISOString().split('T')[0]}.xlsx`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
          showNotification('Berkas Excel berhasil diunduh!', 'success');
        } else {
          const errText = await res.text().catch(() => 'unknown error');
          console.error('[Download] Failed:', res.status, errText);
          showNotification(`Gagal mengunduh (${res.status}): ${res.statusText}`, 'error');
        }
      } catch (err) {
        console.error('[Download] Network error:', err);
        showNotification('Terjadi kesalahan jaringan saat mengunduh.', 'error');
      }
      return;
    }

    showNotification(`Berkas ${blockName} sedang diproses untuk diunduh.`, 'info');
  };


  const [usersList, setUsersList] = useState(mockUsers.map(u => ({
    ...u,
    role: u.role === 'Manager' ? 'Admin' : 'User'
  })));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        const res = await fetch(`${apiUrl}/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          const mappedUsers = data.map((u: any) => ({
            id: u.id.toString(),
            name: u.full_name || u.username || 'Unknown',
            email: u.email,
            role: u.role === 'admin' ? 'Admin' : 'User',
            status: u.status === 'pending' ? 'Pending' : (u.is_online ? 'Active' : 'Offline'),
            lastActive: u.last_active || 'Unknown'
          }));
          setUsersList(mappedUsers);
        }

        const [statsRes, logsRes, reportsRes, notifRes] = await Promise.all([
          fetch(`${apiUrl}/dashboard/stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/logs/`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/reports/`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/notifications/`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (statsRes.ok) {
          setDashboardStats(await statsRes.json());
        }

        if (logsRes.ok) {
          const logsData = await logsRes.json();
          const mappedLogs = logsData.map((l: any) => ({
            id: l.log_code,
            user: l.user_name,
            role: l.user_role,
            date: new Date(l.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            block: l.block_name,
            trees: l.trees_count || 0,
            confidence: l.confidence_score || 0,
            status: l.status,
            thumb: l.image_url,
            predictions: l.results_json,
            originalBlock: l.block_name
          }));
          setLogs(mappedLogs);
        }

        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          const sortedReports = [...reportsData].sort((a: any, b: any) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          const mappedReports = sortedReports.map((r: any) => {
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
              name: r.name,
              type: r.type,
              date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              size: r.size || 'N/A',
              url: r.report_url || '#',
              
              // Full properties needed by UI
              block: r.name,
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
          
          const activityLogReport = {
            id: 'activity-log-xlsx',
            block: 'User Activity & Audit Logs',
            name: 'User Activity & Audit Logs',
            type: 'XLSX',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            size: 'N/A',
            totalTrees: 0,
            healthy: 0,
            yellowing: 0,
            dead: 0,
            analysisDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            thumb: '',
            satelliteMap: '',
            highPriority: []
          };
          
          setReports([activityLogReport, ...mappedReports]);
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
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      }
    };
    fetchUsers();
  }, []);

  // WebSocket Integration for Real-time updates
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    // Determine ws:// or wss:// based on http/https
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const wsUrl = apiUrl.replace('http', 'ws') + `/ws/presence?token=${token}`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'status_update' || data.type === 'user_joined' || data.type === 'user_approved' || data.type === 'refresh_users') {
          // Re-fetch users to get the latest list when a presence/join event occurs
          const fetchUsers = async () => {
            const res = await fetch(`${apiUrl}/users`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              const usersData = await res.json();
              const mappedUsers = usersData.map((u: any) => ({
                id: u.id.toString(),
                name: u.full_name || u.username || 'Unknown',
                email: u.email,
                role: u.role === 'admin' ? 'Admin' : 'User',
                status: u.status === 'pending' ? 'Pending' : (u.is_online ? 'Active' : 'Offline'),
                lastActive: u.last_active || 'Unknown'
              }));
              setUsersList(mappedUsers);
            }
          };
          fetchUsers();
        }

        if (data.type === 'new_notification') {
          const fetchNotif = async () => {
             const notifRes = await fetch(`${apiUrl}/notifications/`, { headers: { 'Authorization': `Bearer ${token}` } });
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
          };
          fetchNotif();
        }
      } catch(e) {
        console.error("Failed to parse websocket message", e);
      }
    };
    
    return () => {
      ws.close();
    };
  }, []);

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${apiUrl}/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUsersList(prev => prev.filter(u => u.id !== userId));
        showNotification('Pengguna telah berhasil dihapus dari organisasi.', 'success');
      }
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${apiUrl}/users/${userId}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUsersList(prev => prev.map(u => u.id === userId ? { ...u, status: 'Active' } : u));
        showNotification('Pengguna telah berhasil disetujui.', 'success');
      }
    } catch (err) {
      console.error("Failed to approve user", err);
    }
  };

  const getUserDetails = (userName: string) => {
    const found = usersList.find(u => u.name === userName);
    if (found) {
      return { name: found.name, role: found.role };
    }
    return { name: userName, role: userName === 'System Auto' ? 'System' : 'User' };
  };

  const menu = [
    { icon: LayoutDashboard, label: 'Overview', value: 'Overview' as const },
    { icon: History, label: 'Inference Logs', value: 'Logs' as const },
    { icon: Users, label: 'User Management', value: 'Users' as const },
    { icon: FileText, label: 'Reports', value: 'Reports' as const },
  ];

  // TAB RENDERING CALLS ----------------------------------------

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
      
      {/* Sidebar Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar ------------------------------------------------- */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#04211a] text-white flex flex-col shadow-2xl transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 shrink-0`}>
        <div className="w-72 flex flex-col h-full">
          <button onClick={() => { setActiveTab('Overview'); setIsMobileMenuOpen(false); }} className="p-8 flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer text-left focus:outline-none">
            <div className="w-10 h-10 bg-brand-900 rounded-xl flex items-center justify-center shadow-lg shadow-brand-900/10 shrink-0">
              <TreePalm className="text-brand-500 w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-2xl tracking-tighter text-white block">
                Nyawit<span className="text-brand-500">AI</span>
              </span>
              <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest block opacity-80 mt-0.5">Admin Console</span>
            </div>
          </button>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-4">
            {menu.map((item) => (
              <button 
                key={item.label}
                onClick={() => {
                  setActiveTab(item.value);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === item.value 
                    ? 'bg-emerald-600/20 text-emerald-400 shadow-inner border border-emerald-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon className={`w-5 h-5 ${activeTab === item.value ? 'text-emerald-400' : 'opacity-70'}`} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
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
              {activeTab === 'Settings' ? 'Account Settings' : activeTab}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
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
                  {/* Header */}
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
            <div className="h-6 w-px bg-[#e5e2d6] mx-1"></div>
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border border-[#e5e2d6] hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border border-[#e5e2d6] shrink-0 bg-[#04211a]/5">
                  {currentUser?.profile_photo ? (
                    <img src={currentUser.profile_photo} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#04211a] font-bold text-xs uppercase">
                      {currentUser?.full_name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-xs font-bold text-[#04211a] leading-none">{currentUser?.full_name || 'Profile'}</span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">#{currentUser?.role || 'USER'}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#e5e2d6] shadow-[0_15px_30px_rgba(4,33,26,0.15)] z-50 overflow-hidden py-1">
                  <div className="p-4 border-b border-[#e5e2d6] bg-[#fcfbf7]">
                    <span className="text-sm font-bold text-[#04211a] block truncate">{currentUser?.full_name || 'User Profile'}</span>
                    <span className="text-[10px] text-slate-500 font-medium truncate block">{currentUser?.email || 'user@example.com'}</span>
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
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto scroll-smooth bg-white">
          <div className="w-full h-full">
            <AnimatePresence mode="wait">
              {activeTab === 'Overview' && (
                <div key="overview">
                  <AdminOverviewTab 
                    logs={logs} 
                    users={usersList}
                    getUserDetails={getUserDetails} 
                    setActiveTab={setActiveTab} 
                    stats={dashboardStats}
                  />
                </div>
              )}
              {activeTab === 'Logs' && (
                <div key="logs" className="h-full">
                  <AdminLogsTab 
                    logs={logs} 
                    getUserDetails={getUserDetails} 
                    deleteLog={deleteLog}
                  />
                </div>
              )}
              {activeTab === 'Users' && (
                <div key="users" className="h-full">
                  <AdminUsersTab 
                    usersList={usersList}
                    handleRoleChange={handleRoleChange}
                    handleApprove={handleApproveUser}
                    handleDelete={handleDeleteUser}
                  />
                </div>
              )}
              {activeTab === 'Reports' && (
                <div key="reports">
                  <AdminReportsTab 
                    reports={reports} 
                    triggerDownload={triggerDownload}
                    selectedReportId={selectedReportId}
                    setSelectedReportId={setSelectedReportId}
                    logs={logs}
                    deleteReport={deleteReport}
                  />
                </div>
              )}
              {activeTab === 'Settings' && (
                <div key="settings" className="h-full">
                  <AccountSettingsTab />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
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
    </div>
    </>
  );
}
