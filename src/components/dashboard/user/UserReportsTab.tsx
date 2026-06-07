/**
 * User Reports Tab - Executive reports and record sheets
 * Terintegrasi penuh dengan sistem penghapusan log aktivitas.
 */

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  Sprout, 
  Download, 
  FileText 
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';

// --- INTERFACES ---
interface HighPriorityTree {
  id: string;
  condition: string;
  coords: string;
}

interface Report {
  id: string;
  block: string;
  date: string;
  totalTrees: number;
  healthy: number;
  yellowing: number;
  dead: number;
  analysisDate: string;
  thumb: string;
  satelliteMap: string;
  highPriority: HighPriorityTree[];
}

interface UserReportsTabProps {
  reports: Report[];
  selectedReportId: string;
  setSelectedReportId: (id: string) => void;
  triggerDownload: (block: string, format: string) => void;
  onStartAnalysis?: () => void; // Opsional jika dibutuhkan tombol aksi tambahan
}

export default function UserReportsTab({
  reports,
  selectedReportId,
  setSelectedReportId,
  triggerDownload,
}: UserReportsTabProps) {
  
  // --- KONDISI OTOMATIS JIKA DATA DIHAPUS ---
  // Periksa apakah ID laporan yang dipilih saat ini masih ada di dalam array data
  const isSelectedReportValid = reports.some((r) => r.id === selectedReportId);

  useEffect(() => {
    // Jika laporan aktif dihapus dari daftar tetapi array masih memiliki laporan lain,
    // alihkan seleksi secara otomatis ke laporan indeks pertama yang tersedia.
    if (reports.length > 0 && !isSelectedReportValid) {
      setSelectedReportId(reports[0].id);
    }
  }, [reports, isSelectedReportValid, setSelectedReportId]);

  // Menentukan data laporan yang aktif dirender ke layar
  const selectedReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  return (
    <motion.div
      key="reports-tab"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-black text-[#04211a] tracking-tight">Reports & Records</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Kelola data bisnis operasional kebun, ringkasan zonasi kesehatan, dan ekspor laporan kerja.
        </p>
      </div>

      {/* 1. KONDISI KOSONG (EMPTY STATE) */}
      {reports.length === 0 || !selectedReport ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col justify-center items-center py-28 bg-white rounded-[2rem] border border-[#e5e2d6] shadow-sm text-center px-4"
        >
          <div className="w-16 h-16 bg-slate-50 border border-[#e5e2d6] rounded-2xl flex items-center justify-center mb-4 text-slate-400 shadow-inner">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-base font-extrabold text-[#04211a]">Belum Ada Laporan Tersedia</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
            Data laporan sinkron dengan hasil analisis Anda. Silakan jalankan deteksi citra drone baru atau kembalikan log aktivitas di tab inference.
          </p>
        </motion.div>
      ) : (
        /* 2. KONDISI DATA TERSEDIA */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pt-2 items-start">
          
          {/* Kolom Kiri: Daftar Blok Perkebunan (5 Kolom) */}
          <div className="xl:col-span-5 space-y-4 max-h-[680px] overflow-y-auto pr-1">
            {reports.map((rep) => {
              const isSelected = selectedReport.id === rep.id;
              return (
                <motion.div
                  key={rep.id}
                  onClick={() => setSelectedReportId(rep.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`p-4 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between gap-4 bg-white
                    ${isSelected 
                      ? 'border-emerald-600 bg-emerald-50/15 shadow-[0_8px_30px_rgba(4,33,26,0.06)]' 
                      : 'border-[#e5e2d6] hover:border-emerald-600/40 hover:bg-slate-50/30 shadow-sm'}
                  `}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Thumbnail Satelit */}
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 shadow-inner shrink-0 relative">
                      <img src={rep.thumb} className="w-full h-full object-cover" alt={rep.block} />
                      <div className="absolute inset-0 bg-[#04211a]/5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-extrabold text-[#04211a] truncate">{rep.block}</h4>
                      <p className="text-[10px] text-slate-400 font-bold tracking-tight mt-1">{rep.date}</p>
                    </div>
                  </div>

                  {/* Tombol Aksi Ekspor */}
                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => triggerDownload(rep.block, 'PDF')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <Download className="w-3 h-3 text-blue-200" />
                      PDF
                    </button>
                    <button
                      onClick={() => triggerDownload(rep.block, 'XLSX')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <Download className="w-3 h-3 text-emerald-200" />
                      XLSX
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Kolom Kanan: Lembar Preview Cetak Dokumen (7 Kolom) */}
          <div className="xl:col-span-7 bg-white rounded-[2rem] border border-[#e5e2d6] shadow-sm p-6 md:p-8 space-y-6 relative overflow-hidden">
            
            {/* Garis Aksen Dekoratif Atas */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#04211a]" />
            
            {/* Header Lembar Laporan */}
            <div className="text-center pb-6 border-b border-slate-200">
              <h3 className="text-xl font-extrabold text-[#04211a]">Plantation Status Report</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1.5">
                {selectedReport.block} • Snapshot
              </p>
            </div>

            {/* Grid Ringkasan & Grafik Lingkaran */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 bg-[#fcfbf7] rounded-2xl border border-[#e5e2d6] relative">
              <div className="md:col-span-7 grid grid-cols-2 gap-y-5 gap-x-4 md:border-r border-[#e5e2d6]/80 md:pr-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Trees</span>
                  <span className="text-lg font-black text-[#04211a]">{selectedReport.totalTrees.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Healthy</span>
                  <span className="text-lg font-black text-emerald-600">{selectedReport.healthy.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Yellowing</span>
                  <span className="text-lg font-black text-amber-600">{selectedReport.yellowing.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Dead Trees</span>
                  <span className="text-lg font-black text-red-600">{selectedReport.dead.toLocaleString()}</span>
                </div>
                <div className="col-span-2 pt-2.5 border-t border-[#e5e2d6]/50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Analysis Date</span>
                  <span className="text-xs font-bold text-slate-700">{selectedReport.analysisDate}</span>
                </div>
              </div>

              {/* Grafik Lingkaran Mini */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div className="w-24 h-24 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Healthy', value: selectedReport.healthy },
                          { name: 'Yellowing', value: selectedReport.yellowing },
                          { name: 'Dead', value: selectedReport.dead }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={20}
                        outerRadius={36}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#ef4444" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">
                  Condition Ratio
                </span>
              </div>
            </div>

            {/* Tabel Lokasi Prioritas Tinggi */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#04211a] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600 text-opacity-80" />
                High-Priority Locations
              </h4>
              <div className="overflow-hidden border border-[#e5e2d6] rounded-2xl shadow-inner bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#fcfbf7] border-b border-[#e5e2d6] font-bold text-slate-400 uppercase text-[9px] tracking-widest">
                      <th className="px-5 py-3 pl-5">Tree ID</th>
                      <th className="px-5 py-3">Condition</th>
                      <th className="px-5 py-3 pr-5">Coordinates</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReport.highPriority.map((tree, idx) => (
                      <tr key={idx} className="border-b border-[#e5e2d6]/50 last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3 font-mono font-bold text-slate-700">{tree.id}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                            tree.condition === 'Dead' 
                              ? 'bg-red-50 text-red-700 border border-red-100' 
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {tree.condition}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-mono text-slate-500">{tree.coords}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rekomendasi & Marker Peta Satelit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-2">
              <div className="p-4 bg-[#faf8f0] border border-[#e5e2d6] rounded-2xl space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#04211a] flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                  Rekomendasi Pemupukan
                </span>
                <p className="text-[10px] text-slate-600 font-semibold leading-relaxed">
                  Dosis VRA Pelepah: Naikkan 15% Mg pada zona merah. Berikan pengairan teratur di area pinggiran {selectedReport.block} untuk mengembalikan vitalitas pelepah sawit.
                </p>
              </div>

              {/* Kontainer Snapshot Satelit */}
              <div className="h-28 rounded-2xl overflow-hidden border border-[#e5e2d6] shadow-sm relative group">
                <img 
                  src={selectedReport.satelliteMap} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt="Satellite Preview" 
                />
                <div className="absolute inset-0 bg-[#04211a]/20 group-hover:bg-[#04211a]/10 transition-colors" />
                <div className="absolute top-2 left-2 bg-[#04211a]/95 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-white/10">
                  Sector Map
                </div>
                
                {/* Marker Target Peta */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-3.5 h-3.5 bg-red-500 rounded-full border border-white shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" />
                  <span className="text-[8px] font-black text-white bg-black/85 px-1 py-0.5 rounded shadow mt-1">
                    {selectedReport.block}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </motion.div>
  );
}