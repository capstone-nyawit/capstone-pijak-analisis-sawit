import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Download } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
}

interface AdminReportsTabProps {
  reports: Report[];
  triggerDownload: (name: string) => void;
}

export default function AdminReportsTab({ reports, triggerDownload }: AdminReportsTabProps) {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PDF' | 'CSV' | 'XLSX'>('ALL');

  const reportTypes = ['PDF', 'CSV', 'XLSX'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -15 }} 
      className="bg-white flex flex-col h-full"
    >
      <div className="p-6 md:p-8 flex flex-col h-full">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-extrabold text-[#04211a]">Executive Reports</h3>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Daftar laporan siap unduh</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl items-center gap-1 self-stretch sm:self-auto">
            {['ALL', ...reportTypes].map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type as any)}
                className={`flex-1 sm:flex-initial text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer border-none ${
                  activeFilter === type
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-[#04211a] hover:bg-slate-200/60'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {reportTypes.map((currentType) => {
            if (activeFilter !== 'ALL' && activeFilter !== currentType) return null;

            const filteredReports = reports.filter(r => r.type.toUpperCase() === currentType);

            if (filteredReports.length === 0) return null;

            return (
              <div key={currentType} className="flex flex-col gap-3">
                <div className="flex items-center gap-2 px-1">
                  <span className={`w-2 h-2 rounded-full ${
                    currentType === 'PDF' ? 'bg-red-500' : 
                    currentType === 'CSV' ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                  <h4 className="text-sm font-black tracking-wide text-slate-400 uppercase">
                    {currentType} Files
                  </h4>
                  <span className="text-xs font-bold text-slate-300">({filteredReports.length})</span>
                </div>

                <div className="flex flex-col gap-3">
                  <AnimatePresence mode="popLayout">
                    {filteredReports.map((report) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        key={report.id} 
                        className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all group bg-[#fcfbf7]"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                            report.type === 'PDF' ? 'bg-red-50 text-red-600' : 
                            report.type === 'CSV' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                          }`}>
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[#04211a] text-sm mb-1 group-hover:text-emerald-700 transition-colors">
                              {report.name}
                            </h4>
                            <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                              <span className="uppercase tracking-wider">{report.type}</span>
                              <span>•</span>
                              <span>{report.date}</span>
                              <span>•</span>
                              <span>{report.size}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => triggerDownload(report.name)}
                          className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm cursor-pointer active:scale-95"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}