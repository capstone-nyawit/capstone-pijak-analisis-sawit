/**
 * Admin Reports Tab - Plantation Reports
 * Features dynamic, high-fidelity browser printing to PDF and Excel download.
 * Filter options: All, PDF, XLS
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  FileText,
  FileSpreadsheet,
  Loader2,
  Trash2,
  Filter,
  FileDown
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
  name?: string;
  type?: string;
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

interface AdminReportsTabProps {
  reports: Report[];
  selectedReportId: string;
  setSelectedReportId: (id: string) => void;
  triggerDownload: (block: string, format: string) => void;
  logs: any[];
  onStartAnalysis?: () => void;
  deleteReport: (id: string) => void;
}

type FilterType = 'ALL' | 'PDF' | 'XLS';

export default function AdminReportsTab({
  reports,
  selectedReportId,
  setSelectedReportId,
  logs,
  deleteReport
}: AdminReportsTabProps) {
  
  const [printRec, setPrintRec] = useState<any>(null);
  const [isLoadingPrint, setIsLoadingPrint] = useState(false);
  const [isDownloadingXlsx, setIsDownloadingXlsx] = useState(false);
  const [activeReportRec, setActiveReportRec] = useState<any>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  // --- XLSX DOWNLOAD (self-contained, no prop dependency) ---
  const handleDownloadXlsx = async () => {
    if (isDownloadingXlsx) return;
    setIsDownloadingXlsx(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Sesi login tidak ditemukan. Silakan login ulang.');
        return;
      }
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const url = `${apiUrl}/admin/reports/user-activity-xlsx`;
      
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const blob = await res.blob();
        const href = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = href;
        a.download = `User_Activity_Audit_Log_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(href);
        }, 200);
      } else {
        const text = await res.text().catch(() => res.statusText);
        alert(`Gagal mengunduh (${res.status}): ${text}`);
      }
    } catch (err: any) {
      alert(`Error: ${err?.message || err}`);
    } finally {
      setIsDownloadingXlsx(false);
    }
  };

  // Trigger print once isPrinting and printRec are ready
  useEffect(() => {
    if (!isPrinting || !printRec) return;

    const checkAndPrint = () => {
      const imgEl = document.getElementById('print-report-image') as HTMLImageElement;
      if (imgEl) {
        const triggerBrowserPrint = () => {
          setTimeout(() => {
            window.print();
            setIsPrinting(false);
          }, 350);
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

  // PDF reports only (exclude XLSX)
  const pdfReports = reports.filter(r => r.type !== 'XLSX');
  const xlsReports  = reports.filter(r => r.type === 'XLSX');

  const isSelectedReportValid = pdfReports.some((r) => r.id === selectedReportId);

  useEffect(() => {
    if (pdfReports.length > 0 && !isSelectedReportValid) {
      setSelectedReportId(pdfReports[0].id);
    }
  }, [pdfReports, isSelectedReportValid, setSelectedReportId]);

  const selectedReport = pdfReports.find((r) => r.id === selectedReportId) || pdfReports[0];

  // Fetch recommendation for the currently selected preview report
  useEffect(() => {
    if (!selectedReport) return;
    
    const fetchActiveReportRec = async () => {
      const blockName = selectedReport.block || selectedReport.name;
      const logIdentifier = selectedReport.logCode || logs.find((l: any) => l.block === blockName)?.id;
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
    const blockName = rep.block || rep.name;
    const logIdentifier = rep.logCode || logs.find((l: any) => l.block === blockName)?.id;
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
        
        const highResUrl = (rep.thumb || '').replace('w=100', 'w=1200').replace('w=150', 'w=1200');
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

  // Filter pills
  const filters: { label: string; value: FilterType; count: number }[] = [
    { label: 'Semua', value: 'ALL', count: reports.length },
    { label: 'PDF', value: 'PDF', count: pdfReports.length },
    { label: 'Excel (XLS)', value: 'XLS', count: xlsReports.length },
  ];

  const showExcel = activeFilter === 'ALL' || activeFilter === 'XLS';
  const showPDF   = activeFilter === 'ALL' || activeFilter === 'PDF';

  return (
    <motion.div
      key="reports-tab"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {/* ── TOP BAR ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-full px-2 py-1.5 shadow-sm">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1 mr-0.5" />
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border-none ${
                activeFilter === f.value
                  ? 'bg-[#04211a] text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {f.label}
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                activeFilter === f.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
              }`}>{f.count}</span>
            </button>
          ))}
        </div>

        {isLoadingPrint && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[#04211a] text-white rounded-full text-xs font-bold shadow-md">
            <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>Mempersiapkan PDF...</span>
          </div>
        )}
      </div>

      {/* ── EXCEL SECTION ── */}
      <AnimatePresence>
        {showExcel && (
          <motion.div
            key="excel-section"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-white border-y border-slate-200"
          >
            {/* Header row */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-slate-600" />
                <div>
                  <h3 className="text-sm font-extrabold text-[#04211a]">Excel Reports</h3>
                  <p className="text-[11px] text-slate-400 font-semibold">Activity & Audit Logs</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 bg-slate-100 px-2.5 py-1 font-bold uppercase tracking-wider">
                {xlsReports.length} berkas
              </span>
            </div>

            {/* Items */}
            {xlsReports.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-400 text-xs font-semibold">
                Belum ada berkas Excel tersedia.
              </div>
            ) : (
              xlsReports.map((report, idx) => (
                <div
                  key={report.id}
                  className={`flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors ${
                    idx < xlsReports.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#04211a] text-sm">{report.block || report.name}</h4>
                      <p className="text-slate-400 text-[11px] font-semibold mt-0.5">{report.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (confirm(`Hapus laporan "${report.block || report.name}"?`)) {
                          deleteReport(report.id);
                        }
                      }}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-95 cursor-pointer"
                      title="Hapus Laporan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleDownloadXlsx}
                      disabled={isDownloadingXlsx}
                      className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isDownloadingXlsx
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <FileDown className="w-4 h-4" />
                      }
                      {isDownloadingXlsx ? 'Mengunduh...' : 'Unduh Excel'}
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Footer download-all */}
            {xlsReports.length > 0 && (
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
                <button
                  onClick={handleDownloadXlsx}
                  disabled={isDownloadingXlsx}
                  className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#04211a] transition-colors cursor-pointer border-none bg-transparent active:scale-95 disabled:opacity-60"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh Semua Activity & Audit Logs (.xlsx)
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PDF SECTION ── */}
      <AnimatePresence>
        {showPDF && (
          <motion.div
            key="pdf-section"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {pdfReports.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col justify-center items-center py-28 bg-white border border-slate-200 shadow-sm text-center px-4"
              >
                <div className="w-16 h-16 bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 text-slate-400">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-base font-extrabold text-[#04211a]">Belum Ada Laporan PDF</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
                  Laporan PDF otomatis terbuat setelah analisis citra drone selesai.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                {/* Left: PDF Report list */}
                <div className="xl:col-span-5 bg-white border border-slate-200 shadow-sm overflow-hidden max-h-[680px] overflow-y-auto">
                  {/* Section label */}
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
                      PDF Reports — {pdfReports.length} laporan
                    </span>
                  </div>

                  {pdfReports.map((rep, idx) => {
                    const isSelected = selectedReport?.id === rep.id;
                    const blockLabel = rep.block || rep.name || '-';
                    return (
                      <div
                        key={rep.id}
                        onClick={() => setSelectedReportId(rep.id)}
                        className={`flex items-center justify-between px-5 py-4 cursor-pointer transition-all ${
                          idx < pdfReports.length - 1 ? 'border-b border-slate-100' : ''
                        } ${
                          isSelected
                            ? 'bg-emerald-50 border-l-2 border-l-emerald-600'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 overflow-hidden border border-slate-200 shrink-0 relative">
                            <img
                              src={rep.thumb}
                              className="w-full h-full object-cover"
                              alt={blockLabel}
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-extrabold text-[#04211a] truncate">{blockLabel}</h4>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] bg-red-50 text-red-600 border border-red-100 font-bold px-1.5 py-0.5 uppercase tracking-wide">PDF</span>
                              <p className="text-[10px] text-slate-400 font-bold">{rep.date}</p>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Right: Preview pane */}
                {selectedReport && (
                  <div className="xl:col-span-7 bg-white border border-slate-200 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                      <div>
                        <h3 className="text-base font-extrabold text-[#04211a]">Plantation Status Report</h3>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                          {selectedReport.block || selectedReport.name} • Snapshot
                        </p>
                      </div>
                      <button
                        onClick={() => handlePrintPDF(selectedReport)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#04211a] hover:bg-emerald-900 text-white text-xs font-bold transition-all border-none cursor-pointer active:scale-95"
                      >
                        <Download className="w-4 h-4 text-emerald-400" />
                        Cetak PDF Laporan
                      </button>
                    </div>

                    {/* Preview */}
                    <div className="overflow-hidden bg-white">
                      <ReportPDF report={{...selectedReport, block: selectedReport.block || selectedReport.name || '-'}} recommendation={activeReportRec} isPreview={true} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden printable sheet */}
      {isPrinting && selectedReport && createPortal(
        <ReportPDF report={{...selectedReport, block: selectedReport.block || selectedReport.name || '-'}} recommendation={printRec} isPrintPortal={true} />,
        document.body
      )}
    </motion.div>
  );
}