/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, ArrowRight, Mail, Lock, User, Building2, ShieldCheck, Eye, EyeOff, CheckCircle2, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real application, the role would be determined by the backend response
    // For this simulation, we use a mock rule (e.g., admin@nyawit.ai is admin)
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      
      setTimeout(() => {
        if (email === 'admin@nyawit.ai') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 1000);
    }, 1500);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotSuccess(true);
    }, 1500);
  };

  const resetAuthView = (view: 'login' | 'signup' | 'forgot') => {
    setAuthView(view);
    setSuccess(false);
    setForgotSuccess(false);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#04211a] relative overflow-hidden flex flex-col items-center justify-center p-6 md:p-12 font-sans">
      {/* Background Texture & Decor */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />
      
      {/* Subtle Contour/Sat Decor */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none overflow-hidden text-emerald-400">
        <svg className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] rotate-12" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 100 C 300 150, 400 50, 600 100 S 800 200, 900 150" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M50 200 C 250 250, 350 150, 550 200 S 750 300, 850 250" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M0 300 C 200 350, 300 250, 500 300 S 700 400, 800 350" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#2dd4bf 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />

      {/* Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[160px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl relative z-10"
      >
        {/* Branding Header */}
        <div className="flex flex-col items-center mb-10">
          <div 
            className="flex items-center gap-4 mb-3 cursor-pointer group" 
            onClick={() => navigate('/')}
          >
            <div className="w-14 h-14 bg-[#fcfbf7] rounded-2xl flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform">
              <Leaf className="text-[#04211a] w-8 h-8" />
            </div>
            <span className="text-[#fcfbf7] font-black text-4xl tracking-tighter">
              Nyawit<span className="text-teal-400">AI</span>
            </span>
          </div>
          <p className="text-teal-400 font-bold text-[10px] uppercase tracking-[0.6em] text-center opacity-80 mb-2">
            AI-POWERED PLANTATION INTELLIGENCE
          </p>
        </div>

        {/* Main Ivory Card */}
        <div className="bg-[#fcfbf7] rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.4)] overflow-hidden border border-white/20">
          <div className="p-8 md:p-14 lg:p-16">
            <div className="mb-10 text-center">
              <h2 className="text-4xl font-extrabold text-[#04211a] tracking-tight mb-3">
                {authView === 'login' ? 'Welcome Back' : authView === 'signup' ? 'Create Your Account' : forgotSuccess ? 'Reset Link Sent' : 'Reset Your Password'}
              </h2>
              <p className="text-slate-500 font-medium">
                {authView === 'login' 
                  ? 'Access your plantation intelligence dashboard.' 
                  : authView === 'signup' 
                  ? 'Join the next generation of AI-powered plantation monitoring.'
                  : forgotSuccess
                  ? 'Please check your email and follow the instructions to reset your password.'
                  : 'Enter your registered email address and we\'ll send you a secure password reset link.'}
              </p>
            </div>

            {/* Premium Toggle Switch - Only show on Login/Signup */}
            {authView !== 'forgot' && (
              <div className="flex p-1.5 bg-[#f0eee6] rounded-full mb-10 border border-[#e5e2d6]">
                <button 
                  onClick={() => resetAuthView('login')}
                  className={`flex-1 py-4 text-sm font-bold rounded-full transition-all duration-300 ${authView === 'login' ? 'bg-white text-[#04211a] shadow-lg' : 'text-slate-500 hover:text-[#04211a]'}`}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => resetAuthView('signup')}
                  className={`flex-1 py-4 text-sm font-bold rounded-full transition-all duration-300 ${authView === 'signup' ? 'bg-white text-[#04211a] shadow-lg' : 'text-slate-500 hover:text-[#04211a]'}`}
                >
                  Create Account
                </button>
              </div>
            )}

            {authView === 'forgot' ? (
              <form onSubmit={handleForgotSubmit} className="space-y-6">
                {!forgotSuccess ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#04211a] uppercase tracking-wider flex items-center gap-2 px-1">
                      <Mail className="w-3.5 h-3.5 opacity-40" />
                      Email Address
                    </label>
                    <input 
                      required
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-6 py-4 bg-[#fcfbf7] border-2 border-[#e5e2d6] rounded-2xl focus:outline-none focus:border-emerald-600 transition-all font-medium placeholder:opacity-30"
                    />
                  </div>
                ) : null}

                {!forgotSuccess ? (
                  <button 
                    disabled={isLoading}
                    type="submit"
                    className={`w-full py-6 rounded-2xl font-extrabold text-lg shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] bg-[#04211a] text-white hover:bg-emerald-950 hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <button 
                      type="button"
                      onClick={() => setForgotSuccess(false)}
                      className="w-full py-4 text-emerald-600 font-extrabold flex justify-center items-center gap-2 hover:bg-emerald-50 rounded-2xl transition-all"
                    >
                      Resend Email
                    </button>
                    <button 
                      type="button"
                      onClick={() => resetAuthView('login')}
                      className={`w-full py-6 rounded-2xl font-extrabold text-lg shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] bg-[#04211a] text-white hover:bg-emerald-950 hover:-translate-y-0.5`}
                    >
                      Back to Sign In
                    </button>
                  </div>
                )}
                
                {!forgotSuccess && (
                  <button 
                    type="button"
                    onClick={() => resetAuthView('login')}
                    className="w-full py-4 text-slate-500 font-extrabold flex justify-center items-center gap-2 hover:bg-slate-100 rounded-2xl transition-all mt-4"
                  >
                    Back to Sign In
                  </button>
                )}
              </form>
            ) : (
              <form onSubmit={handleAuth} className="space-y-6">
                <AnimatePresence mode="wait">
                  {authView === 'signup' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6 overflow-hidden pb-1"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#04211a] uppercase tracking-wider flex items-center gap-2 px-1">
                            <User className="w-3.5 h-3.5 opacity-40" />
                            Full Name
                          </label>
                          <input 
                            required
                            type="text" 
                            placeholder="Elizabeth Warren"
                            className="w-full px-6 py-4 bg-[#fcfbf7] border-2 border-[#e5e2d6] rounded-2xl focus:outline-none focus:border-emerald-600 transition-all font-medium placeholder:opacity-30"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#04211a] uppercase tracking-wider flex items-center gap-2 px-1">
                            <Building2 className="w-3.5 h-3.5 opacity-40" />
                            Company Name
                          </label>
                          <input 
                            required
                            type="text" 
                            placeholder="Sumatra Agri"
                            className="w-full px-6 py-4 bg-[#fcfbf7] border-2 border-[#e5e2d6] rounded-2xl focus:outline-none focus:border-emerald-600 transition-all font-medium placeholder:opacity-30"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#04211a] uppercase tracking-wider flex items-center gap-2 px-1">
                    <Mail className="w-3.5 h-3.5 opacity-40" />
                    Email Address
                  </label>
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-6 py-4 bg-[#fcfbf7] border-2 border-[#e5e2d6] rounded-2xl focus:outline-none focus:border-emerald-600 transition-all font-medium placeholder:opacity-30"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-xs font-bold text-[#04211a] uppercase tracking-wider flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 opacity-40" />
                      Password
                    </label>
                    {authView === 'login' && (
                      <button 
                        type="button" 
                        onClick={() => resetAuthView('forgot')}
                        className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input 
                      required
                      minLength={authView === 'signup' ? 8 : undefined}
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••"
                      className="w-full px-6 py-4 bg-[#fcfbf7] border-2 border-[#e5e2d6] rounded-2xl focus:outline-none focus:border-emerald-600 transition-all font-medium pr-14 placeholder:opacity-30"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#04211a] p-1 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {authView === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#04211a] uppercase tracking-wider flex items-center gap-2 px-1">
                      <Lock className="w-3.5 h-3.5 opacity-40" />
                      Confirm Password
                    </label>
                    <input 
                      required
                      minLength={authView === 'signup' ? 8 : undefined}
                      type="password" 
                      placeholder="••••••••"
                      className="w-full px-6 py-4 bg-[#fcfbf7] border-2 border-[#e5e2d6] rounded-2xl focus:outline-none focus:border-emerald-600 transition-all font-medium placeholder:opacity-30"
                    />
                  </div>
                )}

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="w-5 h-5 rounded-md border-[#e5e2d6] text-emerald-600 focus:ring-emerald-500 cursor-pointer" 
                  required
                />
                <label htmlFor="terms" className="text-sm font-medium text-slate-500 cursor-pointer select-none">
                  {authView === 'login' ? 'Keep me signed in' : 'I agree to the Terms and Privacy Policy'}
                </label>
              </div>

              <button 
                disabled={isLoading || success}
                className={`w-full py-6 rounded-2xl font-extrabold text-lg shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                  success 
                    ? 'bg-emerald-500 text-white cursor-default' 
                    : 'bg-[#04211a] text-white hover:bg-emerald-950 hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    {authView === 'login' ? 'Access Dashboard' : 'Create Account'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
            )}

            {authView !== 'forgot' && (
              <p className="mt-10 text-center text-slate-500 font-medium">
                {authView === 'login' ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={() => resetAuthView(authView === 'login' ? 'signup' : 'login')}
                  className="ml-2 text-teal-600 font-extrabold hover:text-teal-700 underline underline-offset-4 decoration-2"
                >
                  {authView === 'login' ? 'Create Account' : 'Sign In'}
                </button>
              </p>
            )}

            {/* Subtle Security Badge */}
            <div className="mt-10 pt-8 border-t border-[#e5e2d6] flex justify-center">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Secure Enterprise Session
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Global Footer Detail */}
      <div className="mt-12 text-teal-400/30 font-mono text-[9px] uppercase tracking-[0.4em] flex items-center gap-4">
        <span>Precision Agronomy</span>
        <div className="w-1 h-1 bg-teal-400/20 rounded-full" />
        <span>UAV Analytics</span>
        <div className="w-1 h-1 bg-teal-400/20 rounded-full" />
        <span>VRA Monitoring</span>
      </div>
    </div>
  );
}
