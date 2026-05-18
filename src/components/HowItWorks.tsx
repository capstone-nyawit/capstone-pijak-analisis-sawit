import { motion } from 'motion/react';
import { UploadCloud, Cpu, PieChart, Map } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { ShaderPlane } from './ui/background-paper-shaders';

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
    <section id="how-it-works" className="py-24 relative">
      {/* 3D Shader Background */}
      <div className="absolute inset-0 pointer-events-none opacity-50" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)' }}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ShaderPlane position={[0, 0, 0]} color1="#022c22" color2="#10b981" />
        </Canvas>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-[#4ade80] font-semibold text-xs uppercase tracking-[0.3em] mb-4">The Workflow</h2>
            <h3 className="text-4xl sm:text-5xl font-semibold text-[#F8FAF6] tracking-tight leading-tight">
              Complex Analysis, <br />
              <span className="text-[#d97706] font-light italic">Simplified.</span>
            </h3>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
              className="relative group"
            >
              <div className="text-[120px] font-semibold text-white/5 absolute -top-16 -left-4 leading-none select-none pointer-events-none transition-colors group-hover:text-white/10 duration-500">
                {s.step}
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/[0.02] border border-white/[0.03] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md group-hover:scale-110 group-hover:bg-[#10b981]/10 group-hover:border-[#10b981]/20 transition-all duration-500">
                  <s.icon className="text-[#4ade80] w-6 h-6" strokeWidth={1.5} />
                </div>
                <h4 className="text-xl font-semibold text-[#F8FAF6] mb-3">{s.title}</h4>
                <p className="text-white/60 leading-relaxed font-light text-sm">
                  {s.description}
                </p>
              </div>
              
              {i < 3 && (
                <div className="hidden lg:block absolute top-7 -right-6 w-12 h-[1px] bg-gradient-to-r from-white/20 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
