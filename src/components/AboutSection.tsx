/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Target, Trees, Microscope, Activity } from 'lucide-react';

const stats = [
  { label: 'Detection Speed', value: '450/sec', icon: Target },
  { label: 'Trees Analyzed', value: '8.2M+', icon: Trees },
  { label: 'Data Accuracy', value: '99.4%', icon: Microscope },
  { label: 'Yield Impact', value: '+14%', icon: Activity },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-32 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-50/50 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-8"
          >
            {stats.map((stat, i) => (
              <div 
                key={stat.label}
                className="bg-slate-50 border border-slate-100 p-10 rounded-[2.5rem] flex flex-col justify-between aspect-square group hover:bg-white hover:shadow-2xl transition-all"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <stat.icon className="text-brand-900 w-7 h-7" />
                </div>
                <div>
                  <p className="text-brand-950 text-3xl font-black mb-1">{stat.value}</p>
                  <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-black">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <h2 className="text-brand-600 font-black text-xs uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-brand-600/30" />
              The Project
            </h2>
            <h3 className="text-5xl font-black text-brand-950 tracking-tight mb-10 leading-[1.1]">
              Pioneering <br />
              <span className="text-brand-600">Autonomous Agronomy.</span>
            </h3>
            
            <div className="space-y-8 text-slate-600 text-lg leading-relaxed font-medium">
              <p>
                NyawitAI is a research-driven platform developed to solve the "blind spot" in large-scale palm oil management. By utilizing high-altitude UAV imagery (Drone Mapping), we provide visibility that ground surveys simply cannot match.
              </p>
              <p>
                Our core technology leverages <strong className="text-brand-950">Faster R-CNN</strong> deep learning architectures, specifically tuned for the unique geometry of oil palm crowns. This allows us to detect subtle health shifts — such as yellowing due to nutrient deficiency or stunting — weeks before they impact harvest yield.
              </p>
              <div className="pt-6">
                 <button className="flex items-center gap-4 text-brand-900 font-black text-sm uppercase tracking-widest hover:text-brand-600 transition-colors group">
                    View Project Documentation
                    <div className="w-10 h-px bg-brand-900 group-hover:w-16 transition-all" />
                 </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
