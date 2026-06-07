import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, Mail, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FluidParticlesBackground } from '../components/ui/fluid-particles-background';

export default function ChangeEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !token) return;

    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${apiUrl}/users/confirm-email-change`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_email: newEmail })
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Your email has been successfully updated. Please login again with your new credentials.');
        // Log out user locally since their email (username) might have changed
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.detail || 'Failed to update email.');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] flex flex-col justify-center items-center relative overflow-hidden font-inter selection:bg-emerald-500/30">
      <FluidParticlesBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-100 relative z-10 mx-4"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#04211a] text-white mb-6 shadow-xl shadow-[#04211a]/20">
            <Mail size={32} strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-extrabold text-[#04211a]">Update Email</h2>
          <p className="text-sm font-semibold text-slate-500 mt-2">Enter your new email address below</p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-emerald-900 font-bold mb-2">Success!</h3>
              <p className="text-emerald-700 text-sm font-medium leading-relaxed">{message}</p>
              <p className="text-emerald-600/80 text-xs mt-4 animate-pulse">Redirecting to login...</p>
            </motion.div>
          ) : status === 'error' && !token ? (
            <motion.div 
              key="error-notoken"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center"
            >
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-red-900 font-bold mb-2">Invalid Link</h3>
              <p className="text-red-700 text-sm font-medium leading-relaxed">{message}</p>
              <button onClick={() => navigate('/auth')} className="mt-6 w-full py-3 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl font-bold transition-all">Back to Login</button>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              {status === 'error' && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-bold p-4 rounded-xl flex items-center gap-2">
                  <XCircle className="w-4 h-4 shrink-0" />
                  {message}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">New Email Address</label>
                <input 
                  type="email" 
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border border-[#e5e2d6] rounded-xl py-3 px-4 text-sm font-semibold text-[#04211a] focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all shadow-sm"
                />
              </div>

              <button 
                type="submit"
                disabled={isLoading || !newEmail}
                className="w-full py-3.5 bg-[#04211a] hover:bg-emerald-950 text-white font-extrabold rounded-xl transition-all shadow-xl shadow-[#04211a]/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm New Email'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
