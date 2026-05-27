import { useState, useRef, ChangeEvent } from 'react';
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
  const [fullName, setFullName] = useState("Budi Santoso");
  const [email, setEmail] = useState("budi.s@nyawit.ai");
  
  // Organization Data (Read-only for demo)
  const [company] = useState("PT. Sawit Nusantara");
  const [role] = useState("Administrator");
  const [workspaceType] = useState("Enterprise Plan");
  
  // Profile Editable State
  const [tempProfilePhoto, setTempProfilePhoto] = useState<string | null>(profilePhoto);
  const [tempFullName, setTempFullName] = useState(fullName);
  
  // Inline Edit States
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  
  // Email Verification State
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  
  // Form Inputs
  const [tempEmail, setTempEmail] = useState(email);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Save State
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [inlineIsSaving, setInlineIsSaving] = useState(false);
  
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);

  const hasChanges = tempFullName !== fullName || tempProfilePhoto !== profilePhoto;

  const handleProfilePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (!hasChanges) return;
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setProfilePhoto(tempProfilePhoto);
      setFullName(tempFullName);
      setIsSaving(false);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
      
      if (onSave) onSave();
    }, 1000);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInlineIsSaving(true);
    setTimeout(() => {
      setInlineIsSaving(false);
      setEmailVerificationSent(true);
    }, 1000);
  };

  const cancelEmailUpdate = () => {
    setIsEditingEmail(false);
    setEmailVerificationSent(false);
    setTempEmail(email);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInlineIsSaving(true);
    setTimeout(() => {
      setInlineIsSaving(false);
      setIsEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1000);
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
                      onClick={() => setTempProfilePhoto(null)}
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
                {!isEditingEmail ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-sm font-bold text-[#04211a] truncate">{email}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        setTempEmail(email);
                        setIsEditingEmail(true);
                        setEmailVerificationSent(false);
                      }}
                      className="px-4 py-2 text-xs font-bold bg-white border border-[#e5e2d6] hover:bg-slate-50 rounded-xl transition-all cursor-pointer whitespace-nowrap text-[#04211a] shadow-sm ml-2"
                    >
                      Change
                    </button>
                  </div>
                ) : emailVerificationSent ? (
                  <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 space-y-3">
                    <div className="flex items-center gap-3 text-emerald-700">
                      <Mail className="w-5 h-5 shrink-0" />
                      <h4 className="text-sm font-extrabold m-0">Verification Link Sent</h4>
                    </div>
                    <p className="text-xs font-semibold text-emerald-600/80 leading-relaxed">
                      We've sent a confirmation link to <span className="font-bold text-emerald-700">{tempEmail}</span>. Please check your inbox and verify the new address to complete this change.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleEmailSubmit} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">New Email Address</label>
                      <input 
                        type="email"
                        required
                        value={tempEmail}
                        onChange={(e) => setTempEmail(e.target.value)}
                        placeholder="Enter new email"
                        autoFocus
                        className="w-full bg-white border border-[#e5e2d6] rounded-xl py-2.5 pl-4 pr-4 text-sm font-semibold text-[#04211a] focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all shadow-sm"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button 
                        type="button"
                        onClick={cancelEmailUpdate}
                        className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={inlineIsSaving || !tempEmail || tempEmail === email}
                        className="px-5 py-2 bg-[#04211a] hover:bg-emerald-950 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {inlineIsSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm Change'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col sm:flex-row py-6 px-6 sm:px-8 gap-6 items-start">
              <div className="sm:w-1/3 shrink-0">
                <h3 className="text-sm font-bold text-[#04211a]">Password</h3>
                <p className="text-[13px] text-slate-500 mt-1">Keep your account secure</p>
              </div>
              <div className="sm:w-2/3 w-full">
                {!isEditingPassword ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        <KeyRound className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-sm font-bold text-[#04211a] tracking-widest mt-1">••••••••••••</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsEditingPassword(true)}
                      className="px-4 py-2 text-xs font-bold bg-white border border-[#e5e2d6] hover:bg-slate-50 rounded-xl transition-all cursor-pointer whitespace-nowrap text-[#04211a] shadow-sm ml-2"
                    >
                      Update
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Current Password</label>
                      <input 
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        autoFocus
                        className="w-full bg-white border border-[#e5e2d6] rounded-xl py-2.5 pl-4 pr-4 text-sm font-semibold text-[#04211a] focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all shadow-sm"
                      />
                    </div>
                    
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mt-2">New Password</label>
                      <PasswordStrengthInput
                        value={newPassword}
                        onChange={setNewPassword}
                        placeholder="Enter new password"
                        className="w-full bg-white border border-[#e5e2d6] rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-[#04211a] focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all shadow-sm !h-auto"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Confirm New Password</label>
                      <input 
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                        className="w-full bg-white border border-[#e5e2d6] rounded-xl py-2.5 pl-4 pr-4 text-sm font-semibold text-[#04211a] focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all shadow-sm"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-2">
                      <button 
                        type="button"
                        onClick={() => {
                          setIsEditingPassword(false);
                          setCurrentPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                        className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={inlineIsSaving || !currentPassword || !newPassword || newPassword !== confirmPassword}
                        className="px-5 py-2 bg-[#04211a] hover:bg-emerald-950 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {inlineIsSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Update Password'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: ORGANIZATION INFO (Optional)                   */}
        {/* ========================================================= */}
        {showCompany && (
          <section>
            <h2 className="text-lg font-extrabold text-[#04211a] mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-500" />
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
                      <Building className="w-4 h-4 opacity-50" />
                    </span>
                    <input 
                      type="text" 
                      value={company}
                      disabled
                      className="w-full bg-slate-50 border border-[#e5e2d6] rounded-xl py-2.5 pl-10 pr-4 text-sm font-semibold text-[#04211a] opacity-70 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 font-bold mt-2 flex items-center gap-1.5 uppercase tracking-wider">
                    <Lock className="w-3 h-3 text-slate-400" /> Managed by Administrator
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
                  <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="w-4 h-4 text-indigo-500" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role</span>
                    </div>
                    <p className="text-sm font-extrabold text-[#04211a]">{role}</p>
                  </div>
                  <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-indigo-500" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Workspace</span>
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

    </motion.div>
  );
}
