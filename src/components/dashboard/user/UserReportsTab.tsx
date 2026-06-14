/**
 * User Reports Tab - Plantation Reports
 * Features dynamic, high-fidelity browser printing to PDF using the rule engine recommendation details.
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { 
  Download, 
  FileText,
  Loader2,
  Trash2
} from 'lucide-react';
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
  predictions?: any;
  inferenceLogId?: number;
  logCode?: string;
}

interface UserReportsTabProps {
  reports: Report[];
  selectedReportId: string;
  setSelectedReportId: (id: string) => void;
  triggerDownload: (block: string, format: string) => void;
  logs: any[];
  onStartAnalysis?: () => void;
  deleteReport: (id: string) => void;
}

export default function UserReportsTab({
  reports,
  selectedReportId,
  setSelectedReportId,
  triggerDownload,
  logs,
  deleteReport
}: UserReportsTabProps) {
  
  const [printRec, setPrintRec] = useState<any>(null);
  const [isLoadingPrint, setIsLoadingPrint] = useState(false);
  const [activeReportRec, setActiveReportRec] = useState<any>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // Trigger print once isPrinting and printRec are ready and fully mounted in the DOM
  useEffect(() => {
    if (!isPrinting || !printRec) return;

    const checkAndPrint = () => {
      const imgEl = document.getElementById('print-report-image') as HTMLImageElement;
      if (imgEl) {
        const triggerBrowserPrint = () => {
          setTimeout(() => {
            window.print();
            setIsPrinting(false);
          }, 350); // small delay to let browser paint
        };

        if (imgEl.complete) {
          triggerBrowserPrint();
        } else {
          imgEl.onload = triggerBrowserPrint;
          imgEl.onerror = triggerBrowserPrint;
        }
      } else {
        setTimeout(checkAndPrint, 50);
      }
    };

    const timer = setTimeout(checkAndPrint, 150);
    return () => clearTimeout(timer);
  }, [isPrinting, printRec]);

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
      const logIdentifier = selectedReport.logCode || logs.find((l: any) => l.block === selectedReport.block)?.id;
      if (!logIdentifier) return;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const headers = { 'Authorization': `Bearer ${token}` };
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

        const res = await fetch(`${apiUrl}/vra/recommendation/log/${logIdentifier}`, { headers });
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
    const logIdentifier = rep.logCode || logs.find((l: any) => l.block === rep.block)?.id;
    if (!logIdentifier) {
      alert("Data analisis untuk blok ini tidak ditemukan di riwayat log.");
      return;
    }
    
    setIsLoadingPrint(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const headers = { 'Authorization': `Bearer ${token}` };
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

      const res = await fetch(`${apiUrl}/vra/recommendation/log/${logIdentifier}`, { headers });
      if (res.ok) {
        const recData = await res.json();
        
        // Preload the high-resolution image to ensure it is cached before printing
        const highResUrl = rep.thumb.replace('w=100', 'w=1200').replace('w=150', 'w=1200');
        const img = new Image();
        img.src = highResUrl;
        
        const triggerPrint = () => {
          setPrintRec(recData);
          setIsPrinting(true);
          setIsLoadingPrint(false);
        };
        
        if (img.complete) {
          triggerPrint();
        } else {
          img.onload = triggerPrint;
          img.onerror = triggerPrint;
        }
      } else {
        alert("Gagal memproses rekomendasi VRA untuk laporan.");
        setIsLoadingPrint(false);
      }
    } catch (err) {
      console.error(err);
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
          <h2 className="text-2xl font-black text-[#04211a] tracking-tight">Plantation Reports</h2>
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
                      <img 
                        src={rep.thumb} 
                        className="w-full h-full object-cover" 
                        alt={rep.block} 
                      />
                      <div className="absolute inset-0 bg-[#04211a]/5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-extrabold text-[#04211a] truncate">{rep.block}</h4>
                      <p className="text-[10px] text-slate-400 font-bold tracking-tight mt-1">{rep.date}</p>
                    </div>
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
                  {selectedReport.block} &bull; Snapshot
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
              <ReportPDF report={selectedReport} recommendation={activeReportRec} isPreview={true} />
            </div>

          </div>
        </div>
      )}

      {/* Hidden printable report sheet */}
      {isPrinting && selectedReport && createPortal(
        <ReportPDF report={selectedReport} recommendation={printRec} isPrintPortal={true} />,
        document.body
      )}
    </motion.div>
  );
}