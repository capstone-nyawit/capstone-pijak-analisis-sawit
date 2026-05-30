import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CloudLightning, Search, Download, Trash2, Filter } from 'lucide-react';

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

type FilterStatus = 'ALL' | 'COMPLETED' | 'PENDING' | 'FAILED';

export default function UserLogsTab({ logs, deleteLog, triggerDownload }: UserLogsTabProps) {
  // --- STATE FILTER & SEARCH ---
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('ALL');
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);

  // --- LOGIKA UTAMA: FILTER DAN SEARCH ---
  const filteredLogs = logs.filter((log) => {
    // 1. Normalisasi status: jika 'Flagged' otomatis dikonversi menjadi 'PENDING'
    const normalizedStatus = log.status.toUpperCase() === 'FLAGGED' ? 'PENDING' : log.status.toUpperCase();
    
    // Pencocokan Filter Status
    const matchesFilter = activeFilter === 'ALL' || normalizedStatus === activeFilter;

    // Pencocokan Query Pencarian (Berdasarkan ID atau Nama Block)
    const matchesSearch = 
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.block.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <motion.div
      key="inference-logs-tab"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-black text-[#04211a] tracking-tight">Inference Logs</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">Daftar riwayat lengkap analisis citra drone UAV, deteksi mahkota kelapa sawit, dan preskripsi VRA.</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-[#e5e2d6] shadow-sm overflow-visible flex flex-col">
        <div className="p-6 border-b border-[#e5e2d6] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#fcfbf7] rounded-t-[2rem]">
          <div className="flex items-center gap-2">
            <CloudLightning className="w-5 h-5 text-emerald-600" />
            <span className="font-extrabold text-[#04211a]">Total Analisis: {filteredLogs.length} Snapshot</span>
          </div>
          
          {/* Kontrol Pencarian & Filter Status */}
          <div className="flex items-center gap-2 max-w-md w-full justify-end relative">
            {/* Search Input */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#e5e2d6] text-xs w-full max-w-xs shadow-sm">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Analysis ID atau Block / Zone"
                className="bg-transparent border-none outline-none w-full font-medium text-slate-600"
              />
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 text-xs font-bold bg-white border-[#e5e2d6] text-slate-600 hover:bg-slate-50`}
              >
                <Filter className="w-3.5 h-3.5" />
                {activeFilter !== 'ALL' && <span>{activeFilter}</span>}
              </button>

              <AnimatePresence>
                {showFilterDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-40 bg-white border border-[#e5e2d6] rounded-xl shadow-xl z-30 py-1 overflow-hidden"
                    >
                      {(['ALL', 'COMPLETED', 'PENDING', 'FAILED'] as FilterStatus[]).map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setActiveFilter(status);
                            setShowFilterDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors border-none bg-transparent cursor-pointer block ${
                            activeFilter === status 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {status === 'ALL' ? 'Show All' : status}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Wrapper Table - Menggunakan max-h agar area tabel bisa di-scroll secara independen */}
        <div className="overflow-x-auto max-h-[450px] overflow-y-auto scroll-smooth rounded-b-[2rem]">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* MODIFIKASI: Menambahkan class sticky top-0, z-10, dan shadow-sm agar header tetap fixed di atas */}
              <tr className="bg-[#fcfbf7] border-b border-[#e5e2d6] sticky top-0 z-10 shadow-sm">
                {/* MODIFIKASI: Setiap 'th' dipastikan memiliki bg-[#fcfbf7] agar data di bawahnya tersembunyi dengan sempurna saat di-scroll */}
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 pl-6 uppercase tracking-widest w-20 bg-[#fcfbf7]">Preview</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-[#fcfbf7]">Analysis ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-[#fcfbf7]">Block / Zone</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-[#fcfbf7]">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-[#fcfbf7]">Confidence</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right pr-6 bg-[#fcfbf7]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm font-medium text-slate-400 bg-white">
                    No data available
                  </td>
                </tr>
              ) : (
                filteredLogs.map((row) => {
                  const displayStatus = row.status.toUpperCase() === 'FLAGGED' ? 'Pending' : row.status;
                  return (
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
                          displayStatus.toLowerCase() === 'completed' ? 'bg-emerald-100/50 border border-emerald-200 text-emerald-700' : 'bg-amber-100/50 border border-amber-200 text-amber-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${displayStatus.toLowerCase() === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          {displayStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-bold text-emerald-800">{row.confidence}</span>
                      </td>
                      <td className="px-6 py-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                           <button className="p-2.5 text-slate-400 border border-slate-200 bg-white hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all shadow-sm cursor-pointer" onClick={() => deleteLog(row.id)} title="Hapus Riwayat">
                             <Trash2 className="w-4 h-4" />
                           </button>
                           <button className="p-2.5 text-white bg-[#04211a] hover:bg-emerald-950 rounded-xl transition-all shadow-sm font-bold text-xs px-4 cursor-pointer active:scale-95">
                             Details
                           </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}