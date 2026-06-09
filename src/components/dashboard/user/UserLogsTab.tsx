// import { useState } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
// import { 
//   CloudLightning, 
//   Search, 
//   Download, 
//   Trash2, 
//   Filter, 
//   Eye, 
//   CheckCircle2, 
//   AlertTriangle, 
//   X, 
//   Image as ImageIcon, 
//   MapPin, 
//   XCircle 
// } from 'lucide-react';
// import { log } from 'console';

// interface Log {
//   id: string;
//   date: string;
//   block: string;
//   trees: number;
//   status: string;
//   confidence: string;
//   thumb: string;
// }

// interface UserLogsTabProps {
//   logs: Log[];
//   deleteLog: (id: string) => void;
//   triggerDownload: (block: string, format: string) => void;
// }

// type FilterStatus = 'ALL' | 'COMPLETED' | 'PENDING' | 'FAILED';

// export default function UserLogsTab({ logs, deleteLog, triggerDownload }: UserLogsTabProps) {
//   // --- STATE FILTER & SEARCH ---
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [activeFilter, setActiveFilter] = useState<FilterStatus>('ALL');
//   const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);

//   // --- STATE DETAIL DRAWER (DIADAPTASI DARI ADMIN) ---
//   const [selectedLog, setSelectedLog] = useState<Log | null>(null);
//   const [vraStatus, setVraStatus] = useState<'PENDING' | 'COMPLETED'>('PENDING');
//   const [logToDelete, setLogToDelete] = useState<string | null>(null);

//   const toggleVraStatus = () => {
//     setVraStatus(prev => prev === 'PENDING' ? 'COMPLETED' : 'PENDING');
//   };

//   // --- LOGIKA UTAMA: FILTER DAN SEARCH ---
//   const filteredLogs = logs.filter((log) => {
//     // 1. Normalisasi status: jika 'Flagged' otomatis dikonversi menjadi 'PENDING'
//     const normalizedStatus = log.status.toUpperCase() === 'FLAGGED' ? 'PENDING' : log.status.toUpperCase();
    
//     // Pencocokan Filter Status
//     const matchesFilter = activeFilter === 'ALL' || normalizedStatus === activeFilter;

//     // Pencocokan Query Pencarian (Berdasarkan ID atau Nama Block)
//     const matchesSearch = 
//       log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       log.block.toLowerCase().includes(searchQuery.toLowerCase());

//     return matchesFilter && matchesSearch;
//   });

//   return (
//     <motion.div
//       key="inference-logs-tab"
//       initial={{ opacity: 0, y: 15 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0 }}
//       className="space-y-6"
//     >
//       <div>
//         <h2 className="text-2xl font-black text-[#04211a] tracking-tight">Inference Logs</h2>
//         <p className="text-sm text-slate-500 font-medium mt-1">Daftar riwayat lengkap analisis citra drone UAV, deteksi mahkota kelapa sawit, dan preskripsi VRA.</p>
//       </div>

//       <div className="bg-white rounded-[2rem] border border-[#e5e2d6] shadow-sm overflow-visible flex flex-col">
//         <div className="p-6 border-b border-[#e5e2d6] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#fcfbf7] rounded-t-[2rem]">
//           <div className="flex items-center gap-2">
//             <CloudLightning className="w-5 h-5 text-emerald-600" />
//             <span className="font-extrabold text-[#04211a]">Total Analisis: {filteredLogs.length} Snapshot</span>
//           </div>
          
//           {/* Kontrol Pencarian & Filter Status */}
//           <div className="flex items-center gap-2 max-w-md w-full justify-end relative">
//             {/* Search Input */}
//             <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#e5e2d6] text-xs w-full max-w-xs shadow-sm">
//               <Search className="w-3.5 h-3.5 text-slate-400" />
//               <input 
//                 type="text" 
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Cari Analysis ID atau Block / Zone"
//                 className="bg-transparent border-none outline-none w-full font-medium text-slate-600"
//               />
//               {searchQuery && (
//                 <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => setSearchQuery('')} />
//               )}
//             </div>

//             <div className="relative">
//               <button 
//                 onClick={() => setShowFilterDropdown(!showFilterDropdown)}
//                 className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 text-xs font-bold bg-white border-[#e5e2d6] text-slate-600 hover:bg-slate-50`}
//               >
//                 <Filter className="w-3.5 h-3.5" />
//                 {activeFilter !== 'ALL' && <span>{activeFilter}</span>}
//               </button>

//               <AnimatePresence>
//                 {showFilterDropdown && (
//                   <>
//                     <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(false)} />
//                     <motion.div 
//                       initial={{ opacity: 0, y: 10 }} 
//                       animate={{ opacity: 1, y: 0 }} 
//                       exit={{ opacity: 0, y: 10 }}
//                       className="absolute right-0 mt-2 w-40 bg-white border border-[#e5e2d6] rounded-xl shadow-xl z-30 py-1 overflow-hidden"
//                     >
//                       {(['ALL', 'COMPLETED', 'PENDING', 'FAILED'] as FilterStatus[]).map((status) => (
//                         <button
//                           key={status}
//                           onClick={() => {
//                             setActiveFilter(status);
//                             setShowFilterDropdown(false);
//                           }}
//                           className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors border-none bg-transparent cursor-pointer block ${
//                             activeFilter === status 
//                               ? 'bg-emerald-50 text-emerald-700' 
//                               : 'text-slate-600 hover:bg-slate-50'
//                           }`}
//                         >
//                           {status === 'ALL' ? 'Show All' : status}
//                         </button>
//                       ))}
//                     </motion.div>
//                   </>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>
//         </div>

//         {/* Wrapper Table */}
//         <div className="overflow-x-auto max-h-[450px] overflow-y-auto scroll-smooth rounded-b-[2rem]">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-[#fcfbf7] border-b border-[#e5e2d6] sticky top-0 z-10 shadow-sm">
//                 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 pl-6 uppercase tracking-widest w-20 bg-[#fcfbf7]">Preview</th>
//                 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-[#fcfbf7]">Analysis ID</th>
//                 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-[#fcfbf7]">Block / Zone</th>
//                 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-[#fcfbf7]">Status</th>
//                 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-[#fcfbf7]">Confidence</th>
//                 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right pr-6 bg-[#fcfbf7]">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredLogs.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-12 text-center text-sm font-medium text-slate-400 bg-white">
//                     No data available
//                   </td>
//                 </tr>
//               ) : (
//                 filteredLogs.map((row) => {
//                   const displayStatus = row.status.toUpperCase() === 'FLAGGED' ? 'Pending' : row.status;
//                   return (
//                     <tr key={row.id} className="border-b border-[#e5e2d6]/50 hover:bg-slate-50/50 transition-colors group">
//                       <td className="px-6 py-4">
//                         <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden relative border border-slate-200 shadow-sm">
//                           <img src={row.thumb} alt={row.id} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
//                           <div className="absolute inset-0 bg-[#04211a]/10"></div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="text-sm font-bold text-[#04211a] block">{row.id}</span>
//                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.date}</span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="text-sm font-bold text-slate-700 block">{row.block}</span>
//                         <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mt-1 inline-block">{row.trees} trees</span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
//                           displayStatus.toUpperCase() === 'COMPLETED' ? 'bg-emerald-100/50 border border-emerald-200 text-emerald-700' : 
//                           displayStatus.toUpperCase() === 'PENDING' ? 'bg-amber-100/50 border border-amber-200 text-amber-700' : 'bg-red-100/50 border border-red-200 text-red-700'
//                         }`}>
//                           {displayStatus.toUpperCase() === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : 
//                            displayStatus.toUpperCase() === 'PENDING' ? <AlertTriangle className="w-3 h-3 text-amber-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
//                           {displayStatus}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="text-sm font-mono font-bold text-emerald-800">{row.confidence}</span>
//                       </td>
//                       <td className="px-6 py-4 text-right pr-6">
//                         <div className="flex items-center justify-end gap-2">
//                           <button 
//                             className="p-2.5 text-slate-400 border border-slate-200 bg-white hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all shadow-sm cursor-pointer" 
//                             onClick={() => setLogToDelete(log.id)} // Mengubah row.id menjadi log.id menyesuaikan mapping tabel Anda
//                             title="Hapus Riwayat"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                           <button 
//                             onClick={() => { setSelectedLog(row); setVraStatus('PENDING'); }}
//                             className="p-2.5 text-white bg-[#04211a] hover:bg-emerald-950 rounded-xl transition-all shadow-sm font-bold text-xs px-4 cursor-pointer active:scale-95 flex items-center gap-1"
//                           >
//                             Details
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Slide-over Drawer Section (Sama persis dengan AdminLogsTab) */}
//       <AnimatePresence>
//         {selectedLog && (
//           <div className="fixed inset-0 z-[9999] flex justify-end bg-[#04211a]/40 backdrop-blur-sm transition-all">
//             <motion.div 
//               initial={{ x: '100%' }}
//               animate={{ x: 0 }}
//               exit={{ x: '100%' }}
//               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
//               className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col"
//             >
//               <div className="p-6 md:p-8 border-b border-[#e5e2d6] flex justify-between items-center bg-[#fcfbf7] shrink-0">
//                 <h3 className="text-xl font-extrabold text-[#04211a]">Inference Details</h3>
//                 <button 
//                   onClick={() => setSelectedLog(null)}
//                   className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-8 bg-[#fcfbf7]">
//                 <div className="bg-white p-6 rounded-2xl border border-[#e5e2d6] shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <div>
//                     <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Analysis ID</span>
//                     <span className="font-mono text-sm font-bold text-[#04211a] bg-slate-100 px-2 py-1 rounded">{selectedLog.id}</span>
//                   </div>
//                   <div>
//                     <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Block / Zone</span>
//                     <span className="text-sm font-semibold text-slate-800">{selectedLog.block}</span>
//                   </div>
//                   <div>
//                     <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Confidence</span>
//                     <span className="text-sm font-semibold text-slate-800">
//                       {selectedLog.confidence}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date & Time</span>
//                     <span className="text-sm font-semibold text-slate-800">{selectedLog.date}</span>
//                   </div>
//                 </div>

//                 {/* Convert flagged/pending status alert */}
//                 {(selectedLog.status.toUpperCase() === 'FLAGGED' || selectedLog.status.toUpperCase() === 'PENDING') && (
//                   <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex items-start gap-4">
//                     <div className="bg-red-100 p-2 rounded-full shrink-0">
//                       <AlertTriangle className="w-5 h-5 text-red-600" />
//                     </div>
//                     <div>
//                       <h4 className="text-sm font-bold text-red-700 mb-1">High-Risk Anomaly Detected</h4>
//                       <p className="text-xs text-red-600 font-medium leading-relaxed">
//                         Konsentrasi area dengan kanopi menguning atau mati melebihi ambang batas toleransi historis pada sektor ini. Segera tinjau rekomendasi VRA dan instruksikan tim lapangan.
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 <div className="bg-white rounded-2xl border border-[#e5e2d6] shadow-sm overflow-hidden">
//                   <div className="p-6 border-b border-[#e5e2d6]">
//                     <h4 className="text-sm font-extrabold text-[#04211a]">Detection Output</h4>
//                   </div>
//                   <div className="p-6 flex flex-col lg:flex-row gap-8">
//                     <div className="flex-1 bg-slate-100 rounded-xl min-h-[250px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 relative overflow-hidden group">
//                       {selectedLog.thumb ? (
//                         <img src={selectedLog.thumb} alt="Orthophoto View" className="absolute inset-0 w-full h-full object-cover" />
//                       ) : (
//                         <>
//                           <ImageIcon className="w-10 h-10 text-slate-300 mb-3 group-hover:scale-110 transition-transform" />
//                           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Orthophoto View</span>
//                         </>
//                       )}
//                       <div className="absolute top-[20%] left-[30%] w-16 h-16 border-[1.5px] border-emerald-500 rounded bg-emerald-500/10"></div>
//                       <div className="absolute bottom-[30%] right-[25%] w-12 h-12 border-[1.5px] border-amber-500 rounded bg-amber-500/10"></div>
//                       <div className="absolute top-[40%] left-[50%] w-20 h-20 border-[1.5px] border-red-500 rounded bg-red-500/10"></div>
//                       <div className="absolute bottom-[10%] left-[20%] w-14 h-14 border-[1.5px] border-teal-500 rounded bg-teal-500/10"></div>
//                     </div>
                    
//                     <div className="flex-1 flex flex-col justify-center space-y-6">
//                       <div>
//                         <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Trees Detected</span>
//                         <span className="text-4xl font-black text-[#04211a]">{selectedLog.trees.toLocaleString()}</span>
//                       </div>
                      
//                       <div className="space-y-4">
//                         <div>
//                           <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
//                             <span>Healthy Canopy</span>
//                             <span className="text-emerald-600">{Math.round(selectedLog.trees * 0.70).toLocaleString()} (70%)</span>
//                           </div>
//                           <div className="w-full bg-slate-100 rounded-full h-2">
//                             <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '70%' }}></div>
//                           </div>
//                         </div>
//                         <div>
//                           <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
//                             <span>Small Canopy</span>
//                             <span className="text-teal-600">{Math.round(selectedLog.trees * 0.12).toLocaleString()} (12%)</span>
//                           </div>
//                           <div className="w-full bg-slate-100 rounded-full h-2">
//                             <div className="bg-teal-500 h-2 rounded-full" style={{ width: '12%' }}></div>
//                           </div>
//                         </div>
//                         <div>
//                           <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
//                             <span>Yellowing / Nutrient Deficient</span>
//                             <span className="text-amber-500">{Math.round(selectedLog.trees * 0.14).toLocaleString()} (14%)</span>
//                           </div>
//                           <div className="w-full bg-slate-100 rounded-full h-2">
//                             <div className="bg-amber-400 h-2 rounded-full" style={{ width: '14%' }}></div>
//                           </div>
//                         </div>
//                         <div>
//                           <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
//                             <span>Dead / Missing</span>
//                             <span className="text-red-500">{Math.round(selectedLog.trees * 0.04).toLocaleString()} (4%)</span>
//                           </div>
//                           <div className="w-full bg-slate-100 rounded-full h-2">
//                             <div className="bg-red-500 h-2 rounded-full" style={{ width: '4%' }}></div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-2xl border border-[#e5e2d6] shadow-sm overflow-hidden mb-8">
//                   <div className="p-6 border-b border-[#e5e2d6] flex items-center gap-2">
//                     <MapPin className="w-4 h-4 text-emerald-600" />
//                     <h4 className="text-sm font-extrabold text-[#04211a]">VRA Recommendation Activity</h4>
//                   </div>
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-left">
//                       <thead>
//                         <tr className="bg-[#fcfbf7] border-b border-[#e5e2d6] text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                           <th className="px-6 py-4">Sector / Block</th>
//                           <th className="px-6 py-4">Detected Issue</th>
//                           <th className="px-6 py-4">Recommended Action</th>
//                           <th className="px-6 py-4 text-right">Status</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-slate-100">
//                         <tr className="hover:bg-slate-50 transition-colors">
//                           <td className="px-6 py-4 text-sm font-bold text-[#04211a]">{selectedLog.block}</td>
//                           <td className="px-6 py-4 text-sm font-semibold text-amber-600">Defisiensi Nitrogen (Kuning)</td>
//                           <td className="px-6 py-4 text-sm font-semibold text-slate-600">Aplikasi Urea 1.5kg/pohon (Zona Merah)</td>
//                           <td className="px-6 py-4 text-right">
//                             <button 
//                               onClick={toggleVraStatus}
//                               className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95 ${
//                                 vraStatus === 'PENDING' 
//                                   ? 'bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200' 
//                                   : 'bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200'
//                               }`}
//                             >
//                               {vraStatus}
//                             </button>
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {logToDelete && (
//           <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-[#04211a]/40 backdrop-blur-sm">
//             <div className="fixed inset-0" onClick={() => setLogToDelete(null)} />
            
//             <motion.div 
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="bg-white rounded-2xl border border-[#e5e2d6] p-6 max-w-md w-full shadow-2xl relative z-10 space-y-6"
//             >
//               <div className="flex items-start gap-4">
//                 <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-red-600 shrink-0">
//                   <AlertTriangle className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <h4 className="text-base font-extrabold text-[#04211a] mb-1">Delete Inference Record</h4>
//                   <p className="text-xs text-slate-500 font-medium leading-relaxed">
//                     Are you sure you want to delete analysis ID <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">{logToDelete}</span>? This action is permanent and cannot be undone.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 pt-2">
//                 <button
//                   onClick={() => setLogToDelete(null)}
//                   className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => {
//                     deleteLog(logToDelete);
//                     setLogToDelete(null);
//                   }}
//                   className="px-4 py-2 bg-red-600 border border-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-all cursor-pointer shadow-sm active:scale-95"
//                 >
//                   Yes, Delete
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CloudLightning, 
  Search, 
  Download, 
  Trash2, 
  Filter, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Image as ImageIcon, 
  MapPin, 
  XCircle 
} from 'lucide-react';

interface Log {
  id: string;
  date: string;
  block: string;
  originalBlock?: string;
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

  // --- STATE DETAIL DRAWER ---
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [vraStatus, setVraStatus] = useState<'PENDING' | 'COMPLETED'>('PENDING');
  const [logToDelete, setLogToDelete] = useState<string | null>(null);
  const [activeRecommendation, setActiveRecommendation] = useState<any>(null);
  const [loadingRec, setLoadingRec] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedLog) {
      setActiveRecommendation(null);
      return;
    }
    
    const fetchRec = async () => {
      setLoadingRec(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const headers = { 'Authorization': `Bearer ${token}` };
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

        const res = await fetch(`${apiUrl}/vra/recommendation/log/${selectedLog.id}`, { headers });
        if (res.ok) {
          const data = await res.json();
          setActiveRecommendation(data);
        }
      } catch (err) {
        console.error("Failed to fetch VRA recommendation for log:", err);
      } finally {
        setLoadingRec(false);
      }
    };

    fetchRec();
  }, [selectedLog]);

  const toggleVraStatus = () => {
    setVraStatus(prev => prev === 'PENDING' ? 'COMPLETED' : 'PENDING');
  };

  // --- LOGIKA UTAMA: FILTER DAN SEARCH ---
  const filteredLogs = logs.filter((log) => {
    const normalizedStatus = log.status.toUpperCase() === 'FLAGGED' ? 'PENDING' : log.status.toUpperCase();
    const matchesFilter = activeFilter === 'ALL' || normalizedStatus === activeFilter;
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
          
          <div className="flex items-center gap-2 max-w-md w-full justify-end relative">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#e5e2d6] text-xs w-full max-w-xs shadow-sm">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Analysis ID atau Block / Zone"
                className="bg-transparent border-none outline-none w-full font-medium text-slate-600"
              />
              {searchQuery && (
                <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => setSearchQuery('')} />
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 text-xs font-bold bg-white border-[#e5e2d6] text-slate-600 hover:bg-slate-50"
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

        <div className="overflow-x-auto max-h-[450px] overflow-y-auto scroll-smooth rounded-b-[2rem]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fcfbf7] border-b border-[#e5e2d6] sticky top-0 z-10 shadow-sm">
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
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
                          displayStatus.toUpperCase() === 'COMPLETED' ? 'bg-emerald-100/50 border border-emerald-200 text-emerald-700' : 
                          displayStatus.toUpperCase() === 'PENDING' ? 'bg-amber-100/50 border border-amber-200 text-amber-700' : 'bg-red-100/50 border border-red-200 text-red-700'
                        }`}>
                          {displayStatus.toUpperCase() === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : 
                          displayStatus.toUpperCase() === 'PENDING' ? <AlertTriangle className="w-3 h-3 text-amber-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                          {displayStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-bold text-emerald-800">{row.confidence}</span>
                      </td>
                      <td className="px-6 py-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            className="p-2.5 text-slate-400 border border-slate-200 bg-white hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all shadow-sm cursor-pointer" 
                            onClick={() => setLogToDelete(row.id)}
                            title="Hapus Riwayat"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setSelectedLog(row); setVraStatus('PENDING'); }}
                            className="p-2.5 text-white bg-[#04211a] hover:bg-emerald-950 rounded-xl transition-all shadow-sm font-bold text-xs px-4 cursor-pointer active:scale-95 flex items-center gap-1"
                          >
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

      {/* Slide-over Drawer Section */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-[9999] flex justify-end bg-[#04211a]/40 backdrop-blur-sm transition-all">
            <div className="fixed inset-0" onClick={() => setSelectedLog(null)} /> {/* Tambahan penutup klik backdrop */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col relative z-10"
            >
              <div className="p-6 md:p-8 border-b border-[#e5e2d6] flex justify-between items-center bg-[#fcfbf7] shrink-0">
                <h3 className="text-xl font-extrabold text-[#04211a]">Inference Details</h3>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-8 bg-[#fcfbf7]">
                <div className="bg-white p-6 rounded-2xl border border-[#e5e2d6] shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Analysis ID</span>
                    <span className="font-mono text-sm font-bold text-[#04211a] bg-slate-100 px-2 py-1 rounded">{selectedLog.id}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Block / Zone</span>
                    <span className="text-sm font-semibold text-slate-800">{selectedLog.block}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Confidence</span>
                    <span className="text-sm font-semibold text-slate-800">{selectedLog.confidence}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date & Time</span>
                    <span className="text-sm font-semibold text-slate-800">{selectedLog.date}</span>
                  </div>
                </div>

                {(selectedLog.status.toUpperCase() === 'FLAGGED' || selectedLog.status.toUpperCase() === 'PENDING') && (
                  <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex items-start gap-4">
                    <div className="bg-red-100 p-2 rounded-full shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-red-700 mb-1">High-Risk Anomaly Detected</h4>
                      <p className="text-xs text-red-600 font-medium leading-relaxed">
                        Konsentrasi area dengan kanopi menguning atau mati melebihi ambang batas toleransi historis pada sektor ini. Segera tinjau rekomendasi VRA dan instruksikan tim lapangan.
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl border border-[#e5e2d6] shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-[#e5e2d6]">
                    <h4 className="text-sm font-extrabold text-[#04211a]">Detection Output</h4>
                  </div>
                  <div className="p-6 flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 bg-slate-100 rounded-xl min-h-[250px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 relative overflow-hidden group">
                      {(() => {
                        const localImg = localStorage.getItem(`analysis_img_${(selectedLog.originalBlock || selectedLog.block).toLowerCase()}`);
                        const displayThumb = localImg || selectedLog.thumb;
                        return displayThumb ? (
                          <img src={displayThumb} alt="Orthophoto View" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <>
                            <ImageIcon className="w-10 h-10 text-slate-300 mb-3 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Orthophoto View</span>
                          </>
                        );
                      })()}
                      <div className="absolute top-[20%] left-[30%] w-16 h-16 border-[1.5px] border-emerald-500 rounded bg-emerald-500/10"></div>
                      <div className="absolute bottom-[30%] right-[25%] w-12 h-12 border-[1.5px] border-amber-500 rounded bg-amber-500/10"></div>
                      <div className="absolute top-[40%] left-[50%] w-20 h-20 border-[1.5px] border-red-500 rounded bg-red-500/10"></div>
                      <div className="absolute bottom-[10%] left-[20%] w-14 h-14 border-[1.5px] border-teal-500 rounded bg-teal-500/10"></div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center space-y-6">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Trees Detected</span>
                        <span className="text-4xl font-black text-[#04211a]">{selectedLog.trees.toLocaleString()}</span>
                      </div>
                      
                      {(() => {
                        const hCount = activeRecommendation ? activeRecommendation.healthy_count : Math.round(selectedLog.trees * 0.84);
                        const sCount = activeRecommendation ? activeRecommendation.small_canopy_count : Math.round(selectedLog.trees * 0.12);
                        const yCount = activeRecommendation ? activeRecommendation.yellowing_count : Math.round(selectedLog.trees * 0.03);
                        const dCount = activeRecommendation ? activeRecommendation.dead_count : (selectedLog.trees - hCount - sCount - yCount);
                        const total = selectedLog.trees || 1;

                        const pHealthy = ((hCount / total) * 100).toFixed(1);
                        const pSmall = ((sCount / total) * 100).toFixed(1);
                        const pYellow = ((yCount / total) * 100).toFixed(1);
                        const pDead = ((dCount / total) * 100).toFixed(1);

                        return (
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                                <span>Healthy Canopy</span>
                                <span className="text-emerald-600">{hCount.toLocaleString()} ({pHealthy}%)</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2">
                                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${pHealthy}%` }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                                <span>Small Canopy</span>
                                <span className="text-teal-600">{sCount.toLocaleString()} ({pSmall}%)</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2">
                                <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${pSmall}%` }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                                <span>Yellowing / Nutrient Deficient</span>
                                <span className="text-amber-500">{yCount.toLocaleString()} ({pYellow}%)</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2">
                                <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${pYellow}%` }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                                <span>Dead / Missing</span>
                                <span className="text-red-500">{dCount.toLocaleString()} ({pDead}%)</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2">
                                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${pDead}%` }}></div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#e5e2d6] shadow-sm overflow-hidden mb-8">
                  <div className="p-6 border-b border-[#e5e2d6] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-sm font-extrabold text-[#04211a]">VRA Recommendation Activity</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#fcfbf7] border-b border-[#e5e2d6] text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          <th className="px-6 py-4">Sector / Block</th>
                          <th className="px-6 py-4">Detected Issue</th>
                          <th className="px-6 py-4">Recommended Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {loadingRec ? (
                          <tr>
                            <td colSpan={3} className="px-6 py-4 text-center text-xs font-bold text-slate-400">
                              Loading VRA recommendations...
                            </td>
                          </tr>
                        ) : activeRecommendation ? (
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-[#04211a]">{selectedLog.block}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-amber-600">
                              {activeRecommendation.primary_concern}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                              {activeRecommendation.recommended_programs}
                            </td>
                          </tr>
                        ) : (
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-[#04211a]">{selectedLog.block}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-slate-600">Routine Monitoring</td>
                            <td className="px-6 py-4 text-sm font-semibold text-slate-550">Routine NPK fertilization program</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal Section */}
      <AnimatePresence>
        {logToDelete && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-[#04211a]/40 backdrop-blur-sm">
            <div className="fixed inset-0" onClick={() => setLogToDelete(null)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-[#e5e2d6] p-6 max-w-md w-full shadow-2xl relative z-10 space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-red-600 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#04211a] mb-1">Delete Inference Record</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Are you sure you want to delete analysis ID <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">{logToDelete}</span>? This action is permanent and cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setLogToDelete(null)}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteLog(logToDelete);
                    setLogToDelete(null);
                  }}
                  className="px-4 py-2 bg-red-600 border border-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}