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
    <section id="about" className="py-24 relative">
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
                className="p-8 md:p-10 bg-white/[0.02] backdrop-blur-3xl border border-white/[0.06] shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),_0_8px_32px_rgba(0,0,0,0.3)] flex flex-col justify-between aspect-square group hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-500"
              >
                <div className="w-12 h-12 bg-[#064e3b]/50 border border-white/5 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-[#10b981]/20 transition-all duration-300">
                  <stat.icon className="text-[#4ade80] w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[#F8FAF6] text-3xl font-semibold mb-1">{stat.value}</p>
                  <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-semibold">{stat.label}</p>
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
            <h2 className="text-[#4ade80] font-semibold text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-[#4ade80]/30" />
              The Project
            </h2>
            <h3 className="text-4xl sm:text-5xl font-semibold text-[#F8FAF6] tracking-tight mb-10 leading-[1.1]">
              Pioneering <br />
              <span className="text-[#d97706] font-light italic">Autonomous Agronomy.</span>
            </h3>
            
            <div className="space-y-8 text-white/60 text-lg leading-relaxed font-light">
              <p>
                NyawitAI is a research-driven platform developed to solve the "blind spot" in large-scale palm oil management. By utilizing high-altitude UAV imagery (Drone Mapping), we provide visibility that ground surveys simply cannot match.
              </p>
              <p>
                Our core technology leverages <strong className="text-[#F8FAF6] font-semibold">Faster R-CNN</strong> deep learning architectures, specifically tuned for the unique geometry of oil palm crowns. This allows us to detect subtle health shifts — such as yellowing due to nutrient deficiency or stunting — weeks before they impact harvest yield.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
