/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ShieldCheck, Users, Database, Activity, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Sidebar */}
      <div className="w-72 bg-black flex flex-col p-8 border-r border-white/5">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
            <ShieldCheck className="text-brand-950 w-6 h-6" />
          </div>
          <span className="font-black text-xl tracking-tighter">Nyawit<span className="text-brand-500">Admin</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { icon: Activity, label: 'System Health', active: true },
            { icon: Users, label: 'User Management' },
            { icon: Database, label: 'API Logs' },
            { icon: ShieldCheck, label: 'Security Clusters' },
          ].map((item) => (
            <button 
              key={item.label}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-black transition-all ${
                item.active ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => navigate('/auth')}
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-black text-red-400 hover:bg-red-500/10 transition-all mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12 flex flex-col">
         <header className="mb-16">
            <h1 className="text-4xl font-black tracking-tight mb-2">Systems Intelligence</h1>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.3em]">Root Access Enabled</p>
         </header>

         <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 bg-black/40 border border-white/5 rounded-[3rem] p-12">
               <h2 className="text-xl font-black mb-8">Active Neural Nodes</h2>
               <div className="space-y-6">
                  {[
                    { node: 'Node-SEA-01', load: '42%', status: 'Online' },
                    { node: 'Node-SEA-02', load: '18%', status: 'Online' },
                    { node: 'Node-AUS-01', load: '94%', status: 'High Load' },
                  ].map((node) => (
                    <div key={node.node} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl">
                       <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${node.status === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-brand-500'}`} />
                          <span className="font-black text-sm">{node.node}</span>
                       </div>
                       <span className="text-slate-500 font-mono text-xs">{node.load}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-brand-900 rounded-[3rem] p-10 flex flex-col justify-between">
               <Activity className="w-12 h-12 text-brand-400 mb-8" />
               <div>
                  <p className="text-brand-400 font-black text-xs uppercase tracking-widest mb-2">System Uptime</p>
                  <p className="text-5xl font-black tracking-tighter">99.99<span className="text-brand-400">%</span></p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
