import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, LogIn } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (username: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Lütfen kullanıcı adı ve şifrenizi giriniz.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      onLoginSuccess(username.trim());
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0a08] bg-waves p-4 select-none">
      {/* Background Glow */}
      <div className="absolute w-72 h-72 bg-[#c8a165]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Sleek Compact Glass Card */}
      <div className="relative z-10 w-full max-w-sm bg-[#16120f]/90 border border-[#c8a165]/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-5 animate-fade-in">
        
        {/* Simple Clean Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#0d0a08] border border-[#c8a165]/50 flex items-center justify-center p-2 shadow-md">
            <img
              src="/hookahlab-official-logo.webp"
              alt="Logo"
              className="w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold text-[#e2d8c3]">
              Yönetim Paneli
            </h1>
            <p className="text-[11px] text-[#a0907a]">HOOKAHLAB QR MENÜ</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800/40 text-red-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Compact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#c8a165] uppercase tracking-wider mb-1">
              Kullanıcı Adı
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#a0907a]" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-9 pr-3 py-2.5 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#c8a165] uppercase tracking-wider mb-1">
              Şifre
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#a0907a]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2.5 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0907a] hover:text-[#c8a165]"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[#8b5a2b] via-[#c8a165] to-[#8b5a2b] hover:from-[#c8a165] hover:to-[#c8a165] text-[#0d0a08] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-[#0d0a08] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Giriş Yap</span>
              </>
            )}
          </button>
        </form>

        <p className="text-[10px] text-center text-[#6b5a4b]">
          Demo Hesabı: <code className="text-[#c8a165]">admin / 123456</code>
        </p>

      </div>
    </div>
  );
};
