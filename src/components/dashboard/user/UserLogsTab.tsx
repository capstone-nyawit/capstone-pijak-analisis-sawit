/**
 * User Logs Tab - Inference History log view
 */

import { motion } from 'motion/react';
import { CloudLightning, Search, Download, Trash2 } from 'lucide-react';

interface Log {
  id: string;
  date: string;
  block: string;
  trees: number;
  status: string;
  confidence: string;
  thumb: string;
}

interface UserLogsTabProps {
  logs: Log[];
  deleteLog: (id: string) => void;
  triggerDownload: (block: string, format: string) => void;
}

export default function UserLogsTab({ logs, deleteLog, triggerDownload }: UserLogsTabProps) {
  return (
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

        <div className="overflow-x-auto scroll-smooth">
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
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
