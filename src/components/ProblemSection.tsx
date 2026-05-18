import { motion } from 'motion/react';
import { Clock, TrendingDown, ShieldAlert, DatabaseZap } from 'lucide-react';
import { DottedSurface } from './ui/dotted-surface';

const problems = [
  {
    title: "Manual Inspection",
    description: "Ground surveys are 80% slower and prone to human error, leading to missed disease clusters.",
    icon: Clock
  },
  {
    title: "Fertilizer Waste",
    description: "Uniform fertilization ignores individual tree health, wasting up to 30% of high-cost chemicals.",
    icon: TrendingDown
  },
  {
    title: "Late Detection",
    description: "Visual symptoms often appear too late. AI detects spectral shifts weeks before visual decay.",
    icon: ShieldAlert
  },
  {
    title: "Data Blindness",
    description: "Lack of tree-level data makes industrial-scale estate management reactive rather than proactive.",
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
                Traditional Estate <br />
                Management Is <br />
                <span className="text-[#d97706] font-light italic">Bleeding Efficiency.</span>
              </h3>
              <p className="text-lg text-white/60 leading-relaxed font-light mb-10 max-w-lg">
                Operating blindly at scale costs millions in yield loss and chemical waste. NyawitAI provides the visibility required for modern, sustainable agriculture.
              </p>
              
              <div className="flex items-center gap-6 p-6 bg-white/[0.02] backdrop-blur-3xl rounded-[2rem] border border-white/[0.06] shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),_0_8px_32px_rgba(0,0,0,0.3)]">
                 <div className="w-12 h-12 bg-white/[0.02] rounded-xl flex items-center justify-center border border-white/[0.05]">
                    <TrendingDown className="text-[#d97706] w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-[#F8FAF6] font-semibold text-lg">-22% Estate Yield</p>
                    <p className="text-white/50 text-sm font-light">Average loss due to delayed disease intervention.</p>
                 </div>
              </div>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {problems.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                className="bg-white/[0.02] backdrop-blur-3xl p-8 rounded-[2rem] border border-white/[0.06] shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),_0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-500 group"
              >
                <div className="w-12 h-12 bg-[#064e3b]/30 rounded-xl border border-white/[0.03] flex items-center justify-center mb-6 group-hover:bg-[#10b981]/10 transition-colors duration-500">
                  <p.icon className="text-[#4ade80] w-5 h-5" strokeWidth={1.5} />
                </div>
                <h4 className="text-lg font-semibold text-[#F8FAF6] mb-3">{p.title}</h4>
                <p className="text-white/60 text-sm leading-relaxed font-light">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
