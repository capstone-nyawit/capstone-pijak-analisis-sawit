/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';





export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* ── Parallax plantation background & Overlays ────────────────────────────── */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
        }}
      >
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ y: bgY }}
        >
          <img
            src="/hero-plantation.png"
            alt="Aerial oil palm plantation"
            className="w-full h-full object-cover object-center scale-110"
            loading="eager"
          />
        </motion.div>

        {/* ── Layered organic overlays for text legibility & transition ──────────────────── */}
        {/* Deep palm green base tint */}
        <div className="absolute inset-0 bg-[#022c22]/40" />
        
        {/* Central soft vignette (muted forest green/black) for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(2, 44, 34, 0.2) 0%, rgba(2, 44, 34, 0.6) 100%)',
          }}
        />
        
        {/* Top subtle fade for navbar integration */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#011712]/70 to-transparent" />
      </div>



      {/* ── Main centered content ────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-24 pb-20"
        style={{ y: contentY, opacity }}
      >
        {/* AI badge removed per user request */}

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
          className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-[1.1] max-w-5xl mb-8"
          style={{ textShadow: '0 4px 24px rgba(2, 44, 34, 0.4)' }}
        >
          Precision Analytics for <br />
          <span
            className="font-light italic text-[#F8FAF6]"
          >
            Modern Agriculture
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: 'easeOut' }}
          className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl mb-12 font-light"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
        >
          Nyawit AI transforms aerial imagery into actionable estate insights, empowering teams with data-driven tree health mapping and proactive resource optimization.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-5"
        >
          <Link
            to="/auth"
            className="flex items-center gap-3 px-10 py-4 rounded-full font-semibold text-sm text-[#022c22] transition-all hover:scale-[1.02] active:scale-95 group"
            style={{
              background: '#F8FAF6',
              boxShadow: '0 8px 32px rgba(248,250,246,0.15)',
            }}
          >
            Start Monitoring
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          {/* View Demo button removed per user request */}
        </motion.div>
      </motion.div>


      {/* ── Scroll indicator ────────────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        <div
          className="w-5 h-8 rounded-full border border-[#022c22]/20 flex items-start justify-center pt-1.5"
        >
          <motion.div
            className="w-1 h-1.5 rounded-full bg-[#022c22]/40"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
