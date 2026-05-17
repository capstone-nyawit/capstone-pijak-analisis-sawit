/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProblemSection from '../components/ProblemSection';
import HowItWorks from '../components/HowItWorks';
import FeatureCards from '../components/FeatureCards';
import DashboardSimulation from '../components/DashboardSimulation';
import AboutSection from '../components/AboutSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen font-sans">
      <Navbar />
      
      <main>
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <FeatureCards />
        <AboutSection />

        <div className="bg-brand-50 pt-32 pb-16">
           <div className="max-w-7xl mx-auto px-4 text-center mb-16">
              <h2 className="text-brand-600 font-black text-xs uppercase tracking-[0.4em] mb-4">The Interface</h2>
              <h3 className="text-5xl font-black text-brand-950 tracking-tight">Enterprise Visibility.</h3>
           </div>
           <DashboardSimulation />
        </div>
        
        <CTASection />

        {/* Research Quote Section */}
        <section className="py-24 bg-brand-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
          <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
            <h3 className="text-brand-400 font-mono text-xs uppercase tracking-[0.4em] mb-8 font-black">Scientific Validation</h3>
            <p className="text-white text-3xl md:text-5xl font-black tracking-tight leading-tight mb-8">
              "NyawitAI has demonstrated a <span className="text-brand-400">14% increase</span> in detectable yield metrics through autonomous assessment."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-10 h-px bg-white/20" />
              <span className="text-brand-100/50 font-black uppercase text-[10px] tracking-widest">Faculty of Agricultural Technology</span>
              <div className="w-10 h-px bg-white/20" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
