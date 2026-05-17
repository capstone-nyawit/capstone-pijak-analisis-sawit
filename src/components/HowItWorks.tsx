/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { UploadCloud, Cpu, PieChart, Map } from 'lucide-react';

const steps = [
  {
    title: "Data Acquisition",
    description: "Upload high-resolution UAV ortho-mosaics directly to our secure enterprise cloud.",
    icon: UploadCloud,
    step: "01"
  },
  {
    title: "Neural Analysis",
    description: "Our Faster R-CNN engine identifies every tree crown and cross-references multispectral data.",
    icon: Cpu,
    step: "02"
  },
  {
    title: "Insight Generation",
    description: "View health distribution, mortality rates, and stress patterns in real-time dashboards.",
    icon: PieChart,
    step: "03"
  },
  {
    title: "Operational Export",
    description: "Export VRA shapefiles (.shp) or spreadsheets directly for field fertilization hardware.",
    icon: Map,
    step: "04"
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-brand-950 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-brand-500 font-black text-xs uppercase tracking-[0.5em] mb-4">The Workflow</h2>
          <h3 className="text-5xl font-black tracking-tight leading-tight">Complex Analysis, <br /><span className="text-brand-400">Simplified.</span></h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className="text-[120px] font-black text-white/5 absolute -top-16 -left-4 leading-none select-none pointer-events-none">
                {s.step}
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mb-10 shadow-2xl shadow-brand-600/20">
                  <s.icon className="text-white w-8 h-8" />
                </div>
                <h4 className="text-2xl font-black mb-4 tracking-tight">{s.title}</h4>
                <p className="text-slate-400 leading-relaxed font-medium">
                  {s.description}
                </p>
              </div>
              
              {i < 3 && (
                <div className="hidden lg:block absolute top-8 -right-8 w-16 h-[2px] bg-gradient-to-r from-brand-600 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
