/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
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
  Trash2
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

        <div className="p-4 mt-auto border-t border-white/5">
          <button 
            onClick={() => navigate('/auth')}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent"
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
          <h1 className="text-2xl font-extrabold text-[#04211a] tracking-tight">{activeTab}</h1>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full border border-[#e5e2d6] flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors relative cursor-pointer active:scale-95">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-[1.5px] border-white" />
            </button>
            <div className="h-6 w-px bg-[#e5e2d6] mx-1"></div>
            <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border border-[#e5e2d6] hover:bg-slate-50 transition-all">
              <div className="w-8 h-8 bg-[#04211a] rounded-full flex items-center justify-center text-white font-bold text-xs uppercase">
                AD
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-bold text-[#04211a] leading-none">Admin</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Superuser</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
            </button>
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
                  />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
