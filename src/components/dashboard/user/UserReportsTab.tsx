/**
 * User Reports Tab - Executive reports and record sheets
 * Features dynamic, high-fidelity browser printing to PDF using the rule engine recommendation details.
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  Sprout, 
  Download, 
  FileText,
  Loader2
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';
import ReportPDF from '@/components/reports/ReportPDF';

// --- INTERFACES ---
interface HighPriorityTree {
  id: string;
  condition: string;
  coords: string;
}

interface Report {
  id: string;
  block: string;
  originalName?: string;
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
  logs: any[];
  onStartAnalysis?: () => void;
}

export default function UserReportsTab({
  reports,
  selectedReportId,
  setSelectedReportId,
  triggerDownload,
  logs
}: UserReportsTabProps) {
  
  const [printRec, setPrintRec] = useState<any>(null);
  const [isLoadingPrint, setIsLoadingPrint] = useState(false);
  const [activeReportRec, setActiveReportRec] = useState<any>(null);

  // --- KONDISI OTOMATIS JIKA DATA DIHAPUS ---
  const isSelectedReportValid = reports.some((r) => r.id === selectedReportId);

  useEffect(() => {
    if (reports.length > 0 && !isSelectedReportValid) {
      setSelectedReportId(reports[0].id);
    }
  }, [reports, isSelectedReportValid, setSelectedReportId]);

  const selectedReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  // Fetch recommendation for the currently selected preview report
  useEffect(() => {
    if (!selectedReport) return;
    
    const fetchActiveReportRec = async () => {
      const matchingLog = logs.find((l: any) => l.block === selectedReport.block);
      if (!matchingLog) return;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const headers = { 'Authorization': `Bearer ${token}` };
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

        const res = await fetch(`${apiUrl}/vra/recommendation/log/${matchingLog.id}`, { headers });
        if (res.ok) {
          const data = await res.json();
          setActiveReportRec(data);
        }
      } catch (err) {
        console.error("Failed to fetch active report recommendation details:", err);
      }
    };

    fetchActiveReportRec();
  }, [selectedReport, logs]);

  const handlePrintPDF = async (rep: Report) => {
    const matchingLog = logs.find((l: any) => l.block === rep.block);
    if (!matchingLog) {
      alert("Data analisis untuk blok ini tidak ditemukan di riwayat log.");
      return;
    }
    
    setIsLoadingPrint(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const headers = { 'Authorization': `Bearer ${token}` };
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

      const res = await fetch(`${apiUrl}/vra/recommendation/log/${matchingLog.id}`, { headers });
      if (res.ok) {
        const recData = await res.json();
        setPrintRec(recData);
        // Wait for state to reflect in PrintableReportTemplate, then trigger print
        setTimeout(() => {
          window.print();
        }, 150);
      } else {
        alert("Gagal memproses rekomendasi VRA untuk laporan.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingPrint(false);
    }
  };

  return (
    <motion.div
      key="reports-tab"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Title Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#04211a] tracking-tight">Reports & Records</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Kelola data bisnis operasional kebun, ringkasan zonasi kesehatan, dan ekspor laporan kerja.
          </p>
        </div>
        {isLoadingPrint && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[#04211a] text-white rounded-full text-xs font-bold shadow-md">
            <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>Mempersiapkan PDF...</span>
          </div>
        )}
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
                      <img src={localStorage.getItem(`analysis_img_${(rep.originalName || rep.block).toLowerCase()}`) || rep.thumb} className="w-full h-full object-cover" alt={rep.block} />
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
                      onClick={() => handlePrintPDF(rep)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black shadow-sm transition-all active:scale-95 cursor-pointer border-none"
                    >
                      <Download className="w-3 h-3 text-blue-200" />
                      PDF
                    </button>
                    <button
                      onClick={() => triggerDownload(rep.block, 'XLSX')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black shadow-sm transition-all active:scale-95 cursor-pointer border-none"
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
            <div className="flex justify-between items-center border-b border-slate-200 pb-6">
              <div className="text-left">
                <h3 className="text-xl font-extrabold text-[#04211a]">Plantation Status Report</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1.5">
                  {selectedReport.block} • Snapshot
                </p>
              </div>
              <button 
                onClick={() => handlePrintPDF(selectedReport)}
                className="flex items-center gap-1 px-4 py-2 bg-[#04211a] hover:bg-emerald-950 text-white rounded-xl text-xs font-bold transition-all border-none cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                Cetak PDF Laporan
              </button>
            </div>

            {/* Actual Print Template Preview */}
            <div className="mt-6 border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
              <ReportPDF report={selectedReport} recommendation={activeReportRec} />
            </div>

          </div>
        </div>
      )}

      {/* Hidden printable report sheet */}
      {selectedReport && createPortal(
        <ReportPDF report={selectedReport} recommendation={printRec} />,
        document.body
      )}
    </motion.div>
  );
}