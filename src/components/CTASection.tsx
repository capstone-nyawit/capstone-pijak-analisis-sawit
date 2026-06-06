import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Smooth scroll translation for the background image
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <section ref={containerRef} className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-12 lg:px-20">
        <div className="relative bg-[#022c22]/10 backdrop-blur-3xl rounded-[3rem] p-12 md:p-24 overflow-hidden flex flex-col md:flex-row items-center gap-12 text-center md:text-left shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),_0_8px_32px_rgba(0,0,0,0.3)] border border-white/[0.06]">
          {/* Parallax background image */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <motion.img
              src="/hero-plantation.png"
              alt="Background plantation"
              className="absolute w-full h-[130%] object-cover opacity-15 top-[-15%] left-0 scale-105"
              style={{ y: bgY }}
            />
            {/* Soft gradient masks for visual integration */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#011712] via-[#011712]/90 to-transparent" />
            <div className="absolute inset-0 bg-[#022c22]/30 mix-blend-multiply" />
          </div>

          <div className="relative z-10 flex-1">
             <h2 className="text-[#F8FAF6] text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] mb-8">
                Start Monitoring Your <br />
                Plantation With <span className="text-[#d97706] font-light italic">AI.</span>
             </h2>
             <div className="flex flex-wrap justify-center md:justify-start gap-6">
                {['No setup fees', 'Enterprise SLA', 'Cloud & On-prem'].map((item) => (
                   <div key={item} className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-widest">
                     <CheckCircle2 className="w-5 h-5 text-[#4ade80]" />
                     {item}
                   </div>
                ))}
             </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             <Link to="/auth" className="bg-[#F8FAF6] text-[#011712] px-10 py-5 rounded-2xl font-semibold text-sm hover:bg-white transition-all shadow-lg flex items-center justify-center gap-3">
                Sign Up Now
                <ArrowRight className="w-4 h-4" />
             </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
