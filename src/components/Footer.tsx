/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Leaf, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
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
              Leading the revolution in precision agriculture through advanced UAV computer vision and deep learning analytics.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="text-white/40 hover:text-[#4ade80] transition-colors">
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white/95 font-bold mb-6 text-xs uppercase tracking-[0.2em] text-[#4ade80]">Solutions</h4>
            <ul className="space-y-4 text-white/60 text-sm font-light">
              <li><a href="#features" className="hover:text-[#4ade80] transition-colors">Health Monitoring</a></li>
              <li><a href="#features" className="hover:text-[#4ade80] transition-colors">Object Detection</a></li>
              <li><a href="#features" className="hover:text-[#4ade80] transition-colors">VRA Optimization</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white/95 font-bold mb-6 text-xs uppercase tracking-[0.2em] text-[#4ade80]">Company</h4>
            <ul className="space-y-4 text-white/60 text-sm font-light">
              <li><a href="#about" className="hover:text-[#4ade80] transition-colors">About Us</a></li>
              <li><a href="#how-it-works" className="hover:text-[#4ade80] transition-colors">How It Works</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white/95 font-bold mb-6 text-xs uppercase tracking-[0.2em] text-[#4ade80]">Contact</h4>
            <ul className="space-y-4 text-white/60 text-sm font-light">
              <li className="hover:text-white transition-colors">HQ: Jakarta, Indonesia</li>
              <li className="hover:text-white transition-colors">Email: info@nyawit.ai</li>
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
