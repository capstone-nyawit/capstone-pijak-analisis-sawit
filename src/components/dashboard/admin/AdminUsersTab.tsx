import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Copy, CheckCircle2 } from 'lucide-react';

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
  handleApprove: (userId: string) => void;
  handleDelete: (userId: string) => void;
}

export default function AdminUsersTab({ usersList, handleRoleChange, handleApprove, handleDelete }: AdminUsersTabProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [expireAt, setExpireAt] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

  const fetchInviteStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${apiUrl}/invite/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        if (data.code) {
          setInviteCode(data.code);
          const ttl = data.ttl_seconds;
          setTimeLeft(ttl);
          setExpireAt(Date.now() + ttl * 1000);
        } else {
          generateCode();
        }
      }
    } catch (err) {
      console.error('Error fetching invite status:', err);
    }
  };

  const generateCode = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${apiUrl}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (res.ok) {
        setInviteCode(data.code);
        const ttl = data.ttl_seconds || 600;
        setTimeLeft(ttl);
        setExpireAt(Date.now() + ttl * 1000);
        setCopied(false);
      }
    } catch (err) {
      console.error('Error generating invite code:', err);
    }
  };

  useEffect(() => {
    fetchInviteStatus();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (expireAt !== null) {
      const remaining = Math.max(0, Math.floor((expireAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        setExpireAt(null);
        generateCode();
      } else {
        timer = setInterval(() => {
          const currentRemaining = Math.max(0, Math.floor((expireAt - Date.now()) / 1000));
          setTimeLeft(currentRemaining);
          if (currentRemaining === 0) {
            clearInterval(timer);
            setExpireAt(null);
            generateCode();
          }
        }, 1000);
      }
    }
    return () => clearInterval(timer);
  }, [expireAt]);

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

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 600) * circumference;

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="bg-white rounded-[2rem] border border-[#e5e2d6] shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-[#e5e2d6] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-extrabold text-[#04211a]">Organization Users</h3>
        
        {/* Authenticator Style Invite Code */}
        <div className="flex items-center gap-4 bg-white border border-[#e5e2d6] rounded-full pl-2 pr-4 py-1.5 shadow-sm">
          {/* Circular Timer */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="transform -rotate-90 w-10 h-10">
              <circle cx="20" cy="20" r={radius} stroke="#f1f5f9" strokeWidth="3" fill="none" />
              <circle 
                cx="20" 
                cy="20" 
                r={radius} 
                stroke="#10b981" 
                strokeWidth="3" 
                fill="none" 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset} 
                className="transition-all duration-1000 ease-linear" 
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-emerald-600">{formatTime(timeLeft)}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Invite Code</span>
            <span className="text-base font-mono font-black text-[#04211a] tracking-widest leading-none">{inviteCode || '------'}</span>
          </div>

          <div className="w-px h-6 bg-[#e5e2d6] mx-1"></div>

          <button onClick={handleCopy} className="p-1.5 text-slate-400 hover:text-[#04211a] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer active:scale-95">
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
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
                    {user.status === 'Pending' && (
                      <button 
                        onClick={() => handleApprove(user.id)}
                        className="p-2 text-emerald-600 hover:text-emerald-700 transition-colors rounded-lg hover:bg-emerald-50 active:scale-95 cursor-pointer"
                        title="Setujui Pengguna"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => setUserToDelete({ id: user.id, name: user.name })}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 cursor-pointer active:scale-95"
                      title="Hapus Pengguna"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 transition-all">
          <div className="bg-[#021611] border border-emerald-500/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl shadow-black/50">
            <p className="text-white text-sm mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus akun <strong>{userToDelete.name}</strong>? Akun tersebut akan terhapus permanen dari database dan tidak dapat digunakan lagi.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-5 py-2.5 text-sm font-bold text-emerald-500/50 hover:bg-white/5 hover:text-white rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              
              <button
                onClick={() => {
                  handleDelete(userToDelete.id);
                  setUserToDelete(null);
                }}
                className="px-5 py-2.5 text-sm font-bold bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl border border-red-500/20 hover:border-transparent transition-all cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </motion.div>
  );
}
