/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-12 lg:px-20">
        <div className="bg-brand-900 rounded-[3rem] p-12 md:p-24 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
          {/* Decorative backgrounds */}
          <div className="absolute top-0 right-0 w-full h-full bg-brand-800 translate-x-[20%] skew-x-[-15deg] -z-0" />
          
          <div className="relative z-10 flex-1">
             <h2 className="text-white text-4xl md:text-6xl font-black tracking-tight leading-tight mb-8">
                Start Monitoring Your <br />
                Plantation With <span className="text-brand-400">AI.</span>
             </h2>
             <div className="flex flex-wrap justify-center md:justify-start gap-6">
                {['No setup fees', 'Enterprise SLA', 'Cloud & On-prem'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-brand-100 text-sm font-black uppercase tracking-widest">
                    <CheckCircle2 className="w-5 h-5 text-brand-400" />
                    {item}
                  </div>
                ))}
             </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             <Link to="/auth" className="bg-white text-brand-950 px-10 py-5 rounded-2xl font-black text-lg hover:bg-brand-50 transition-all shadow-2xl flex items-center justify-center gap-3">
                Sign Up Now
                <ArrowRight className="w-5 h-5" />
             </Link>
             <button className="bg-brand-800 text-white px-10 py-5 rounded-2xl font-black text-lg border border-white/10 hover:bg-brand-700 transition-all flex items-center justify-center">
                Contact Sales
             </button>
          </div>
        </div>
      </div>
    </section>
  );
}
