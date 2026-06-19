import React, { useState, useRef, ChangeEvent } from 'react';
import { 
  User,
  Mail,
  Building,
  Upload,
  Check,
  Loader2,
  Lock,
  KeyRound,
  X,
  ShieldAlert,
  CreditCard,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PasswordStrengthInput } from '../ui/password-strength-input';
import { useEffect } from 'react';

interface AccountSettingsTabProps {
  onSave?: () => void;
  isCompanyLocked?: boolean;
  showCompany?: boolean;
}

export default function AccountSettingsTab({ 
  onSave, 
  isCompanyLocked = true,
  showCompany = true 
}: AccountSettingsTabProps) {
  // Base Data
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  
  // Organization Data (Read-only for demo)
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [workspaceType] = useState("Enterprise Plan");
  
  // Profile Editable State
  const [tempProfilePhoto, setTempProfilePhoto] = useState<string | null>(null);
  const [tempFullName, setTempFullName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [removePhotoSelected, setRemovePhotoSelected] = useState(false);
  
  // Initialize from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const u = JSON.parse(userStr);
      const photo = u.profile_photo || null;
      setFullName(u.full_name || u.username || "Unknown User");
      setEmail(u.email || "");
      setRole(u.role === 'admin' ? 'Administrator' : 'User');
      setCompany(u.company_name || "Organisasi");
      setProfilePhoto(photo);
      setTempProfilePhoto(photo);
      
      setTempFullName(u.full_name || u.username || "Unknown User");
    }
  }, []);
  
  // Modals State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Email Change State
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [emailModalOldEmail, setEmailModalOldEmail] = useState("");
  const [emailModalPassword, setEmailModalPassword] = useState("");
  
  // Password Update State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Save State
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [inlineIsSaving, setInlineIsSaving] = useState(false);
  
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);

  const hasChanges = tempFullName !== fullName || selectedFile !== null || removePhotoSelected;

  const handleProfilePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setRemovePhotoSelected(false);
      const reader = new FileReader();
      reader.onload = (e) => setTempProfilePhoto(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setTempProfilePhoto(null);
    setSelectedFile(null);
    setRemovePhotoSelected(true);
  };

  const handleSaveProfile = async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      let currentPhotoUrl = profilePhoto;

      // 1. Upload new photo to Cloudinary first if a new file is selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const uploadRes = await fetch(`${apiUrl}/users/profile-photo`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        if (!uploadRes.ok) {
          throw new Error('Gagal mengunggah foto profil ke Cloudinary.');
        }
        
        const uploadData = await uploadRes.json();
        currentPhotoUrl = uploadData.profile_photo;
      } else if (removePhotoSelected) {
        currentPhotoUrl = null;
      }

      // 2. Save overall profile (full name and profile photo URL)
      const res = await fetch(`${apiUrl}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: tempFullName,
          profile_photo: currentPhotoUrl
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setFullName(data.full_name);
        setProfilePhoto(data.profile_photo);
        setTempProfilePhoto(data.profile_photo);
        setSelectedFile(null);
        setRemovePhotoSelected(false);
        
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const u = JSON.parse(userStr);
          u.full_name = data.full_name;
          u.profile_photo = data.profile_photo;
          localStorage.setItem('user', JSON.stringify(u));
        }
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        if (onSave) onSave();
        window.dispatchEvent(new Event('profile_updated'));
      } else {
        alert('Gagal memperbarui profil.');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Terjadi kesalahan saat menyimpan profil.');
    } finally {
      setIsSaving(false);
    }
  };

  const requestEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${apiUrl}/users/request-email-change`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ old_email: emailModalOldEmail, password: emailModalPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Gagal memproses permintaan");
      setEmailVerificationSent(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setInlineIsSaving(false);
    }
  };

  const cancelEmailUpdate = () => {
    setShowEmailModal(false);
    setEmailVerificationSent(false);
    setEmailModalOldEmail("");
    setEmailModalPassword("");
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Password baru tidak cocok");
      return;
    }
    setInlineIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const res = await fetch(`${apiUrl}/users/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ old_password: currentPassword, new_password: newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Gagal mengubah password");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password berhasil diperbarui!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setInlineIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex-1 w-full max-w-4xl mx-auto py-8 px-6 sm:px-12 pb-24"
    >
      <div className="mb-10 flex items-center justify-end">
        
        {/* Success Feedback Banner (Top Right) */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl shadow-sm text-sm font-bold"
            >
              <Check className="w-4 h-4" />
              Profile updated successfully
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-10">
        
        {/* ========================================================= */}
        {/* SECTION 1: PROFILE INFORMATION                            */}
        {/* ========================================================= */}
        <section>
          <h2 className="text-lg font-extrabold text-[#04211a] mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            Profile Information
          </h2>
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Profile Photo */}
            <div className="flex flex-col sm:flex-row py-6 px-6 sm:px-8 border-b border-slate-100 gap-6">
              <div className="sm:w-1/3 shrink-0">
                <h3 className="text-sm font-bold text-[#04211a]">Profile Photo</h3>
                <p className="text-[13px] text-slate-500 mt-1">Used on your profile and reports</p>
              </div>
              <div className="sm:w-2/3 flex items-center gap-6">
                <div className="w-16 h-16 rounded-full border border-slate-200 shadow-sm overflow-hidden bg-[#f0eee6] flex items-center justify-center shrink-0">
                  {tempProfilePhoto ? (
                    <img src={tempProfilePhoto} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-[#04211a] uppercase">
                      {tempFullName ? tempFullName.charAt(0) : 'U'}
                    </span>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  ref={profilePhotoInputRef}
                  onChange={handleProfilePhotoChange}
                  className="hidden"
                />
                <div className="flex flex-col gap-1.5">
                  <button 
                    type="button"
                    onClick={() => profilePhotoInputRef.current?.click()}
                    className="px-4 py-2 bg-white border border-[#e5e2d6] hover:bg-slate-50 text-sm font-bold text-[#04211a] rounded-xl transition-all cursor-pointer shadow-sm w-max flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4 text-slate-400" />
                    Upload Photo
                  </button>
                  {tempProfilePhoto && (
                    <button 
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-[11px] font-bold text-red-500 hover:text-red-600 transition-colors bg-transparent border-none cursor-pointer text-left w-max uppercase tracking-wider px-1"
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div className="flex flex-col sm:flex-row py-6 px-6 sm:px-8 gap-6">
              <div className="sm:w-1/3 shrink-0">
                <h3 className="text-sm font-bold text-[#04211a]">Full Name</h3>
                <p className="text-[13px] text-slate-500 mt-1">Used to identify your account</p>
              </div>
              <div className="sm:w-2/3 max-w-md">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input 
                    type="text" 
                    value={tempFullName}
                    onChange={(e) => setTempFullName(e.target.value)}
                    className="w-full bg-[#fcfbf7] border border-[#e5e2d6] rounded-xl py-2.5 pl-10 pr-4 text-sm font-semibold text-[#04211a] focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: ACCOUNT SECURITY                               */}
        {/* ========================================================= */}
        <section>
          <h2 className="text-lg font-extrabold text-[#04211a] mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            Account Security
          </h2>
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Email Address */}
            <div className="flex flex-col sm:flex-row py-6 px-6 sm:px-8 border-b border-slate-100 gap-6 items-start">
              <div className="sm:w-1/3 shrink-0">
                <h3 className="text-sm font-bold text-[#04211a]">Email Address</h3>
                <p className="text-[13px] text-slate-500 mt-1">Used for login and notifications</p>
              </div>
              <div className="sm:w-2/3 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-sm font-bold text-[#04211a] truncate">{email}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowEmailModal(true)}
                      className="px-4 py-2 text-xs font-bold bg-white border border-[#e5e2d6] hover:bg-slate-50 rounded-xl transition-all cursor-pointer whitespace-nowrap text-[#04211a] shadow-sm ml-2"
                    >
                      Change
                    </button>
                  </div>
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col sm:flex-row py-6 px-6 sm:px-8 gap-6 items-start">
              <div className="sm:w-1/3 shrink-0">
                <h3 className="text-sm font-bold text-[#04211a]">Password</h3>
                <p className="text-[13px] text-slate-500 mt-1">Keep your account secure</p>
              </div>
              <div className="sm:w-2/3 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        <KeyRound className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-sm font-bold text-[#04211a] tracking-widest mt-1">••••••••••••</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowPasswordModal(true)}
                      className="px-4 py-2 text-xs font-bold bg-white border border-[#e5e2d6] hover:bg-slate-50 rounded-xl transition-all cursor-pointer whitespace-nowrap text-[#04211a] shadow-sm ml-2"
                    >
                      Update
                    </button>
                  </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: ORGANIZATION INFO (Optional)                   */}
        {/* ========================================================= */}
        {(showCompany && !company.toLowerCase().startsWith('personal')) && (
          <section>
            <h2 className="text-lg font-extrabold text-[#04211a] mb-4 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                <Building className="w-4 h-4" />
              </div>
              Organization Information
            </h2>
            
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Company */}
              <div className="flex flex-col sm:flex-row py-6 px-6 sm:px-8 border-b border-slate-100 gap-6">
                <div className="sm:w-1/3 shrink-0">
                  <h3 className="text-sm font-bold text-[#04211a]">Company</h3>
                  <p className="text-[13px] text-slate-500 mt-1">Registered organization</p>
                </div>
                <div className="sm:w-2/3 max-w-md">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Building className="w-4 h-4 opacity-40" />
                    </span>
                    <input 
                      type="text" 
                      value={company}
                      disabled
                      className="w-full bg-[#f8fafc] border border-[#e5e2d6] rounded-xl py-3.5 pl-10 pr-4 text-sm font-semibold text-[#04211a]/80 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[10px] text-indigo-600 font-extrabold mt-2 flex items-center gap-1.5 uppercase tracking-wider">
                    <Lock className="w-3.5 h-3.5 text-indigo-500" /> Managed by Administrator
                  </p>
                </div>
              </div>

              {/* Role & Workspace Type */}
              <div className="flex flex-col sm:flex-row py-6 px-6 sm:px-8 gap-6 bg-slate-50/50">
                <div className="sm:w-1/3 shrink-0">
                  <h3 className="text-sm font-bold text-[#04211a]">Access Level</h3>
                  <p className="text-[13px] text-slate-500 mt-1">Your current permissions</p>
                </div>
                <div className="sm:w-2/3 max-w-md flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                        <Briefcase className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-extrabold text-indigo-900/50 uppercase tracking-widest">Role</span>
                    </div>
                    <p className="text-sm font-extrabold text-[#04211a]">{role}</p>
                  </div>
                  <div className="flex-1 bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                        <CreditCard className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-extrabold text-indigo-900/50 uppercase tracking-widest">Workspace</span>
                    </div>
                    <p className="text-sm font-extrabold text-[#04211a]">{workspaceType}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-10">
        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={!hasChanges || isSaving}
          className={`px-8 py-3 text-sm font-extrabold rounded-2xl transition-all flex items-center gap-2 shadow-lg border-none ${
            hasChanges 
              ? 'bg-[#04211a] hover:bg-emerald-950 text-white cursor-pointer shadow-[#04211a]/20 active:scale-95' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-transparent'
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>

      {/* --------------------- MODALS --------------------- */}
      <AnimatePresence>
        {showEmailModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100"
            >
              <h3 className="text-xl font-extrabold text-[#04211a] mb-2">Change Email</h3>
              
              {emailVerificationSent ? (
                <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 space-y-3 mt-6">
                  <div className="flex items-center gap-3 text-emerald-700">
                    <Mail className="w-5 h-5 shrink-0" />
                    <h4 className="text-sm font-extrabold m-0">Verification Link Sent</h4>
                  </div>
                  <p className="text-xs font-semibold text-emerald-600/80 leading-relaxed">
                    We've sent a confirmation link to <span className="font-bold text-emerald-700">{emailModalOldEmail}</span>. Please click the link to enter your new email.
                  </p>
                  <button 
                    type="button"
                    onClick={cancelEmailUpdate}
                    className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={requestEmailChange} className="space-y-4 mt-6">
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                    To change your email address, please verify your current email and password.
                  </p>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Current Email</label>
                    <input 
                      type="email" required
                      value={emailModalOldEmail}
                      onChange={(e) => setEmailModalOldEmail(e.target.value)}
                      placeholder="Enter current email"
                      className="w-full bg-slate-50 border border-[#e5e2d6] rounded-xl py-2.5 px-4 text-sm font-semibold text-[#04211a] focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Password</label>
                      <button 
                        type="button" 
                        onClick={() => {
                          const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
                          fetch(`${backendUrl}/forgot-password`, {
                            method: 'POST', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email })
                          }).then(() => alert("Email reset password telah dikirim.")).catch(() => alert("Gagal mengirim email reset."));
                        }}
                        className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <input 
                      type="password" required
                      value={emailModalPassword}
                      onChange={(e) => setEmailModalPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-slate-50 border border-[#e5e2d6] rounded-xl py-2.5 px-4 text-sm font-semibold text-[#04211a] focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={cancelEmailUpdate}
                      className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={inlineIsSaving || !emailModalOldEmail || !emailModalPassword}
                      className="px-6 py-2.5 bg-[#04211a] hover:bg-emerald-950 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {inlineIsSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Send Link'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-extrabold text-[#04211a] mb-6">Update Password</h3>
              <form onSubmit={updatePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Current Password</label>
                  <input 
                    type="password" required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-slate-50 border border-[#e5e2d6] rounded-xl py-2.5 px-4 text-sm font-semibold text-[#04211a] focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all"
                  />
                </div>
                
                <div className="space-y-1.5 pt-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">New Password</label>
                  <PasswordStrengthInput
                    value={newPassword}
                    onChange={setNewPassword}
                    placeholder="Enter new password"
                    className="w-full bg-slate-50 border border-[#e5e2d6] rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-[#04211a] focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all !h-auto"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Confirm New Password</label>
                  <input 
                    type="password" required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-slate-50 border border-[#e5e2d6] rounded-xl py-2.5 px-4 text-sm font-semibold text-[#04211a] focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
                    }}
                    className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={inlineIsSaving || !currentPassword || !newPassword || newPassword !== confirmPassword}
                    className="px-6 py-2.5 bg-[#04211a] hover:bg-emerald-950 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {inlineIsSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm Update'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
