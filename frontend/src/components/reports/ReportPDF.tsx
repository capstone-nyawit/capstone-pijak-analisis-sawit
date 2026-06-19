/**
 * PrintableReportTemplate - WYSIWYG Print Template for Plantation Report
 * Designed specifically for window.print() output.
 */

import React from 'react';

interface HighPriorityTree {
  id: string;
  condition: string;
  coords: string;
}

interface ReportData {
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
  highPriority: HighPriorityTree[];
  predictions?: any;
}

interface PrintableReportTemplateProps {
  report: ReportData;
  recommendation: {
    overall_priority: string;
    primary_concern: string;
    secondary_concern: string;
    recommended_programs: string;
  } | null;
  isPreview?: boolean;
  isPrintPortal?: boolean;
}

export default function PrintableReportTemplate({ report, recommendation, isPreview = false, isPrintPortal = false }: PrintableReportTemplateProps) {
  if (!report) return null;

  const getHighRes = (url: string) => {
    if (!url) return "";
    return url.replace('w=100', 'w=1200').replace('w=150', 'w=1200');
  };
  const displayImage = getHighRes(report.thumb);

  const renderBoundingBoxes = () => {
    if (!report.predictions) return null;
    let preds: any[] = [];
    if (typeof report.predictions === 'string') {
      try { preds = JSON.parse(report.predictions); } catch (e) {}
    } else if (Array.isArray(report.predictions)) {
      preds = report.predictions;
    }

    return preds.map((pred: any, idx: number) => {
      const box = pred.box || pred.bbox;
      if (!box) return null;
      
      const [xmin, ymin, xmax, ymax] = box;
      let leftPct, topPct, widthPct, heightPct;
      
      if (xmin <= 1 && ymin <= 1 && xmax <= 1 && ymax <= 1) {
        leftPct = xmin * 100;
        topPct = ymin * 100;
        widthPct = xmax * 100;
        heightPct = ymax * 100;
      } else {
        const w = xmax > xmin ? xmax - xmin : xmax;
        const h = ymax > ymin ? ymax - ymin : ymax;
        leftPct = (xmin / 1024) * 100;
        topPct = (ymin / 1024) * 100;
        widthPct = (w / 1024) * 100;
        heightPct = (h / 1024) * 100;
      }
      
      const class_id = pred.class_id || pred.class;
      let borderColor = 'border-emerald-500'; 
      let bgColor = 'bg-emerald-500/10';

      if (class_id === 0) { // Dead
        borderColor = 'border-red-500';
        bgColor = 'bg-red-500/10';
      } else if (class_id === 4) { // Yellowing
        borderColor = 'border-amber-500';
        bgColor = 'bg-amber-500/10';
      } else if (class_id === 3) { // Small Canopy
        borderColor = 'border-blue-400';
        bgColor = 'bg-blue-400/10';
      }

      return (
        <div 
          key={idx} 
          className={`absolute border-[1px] ${borderColor} ${bgColor} rounded-[1px] pointer-events-none`}
          style={{
            left: `${leftPct}%`,
            top: `${topPct}%`,
            width: `${widthPct}%`,
            height: `${heightPct}%`
          }}
        />
      );
    });
  };

  // Derive counts
  const healthy = report.healthy;
  // Combine yellowing and small canopy if needed, or represent them as in database
  const yellow = report.yellowing;
  const dead = report.dead;
  const total = report.totalTrees || (healthy + yellow + dead) || 1;

  const pHealthy = ((healthy / total) * 100).toFixed(1);
  const pYellow = ((yellow / total) * 100).toFixed(1);
  const pDead = ((dead / total) * 100).toFixed(1);

  return (
    <div className={`${isPreview ? "" : "printable-only"} p-8 bg-white text-slate-800 font-sans max-w-4xl mx-auto space-y-6`}>
      
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-emerald-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#04211a] tracking-tight">NyawitAI Plantation Report</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Plantation Intelligence Systems</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 uppercase tracking-widest">
            Report ID: {report.id}
          </span>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Generated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Meta Information Grid */}
      <div className="grid grid-cols-3 gap-4 bg-[#fcfbf7] p-4 rounded-xl border border-[#e5e2d6] text-xs">
        <div>
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Priority Location</span>
          <span className="font-bold text-[#04211a]">{report.block}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Analysis Date</span>
          <span className="font-bold text-slate-700">{report.analysisDate}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Overall Condition Index</span>
          <span className="font-bold text-emerald-700">{pHealthy}% Good</span>
        </div>
      </div>

      {/* Two Column Layout for Image and Stats */}
      <div className="grid grid-cols-2 gap-6 items-start">
        
        {/* Left: Detection Image */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Detection Image Output</span>
          <div className="relative border border-[#e5e2d6] rounded-xl overflow-hidden shadow-sm">
            <img 
              id={isPrintPortal ? "print-report-image" : undefined}
              src={displayImage} 
              className="w-full h-auto block" 
              alt="Ortofoto Udara" 
            />
            <div className="absolute inset-0 bg-[#04211a]/5 print:hidden" />
            <div className="absolute inset-0 pointer-events-none">
              {renderBoundingBoxes()}
            </div>
          </div>
          <p className="text-[9px] text-slate-400 font-medium italic">
            Gambar orthomosaic UAV terkompresi dengan deteksi kanopi aktif.
          </p>
        </div>

        {/* Right: Classification Statistics */}
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Overview Tree Classification</span>
          
          <div className="border border-[#e5e2d6] rounded-xl overflow-hidden bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#fcfbf7] border-b border-[#e5e2d6] font-bold text-slate-400 uppercase text-[9px] tracking-wider">
                  <th className="px-4 py-2">Condition Class</th>
                  <th className="px-4 py-2 text-right">Count</th>
                  <th className="px-4 py-2 text-right">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e2d6]/50">
                <tr>
                  <td className="px-4 py-2 flex items-center gap-1.5 font-semibold text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Healthy
                  </td>
                  <td className="px-4 py-2 text-right font-bold text-[#04211a]">{healthy.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right font-bold text-emerald-600">{pHealthy}%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 flex items-center gap-1.5 font-semibold text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Yellowing
                  </td>
                  <td className="px-4 py-2 text-right font-bold text-[#04211a]">{yellow.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right font-bold text-amber-600">{pYellow}%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 flex items-center gap-1.5 font-semibold text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-sm bg-red-500" /> Dead / Missing
                  </td>
                  <td className="px-4 py-2 text-right font-bold text-[#04211a]">{dead.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right font-bold text-red-650">{pDead}%</td>
                </tr>
                <tr className="bg-[#fcfbf7] font-bold">
                  <td className="px-4 py-2 text-slate-700">Total Trees</td>
                  <td className="px-4 py-2 text-right text-[#04211a]">{total.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right text-slate-400">100.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* VRA Engine Recommendations & Rule Analysis */}
      {recommendation && (
        <div className="space-y-4 border-t border-slate-200 pt-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-[#04211a]">VRA Recommendation & Insights</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#faf8f0] p-4 rounded-xl border border-[#e5e2d6] space-y-3">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Rule-Based Analysis Details</span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-[#e5e2d6]/50 pb-1.5">
                  <span className="font-semibold text-slate-500">Overall Priority:</span>
                  <span className="font-bold text-emerald-800">{recommendation.overall_priority}</span>
                </div>
                <div className="flex justify-between border-b border-[#e5e2d6]/50 pb-1.5">
                  <span className="font-semibold text-slate-500">Primary Concern:</span>
                  <span className="font-bold text-[#04211a]">{recommendation.primary_concern}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Secondary Concern:</span>
                  <span className="font-bold text-slate-700">{recommendation.secondary_concern}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#fcfbf7] p-4 rounded-xl border border-[#e5e2d6] space-y-3">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Recommended Programs</span>
              <ul className="space-y-2 text-xs">
                {(() => {
                  const rp = recommendation.recommended_programs;
                  try {
                    const parsed = JSON.parse(rp);
                    if (typeof parsed === 'object' && parsed !== null) {
                      return Object.entries(parsed).map(([key, val], idx) => {
                        const cleanKey = key.replace('_', ' ');
                        return (
                          <li key={idx} className="flex items-start gap-2 font-bold text-slate-700 leading-relaxed text-left">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
                            <span>
                              <span className="capitalize">{cleanKey}</span>: {String(val)}
                            </span>
                          </li>
                        );
                      });
                    }
                  } catch (e) {}
                  
                  return rp.split(',').map((prog: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 font-bold text-slate-700 text-left">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0" />
                      {prog.trim()}
                    </li>
                  ));
                })()}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* High-Priority Tree Coordinates list */}
      {report.highPriority && report.highPriority.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-black uppercase tracking-widest text-[#04211a]">Priority Location Points</h2>
          <div className="border border-[#e5e2d6] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#fcfbf7] border-b border-[#e5e2d6] font-bold text-slate-400 uppercase text-[9px] tracking-wider">
                  <th className="px-4 py-2">Tree ID</th>
                  <th className="px-4 py-2">Condition Status</th>
                  <th className="px-4 py-2">UAV GPS Coordinates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e2d6]/50">
                {report.highPriority.map((tree, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 font-mono font-bold text-slate-700">{tree.id}</td>
                    <td className="px-4 py-2">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        tree.condition === 'Dead' ? 'bg-red-50 text-red-750 border border-red-100' : 'bg-amber-50 text-amber-750 border border-amber-100'
                      }`}>
                        {tree.condition}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-mono text-slate-500">{tree.coords}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer disclaimer */}
      <div className="border-t border-slate-200 pt-4 text-center">
        <p className="text-[9px] text-slate-400 font-semibold leading-relaxed">
          Dokumen ini diproduksi secara otomatis oleh NyawitAI Plantation Intelligence Platform.<br/>
          Rekomendasi bersifat operasional pertanian makro berdasarkan persentase anomali kanopi pohon sawit hasil analisis citra orthomosaic.
        </p>
      </div>

    </div>
  );
}
