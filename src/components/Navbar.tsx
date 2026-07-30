import React from 'react';
import { Film, FolderTree, LogOut, RotateCcw, Store } from 'lucide-react';

interface NavbarProps {
  activeTab: 'menuTree' | 'welcome' | 'storeSettings';
  setActiveTab: (tab: 'menuTree' | 'welcome' | 'storeSettings') => void;
  onLogout: () => void;
  onResetDefaults: () => void;
  totalCategories: number;
  totalProducts: number;
  username: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
  onResetDefaults,
  totalCategories,
  totalProducts,
  username,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#120e0b]/95 border-b border-[#c8a165]/20 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0d0a08] border border-[#c8a165]/50 flex items-center justify-center p-1 shadow-md">
              <img
                src="/hookahlab-official-logo.webp"
                alt="HookahLab"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-base sm:text-lg font-bold text-[#e2d8c3] tracking-wide">
                  HOOKAHLAB
                </span>
                <span className="text-[9px] sm:text-[10px] bg-[#c8a165]/20 border border-[#c8a165]/40 text-[#c8a165] font-semibold px-2 py-0.5 rounded-full uppercase">
                  Admin
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#a0907a] hidden sm:block">
                Hoş geldiniz, <span className="text-[#c8a165] font-semibold">{username}</span>
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center gap-1.5 bg-[#0d0a08]/80 p-1 rounded-xl border border-[#3a2e26]">
            <button
              onClick={() => setActiveTab('menuTree')}
              className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'menuTree'
                  ? 'bg-gradient-to-r from-[#8b5a2b] to-[#c8a165] text-[#0d0a08] font-bold shadow-md'
                  : 'text-[#a0907a] hover:text-[#e2d8c3] hover:bg-[#1a1511]'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Menü & Ürün Yönetimi</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-[#0d0a08]/40 border border-current hidden sm:inline">
                {totalCategories} Kat / {totalProducts} Ürün
              </span>
            </button>

            <button
              onClick={() => setActiveTab('welcome')}
              className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'welcome'
                  ? 'bg-gradient-to-r from-[#8b5a2b] to-[#c8a165] text-[#0d0a08] font-bold shadow-md'
                  : 'text-[#a0907a] hover:text-[#e2d8c3] hover:bg-[#1a1511]'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Welcome Video</span>
            </button>

            <button
              onClick={() => setActiveTab('storeSettings')}
              className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'storeSettings'
                  ? 'bg-gradient-to-r from-[#8b5a2b] to-[#c8a165] text-[#0d0a08] font-bold shadow-md'
                  : 'text-[#a0907a] hover:text-[#e2d8c3] hover:bg-[#1a1511]'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>İletişim & Saatler</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Reset Defaults button */}
            <button
              onClick={onResetDefaults}
              className="p-1.5 sm:p-2 bg-[#1f1914] border border-[#3a2e26] hover:border-[#8b5a2b] text-[#a0907a] hover:text-[#e2d8c3] rounded-xl transition-all cursor-pointer"
              title="Mock Verileri Sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="p-1.5 sm:p-2 bg-red-950/40 border border-red-900/40 hover:border-red-600 text-red-300 hover:text-white rounded-xl transition-all cursor-pointer"
              title="Çıkış Yap"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
