/**
 * Admin Logs Tab
 * Displays the complete set of inference activity records and statuses.
 */

import { motion } from 'motion/react';
import { Search, Filter, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';

interface UserDetail {
  name: string;
  role: string;
}

interface Log {
  id: string;
  user: string;
  role: string;
  date: string;
  block: string;
  trees: number;
  confidence: number;
  status: string;
}

interface AdminLogsTabProps {
  logs: Log[];
  getUserDetails: (userName: string) => UserDetail;
}

export default function AdminLogsTab({ logs, getUserDetails }: AdminLogsTabProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="bg-white rounded-[2rem] border border-[#e5e2d6] shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-[#e5e2d6] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-extrabold text-[#04211a]">Inference History</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-[#fcfbf7] px-4 py-2 rounded-xl border border-[#e5e2d6] text-sm w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search ID or Block..." className="bg-transparent border-none outline-none w-full font-medium text-slate-700 placeholder:text-slate-400" />
          </div>
          <button className="p-2.5 rounded-xl border border-[#e5e2d6] text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fcfbf7] border-b border-[#e5e2d6] text-xs font-bold text-slate-500 uppercase tracking-widest">
              <th className="px-6 py-4 font-bold">Analysis ID</th>
              <th className="px-6 py-4 font-bold">Block / Zone</th>
              <th className="px-6 py-4 font-bold">Operator</th>
              <th className="px-6 py-4 font-bold">Date & Time</th>
              <th className="px-6 py-4 font-bold">Trees</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e2d6]">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <span className="font-bold text-[#04211a]">{log.id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-slate-700">{log.block}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-sm">{getUserDetails(log.user).name}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{getUserDetails(log.user).role}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600">{log.date}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-700">{log.trees.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    log.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {log.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-[#e5e2d6] bg-[#fcfbf7] flex justify-center text-sm font-bold text-slate-500">
        Showing {logs.length} of 1,248 logs
      </div>
    </motion.div>
  );
}
