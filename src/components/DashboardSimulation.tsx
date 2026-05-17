/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Activity, BarChart3, Map as MapIcon, ShieldCheck } from 'lucide-react';

const stats = [
  { label: 'Detection Rate', value: '94.2%', color: 'text-brand-600' },
  { label: 'Health Index', value: 'A++', color: 'text-brand-600' },
  { label: 'Coverage', value: '42,000 Ha', color: 'text-brand-950' },
];

export default function DashboardSimulation() {
  return (
    <section className="bg-brand-50 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="flex-1">
            <h2 className="text-4xl font-black text-brand-950 tracking-tight leading-tight mb-8">
              The Mission Control for <br />
              <span className="text-brand-600">Precision Agronomy.</span>
            </h2>
            <p className="text-slate-600 text-lg mb-10 leading-relaxed font-medium">
              Experience the future of plantation management. Our high-fidelity interface 
              provides instantaneous analysis of every square meter of your estate, 
              turning raw aerial data into surgical interventions.
            </p>

            <div className="space-y-6">
              {[
                { icon: ShieldCheck, title: 'Autonomous Health Assessment', desc: 'AI-driven diagnostics that identify stress before it is visible to the naked eye.' },
                { icon: BarChart3, title: 'Yield Prediction Models', desc: 'Advanced modeling based on individual tree metrics and historical growth data.' },
                { icon: MapIcon, title: 'Geospatial Estate Mapping', desc: 'Precision mapping with centimetre-level accuracy for every asset in your plantation.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-6 p-6 rounded-3xl bg-white border border-slate-100 hover:border-brand-500 hover:shadow-xl transition-all group">
                  <div className="mt-1">
                    <item.icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <h4 className="text-brand-950 font-black mb-1 tracking-tight">{item.title}</h4>
                    <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 relative w-full lg:w-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              whileInView={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] aspect-[4/3] flex flex-col p-4"
            >
               <div className="bg-slate-50 rounded-[1.5rem] flex-1 overflow-hidden flex flex-col border border-slate-100">
                  {/* Fake Dashboard Header */}
                  <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                      <Activity className="text-brand-600 w-5 h-5" />
                      <span className="text-brand-950 font-black text-[10px] uppercase tracking-widest">NyawitAI Core Engine</span>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    </div>
                  </div>

                  {/* Fake Dashboard Content */}
                  <div className="flex-1 p-6 flex flex-col bg-white">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {stats.map((s) => (
                        <div key={s.label} className="p-4 rounded-2xl bg-brand-50 border border-brand-100">
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</p>
                          <p className={`text-xl font-black tracking-tighter ${s.color}`}>{s.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex-1 rounded-2xl bg-slate-50 border border-slate-100 relative p-4 overflow-hidden">
                      {/* Grid Lines */}
                      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-40 pointer-events-none">
                        {[...Array(64)].map((_, i) => (
                          <div key={i} className="border-[0.5px] border-slate-200" />
                        ))}
                      </div>
                      
                      {/* Fake Detection Visualization */}
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <img 
                          src="https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=800&auto=format&fit=crop" 
                          alt="Map Visualization" 
                          className="w-full h-full object-cover opacity-80 rounded-xl"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                           {/* Bounding Boxes */}
                           {[...Array(12)].map((_, i) => (
                             <motion.div 
                               key={i}
                               initial={{ scale: 0.8, opacity: 0 }}
                               animate={{ scale: 1, opacity: 1 }}
                               transition={{ delay: 1 + (i * 0.1) }}
                               className={`absolute border-2 w-8 h-8 rounded ${i % 3 === 0 ? 'border-amber-400' : 'border-brand-500 shadow-xl shadow-brand-500/20'}`}
                               style={{ 
                                 top: `${20 + (Math.random() * 60)}%`, 
                                 left: `${20 + (Math.random() * 60)}%` 
                               }}
                             >
                               <div className={`absolute -top-3.5 -left-0.5 text-[7px] font-black px-1 rounded-sm ${i % 3 === 0 ? 'bg-amber-400 text-black' : 'bg-brand-900 text-white'}`}>
                                 {i % 3 === 0 ? 'S-DEF' : 'HEALTHY'}
                               </div>
                             </motion.div>
                           ))}
                        </div>
                      </div>
                    </div>
                  </div>
               </div>
            </motion.div>

            {/* Float decorative elements */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
