import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-12 lg:px-20">
        <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] p-12 md:p-24 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 text-center md:text-left shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),_0_8px_32px_rgba(0,0,0,0.3)] border border-white/[0.06]">
          {/* Decorative backgrounds */}
          <div className="absolute top-0 right-0 w-full h-full bg-[#064e3b]/30 translate-x-[20%] skew-x-[-15deg] -z-0" />
          
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
