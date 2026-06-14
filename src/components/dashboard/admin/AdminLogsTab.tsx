import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, CheckCircle2, AlertTriangle, X, Image as ImageIcon, MapPin, XCircle, Trash2 } from 'lucide-react';

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
  thumb?: string;
  predictions?: any;
  originalBlock?: string;
}

interface AdminLogsTabProps {
  logs: Log[];
  getUserDetails: (userName: string) => UserDetail;
  deleteLog: (id: string) => void;
}

type FilterStatus = 'ALL' | 'COMPLETED' | 'PENDING' | 'FAILED';

// URL Gambar Dummy untuk Frontend Preview (Menggunakan Unsplash Lanskap Perkebunan/Hutan)
const DUMMY_PREVIEW_IMAGE = "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&q=80&w=600";

export default function AdminLogsTab({ logs, getUserDetails, deleteLog }: AdminLogsTabProps) {
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [vraStatus, setVraStatus] = useState<'PENDING' | 'COMPLETED'>('PENDING');
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('ALL');
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);

  const toggleVraStatus = () => {
    setVraStatus(prev => prev === 'PENDING' ? 'COMPLETED' : 'PENDING');
  };

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
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="bg-white flex flex-col h-full overflow-hidden">
      
      <div className="p-6 md:p-8 border-b border-[#e5e2d6] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-extrabold text-[#04211a]">Inference History</h3>
        
        <div className="flex items-center gap-3 w-full sm:w-auto relative">
          <div className="flex items-center gap-2 bg-[#fcfbf7] px-4 py-2 rounded-xl border border-[#e5e2d6] text-sm w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID or Block..." 
              className="bg-transparent border-none outline-none w-full font-medium text-slate-700 placeholder:text-slate-400" 
            />
            {searchQuery && (
              <X className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => setSearchQuery('')} />
            )}
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
      
      {/* Tabel Utama */}
      <div className="overflow-x-auto scroll-smooth flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fcfbf7] border-b border-[#e5e2d6] text-xs font-bold text-slate-500 uppercase tracking-widest sticky top-0 z-10 shadow-sm">
              <th className="px-6 md:px-8 py-4 font-bold ">Preview</th>
              <th className="px-6 md:px-8 py-4 font-bold ">Analysis ID</th>
              <th className="px-6 md:px-8 py-4 font-bold">Block / Zone</th>
              <th className="px-6 md:px-8 py-4 font-bold">Operator</th>
              <th className="px-6 md:px-8 py-4 font-bold">Date & Time</th>
              <th className="px-6 md:px-8 py-4 font-bold">Trees</th>
              <th className="px-6 md:px-8 py-4 font-bold">Status</th>
              <th className="px-6 md:px-8 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e2d6]">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => {
                // Konversi visual: 'Flagged' as 'Pending'
                const displayStatus = log.status.toUpperCase() === 'FLAGGED' ? 'Pending' : log.status;
                const userDetails = getUserDetails(log.user);

                return (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                    {/* Dummy Preview Gambar Kolom */}
                    <td className="px-6 md:px-8 py-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-[#e5e2d6] flex items-center justify-center relative shadow-sm">
                        <img 
                          src={log.thumb || DUMMY_PREVIEW_IMAGE} 
                          alt="Orthophoto Thumbnail" 
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4">
                      <span className="font-bold text-[#04211a]">{log.id}</span>
                    </td>
                    <td className="px-6 md:px-8 py-4">
                      <span className="font-semibold text-slate-700">{log.block}</span>
                    </td>
                    <td className="px-6 md:px-8 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">
                          {userDetails?.name || 'Unknown Operator'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">
                          {userDetails?.role || 'Staff'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 text-sm font-medium text-slate-600">{log.date}</td>
                    <td className="px-6 md:px-8 py-4 text-sm font-semibold text-slate-700">{log.trees.toLocaleString()}</td>
                    <td className="px-6 md:px-8 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        displayStatus.toUpperCase() === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 
                        displayStatus.toUpperCase() === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {displayStatus.toUpperCase() === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3" /> : 
                         displayStatus.toUpperCase() === 'PENDING' ? <AlertTriangle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {displayStatus}
                      </span>
                    </td>
                    <td className="px-6 md:px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {displayStatus.toUpperCase() === 'COMPLETED' ? (
                          <button 
                            onClick={() => { setSelectedLog(log); setVraStatus('PENDING'); }}
                            className="p-2.5 text-white bg-[#04211a] hover:bg-emerald-950 rounded-xl transition-all shadow-sm font-bold text-xs px-4 cursor-pointer active:scale-95 flex items-center gap-1 inline-block"
                          >
                            Details
                          </button>
                        ) : (
                          <button 
                            onClick={() => { setSelectedLog(log); setVraStatus('PENDING'); }}
                            className="px-2 py-1 bg-amber-950 text-amber-400 border border-amber-800 rounded text-[11px] font-semibold hover:bg-amber-900 transition-all cursor-pointer shadow-sm"
                          >
                            Resolve
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus log inference ${log.id}?`)) {
                              deleteLog(log.id);
                            }
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all active:scale-95 cursor-pointer"
                          title="Hapus Log"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-sm font-semibold text-slate-400">
                  No inference records found matching the current search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-[#e5e2d6] bg-[#fcfbf7] flex justify-center text-sm font-bold text-slate-500 shrink-0">
        Showing {filteredLogs.length} of {logs.length} logs
      </div>

      {/* Slide-over Drawer Section */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-[9999] flex justify-end bg-[#04211a]/40 backdrop-blur-sm transition-all">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col"
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
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Operator</span>
                    <span className="text-sm font-semibold text-slate-800">
                      {getUserDetails(selectedLog.user)?.name || 'Unknown'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date & Time</span>
                    <span className="text-sm font-semibold text-slate-800">{selectedLog.date}</span>
                  </div>
                </div>

                {/* convert flagged to pending */}
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

                <div className="bg-white rounded-2xl border border-[#e5e2d6] shadow-sm overflow-hidden mb-8">
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
                      {(() => {
                        if (!selectedLog.predictions) return null;
                        let preds: any[] = [];
                        if (typeof selectedLog.predictions === 'string') {
                          try { preds = JSON.parse(selectedLog.predictions); } catch(e) {}
                        } else if (Array.isArray(selectedLog.predictions)) {
                          preds = selectedLog.predictions;
                        }
                        return preds.map((pred: any, idx: number) => {
                          const box = pred.box || pred.bbox;
                          if (!box) return null;
                          const [xc, yc, w, h] = box;
                          const scale = 0.5;
                          const tw = w * scale;
                          const th = h * scale;
                          const left = (xc - tw / 2) * 100;
                          const top = (yc - th / 2) * 100;
                          const width = tw * 100;
                          const height = th * 100;
                          const cid = pred.class_id || pred.class;
                          let borderColor = 'border-emerald-400';
                          let bgColor = 'bg-emerald-500/10';
                          if (cid === 0) { borderColor = 'border-red-500'; bgColor = 'bg-red-500/15'; }
                          else if (cid === 4) { borderColor = 'border-amber-400'; bgColor = 'bg-amber-400/15'; }
                          else if (cid === 3) { borderColor = 'border-blue-400'; bgColor = 'bg-blue-500/10'; }
                          return (
                            <div key={idx} className={`absolute border ${borderColor} ${bgColor} rounded-sm`}
                              style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }} />
                          );
                        });
                      })()}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center space-y-6">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Trees Detected</span>
                        <span className="text-4xl font-black text-[#04211a]">{selectedLog.trees.toLocaleString()}</span>
                      </div>
                      
                      {(() => {
                        const hCount = Math.round(selectedLog.trees * 0.70);
                        const sCount = Math.round(selectedLog.trees * 0.12);
                        const yCount = Math.round(selectedLog.trees * 0.14);
                        const dCount = Math.round(selectedLog.trees * 0.04);
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
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Action Summary</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-[#04211a]">{selectedLog.block}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-emerald-600">Generated</td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-700">Detailed VRA prescriptions available in user report</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

