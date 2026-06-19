import { motion } from 'motion/react';
import { Activity, BarChart3, Map as MapIcon, ShieldCheck } from 'lucide-react';

const stats = [
  { label: 'Detection Rate', value: '94.2%', color: 'text-[#4ade80]' },
  { label: 'Health Index', value: 'A++', color: 'text-[#4ade80]' },
  { label: 'Coverage', value: '42,000 Ha', color: 'text-[#F8FAF6]' },
];

export default function DashboardSimulation() {
  return (
    <section className="bg-transparent pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="flex-1">
            <h2 className="text-4xl font-semibold text-[#F8FAF6] tracking-tight leading-[1.1] mb-8">
              The Mission Control for <br />
              <span className="text-[#4ade80] font-light italic">Precision Agronomy.</span>
            </h2>
            <p className="text-white/60 text-lg mb-10 leading-relaxed font-light">
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
                <div key={item.title} className="flex gap-6 p-6 rounded-3xl bg-white/[0.02] backdrop-blur-3xl border border-white/[0.06] shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),_0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-500 group">
                  <div className="mt-1 w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center shrink-0 group-hover:bg-[#10b981]/10 transition-colors duration-500">
                    <item.icon className="w-5 h-5 text-[#4ade80]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[#F8FAF6] font-semibold mb-2 tracking-tight">{item.title}</h4>
                    <p className="text-white/60 text-sm font-light leading-relaxed">{item.desc}</p>
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
              className="bg-[#022c22]/30 backdrop-blur-md border border-white/[0.05] rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/3] flex flex-col p-4"
            >
               <div className="bg-[#011712]/50 backdrop-blur-xl rounded-[1.5rem] flex-1 overflow-hidden flex flex-col border border-white/[0.03] shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
                  {/* Fake Dashboard Header */}
                  <div className="px-6 py-4 border-b border-white/[0.03] flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <Activity className="text-[#4ade80] w-5 h-5" strokeWidth={1.5} />
                      <span className="text-[#F8FAF6] font-semibold text-[10px] uppercase tracking-widest">NyawitAI Core Engine</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    </div>
                  </div>

                  {/* Fake Dashboard Content */}
                  <div className="flex-1 p-6 flex flex-col bg-transparent">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {stats.map((s) => (
                        <div key={s.label} className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                          <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-1">{s.label}</p>
                          <p className={`text-xl font-semibold tracking-tighter ${s.color}`}>{s.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex-1 rounded-2xl bg-[#022c22]/50 border border-white/5 relative p-4 overflow-hidden">
                      {/* Grid Lines */}
                      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-20 pointer-events-none">
                        {[...Array(64)].map((_, i) => (
                          <div key={i} className="border-[0.5px] border-white/10" />
                        ))}
                      </div>
                      
                      {/* Fake Detection Visualization */}
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <img 
                          src="https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=800&auto=format&fit=crop" 
                          alt="Map Visualization" 
                          className="w-full h-full object-cover opacity-60 mix-blend-luminosity rounded-xl"
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
                               className={`absolute border-2 w-8 h-8 rounded ${i % 3 === 0 ? 'border-[#d97706]' : 'border-[#4ade80] shadow-lg shadow-[#4ade80]/20'}`}
                               style={{ 
                                 top: `${20 + (Math.random() * 60)}%`, 
                                 left: `${20 + (Math.random() * 60)}%` 
                               }}
                             >
                               <div className={`absolute -top-3.5 -left-0.5 text-[7px] font-semibold px-1 rounded-sm ${i % 3 === 0 ? 'bg-[#d97706] text-[#011712]' : 'bg-[#022c22] text-[#4ade80] border border-[#4ade80]/20'}`}>
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
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#10b981]/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
