import { motion } from 'motion/react';
import { Clock, TrendingDown, ShieldAlert, DatabaseZap } from 'lucide-react';
import { DottedSurface } from './ui/dotted-surface';

const problems = [
  {
    title: "Manual Inspection",
    description: "Conventional ground surveys are time-intensive and highly susceptible to human error, resulting in undetected disease clusters.",
    icon: Clock
  },
  {
    title: "Fertilizer Waste",
    description: "Applying uniform dosage across vast estates ignores tree-level nutrient variations, leading to significant chemical inefficiency.",
    icon: TrendingDown
  },
  {
    title: "Late Detection",
    description: "Physical symptoms of stress typically manifest in late stages, drastically reducing the effectiveness of mitigation efforts.",
    icon: ShieldAlert
  },
  {
    title: "Data Blindness",
    description: "The absence of localized, tree-level metrics forces estate managers to rely on reactive strategies rather than proactive planning.",
    icon: DatabaseZap
  }
];

export default function ProblemSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 pointer-events-none" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)' }}>
        <DottedSurface />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-[#4ade80] font-semibold text-xs uppercase tracking-[0.3em] mb-6">Industrial Challenges</h2>
              <h3 className="text-4xl sm:text-5xl font-semibold text-[#F8FAF6] tracking-tight leading-[1.15] mb-8">
                Addressing Key <br />
                Challenges in <br />
                <span className="text-[#d97706] font-light italic">Estate Management</span>
              </h3>
              <p className="text-lg text-white/60 leading-relaxed font-light mb-10 max-w-lg">
                Large-scale plantations often struggle with inefficient resource allocation and delayed disease interventions due to limited visibility at the individual tree level.
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {problems.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                className="bg-white/[0.03] backdrop-blur-2xl p-8 rounded-[2rem] border border-white/[0.08] shadow-[inset_0_1px_3px_rgba(255,255,255,0.08),_0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-500 group"
              >
                <div className="w-12 h-12 bg-[#064e3b]/30 rounded-xl border border-white/[0.03] flex items-center justify-center mb-6 group-hover:bg-[#10b981]/10 transition-colors duration-500">
                  <p.icon className="text-[#4ade80] w-5 h-5" strokeWidth={1.5} />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-[#F8FAF6] mb-3 group-hover:text-[#4ade80] transition-colors duration-300">{p.title}</h4>
                <p className="text-white/60 text-sm leading-relaxed font-light">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
