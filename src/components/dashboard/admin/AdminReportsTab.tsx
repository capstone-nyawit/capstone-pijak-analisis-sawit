/**
 * Admin Reports Tab
 * Shows executive reports available for download.
 */

import { motion } from 'motion/react';
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
}

export default function AdminReportsTab({ reports }: AdminReportsTabProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-8">
      <div className="bg-white p-6 rounded-[2rem] border border-[#e5e2d6] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-extrabold text-[#04211a]">Executive Reports</h3>
          <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl">Generate Custom</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all group bg-[#fcfbf7]">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  report.type === 'PDF' ? 'bg-red-50 text-red-600' : 
                  report.type === 'CSV' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                }`}>
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#04211a] text-sm mb-1 group-hover:text-emerald-700 transition-colors">{report.name}</h4>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                    <span className="uppercase tracking-wider">{report.type}</span>
                    <span>•</span>
                    <span>{report.date}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>
              <button className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
