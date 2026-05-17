/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Target, BarChart3, Droplets, FileJson } from 'lucide-react';

const features = [
  {
    title: 'Object Detection',
    description: 'Pinpoint every crown with Faster R-CNN accuracy, trained on the most diverse Indonesian plantation datasets.',
    icon: Target,
  },
  {
    title: 'Tree Health Analytics',
    description: 'Categorize plantations by 4-Tier health levels: Healthy, Stunted, Deficient, or Terminal.',
    icon: BarChart3,
  },
  {
    title: 'VRA Optimization',
    description: 'Generate fertilization maps for Variable Rate Application hardware, reducing waste by up to 22%.',
    icon: Droplets,
  },
  {
    title: 'Automated Reporting',
    description: 'Export industrial PDF, XLSX, and CSV reports with one click for stakeholders and field teams.',
    icon: FileJson,
  }
];

export default function FeatureCards() {
  return (
    <section id="features" className="py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-brand-600 font-black text-xs uppercase tracking-[0.4em] mb-4">Core Technology</h2>
          <h3 className="text-5xl font-black text-brand-950 tracking-tight leading-tight">Intelligence for the <br /> Modern Estate.</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-brand-900/5 group hover:border-brand-500 transition-all hover:scale-[1.03]"
            >
              <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-500 transition-colors">
                <feature.icon className="text-brand-900 w-8 h-8 group-hover:text-white" />
              </div>
              <h4 className="text-2xl font-black text-brand-950 mb-4 tracking-tight">{feature.title}</h4>
              <p className="text-slate-500 leading-relaxed font-medium">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
