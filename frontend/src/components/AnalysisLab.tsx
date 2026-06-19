/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Send, 
  RefreshCcw, 
  ShieldCheck, 
  BrainCircuit, 
  AlertTriangle,
  ChevronRight,
  FileSearch,
  CheckCircle2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function AnalysisLab() {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const performAnalysis = async () => {
    if (!image || !prompt) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(',')[0].split(':')[1].split(';')[0];

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: mimeType,
                },
              },
              {
                text: `You are an expert agronomist specializing in palm oil plantation management. 
                Analyze the provided UAV/aerial image based on this specific request: "${prompt}". 
                
                Provide your analysis in the following format:
                - Executive Summary
                - Identified Issues (if any)
                - Recommended Actions (VRA context)
                - Confidence Level
                
                Use professional, technical language.`
              }
            ]
          }
        ],
      });

      setResult(response.text || "Analysis complete but no findings were generated.");
    } catch (err: any) {
      console.error(err);
      setError("Analysis failed. Please check your network connection or try a different image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="analysis" className="py-24 bg-[#051424] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-emerald-400 font-mono text-xs uppercase tracking-[0.3em] mb-4 font-bold">
              Autonomous Intelligence
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Nyawit <span className="text-emerald-400">Analysis Lab</span>
            </h3>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-lg">
              Upload your drone imagery and provide specific instructions for our neural engines to process.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#0d1c2d] border border-emerald-500/20 rounded-2xl p-8 shadow-2xl"
          >
            <div className="space-y-8">
              {/* Image Upload Area */}
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-widest font-bold mb-4">
                  1. Provide Imagery
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative group cursor-pointer border-2 border-dashed rounded-xl transition-all aspect-video flex flex-col items-center justify-center p-4 overflow-hidden
                    ${image ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-700 bg-slate-900/50 hover:border-emerald-500/30 hover:bg-emerald-500/5'}
                  `}
                >
                  {image ? (
                    <>
                      <img src={image} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <RefreshCcw className="text-white w-8 h-8" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="text-emerald-500 w-8 h-8" />
                      </div>
                      <p className="text-white font-bold mb-1">Click to Upload UAV Snapshot</p>
                      <p className="text-slate-500 text-sm">PNG, JPG, or WEBP (Max 10MB)</p>
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
              </div>

              {/* Text Input Area */}
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-widest font-bold mb-4">
                  2. Analysis Parameters
                </label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Identify potential Ganoderma presence in these rows and estimate health scores for each crown."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all h-32 resize-none"
                />
              </div>

              {/* Action Button */}
              <button
                onClick={performAnalysis}
                disabled={loading || !image || !prompt}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                  ${loading || !image || !prompt 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-emerald-500 text-[#051424] hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'}
                `}
              >
                {loading ? (
                  <>
                    <RefreshCcw className="w-5 h-5 animate-spin" />
                    Initializing Neural Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Execute Professional Analysis
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative lg:min-h-[580px]"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#0d1c2d] border border-emerald-500/10 rounded-2xl p-12 h-full flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="relative">
                    <BrainCircuit className="w-20 h-20 text-emerald-500 animate-pulse" />
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping" />
                  </div>
                  <div>
                    <h4 className="text-white text-xl font-bold mb-2">Analyzing Pixels</h4>
                    <p className="text-slate-400">Gemini is cross-referencing multispectral data patterns...</p>
                  </div>
                  {/* Progress Sim */}
                  <div className="w-full max-w-sm h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5 }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0d1c2d] border border-emerald-500/30 rounded-2xl p-8 h-full shadow-[0_0_50px_rgba(16,185,129,0.05)]"
                >
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-emerald-500/10">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="text-emerald-400 w-6 h-6" />
                      <span className="text-white font-bold tracking-tight">Verified AI Intelligence</span>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded border border-emerald-500/20">
                      Success
                    </span>
                  </div>

                  <div className="prose prose-invert max-w-none prose-emerald prose-sm">
                    <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {result}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-emerald-500/10 flex items-center gap-4">
                    <button 
                      onClick={() => {setResult(null); setPrompt('')}}
                      className="text-emerald-400 text-xs font-bold uppercase tracking-widest hover:text-emerald-300 flex items-center gap-2"
                    >
                      <RefreshCcw className="w-4 h-4" />
                      New Analysis
                    </button>
                    <div className="h-4 w-px bg-slate-800" />
                    <button className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-white flex items-center gap-2">
                      <FileSearch className="w-4 h-4" />
                      Export Report
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="bg-[#0d1c2d]/50 border border-slate-800 rounded-2xl p-12 h-full flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6">
                    <ChevronRight className="text-slate-700 w-10 h-10" />
                  </div>
                  <h4 className="text-slate-400 text-lg font-bold mb-2">Waiting for Input</h4>
                  <p className="text-slate-600 max-w-xs">
                    Upload an image and provide instructions to begin the professional agronomy analysis.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Feedback */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm"
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Feature Highlights beneath */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { title: "Computer Vision", icon: CheckCircle2, text: "Advanced edge detection models specialized for palm canopy patterns." },
              { title: "Plantation Context", icon: CheckCircle2, text: "AI trained on MOPAD and local agronomy datasets." },
              { title: "VRA Integrated", icon: CheckCircle2, text: "Actionable results formatted for Variable Rate Application hardware." }
            ].map((f, i) => (
              <div key={i} className="bg-[#0d1c2d]/40 p-6 rounded-xl border border-slate-800 flex gap-4">
                <f.icon className="text-emerald-500 w-5 h-5 shrink-0" />
                <div>
                   <h5 className="text-white font-bold text-sm mb-1">{f.title}</h5>
                   <p className="text-slate-500 text-xs">{f.text}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
