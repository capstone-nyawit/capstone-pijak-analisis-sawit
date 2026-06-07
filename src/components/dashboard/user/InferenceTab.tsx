/**
 * Inference Tab -proses Inferensi
 * Handles UAV/drone image upload, drag-and-drop validation, and analysis execution.
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  PlaySquare, Loader2, ImageIcon, CheckCircle2, 
  Leaf, Upload, RefreshCcw, AlertTriangle 
} from 'lucide-react';

interface InferenceTabProps {
  image: string | null;
  isAnalyzing: boolean;
  error: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent) => void;
  runInference: () => void;
  setActiveTab: (tab: 'Overview' | 'Inference' | 'Tree Health' | 'VRA' | 'Logs' | 'Reports') => void;
}

export default function InferenceTab({
  image,
  isAnalyzing,
  error,
  fileInputRef,
  handleImageUpload,
  handleDrop,
  runInference,
  setActiveTab
}: InferenceTabProps) {
  return (
    <motion.div
      key="inference-pane"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-6xl mx-auto"
    >
      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center min-h-[480px] space-y-4">
          <Loader2 className="w-12 h-12 text-[#04211a] animate-spin opacity-80" />
          <p className="text-[#04211a] font-extrabold text-lg tracking-tight">Waiting for analyzing...</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e5e2d6] pb-6">
            <div>
              <h2 className="text-3xl font-black text-[#04211a] tracking-tight">Mulai Analisis Kebun</h2>
              <p className="text-slate-500 font-semibold mt-1">Unggah gambar kebun untuk menjalankan deteksi dan analisis kondisi pohon sawit.</p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
            
            <div className="space-y-6 lg:col-span-2">
            {/* Upload Card */}
            <div className="bg-white border border-[#e5e2d6] rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">Pilih Gambar Citra Kebun</span>
                {image && (
                  <span className="text-[10px] font-bold text-slate-400">Dimensi Optimal Terbaca</span>
                )}
              </div>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`relative group cursor-pointer border-2 border-dashed rounded-2xl transition-all aspect-video flex flex-col items-center justify-center p-6 overflow-hidden min-h-[260px]
                  ${image ? 'border-emerald-500 bg-emerald-50/10' : 'border-[#e5e2d6] bg-[#fcfbf7]/40 hover:border-emerald-500 hover:bg-emerald-50/5'}
                `}
              >
                {image ? (
                  <>
                    <img src={image} className="absolute inset-0 w-full h-full object-cover" alt="Preview Gambar" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <RefreshCcw className="text-white w-10 h-10 mb-2 animate-spin-hover" />
                      <span className="text-white font-bold text-sm">Ganti Gambar</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-[#04211a]/5 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Upload className="text-[#04211a] w-8 h-8 opacity-80" />
                    </div>
                    <div>
                      <p className="text-[#04211a] font-extrabold text-base">Klik atau seret gambar kebun di sini</p>
                      <p className="text-slate-400 text-xs mt-1.5 font-medium">PNG, JPG, WEBP • Resolusi Maksimal 20MB</p>
                    </div>
                  </div>
                )}
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              {/* File Details */}
              {image && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-[#fcfbf7] rounded-xl border border-[#e5e2d6] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#04211a] block truncate">citra_kebun_contoh.png</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Format: PNG • Ready</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Validated
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            </div>

            <div className="space-y-6 lg:col-span-1">
            {/* Image Quality Guidance */}
            <div className="bg-[#faf8f0]/80 border border-[#e5e2d6] rounded-[2rem] p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-800 flex items-center gap-1.5 mb-3">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                Panduan Upload Gambar
              </h3>
              
              <ul className="space-y-3.5 text-[11px] font-medium text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong className="text-[#04211a]">Posisi:</strong> Usahakan gambar diambil tepat dari atas kanopi pohon.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong className="text-[#04211a]">Pencahayaan:</strong> Pastikan gambar terang dan tidak terlalu gelap.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong className="text-[#04211a]">Kualitas:</strong> Gunakan resolusi tinggi, hindari blur atau terlalu jauh.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong className="text-[#04211a]">Kejelasan:</strong> Pastikan objek pohon terlihat tajam dan jelas.</span>
                </li>
              </ul>
            </div>

            </div>

            {/* Action CTA */}
            <div className="flex flex-col items-center pt-2 lg:col-span-2 lg:col-start-1">
              <button
                onClick={runInference}
                disabled={!image}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md
                  ${image 
                    ? 'bg-[#04211a] text-white hover:bg-emerald-950 cursor-pointer shadow-[0_4px_25px_rgba(4,33,26,0.15)]' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}
                `}
              >
                <PlaySquare className={`w-5 h-5 ${image ? 'text-emerald-400' : 'text-slate-400'}`} />
                Jalankan Analisis
              </button>
              
              {error && (
                <p className="text-red-500 text-xs font-bold text-center mt-3 flex items-center justify-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {error}
                </p>
              )}
            </div>

          </div>
        </>
      )}
    </motion.div>
  );
}
