/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Leaf, Github, Mail } from 'lucide-react';

import React from 'react';

export default function Footer() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    
    const hash = href.substring(1);
    const target = document.getElementById(hash);
    if (target && (window as any).lenis) {
      e.preventDefault();
      (window as any).lenis.scrollTo(target, { duration: 2.0, offset: -100 });
      window.history.pushState(null, '', `#${hash}`);
    }
  };

  return (
    <footer id="contact" className="relative pt-16 pb-8 overflow-hidden">
      {/* Soft gradient bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#011712] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#10b981]/10 border border-[#4ade80]/20 rounded-xl flex items-center justify-center shadow-sm">
                <Leaf className="text-[#4ade80] w-4 h-4" />
              </div>
              <span className="text-[#F8FAF6] font-extrabold text-xl tracking-tight">Nyawit<span className="text-[#4ade80]">AI</span></span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6 font-light">
              AI-powered plantation intelligence platform for oil palm health monitoring, analytics, and VRA recommendation.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Github, href: "https://github.com/capstone-nyawit" },
                { Icon: Mail, href: "mailto:contact@nyawit.ai" }
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} target={href !== "#" ? "_blank" : undefined} rel={href !== "#" ? "noopener noreferrer" : undefined} className="text-white/40 hover:text-[#4ade80] transition-colors">
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white/95 font-bold mb-6 text-xs uppercase tracking-[0.2em] text-[#4ade80]">Features</h4>
            <ul className="space-y-4 text-white/60 text-sm font-light">
              <li><a href="#features" onClick={handleScroll} className="hover:text-[#4ade80] transition-colors">AI Object Detection</a></li>
              <li><a href="#features" onClick={handleScroll} className="hover:text-[#4ade80] transition-colors">Tree Health Classification</a></li>
              <li><a href="#features" onClick={handleScroll} className="hover:text-[#4ade80] transition-colors">VRA Recommendation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white/95 font-bold mb-6 text-xs uppercase tracking-[0.2em] text-[#4ade80]">Quick Links</h4>
            <ul className="space-y-4 text-white/60 text-sm font-light">
              <li><a href="#features" onClick={handleScroll} className="hover:text-[#4ade80] transition-colors">Features</a></li>
              <li><a href="#how-it-works" onClick={handleScroll} className="hover:text-[#4ade80] transition-colors">How It Works</a></li>
              <li><a href="#about" onClick={handleScroll} className="hover:text-[#4ade80] transition-colors">About</a></li>
              <li><a href="#contact" onClick={handleScroll} className="hover:text-[#4ade80] transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white/95 font-bold mb-6 text-xs uppercase tracking-[0.2em] text-[#4ade80]">Contact</h4>
            <ul className="space-y-4 text-white/60 text-sm font-light">
              <li className="hover:text-white transition-colors">HQ: Jakarta, Indonesia</li>
              <li className="hover:text-white transition-colors">Email: contact@nyawit.ai</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.03] text-center">
          <p className="text-white/40 text-[10px] uppercase font-semibold tracking-[0.2em]">
            © {new Date().getFullYear()} NyawitAI Autonomous Agronomy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
