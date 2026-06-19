import React, { useState } from "react";
import { motion } from "motion/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Leaf, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { PasswordStrengthInput } from "../components/ui/password-strength-input";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!token) {
      setErrorMsg("Token reset tidak ditemukan atau tidak valid.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Password dan Konfirmasi Password tidak cocok.");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${apiUrl}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Reset password gagal.");
      }
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-[#04211a] rounded-2xl flex items-center justify-center shadow-lg">
            <Leaf className="text-emerald-400 w-7 h-7" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-black text-[#04211a] tracking-tight">
          Nyawit<span className="text-emerald-600">AI</span>
        </h2>
        <p className="mt-2 text-center text-sm font-bold text-slate-500 uppercase tracking-widest">
          Atur Ulang Password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white py-10 px-6 sm:px-10 rounded-[2.5rem] border border-[#e5e2d6] shadow-[0_25px_60px_-15px_rgba(4,33,26,0.06)]"
        >
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-[0_0_50px_rgba(16,185,129,0.15)] animate-pulse">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-[#04211a]">
                  Password Diperbarui!
                </h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Password Anda berhasil disetel ulang. Silakan kembali ke halaman login untuk masuk ke dashboard.
                </p>
              </div>
              <button
                onClick={() => navigate("/auth")}
                className="w-full py-5 rounded-2xl font-extrabold text-base bg-[#04211a] text-white hover:bg-emerald-950 transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-md cursor-pointer"
              >
                Kembali ke Login
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm font-semibold flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                  {errorMsg}
                </div>
              )}

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#04211a] uppercase tracking-wider flex items-center gap-2 px-1">
                  <Lock className="w-3.5 h-3.5 opacity-40" />
                  Password Baru
                </label>
                <PasswordStrengthInput
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  className="w-full px-6 py-4 bg-[#fcfbf7] border-2 border-[#e5e2d6] rounded-2xl focus:outline-none focus:border-emerald-600 transition-all font-medium pr-14 placeholder:opacity-30 !h-auto"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#04211a] uppercase tracking-wider flex items-center gap-2 px-1">
                  <Lock className="w-3.5 h-3.5 opacity-40" />
                  Konfirmasi Password
                </label>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-6 py-4 bg-[#fcfbf7] border-2 border-[#e5e2d6] rounded-2xl focus:outline-none focus:border-emerald-600 transition-all font-medium placeholder:opacity-30"
                />
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full py-6 rounded-2xl font-extrabold text-lg shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] bg-[#04211a] text-white hover:bg-emerald-950 hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    Simpan Password Baru
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
