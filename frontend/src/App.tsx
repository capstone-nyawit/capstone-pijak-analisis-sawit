/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ChangeEmail from './pages/ChangeEmail';
import { motion, useScroll, useSpring } from 'motion/react';
import Lenis from 'lenis';

function ScrollSetup() {
  const { pathname, hash } = useLocation();
  const lenisRef = useRef<Lenis | null>(null);
  const isInitialRender = useRef(true);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Always scroll to top before page unloads (refresh/close)
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 2.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
    });

    lenisRef.current = lenis;
    (window as any).lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      (window as any).lenis = null;
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const handleScrollTarget = () => {
      if (lenisRef.current) {
        if (hash && window.location.hash) {
          // Wait a short tick for layout rendering
          setTimeout(() => {
            const target = document.querySelector(hash) as HTMLElement | null;
            if (target) {
              lenisRef.current?.scrollTo(target, { duration: 1.5, offset: -100 });
            }
          }, 100);
        } else {
          window.scrollTo(0, 0);
          lenisRef.current.scrollTo(0, { immediate: true });
          setTimeout(() => {
            lenisRef.current?.scrollTo(0, { immediate: true });
          }, 50);
        }
      } else {
        if (hash && window.location.hash) {
          const target = document.querySelector(hash);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo(0, 0);
          setTimeout(() => window.scrollTo(0, 0), 50);
        }
      }
    };

    handleScrollTarget();
  }, [pathname, hash]);


  return null;
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <Router>
      <ScrollSetup />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-brand-600 z-[100] origin-left"
        style={{ scaleX }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/change-email" element={<ChangeEmail />} />
      </Routes>
    </Router>
  );
}

