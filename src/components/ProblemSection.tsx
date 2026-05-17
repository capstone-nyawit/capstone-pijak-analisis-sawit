/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Clock, TrendingDown, ShieldAlert, DatabaseZap } from 'lucide-react';

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
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-brand-600 font-black text-xs uppercase tracking-[0.4em] mb-6">Industrial Challenges</h2>
              <h3 className="text-5xl font-black text-brand-950 tracking-tight leading-tight mb-8">
                Traditional Estate <br />
                Management Is <br />
                <span className="text-red-500">Bleeding Efficiency.</span>
              </h3>
              <p className="text-xl text-slate-600 leading-relaxed font-medium mb-10">
                Operating blindly at scale costs millions in yield loss and chemical waste. NyawitAI provides the visibility required for modern carbon-negative agriculture.
              </p>
              
              <div className="flex items-center gap-6 p-6 bg-brand-50 rounded-3xl border border-brand-100">
                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <TrendingDown className="text-red-500 w-7 h-7" />
                 </div>
                 <div>
                    <p className="text-brand-950 font-black text-lg">-22% Estate Yield</p>
                    <p className="text-slate-500 text-sm font-medium">Average loss due to delayed disease intervention.</p>
                 </div>
              </div>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {problems.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all group"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <p.icon className="text-brand-900 w-6 h-6" />
                </div>
                <h4 className="text-xl font-black text-brand-950 mb-3 tracking-tight">{p.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
