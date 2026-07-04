import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, CheckCircle2, Eye, EyeOff, Beaker } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export default function AdminLogin({ onLoginSuccess, onCancel }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate verification delay for a premium feel
    setTimeout(() => {
      const normalizedEmail = email.trim().toLowerCase();
      
      if (normalizedEmail === 'rekha@gmail.com' && password === 'rekha3421@gmail.com') {
        setIsSuccess(true);
        setTimeout(() => {
          setIsLoading(false);
          onLoginSuccess();
        }, 800);
      } else {
        setIsLoading(false);
        setError('ACCESS DENIED: INVALID CLINICAL CREDENTIALS');
      }
    }, 1000);
  };

  const handleQuickFill = () => {
    setEmail('rekha@gmail.com');
    setPassword('rekha3421@gmail.com');
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-50">
      {/* Decorative background blur spheres */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div 
        className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden relative z-10 transition-all duration-300"
        id="admin-login-card"
      >
        {/* Banner Top */}
        <div className="px-6 py-8 bg-slate-900 text-white text-center relative border-b border-slate-800">
          <div className="absolute inset-0 dark-grid-bg opacity-20 pointer-events-none"></div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 relative z-10">
            <Beaker className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-slate-100 relative z-10">
            SianLab Control Console
          </h2>
          <p className="font-mono text-[9px] text-slate-400 tracking-widest uppercase mt-1 relative z-10">
            Secure Administrator Authorization
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3.5 bg-red-50 border-l-2 border-red-500 rounded-r-lg flex items-start gap-2.5 animate-fadeIn">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="block font-mono text-[10px] font-bold text-red-800 tracking-wider">SECURE LINK REJECTED</span>
                <p className="text-xs text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {isSuccess && (
            <div className="p-3.5 bg-emerald-50 border-l-2 border-emerald-500 rounded-r-lg flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 animate-bounce" />
              <div className="space-y-0.5">
                <span className="block font-mono text-[10px] font-bold text-emerald-800 tracking-wider">CREDENTIALS MATCHED</span>
                <p className="text-xs text-emerald-700 font-medium">Entering secure lab dashboard...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label className="block font-mono text-[9px] tracking-wider text-slate-400 uppercase font-semibold">
                Clinical Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rekha@gmail.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-mono"
                  id="admin-email-input"
                  disabled={isLoading || isSuccess}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center">
                <label className="block font-mono text-[9px] tracking-wider text-slate-400 uppercase font-semibold">
                  Secure Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-mono"
                  id="admin-password-input"
                  disabled={isLoading || isSuccess}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300 font-sans font-bold text-xs tracking-wider uppercase rounded-lg transition-all duration-300 shadow-md hover:shadow-emerald-500/10 active:scale-[0.99]"
                id="admin-login-submit"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin"></div>
                    <span>Verifying Identity...</span>
                  </>
                ) : (
                  'Authorize Access'
                )}
              </button>

              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading || isSuccess}
                className="w-full py-2.5 text-center text-slate-500 hover:text-slate-800 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Cancel & Return
              </button>
            </div>
          </form>

          {/* Quick Demo Helper box */}
          <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-lg text-center space-y-2">
            <span className="block font-mono text-[9px] text-slate-400 tracking-widest uppercase font-bold">
              Demo Portal Assistant
            </span>
            <p className="text-[10px] text-slate-500 leading-relaxed font-light">
              Click below to quickly fill authorized laboratory credentials for testing:
            </p>
            <button
              onClick={handleQuickFill}
              type="button"
              className="px-3 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-emerald-700 font-mono text-[10px] font-bold uppercase tracking-wider rounded transition-colors shadow-xs"
              id="admin-quick-fill"
            >
              Autofill Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
