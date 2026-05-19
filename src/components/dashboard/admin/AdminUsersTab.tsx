/**
 * Admin Users Tab
 * Manages users and allows switching user roles between User and Admin.
 */

import { motion } from 'motion/react';
import { Plus, Edit, Trash2 } from 'lucide-react';

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
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="bg-white rounded-[2rem] border border-[#e5e2d6] shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-[#e5e2d6] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-extrabold text-[#04211a]">Organization Users</h3>
        <button className="flex items-center gap-2 bg-[#04211a] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-emerald-950 transition-all shadow-md active:scale-95">
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
    </motion.div>
  );
}
