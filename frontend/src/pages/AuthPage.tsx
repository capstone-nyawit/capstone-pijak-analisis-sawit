/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {useState} from "react";
import {motion, AnimatePresence} from "motion/react";
import {PasswordStrengthInput} from "../components/ui/password-strength-input";
import {
  TreePalm,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Building2,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  Globe,
  Clock,
  RefreshCw,
} from "lucide-react";
import {useNavigate} from "react-router-dom";

export default function AuthPage() {
  const [authView, setAuthView] = useState<"login" | "signup" | "forgot">(
    "login",
  );
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);
  const [accountType, setAccountType] = useState<"individual" | "organization">(
    "individual",
  );
  const [orgChoice, setOrgChoice] = useState<"create" | "join">("create");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [submitState, setSubmitState] = useState<
    null | "success" | "pending" | "approved"
  >(null);
  const [countdown, setCountdown] = useState(5);
  const [modal, setModal] = useState<{
    show: boolean;
    message: string;
    type: "error" | "success" | "info";
    onConfirm?: () => void;
  } | null>(null);
  const navigate = useNavigate();

  const showAlert = (
    message: string,
    type: "error" | "success" | "info" = "error",
    onConfirm?: () => void
  ) => {
    setModal({ show: true, message, type, onConfirm });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

    try {
      if (authView === "login") {
        const res = await fetch(`${apiUrl}/login`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({identifier: email, password: password}),
        });
        const data = await res.json();

        if (!res.ok) {
          showAlert(data.detail || "Email atau kata sandi salah.", "error");
          setIsLoading(false);
          return;
        }

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", data.role);

        const meRes = await fetch(`${apiUrl}/users/me`, {
          headers: {Authorization: `Bearer ${data.access_token}`},
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          localStorage.setItem("user", JSON.stringify(meData));
        }

        setSuccess(true);
        setSuccess(true);
        if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else if (authView === "signup") {
        if (accountType === "individual") {
          const res = await fetch(
            `${apiUrl}/register/individual`,
            {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({full_name: fullName, email, password}),
            },
          );
          if (!res.ok) {
            const data = await res.json();
            showAlert(data.detail || "Registrasi gagal.", "error");
            setIsLoading(false);
            return;
          }
          showAlert("Registrasi berhasil! Silakan masuk.", "success", () => resetAuthView("login"));
        } else if (accountType === "organization") {
          if (orgChoice === "create") {
            const res = await fetch(
              `${apiUrl}/register/organization`,
              {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                  full_name: fullName,
                  email,
                  password,
                  company_name: companyName,
                }),
              },
            );
            if (!res.ok) {
              const data = await res.json();
              showAlert(data.detail || "Registrasi gagal.", "error");
              setIsLoading(false);
              return;
            }
            setSubmitState("success");
            setTimeout(() => {
              navigate("/auth");
              resetAuthView("login");
            }, 5000);
          } else {
            const res = await fetch(`${apiUrl}/join`, {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({
                full_name: fullName,
                email,
                password,
                invite_code: inviteCode,
              }),
            });
            if (!res.ok) {
              const data = await res.json();
              showAlert(data.detail || "Gagal bergabung.", "error");
              setIsLoading(false);
              return;
            }
            setSubmitState("pending");
          }
        }
      }
    } catch (err) {
      showAlert("Terjadi kesalahan. Silakan coba lagi.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserStatus = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
      const res = await fetch(`${apiUrl}/users/status?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'active') {
          setSubmitState("approved");
        } else {
          showAlert("Status Anda masih pending. Silakan tunggu admin untuk menyetujui.", "info");
        }
      } else {
        showAlert("Gagal mengecek status.", "error");
      }
    } catch (err) {
      showAlert("Terjadi kesalahan.", "error");
    }
  };

  const handleForgotSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:8000/api";
      const res = await fetch(`${apiUrl}/forgot-password`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email}),
      });
      const data = await res.json();
      if (!res.ok) {
        showAlert(data.detail || "Terjadi kesalahan.", "error");
        setIsLoading(false);
        return;
      }
      setForgotSuccess(true);
      if (!e) showAlert("Email berhasil dikirim ulang.", "success");
    } catch (err) {
      showAlert("Terjadi kesalahan. Silakan coba lagi.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetAuthView = (view: "login" | "signup" | "forgot") => {
    setAuthView(view);
    setSignupStep(1);
    setAccountType("individual");
    setOrgChoice("create");
    setSuccess(false);
    setForgotSuccess(false);
    setIsLoading(false);
    setSubmitState(null);
    setCountdown(5);
    setEmail("");
    setFullName("");
    setCompanyName("");
    setInviteCode("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-[#04211a] relative overflow-hidden flex flex-col items-center justify-center p-6 md:p-12 font-sans">
      {/* Back Button to Landing Page */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 right-6 md:top-8 md:right-8 z-50 group flex items-center gap-2 px-4.5 py-2.5 rounded-2xl border border-teal-500/30 bg-teal-950/40 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-teal-400 hover:text-white hover:border-teal-400 hover:bg-teal-950/60 shadow-lg transition-all duration-300 active:scale-95 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Back</span>
      </button>

      {/* Background Texture & Decor */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")',
        }}
      />

      {/* Subtle Contour/Sat Decor */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none overflow-hidden text-emerald-400">
        <svg
          className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] rotate-12"
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 100 C 300 150, 400 50, 600 100 S 800 200, 900 150"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <path
            d="M50 200 C 250 250, 350 150, 550 200 S 750 300, 850 250"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <path
            d="M0 300 C 200 350, 300 250, 500 300 S 700 400, 800 350"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#2dd4bf 0.5px, transparent 0.5px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[160px] rounded-full pointer-events-none" />

      <motion.div
        initial={{opacity: 0, y: 30}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
        className="w-full max-w-xl relative z-10"
      >

        {/* Branding Header */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="flex items-center gap-4 mb-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="w-14 h-14 bg-[#fcfbf7] rounded-2xl flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform">
              <TreePalm className="text-[#04211a] w-8 h-8" />
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
            {submitState === null && (
              <div className="mb-10 text-center">
                <h2 className="text-4xl font-extrabold text-[#04211a] tracking-tight mb-3">
                  {authView === "login"
                    ? "Welcome Back"
                    : authView === "forgot"
                      ? forgotSuccess
                        ? "Reset Link Sent"
                        : "Reset Your Password"
                      : signupStep === 1
                        ? "Create Your Account"
                        : accountType === "individual"
                          ? "Personal Details"
                          : orgChoice === "create"
                            ? "New Organization"
                            : "Join Organization"}
                </h2>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  {authView === "login"
                    ? "Access your plantation intelligence dashboard."
                    : authView === "forgot"
                      ? forgotSuccess
                        ? "Please check your email and follow the instructions to reset your password."
                        : "Enter your email address and we'll send you a secure password reset link."
                      : signupStep === 1
                        ? "Join the next generation of AI-powered plantation monitoring."
                        : accountType === "individual"
                          ? "Enter your details to create your personal account."
                          : orgChoice === "create"
                            ? "Create a new plantation workspace for your organization."
                            : "Enter your invite code to link your account to your company."}
                </p>
              </div>
            )}

            {/* Premium Toggle Switch - Only show on Login screen */}
            {authView === "login" && (
              <div className="flex p-1.5 bg-[#f0eee6] rounded-full mb-10 border border-[#e5e2d6]">
                <button
                  type="button"
                  onClick={() => resetAuthView("login")}
                  className="flex-1 py-4 text-sm font-bold rounded-full transition-all duration-300 bg-white text-[#04211a] shadow-lg"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => resetAuthView("signup")}
                  className="flex-1 py-4 text-sm font-bold rounded-full transition-all duration-300 text-slate-500 hover:text-[#04211a]"
                >
                  Create Account
                </button>
              </div>
            )}

            <AnimatePresence mode="wait">
              {authView === "forgot" ? (
                <motion.form
                  key="forgot"
                  initial={{opacity: 0, y: 15}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -15}}
                  transition={{duration: 0.25}}
                  onSubmit={handleForgotSubmit}
                  className="space-y-6"
                >
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
                      className="w-full py-6 rounded-2xl font-extrabold text-lg shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] bg-[#04211a] text-white hover:bg-emerald-950 hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Reset Link
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <button
                        type="button"
                        onClick={() => handleForgotSubmit()}
                        disabled={isLoading}
                        className="w-full py-4 text-emerald-600 font-extrabold flex justify-center items-center gap-2 hover:bg-emerald-50 rounded-2xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Mengirim Ulang..." : "Resend Email"}
                      </button>
                      <button
                        type="button"
                        onClick={() => resetAuthView("login")}
                        className="w-full py-6 rounded-2xl font-extrabold text-lg shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] bg-[#04211a] text-white hover:bg-emerald-950 hover:-translate-y-0.5"
                      >
                        Back to Sign In
                      </button>
                    </div>
                  )}

                  {!forgotSuccess && (
                    <button
                      type="button"
                      onClick={() => resetAuthView("login")}
                      className="w-full py-4 text-slate-500 font-extrabold flex justify-center items-center gap-2 hover:bg-slate-100 rounded-2xl transition-all mt-4"
                    >
                      Back to Sign In
                    </button>
                  )}
                </motion.form>
              ) : authView === "login" ? (
                <motion.form
                  key="login"
                  initial={{opacity: 0, y: 15}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -15}}
                  transition={{duration: 0.25}}
                  onSubmit={handleAuth}
                  className="space-y-6"
                >
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

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#04211a] uppercase tracking-wider flex items-center gap-2 px-1">
                        <Lock className="w-3.5 h-3.5 opacity-40" />
                        Password
                      </label>
                      <div className="relative">
                        <input
                          required
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-6 py-4 bg-[#fcfbf7] border-2 border-[#e5e2d6] rounded-2xl focus:outline-none focus:border-emerald-600 transition-all font-medium pr-14 placeholder:opacity-30"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#04211a] p-1 transition-colors cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end px-1">
                      <button
                        type="button"
                        onClick={() => resetAuthView("forgot")}
                        className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-5 h-5 rounded-md border-[#e5e2d6] text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium text-slate-500 cursor-pointer select-none"
                    >
                      Keep me signed in
                    </label>
                  </div>

                  <button
                    disabled={isLoading || success}
                    type="submit"
                    className="w-full py-6 rounded-2xl font-extrabold text-lg shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] bg-[#04211a] text-white hover:bg-emerald-950 hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
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
                        Login
                      </>
                    )}
                  </button>


                </motion.form>
              ) : submitState !== null ? (
                <motion.div
                  key={`submit-state-${submitState}`}
                  initial={{opacity: 0, scale: 0.95}}
                  animate={{opacity: 1, scale: 1}}
                  exit={{opacity: 0, scale: 0.95}}
                  transition={{duration: 0.3}}
                  className="space-y-8 text-center"
                >
                  {/* SUCCESS STATE (Create Org Success) */}
                  {submitState === "success" && (
                    <div className="space-y-6 py-4">
                      <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-[0_0_50px_rgba(16,185,129,0.15)] animate-pulse">
                          <CheckCircle2 className="w-12 h-12" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h2 className="text-3xl font-extrabold text-[#04211a] tracking-tight">
                          Organization Created
                        </h2>
                        <p className="text-emerald-600/90 font-semibold text-sm">
                          Your organization has been created successfully.
                        </p>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-md mx-auto">
                          You are now the first admin of this workspace.
                          Creating your dashboard access automatically...
                        </p>
                      </div>

                      <div className="pt-6">
                        <div className="inline-flex items-center gap-3 bg-[#f0eee6] border border-[#e5e2d6] px-5 py-2.5 rounded-full text-xs font-bold text-slate-600">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          Redirecting to admin dashboard in {countdown}{" "}
                          seconds...
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PENDING STATE (Join Org Pending) */}
                  {submitState === "pending" && (
                    <div className="space-y-6 py-2 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600 relative">
                          <div className="absolute inset-0 rounded-full border-2 border-teal-500/30 animate-[ping_3s_infinite_ease-in-out]" />
                          <Clock className="w-10 h-10 animate-[spin_10s_infinite_linear]" />
                        </div>
                        <div className="space-y-2">
                          <h2 className="text-3xl font-extrabold text-[#04211a] tracking-tight">
                            Approval Pending
                          </h2>
                          <p className="text-teal-600 font-bold text-sm uppercase tracking-wider">
                            Your request has been sent successfully.
                          </p>
                          <p className="text-slate-500 font-semibold text-sm max-w-md mx-auto leading-relaxed">
                            Waiting for approval from an administrator to access
                            this organization's workspace.
                          </p>
                        </div>
                      </div>

                      {/* Simple Email Indicator */}
                      <div className="bg-[#f0eee6]/60 border border-[#e5e2d6]/60 rounded-2xl p-4 text-xs font-bold text-slate-500">
                        Notification sent to:{" "}
                        <span className="text-[#04211a] font-extrabold">
                          {email || "your@email.com"}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={checkUserStatus}
                          className="w-full py-5 rounded-2xl font-extrabold text-base bg-[#04211a] text-white hover:bg-emerald-950 transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-md cursor-pointer"
                        >
                          <RefreshCw className="w-5 h-5 animate-[spin_4s_infinite_linear]" />
                          Refresh Status
                        </button>
                      </div>
                    </div>
                  )}

                  {/* APPROVED STATE (Join Org Approved) */}
                  {submitState === "approved" && (
                    <div className="space-y-6 py-6">
                      <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-[0_0_50px_rgba(16,185,129,0.15)] animate-[bounce_2s_infinite]">
                          <ShieldCheck className="w-12 h-12" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h2 className="text-3xl font-extrabold text-[#04211a] tracking-tight">
                          Access Approved
                        </h2>
                        <p className="text-emerald-600/90 font-bold text-sm">
                          Your access has been approved.
                        </p>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-sm mx-auto">
                          You can now sign in to Nyawit AI and access your
                          organization's workspace.
                        </p>
                      </div>

                      <div className="pt-6">
                        <button
                          type="button"
                          onClick={() => resetAuthView("login")}
                          className="w-full py-5 rounded-2xl font-extrabold text-lg bg-[#04211a] hover:bg-emerald-950 text-white transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-md"
                        >
                          Sign In
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.form
                  key={`signup-step-${signupStep}`}
                  initial={{opacity: 0, x: 10}}
                  animate={{opacity: 1, x: 0}}
                  exit={{opacity: 0, x: -10}}
                  transition={{duration: 0.25}}
                  onSubmit={handleAuth}
                  className="space-y-6"
                >
                  {/* STEP 1: Account Type Selection */}
                  {signupStep === 1 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setAccountType("individual")}
                          className={`flex flex-col items-start p-6 text-left rounded-2xl border-2 transition-all duration-300 ${
                            accountType === "individual"
                              ? "bg-white border-[#04211a] shadow-[0_8px_30px_rgba(4,33,26,0.08)] scale-[1.02]"
                              : "bg-white/40 border-[#e5e2d6]/60 hover:border-[#e5e2d6] opacity-75"
                          }`}
                        >
                          <div
                            className={`p-3 rounded-xl mb-4 ${accountType === "individual" ? "bg-[#04211a] text-white" : "bg-[#f0eee6] text-[#04211a]/60"}`}
                          >
                            <User className="w-5 h-5" />
                          </div>
                          <span className="text-base font-extrabold text-[#04211a] mb-1">
                            Individual / Personal
                          </span>
                          <span className="text-[11px] leading-relaxed text-slate-500 font-medium">
                            For personal use or trial access
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAccountType("organization")}
                          className={`flex flex-col items-start p-6 text-left rounded-2xl border-2 transition-all duration-300 ${
                            accountType === "organization"
                              ? "bg-white border-[#04211a] shadow-[0_8px_30px_rgba(4,33,26,0.08)] scale-[1.02]"
                              : "bg-white/40 border-[#e5e2d6]/60 hover:border-[#e5e2d6] opacity-75"
                          }`}
                        >
                          <div
                            className={`p-3 rounded-xl mb-4 ${accountType === "organization" ? "bg-[#04211a] text-white" : "bg-[#f0eee6] text-[#04211a]/60"}`}
                          >
                            <Building2 className="w-5 h-5" />
                          </div>
                          <span className="text-base font-extrabold text-[#04211a] mb-1">
                            Organization / Team
                          </span>
                          <span className="text-[11px] leading-relaxed text-slate-500 font-medium">
                            For plantation companies and team collaboration
                          </span>
                        </button>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          type="button"
                          onClick={() => resetAuthView("login")}
                          className="flex-1 py-5 rounded-2xl font-extrabold text-slate-500 border-2 border-[#e5e2d6] hover:bg-slate-100 transition-all active:scale-[0.98] text-center text-base"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setSignupStep(2)}
                          className="flex-1 py-5 bg-[#04211a] text-white hover:bg-emerald-950 rounded-2xl font-extrabold text-lg shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2 (INDIVIDUAL): Personal signup form */}
                  {signupStep === 2 && accountType === "individual" && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#04211a] uppercase tracking-wider flex items-center gap-2 px-1">
                          <User className="w-3.5 h-3.5 opacity-40" />
                          Full Name
                        </label>
                        <input
                          required
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Elizabeth Warren"
                          className="w-full px-6 py-4 bg-[#fcfbf7] border-2 border-[#e5e2d6] rounded-2xl focus:outline-none focus:border-emerald-600 transition-all font-medium placeholder:opacity-30"
                        />
                      </div>

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
                        <label className="text-xs font-bold text-[#04211a] uppercase tracking-wider flex items-center gap-2 px-1">
                          <Lock className="w-3.5 h-3.5 opacity-40" />
                          Password
                        </label>
                        <PasswordStrengthInput
                          value={password}
                          onChange={(val) => setPassword(val)}
                          placeholder="Create a strong password"
                          className="w-full px-6 py-4 bg-[#fcfbf7] border-2 border-[#e5e2d6] rounded-2xl focus:outline-none focus:border-emerald-600 transition-all font-medium pr-14 placeholder:opacity-30 !h-auto"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#04211a] uppercase tracking-wider flex items-center gap-2 px-1">
                          <Lock className="w-3.5 h-3.5 opacity-40" />
                          Confirm Password
                        </label>
                        <input
                          required
                          minLength={8}
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-6 py-4 bg-[#fcfbf7] border-2 border-[#e5e2d6] rounded-2xl focus:outline-none focus:border-emerald-600 transition-all font-medium placeholder:opacity-30"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <input
                          type="checkbox"
                          id="terms-indiv"
                          className="w-5 h-5 rounded-md border-[#e5e2d6] text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          required
                        />
                        <label
                          htmlFor="terms-indiv"
                          className="text-sm font-medium text-slate-500 cursor-pointer select-none"
                        >
                          I agree to the Terms and Privacy Policy
                        </label>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setSignupStep(1)}
                          className="flex-1 py-5 rounded-2xl font-extrabold text-slate-500 border-2 border-[#e5e2d6] hover:bg-slate-100 transition-all active:scale-[0.98] text-center text-base"
                        >
                          Back
                        </button>
                        <button
                          disabled={isLoading}
                          type="submit"
                          className="flex-1 py-5 bg-[#04211a] text-white hover:bg-emerald-950 rounded-2xl font-extrabold text-lg shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              Create Account
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2 (ORGANIZATION): Choose Organization Mode */}
                  {signupStep === 2 && accountType === "organization" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setOrgChoice("create")}
                          className={`flex flex-col items-start p-6 text-left rounded-2xl border-2 transition-all duration-300 ${
                            orgChoice === "create"
                              ? "bg-white border-[#04211a] shadow-[0_8px_30px_rgba(4,33,26,0.08)] scale-[1.02]"
                              : "bg-white/40 border-[#e5e2d6]/60 hover:border-[#e5e2d6] opacity-75"
                          }`}
                        >
                          <div
                            className={`p-3 rounded-xl mb-4 ${orgChoice === "create" ? "bg-[#04211a] text-white" : "bg-[#f0eee6] text-[#04211a]/60"}`}
                          >
                            <Globe className="w-5 h-5" />
                          </div>
                          <span className="text-base font-extrabold text-[#04211a] mb-1">
                            Create Organization
                          </span>
                          <span className="text-[11px] leading-relaxed text-slate-500 font-medium">
                            Create a new plantation workspace for your
                            organization.
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setOrgChoice("join")}
                          className={`flex flex-col items-start p-6 text-left rounded-2xl border-2 transition-all duration-300 ${
                            orgChoice === "join"
                              ? "bg-white border-[#04211a] shadow-[0_8px_30px_rgba(4,33,26,0.08)] scale-[1.02]"
                              : "bg-white/40 border-[#e5e2d6]/60 hover:border-[#e5e2d6] opacity-75"
                          }`}
                        >
                          <div
                            className={`p-3 rounded-xl mb-4 ${orgChoice === "join" ? "bg-[#04211a] text-white" : "bg-[#f0eee6] text-[#04211a]/60"}`}
                          >
                            <Building2 className="w-5 h-5" />
                          </div>
                          <span className="text-base font-extrabold text-[#04211a] mb-1">
                            Join Organization
                          </span>
                          <span className="text-[11px] leading-relaxed text-slate-500 font-medium">
                            Use an invite code to join an existing workspace.
                          </span>
                        </button>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setSignupStep(1)}
                          className="flex-1 py-5 rounded-2xl font-extrabold text-slate-500 border-2 border-[#e5e2d6] hover:bg-slate-100 transition-all active:scale-[0.98] text-center text-base"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setSignupStep(3)}
                          className="flex-1 py-5 bg-[#04211a] text-white hover:bg-emerald-950 rounded-2xl font-extrabold text-lg shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3 (ORGANIZATION): Show matching form */}
                  {signupStep === 3 && accountType === "organization" && (
                    <div className="space-y-6">
                      {orgChoice === "create" ? (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#04211a] uppercase tracking-wider flex items-center gap-2 px-1">
                            <Building2 className="w-3.5 h-3.5 opacity-40" />
                            Company Name
                          </label>
                          <input
                            required
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Sumatra Agri Co."
                            className="w-full px-6 py-4 bg-[#fcfbf7] border-2 border-[#e5e2d6] rounded-2xl focus:outline-none focus:border-emerald-600 transition-all font-medium placeholder:opacity-30"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#04211a] uppercase tracking-wider flex items-center gap-2 px-1">
                            <ShieldCheck className="w-3.5 h-3.5 opacity-40" />
                            Invite Code
                          </label>
                          <input
                            required
                            type="text"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            placeholder="NYA-123-XYZ"
                            className="w-full px-6 py-4 bg-[#fcfbf7] border-2 border-[#e5e2d6] rounded-2xl focus:outline-none focus:border-emerald-600 transition-all font-medium placeholder:opacity-30"
                          />
                        </div>
                      )}

                      {/* Full Name */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#04211a] uppercase tracking-wider flex items-center gap-2 px-1">
                          <User className="w-3.5 h-3.5 opacity-40" />
                          Full Name
                        </label>
                        <input
                          required
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Elizabeth Warren"
                          className="w-full px-6 py-4 bg-[#fcfbf7] border-2 border-[#e5e2d6] rounded-2xl focus:outline-none focus:border-emerald-600 transition-all font-medium placeholder:opacity-30"
                        />
                      </div>

                      {/* Email Address */}
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

                      {/* Password */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#04211a] uppercase tracking-wider flex items-center gap-2 px-1">
                          <Lock className="w-3.5 h-3.5 opacity-40" />
                          Password
                        </label>
                        <PasswordStrengthInput
                          value={password}
                          onChange={(val) => setPassword(val)}
                          placeholder="Create a strong password"
                          className="w-full px-6 py-4 bg-[#fcfbf7] border-2 border-[#e5e2d6] rounded-2xl focus:outline-none focus:border-emerald-600 transition-all font-medium pr-14 placeholder:opacity-30 !h-auto"
                        />
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#04211a] uppercase tracking-wider flex items-center gap-2 px-1">
                          <Lock className="w-3.5 h-3.5 opacity-40" />
                          Confirm Password
                        </label>
                        <input
                          required
                          minLength={8}
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-6 py-4 bg-[#fcfbf7] border-2 border-[#e5e2d6] rounded-2xl focus:outline-none focus:border-emerald-600 transition-all font-medium placeholder:opacity-30"
                        />
                      </div>

                      {/* Terms */}
                      <div className="flex items-center gap-3 pt-2">
                        <input
                          type="checkbox"
                          id="terms-org"
                          className="w-5 h-5 rounded-md border-[#e5e2d6] text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          required
                        />
                        <label
                          htmlFor="terms-org"
                          className="text-sm font-medium text-slate-500 cursor-pointer select-none"
                        >
                          I agree to the Terms and Privacy Policy
                        </label>
                      </div>

                      {/* Navigation buttons */}
                      <div className="flex gap-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setSignupStep(2)}
                          className="flex-1 py-5 rounded-2xl font-extrabold text-slate-500 border-2 border-[#e5e2d6] hover:bg-slate-100 transition-all active:scale-[0.98] text-center text-base"
                        >
                          Back
                        </button>
                        <button
                          disabled={isLoading}
                          type="submit"
                          className="flex-1 py-5 bg-[#04211a] text-white hover:bg-emerald-950 rounded-2xl font-extrabold text-lg shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              {orgChoice === "create"
                                ? "Create Organization"
                                : "Join Organization"}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Secondary Sign-In Redirect link for wizard steps */}
                  <p className="mt-8 text-center text-slate-500 font-semibold text-sm">
                    Already have an account?
                    <button
                      type="button"
                      onClick={() => resetAuthView("login")}
                      className="ml-2 text-teal-600 font-extrabold hover:text-teal-700 underline underline-offset-4 decoration-2"
                    >
                      Sign In
                    </button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>

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

      <AnimatePresence>
        {modal && modal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-[#021611] border border-emerald-500/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl shadow-black/50"
            >
              <p className="text-white text-sm mb-6 leading-relaxed">
                {modal.message}
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    if (modal.onConfirm) modal.onConfirm();
                    setModal(null);
                  }}
                  className={
                    modal.type === "success"
                      ? "px-5 py-2.5 text-sm font-bold bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-xl border border-emerald-500/20 hover:border-transparent transition-all cursor-pointer"
                      : modal.type === "info"
                      ? "px-5 py-2.5 text-sm font-bold bg-teal-500/10 hover:bg-teal-500 text-teal-400 hover:text-white rounded-xl border border-teal-500/20 hover:border-transparent transition-all cursor-pointer"
                      : "px-5 py-2.5 text-sm font-bold bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl border border-red-500/20 hover:border-transparent transition-all cursor-pointer"
                  }
                >
                  {modal.type === "success" ? "Lanjut" : "Tutup"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
