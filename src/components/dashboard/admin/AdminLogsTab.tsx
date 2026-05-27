/**
 * Admin Logs Tab
 * Displays the complete set of inference activity records and statuses.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Eye, CheckCircle2, AlertTriangle, X, Image as ImageIcon, MapPin } from 'lucide-react';

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
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [vraStatus, setVraStatus] = useState<'PENDING' | 'COMPLETED'>('PENDING');

  const toggleVraStatus = () => {
    setVraStatus(prev => prev === 'PENDING' ? 'COMPLETED' : 'PENDING');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="bg-white flex flex-col h-full overflow-hidden">
      <div className="p-6 md:p-8 border-b border-[#e5e2d6] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-extrabold text-[#04211a]">Inference History</h3>
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
      
      <div className="overflow-x-auto scroll-smooth">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fcfbf7] border-b border-[#e5e2d6] text-xs font-bold text-slate-500 uppercase tracking-widest">
              <th className="px-6 md:px-8 py-4 font-bold">Analysis ID</th>
              <th className="px-6 md:px-8 py-4 font-bold">Block / Zone</th>
              <th className="px-6 md:px-8 py-4 font-bold">Operator</th>
              <th className="px-6 md:px-8 py-4 font-bold">Date & Time</th>
              <th className="px-6 md:px-8 py-4 font-bold">Trees</th>
              <th className="px-6 md:px-8 py-4 font-bold">Status</th>
              <th className="px-6 md:px-8 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e2d6]">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 md:px-8 py-4">
                  <span className="font-bold text-[#04211a]">{log.id}</span>
                </td>
                <td className="px-6 md:px-8 py-4">
                  <span className="font-semibold text-slate-700">{log.block}</span>
                </td>
                <td className="px-6 md:px-8 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-sm">{getUserDetails(log.user).name}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{getUserDetails(log.user).role}</span>
                  </div>
                </td>
                <td className="px-6 md:px-8 py-4 text-sm font-medium text-slate-600">{log.date}</td>
                <td className="px-6 md:px-8 py-4 text-sm font-semibold text-slate-700">{log.trees.toLocaleString()}</td>
                <td className="px-6 md:px-8 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    log.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {log.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {log.status}
                  </span>
                </td>
                <td className="px-6 md:px-8 py-4 text-right">
                  {log.status === 'Completed' ? (
                    <button 
                      onClick={() => { setSelectedLog(log); setVraStatus('PENDING'); }}
                      className="p-2 text-slate-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50 cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  ) : log.status === 'Flagged' ? (
                    <button 
                      onClick={() => { setSelectedLog(log); setVraStatus('PENDING'); }}
                      className="px-2 py-1 bg-amber-950 text-amber-400 border border-amber-800 rounded text-[11px] font-semibold hover:bg-amber-900 transition-all cursor-pointer shadow-sm"
                    >
                      Resolve
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-[#e5e2d6] bg-[#fcfbf7] flex justify-center text-sm font-bold text-slate-500 shrink-0">
        Showing {logs.length} of 1,248 logs
      </div>

      {/* Slide-over Drawer for Log Details */}
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
                
                {/* 1. HEADER & METADATA LOG */}
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
                    <span className="text-sm font-semibold text-slate-800">{getUserDetails(selectedLog.user).name}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date & Time</span>
                    <span className="text-sm font-semibold text-slate-800">{selectedLog.date}</span>
                  </div>
                </div>

                {/* 3. INDIKATOR HIGH-RISK ALERTS */}
                {selectedLog.status === 'Flagged' && (
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

                {/* 2. VISUALISASI & HASIL OBJEK DETEKSI */}
                <div className="bg-white rounded-2xl border border-[#e5e2d6] shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-[#e5e2d6]">
                    <h4 className="text-sm font-extrabold text-[#04211a]">Detection Output (Faster R-CNN)</h4>
                  </div>
                  <div className="p-6 flex flex-col lg:flex-row gap-8">
                    {/* Placeholder Image */}
                    <div className="flex-1 bg-slate-100 rounded-xl min-h-[250px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 relative overflow-hidden group">
                      <ImageIcon className="w-10 h-10 text-slate-300 mb-3 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Orthophoto View</span>
                      {/* Mock Bounding Box */}
                      <div className="absolute top-[20%] left-[30%] w-16 h-16 border-[1.5px] border-emerald-500 rounded bg-emerald-500/10"></div>
                      <div className="absolute bottom-[30%] right-[25%] w-12 h-12 border-[1.5px] border-amber-500 rounded bg-amber-500/10"></div>
                      <div className="absolute top-[40%] left-[50%] w-20 h-20 border-[1.5px] border-red-500 rounded bg-red-500/10"></div>
                      <div className="absolute bottom-[10%] left-[20%] w-14 h-14 border-[1.5px] border-teal-500 rounded bg-teal-500/10"></div>
                    </div>
                    
                    {/* Metrics */}
                    <div className="flex-1 flex flex-col justify-center space-y-6">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Trees Detected</span>
                        <span className="text-4xl font-black text-[#04211a]">{selectedLog.trees.toLocaleString()}</span>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Healthy */}
                        <div>
                          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                            <span>Healthy Canopy</span>
                            <span className="text-emerald-600">{Math.round(selectedLog.trees * 0.70).toLocaleString()} (70%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                          </div>
                        </div>
                        {/* Small */}
                        <div>
                          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                            <span>Small Canopy</span>
                            <span className="text-teal-600">{Math.round(selectedLog.trees * 0.12).toLocaleString()} (12%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-teal-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                          </div>
                        </div>
                        {/* Yellowing */}
                        <div>
                          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                            <span>Yellowing / Nutrient Deficient</span>
                            <span className="text-amber-500">{Math.round(selectedLog.trees * 0.14).toLocaleString()} (14%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-amber-400 h-2 rounded-full" style={{ width: '14%' }}></div>
                          </div>
                        </div>
                        {/* Dead */}
                        <div>
                          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                            <span>Dead / Missing</span>
                            <span className="text-red-500">{Math.round(selectedLog.trees * 0.04).toLocaleString()} (4%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '4%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. TABEL VRA RECOMMENDATION */}
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
                          <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-[#04211a]">{selectedLog.block}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-amber-600">Defisiensi Nitrogen (Kuning)</td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-600">Aplikasi Urea 1.5kg/pohon (Zona Merah)</td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={toggleVraStatus}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95 ${
                                vraStatus === 'PENDING' 
                                  ? 'bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200' 
                                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200'
                              }`}
                            >
                              {vraStatus}
                            </button>
                          </td>
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
