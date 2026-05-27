"use client";

import { Input } from "./input";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useId, useMemo, useState } from "react";

export interface PasswordStrengthInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function PasswordStrengthInput({ 
  value, 
  onChange, 
  placeholder = "Password",
  className = ""
}: PasswordStrengthInputProps) {
  const id = useId();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(value);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-slate-200";
    if (score === 1) return "bg-red-500";
    if (score === 2) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score === 1) return "Weak password";
    if (score === 2) return "Medium password";
    return "Strong password";
  };

  return (
    <div className="w-full">
      <div className="relative">
        <Input
          id={id}
          className={className || "pe-9 h-[44px] text-sm bg-white"}
          placeholder={placeholder}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={strengthScore < 3}
          aria-describedby={`${id}-description`}
        />
        <button
          className="absolute inset-y-0 end-0 flex h-full w-12 items-center justify-center rounded-e-lg text-slate-400 transition-colors hover:text-[#04211a] focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 border-none bg-transparent cursor-pointer"
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          aria-controls="password"
        >
          {isVisible ? (
            <EyeOff size={18} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Eye size={18} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>

      <div
        className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={strengthScore}
        aria-valuemin={0}
        aria-valuemax={3}
        aria-label="Password strength"
      >
        <div
          className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
          style={{ width: `${(strengthScore / 3) * 100}%` }}
        ></div>
      </div>

      <p id={`${id}-description`} className="mb-2 text-xs font-semibold text-[#04211a]">
        {getStrengthText(strengthScore)}. Must contain:
      </p>

      <ul className="space-y-1.5" aria-label="Password requirements">
        {strength.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            {req.met ? (
              <Check size={14} className="text-emerald-500" aria-hidden="true" />
            ) : (
              <X size={14} className="text-slate-400" aria-hidden="true" />
            )}
            <span className={`text-[11px] font-semibold ${req.met ? "text-emerald-600" : "text-slate-500"}`}>
              {req.text}
              <span className="sr-only">
                {req.met ? " - Requirement met" : " - Requirement not met"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
