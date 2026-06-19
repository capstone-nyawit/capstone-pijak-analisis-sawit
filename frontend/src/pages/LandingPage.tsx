/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProblemSection from '../components/ProblemSection';
import HowItWorks from '../components/HowItWorks';
import FeatureCards from '../components/FeatureCards';
import AboutSection from '../components/AboutSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

export default function LandingPage() {
  useEffect(() => {
    // Force scroll to top on page refresh/load
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#011712] min-h-screen font-sans relative overflow-x-hidden">
      {/* Global Atmospheric Mist & Cinematic Depth */}
      <div className="absolute top-[10%] -left-[20%] w-[70%] h-[1000px] bg-[#10b981]/5 rounded-full blur-[180px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[35%] -right-[15%] w-[60%] h-[1200px] bg-[#022c22] rounded-full blur-[200px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[65%] -left-[10%] w-[50%] h-[900px] bg-[#064e3b]/30 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      
      {/* Grain overlay for organic feel */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-50 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

      <Navbar />
      
      <main className="relative z-10 flex flex-col">
        <Hero />
        <ProblemSection />
        <FeatureCards />
        <HowItWorks />
        <AboutSection />


        
        <CTASection />


      </main>

      <Footer />
    </div>
  );
}
