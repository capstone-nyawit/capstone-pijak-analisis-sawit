/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Leaf, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#010f1f] border-t border-emerald-500/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
                <Leaf className="text-[#051424] w-4 h-4" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">NyawitAI</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Leading the revolution in precision agriculture through advanced UAV computer vision and deep learning analytics.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="text-slate-500 hover:text-emerald-400 transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Solutions</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Health Monitoring</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Yield Optimization</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Resource Allocation</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">UAV Fleets</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Company</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Research Results</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Contact</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li>HQ: Jakarta, Indonesia</li>
              <li>Email: info@nyawit.ai</li>
              <li>Tech Support: support@nyawit.ai</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-emerald-500/5 text-center">
          <p className="text-slate-600 text-[10px] uppercase font-bold tracking-[0.2em]">
            © {new Date().getFullYear()} NyawitAI Autonomous Agronomy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
