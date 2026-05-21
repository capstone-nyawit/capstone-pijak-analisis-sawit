/**
 * Admin Users Tab
 * Manages users and allows switching user roles between User and Admin.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit, Trash2, Copy, X, Clock, CheckCircle2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

interface AdminUsersTabProps {
  usersList: User[];
  handleRoleChange: (userId: string, newRole: string) => void;
}

export default function AdminUsersTab({ usersList, handleRoleChange }: AdminUsersTabProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'NYA-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setInviteCode(code);
    setTimeLeft(600);
    setCopied(false);
  };

  const openInviteModal = () => {
    generateCode();
    setIsInviteModalOpen(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isInviteModalOpen && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isInviteModalOpen && timeLeft === 0) {
      generateCode();
    }
    return () => clearInterval(timer);
  }, [isInviteModalOpen, timeLeft]);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="bg-white rounded-[2rem] border border-[#e5e2d6] shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-[#e5e2d6] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-extrabold text-[#04211a]">Organization Users</h3>
        <button 
          onClick={openInviteModal}
          className="flex items-center gap-2 bg-[#04211a] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-emerald-950 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fcfbf7] border-b border-[#e5e2d6] text-xs font-bold text-slate-500 uppercase tracking-widest">
              <th className="px-6 py-4 font-bold">User</th>
              <th className="px-6 py-4 font-bold">Role</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Last Active</th>
              <th className="px-6 py-4 text-right font-bold">Manage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e2d6]">
            {usersList.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs uppercase shrink-0">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#04211a] text-sm">{user.name}</span>
                      <span className="text-xs text-slate-500 font-medium">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={user.role} 
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="text-sm font-semibold text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-md border-r-8 border-transparent outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className="text-sm font-bold text-slate-600">{user.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-500">{user.lastActive}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute inset-0 bg-[#04211a]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-[2rem] border border-[#e5e2d6] shadow-2xl p-8 max-w-md w-full"
            >
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col items-center text-center mt-4">
                <h3 className="text-2xl font-black text-[#04211a] mb-2">Invite New User</h3>
                <p className="text-sm font-semibold text-slate-500 mb-8 max-w-[280px]">
                  Bagikan kode unik ini kepada pengguna baru untuk bergabung.
                </p>

                <div className="w-full bg-[#fcfbf7] border-2 border-dashed border-[#e5e2d6] rounded-2xl p-6 relative group">
                  <div className="text-3xl font-mono font-black text-[#04211a] tracking-[0.1em] md:tracking-[0.2em] break-all">{inviteCode}</div>
                  
                  <button 
                    onClick={handleCopy}
                    className="absolute top-1/2 right-4 -translate-y-1/2 p-2.5 bg-white border border-[#e5e2d6] rounded-xl text-slate-500 hover:text-[#04211a] hover:bg-emerald-50 hover:border-emerald-200 transition-all shadow-sm cursor-pointer active:scale-95"
                  >
                    {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-6 px-4 py-2 bg-amber-50 rounded-full border border-amber-100">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-amber-700">
                    Kode ini hangus dalam <span className="font-mono text-sm ml-1">{formatTime(timeLeft)}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
