import { motion } from 'motion/react';
import { Target, Trees, BarChart3, Droplets, Scan } from 'lucide-react';

const aboutFeatures = [
  {
    title: 'Object Detection',
    description: 'Accurate localization of individual oil palm trees using advanced RetinaNet computer vision models.',
    icon: Scan
  },
  {
    title: '4-Class Health Grading',
    description: 'Automatically categorizes tree crowns into Healthy, Yellow, Small, or Dead for precise monitoring.',
    icon: Trees
  },
  {
    title: 'Automated Analytics',
    description: 'Generates comprehensive statistical reports, pie charts, and visual dashboards from aerial drone imagery.',
    icon: BarChart3
  },
  {
    title: 'Actionable VRA',
    description: 'Provides Variable Rate Application recommendations with criticality levels (Critical, High, Low) for effective estate management.',
    icon: Droplets
  },
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
            {aboutFeatures.map((feat, i) => (
              <div
                key={feat.title}
                className="p-8 md:p-10 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-[inset_0_1px_3px_rgba(255,255,255,0.08),_0_8px_32px_rgba(0,0,0,0.3)] flex flex-col gap-6 group hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-500"
              >
                <div className="w-12 h-12 bg-[#10b981]/5 border border-white/[0.03] rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-[#10b981]/15 transition-all duration-300">
                  <feat.icon className="text-[#4ade80] w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-[#F8FAF6] text-xl sm:text-2xl font-bold mb-3 group-hover:text-[#4ade80] transition-colors duration-300">{feat.title}</h4>
                  <p className="text-white/50 text-sm font-light leading-relaxed">{feat.description}</p>
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
              About
            </h2>
            <h3 className="text-4xl sm:text-5xl font-semibold text-[#F8FAF6] tracking-tight mb-10 leading-[1.1]">
              Pioneering <br />
              <span className="text-[#d97706] font-light italic">Autonomous Agronomy.</span>
            </h3>

            <div className="space-y-8 text-white/60 text-lg leading-relaxed font-light">
              <p>
                By combining high-altitude UAV drone imagery with advanced computer vision, our platform provides comprehensive visibility and analysis that ground surveys simply cannot match. We aim to solve the critical "blind spot" in large-scale oil palm estate management by shifting from reactive to proactive monitoring.
              </p>
              <p>
                Our core technology leverages <strong className="text-[#F8FAF6] font-semibold">RetinaNet</strong> deep learning architectures to detect individual oil palm crowns and automatically classify them into 4 distinct health categories: Healthy, Yellowing, Small Canopy, and Dead. This enables plantation managers to view automated analysis and execute targeted, data-driven <strong className="text-[#F8FAF6] font-semibold">VRA (Variable Rate Application)</strong> interventions.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
