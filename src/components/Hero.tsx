/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, PlayCircle, ShieldCheck } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section 
      ref={containerRef}
      id="home" 
      className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden bg-white"
    >
      {/* Visual Accent */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-brand-50/50 -z-10" 
           style={{ clipPath: 'polygon(35% 0%, 100% 0%, 100% 100%, 0% 100%)' }} />

      <div className="relative z-20 w-full px-4 sm:px-12 lg:px-20 grid lg:grid-cols-2 gap-16 items-center">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-100 text-brand-900 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8">
              <span className="w-2 h-2 bg-brand-600 rounded-full animate-pulse" />
              Agritech Precision AI
            </div>
            <h1 className="text-6xl sm:text-7xl lg:text-[100px] font-black text-brand-950 tracking-tight leading-[0.92] mb-8">
              Analyze Drone <br />
              Imagery Into <br />
              <span className="text-brand-600">Estate Intelligence.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl mb-12 font-medium">
              Leverage autonomous tree-level detection to monitor health, mitigate disease, and automate your VRA fertilization strategy.
            </p>
            
            <div className="flex flex-wrap gap-5">
              <Link to="/auth" className="bg-brand-900 text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-brand-800 transition-all hover:scale-[1.02] shadow-2xl shadow-brand-900/20 active:scale-95 group">
                Start Analysis
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="bg-white text-brand-950 border-2 border-slate-100 px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 hover:border-brand-600 hover:text-brand-600 transition-all shadow-xl active:scale-95">
                <PlayCircle className="w-6 h-6" />
                Watch Demo
              </button>
            </div>

            <div className="mt-20 flex flex-wrap items-center gap-10 opacity-40">
               <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Validated by Global Research</div>
               <div className="flex items-center gap-8">
                  <div className="font-black text-xl tracking-tighter">MOPAD</div>
                  <div className="font-black text-xl tracking-tighter">AGRISAT</div>
                  <div className="font-black text-xl tracking-tighter">UAV-LAB</div>
               </div>
            </div>
          </motion.div>
        </div>

        <motion.div
           initial={{ opacity: 0, scale: 0.9, y: 40 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.2 }}
           className="relative"
        >
           {/* Mockup Display */}
           <div className="relative z-10 p-4 bg-white border border-slate-200 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(4,78,87,0.15)] overflow-hidden">
              <div className="rounded-[2rem] overflow-hidden border border-slate-100 relative group">
                 <img 
                    src="https://images.unsplash.com/photo-1591871925063-d4c6a9170493?q=80&w=1200&auto=format&fit=crop" 
                    alt="Nyawit Dashboard Mockup" 
                    className="w-full h-auto"
                 />
                 <div className="absolute inset-0 bg-brand-950/20 group-hover:bg-brand-950/10 transition-colors" />
                 
                 {/* Floating Info Overlays */}
                 <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-500/20 rounded-full flex items-center justify-center">
                       <ShieldCheck className="text-brand-700 w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-brand-900 uppercase">Detection Accuracy</p>
                       <p className="text-xl font-black text-brand-950 leading-none">99.4%</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Decor Blobs */}
           <div className="absolute -top-10 -right-10 w-72 h-72 bg-brand-100/50 rounded-full blur-[80px] -z-10" />
           <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-brand-500/10 rounded-full blur-[60px] -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
