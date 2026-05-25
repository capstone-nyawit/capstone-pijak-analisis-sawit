/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
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
  Settings
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AdminOverviewTab from '../components/dashboard/admin/AdminOverviewTab';
import AdminLogsTab from '../components/dashboard/admin/AdminLogsTab';
import AdminUsersTab from '../components/dashboard/admin/AdminUsersTab';
import AdminReportsTab from '../components/dashboard/admin/AdminReportsTab';

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
  const [activeTab, setActiveTab] = useState<'Overview' | 'Logs' | 'Users' | 'Reports'>('Overview');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: 'success' | 'info' | 'error' }[]>([]);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [inboxNotifications, setInboxNotifications] = useState([
    { id: 'join-1', message: 'Pengguna baru (Budi Santoso) berhasil bergabung ke organisasi menggunakan kode undangan.', time: '10:05 AM', read: false, type: 'success' }
  ]);

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

  const markAsRead = (id: string) => {
    setInboxNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInboxNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const triggerDownload = (reportName: string) => {
    showNotification(`Berkas ${reportName} berhasil diekspor dan diunduh ke sistem lokal Anda!`, 'success');
  };

  const [usersList, setUsersList] = useState(mockUsers.map(u => ({
    ...u,
    role: u.role === 'Manager' ? 'Admin' : 'User'
  })));

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
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
      
      {/* Sidebar ------------------------------------------------- */}
      <div className="w-72 bg-[#04211a] text-white flex flex-col shadow-2xl relative z-20 shrink-0">
        <button onClick={() => setActiveTab('Overview')} className="p-8 flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer text-left focus:outline-none">
          <div className="w-10 h-10 bg-brand-900 rounded-xl flex items-center justify-center shadow-lg shadow-brand-900/10 shrink-0">
            <Leaf className="text-brand-500 w-6 h-6" />
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
              onClick={() => setActiveTab(item.value)}
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

      {/* Main Content ------------------------------------------ */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-[#e5e2d6] flex items-center justify-between px-8 z-30 shrink-0 sticky top-0">
          <h1 className="text-2xl font-extrabold text-[#04211a] tracking-tight">{activeTab}</h1>
          
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
            <div className="h-6 w-px bg-[#e5e2d6] mx-1"></div>
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border border-[#e5e2d6] hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
              >
                <div className="w-8 h-8 bg-[#04211a]/5 rounded-full flex items-center justify-center text-[#04211a] font-bold text-xs uppercase border border-[#e5e2d6]">
                  A
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-xs font-bold text-[#04211a] leading-none">Profile</span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">#NYA-ADMIN</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#e5e2d6] shadow-[0_15px_30px_rgba(4,33,26,0.15)] z-50 overflow-hidden py-1">
                  <div className="p-4 border-b border-[#e5e2d6] bg-[#fcfbf7]">
                    <span className="text-sm font-bold text-[#04211a] block">Admin Profile</span>
                    <span className="text-[10px] text-slate-500 font-medium">Superuser</span>
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
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#fcfbf7]">
          <div className="max-w-6xl mx-auto h-full">
            <AnimatePresence mode="wait">
              {activeTab === 'Overview' && (
                <div key="overview">
                  <AdminOverviewTab 
                    logs={mockLogs} 
                    getUserDetails={getUserDetails} 
                    setActiveTab={setActiveTab} 
                  />
                </div>
              )}
              {activeTab === 'Logs' && (
                <div key="logs" className="h-full">
                  <AdminLogsTab 
                    logs={mockLogs} 
                    getUserDetails={getUserDetails} 
                  />
                </div>
              )}
              {activeTab === 'Users' && (
                <div key="users" className="h-full">
                  <AdminUsersTab 
                    usersList={usersList} 
                    handleRoleChange={handleRoleChange} 
                  />
                </div>
              )}
              {activeTab === 'Reports' && (
                <div key="reports">
                  <AdminReportsTab 
                    reports={mockReports} 
                    triggerDownload={triggerDownload}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>
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
