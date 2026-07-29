import React, { useState } from 'react';
import type { Category, WelcomeMedia } from '../types/admin';
import { X, Smartphone, Film, Search } from 'lucide-react';

interface LivePreviewModalProps {
  categories: Category[];
  welcomeMedia: WelcomeMedia;
  onClose: () => void;
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({
  categories,
  welcomeMedia,
  onClose,
}) => {
  const [currentView, setCurrentView] = useState<'welcome' | 'home' | 'categoryDetail'>('welcome');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCat, setSelectedSubCat] = useState<string>('all');

  const handleOpenCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setSelectedSubCat('all');
    setCurrentView('categoryDetail');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in select-none">
      
      {/* Container Card */}
      <div className="relative bg-[#16120f] border border-[#c8a165]/40 rounded-3xl p-4 md:p-6 max-w-4xl w-full shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 max-h-[95vh] overflow-y-auto custom-scrollbar">
        
        {/* Left Side: Controls & Info */}
        <div className="flex-1 space-y-4 text-left">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#c8a165]/20 border border-[#c8a165]/40 text-[#c8a165]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#e2d8c3]">
                Canlı Mobil Önizleme
              </h3>
              <p className="text-xs text-[#a0907a]">
                Admin panelinde yaptığınız tüm değişiklikler burada anlık olarak simüle edilir.
              </p>
            </div>
          </div>

          {/* Quick Nav Switches */}
          <div className="p-3 bg-[#0d0a08] rounded-2xl border border-[#3a2e26] space-y-2">
            <span className="text-[11px] font-bold text-[#c8a165] uppercase tracking-wider block">
              Ekran Değiştir
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setCurrentView('welcome')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'welcome'
                    ? 'bg-[#c8a165] text-[#0d0a08]'
                    : 'bg-[#1f1914] text-[#a0907a] hover:text-[#e2d8c3]'
                }`}
              >
                1. Welcome GIF/Video
              </button>

              <button
                onClick={() => setCurrentView('home')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'home'
                    ? 'bg-[#c8a165] text-[#0d0a08]'
                    : 'bg-[#1f1914] text-[#a0907a] hover:text-[#e2d8c3]'
                }`}
              >
                2. Ana Sayfa (Kategoriler)
              </button>

              <button
                onClick={() => {
                  if (categories.length > 0) handleOpenCategory(categories[0]);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'categoryDetail'
                    ? 'bg-[#c8a165] text-[#0d0a08]'
                    : 'bg-[#1f1914] text-[#a0907a] hover:text-[#e2d8c3]'
                }`}
              >
                3. Kategori Detayı
              </button>
            </div>
          </div>

          <div className="p-3 bg-[#0d0a08]/60 rounded-xl border border-[#2a221b] text-xs text-[#a0907a] space-y-1">
            <p>💡 <strong className="text-[#c8a165]">Önemli:</strong> Her kategorinin kendine ait GIF/Video medyası mevcuttur.</p>
            <p>📱 Müşterilerin cep telefonunda menünüz tıpatıp bu şekilde görünecektir.</p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-[#1f1914] hover:bg-[#2a221b] border border-[#3a2e26] text-[#e2d8c3] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Önizlemeyi Kapat</span>
          </button>
        </div>

        {/* Right Side: Phone Frame Mockup */}
        <div className="relative w-full max-w-[320px] aspect-[9/18] bg-[#0d0a08] border-[6px] border-[#2a221b] rounded-[40px] overflow-hidden shadow-2xl flex flex-col justify-between flex-shrink-0">
          
          {/* Phone Top Notch */}
          <div className="absolute top-0 inset-x-0 h-6 bg-[#000] rounded-b-2xl z-30 flex items-center justify-center">
            <div className="w-16 h-3 bg-[#16120f] rounded-full" />
          </div>

          {/* VIEW 1: WELCOME SCREEN */}
          {currentView === 'welcome' && (
            <div
              onClick={() => setCurrentView('home')}
              className="relative w-full h-full flex flex-col justify-between p-5 pt-8 cursor-pointer overflow-hidden animate-fade-in"
            >
              {/* Background Media */}
              {welcomeMedia.videoUrl.endsWith('.gif') || welcomeMedia.videoUrl.includes('giphy') ? (
                <img
                  src={welcomeMedia.videoUrl}
                  alt="Welcome GIF"
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
              ) : (
                <video
                  src={welcomeMedia.videoUrl}
                  poster={welcomeMedia.posterImg}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0d0a08]/80 via-transparent to-[#0d0a08]/90" />

              {/* Tag */}
              <div className="relative z-10 text-center">
                <span className="inline-block px-3 py-1 rounded-full border border-[#c8a165]/40 bg-[#0d0a08]/80 text-[#c8a165] text-[9px] font-bold tracking-widest uppercase">
                  RİZE ÇARŞI · HOOKAHLAB
                </span>
              </div>

              {/* Center Logo */}
              <div className="relative z-10 flex flex-col items-center text-center my-auto">
                <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                  <div className="absolute inset-0 rounded-full border border-[#c8a165]/40 animate-ring-ripple-1" />
                  <div className="w-16 h-16 rounded-full bg-[#110e0c] border border-[#c8a165] flex items-center justify-center p-1 shadow-lg">
                    <img
                      src="/hookahlab-official-logo.webp"
                      alt="Logo"
                      className="w-full h-full object-contain"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                  </div>
                </div>

                <h3 className="font-serif text-lg font-bold text-[#e2d8c3]">
                  {welcomeMedia.title || 'HOOKAHLAB'}
                </h3>
                <p className="text-[10px] text-[#c8a165] tracking-widest mt-1 uppercase font-medium">
                  {welcomeMedia.subtitle || 'PREMIUM QR MENU'}
                </p>
              </div>

              {/* Click instruction */}
              <div className="relative z-10 text-center pb-2">
                <span className="text-[9px] text-[#c8a165] font-bold uppercase tracking-wider bg-[#0d0a08]/80 px-3 py-1 rounded-full border border-[#c8a165]/30">
                  Menüye Geçmek İçin Tıklayın →
                </span>
              </div>
            </div>
          )}

          {/* VIEW 2: HOMEPAGE (CATEGORIES LIST) */}
          {currentView === 'home' && (
            <div className="relative w-full h-full bg-[#0d0a08] text-[#e2d8c3] flex flex-col pt-8 p-3 overflow-y-auto custom-scrollbar animate-fade-in">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#2a221b] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#16120f] border border-[#c8a165]/40 flex items-center justify-center p-1">
                    <img
                      src="/hookahlab-official-logo.webp"
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-xs font-bold text-[#e2d8c3]">HOOKAHLAB</h4>
                    <p className="text-[8px] text-[#c8a165]">RİZE · ÇARŞI</p>
                  </div>
                </div>
                <Search className="w-4 h-4 text-[#c8a165]" />
              </div>

              <div className="text-[10px] text-[#a0907a] font-bold uppercase tracking-wider mb-2">
                Kategoriler ({categories.length})
              </div>

              {/* Categories list */}
              <div className="space-y-3 pb-6">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => handleOpenCategory(cat)}
                    className="relative rounded-2xl overflow-hidden border border-[#3a2e26] hover:border-[#c8a165] cursor-pointer h-24 flex flex-col justify-between p-3 group transition-all"
                  >
                    {/* Background category image */}
                    <img
                      src={cat.img}
                      alt={cat.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    {/* Top Row: Num & Video Badge */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#c8a165] bg-[#0d0a08]/80 px-2 py-0.5 rounded border border-[#c8a165]/30">
                        #{cat.num || '01'}
                      </span>
                      {cat.videoUrl && (
                        <span className="text-[8px] bg-[#c8a165] text-[#0d0a08] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Film className="w-2.5 h-2.5" /> GIF/Video
                        </span>
                      )}
                    </div>

                    {/* Bottom Row: Title & Items count */}
                    <div className="relative z-10">
                      <h4 className="font-serif text-sm font-bold text-[#e2d8c3]">
                        {cat.title}
                      </h4>
                      <p className="text-[9px] text-[#c8a165] uppercase tracking-wider font-semibold">
                        {cat.subtitle} • {cat.items?.length || 0} Ürün
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: CATEGORY DETAIL WITH ITS DEDICATED GIF/VIDEO */}
          {currentView === 'categoryDetail' && selectedCategory && (
            <div className="relative w-full h-full bg-[#0d0a08] text-[#e2d8c3] flex flex-col pt-8 overflow-y-auto custom-scrollbar animate-fade-in">
              
              {/* Category Header with ITS OWN Video/GIF Background! */}
              <div className="relative h-36 flex-shrink-0 flex flex-col justify-between p-3">
                {selectedCategory.videoUrl && selectedCategory.videoUrl.endsWith('.gif') ? (
                  <img
                    src={selectedCategory.videoUrl}
                    alt="Category GIF"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                ) : selectedCategory.videoUrl ? (
                  <video
                    src={selectedCategory.videoUrl}
                    poster={selectedCategory.img}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                ) : (
                  <img
                    src={selectedCategory.img}
                    alt={selectedCategory.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a08] via-[#0d0a08]/40 to-transparent" />

                {/* Back button */}
                <div className="relative z-10 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentView('home')}
                    className="text-[10px] bg-[#0d0a08]/80 text-[#c8a165] px-2.5 py-1 rounded-lg border border-[#c8a165]/40 font-bold"
                  >
                    ← Kategoriler
                  </button>
                  <span className="text-[8px] bg-[#c8a165] text-[#0d0a08] font-bold px-2 py-0.5 rounded">
                    Özel GIF/Video Yayında
                  </span>
                </div>

                {/* Title */}
                <div className="relative z-10">
                  <h3 className="font-serif text-base font-bold text-[#e2d8c3]">
                    {selectedCategory.title}
                  </h3>
                  <p className="text-[9px] text-[#c8a165] uppercase font-medium">
                    {selectedCategory.subtitle}
                  </p>
                </div>
              </div>

              {/* Subcategories Filter Pills */}
              {selectedCategory.subCategories && selectedCategory.subCategories.length > 0 && (
                <div className="px-3 py-2 border-y border-[#2a221b] bg-[#16120f] flex gap-1.5 overflow-x-auto custom-scrollbar">
                  <button
                    onClick={() => setSelectedSubCat('all')}
                    className={`px-2.5 py-1 rounded-md text-[9px] font-bold whitespace-nowrap ${
                      selectedSubCat === 'all'
                        ? 'bg-[#c8a165] text-[#0d0a08]'
                        : 'bg-[#0d0a08] text-[#a0907a]'
                    }`}
                  >
                    HEPSİ
                  </button>
                  {selectedCategory.subCategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubCat(sub.id)}
                      className={`px-2.5 py-1 rounded-md text-[9px] font-bold whitespace-nowrap ${
                        selectedSubCat === sub.id
                          ? 'bg-[#c8a165] text-[#0d0a08]'
                          : 'bg-[#0d0a08] text-[#a0907a]'
                      }`}
                    >
                      {sub.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Items List */}
              <div className="p-3 space-y-3 pb-8">
                {(selectedCategory.items || [])
                  .filter((item) => selectedSubCat === 'all' || item.subCategory === selectedSubCat)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#16120f] border border-[#2a221b] rounded-xl p-2.5 flex gap-2.5 items-center"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-[#0d0a08] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-serif text-xs font-bold text-[#e2d8c3] truncate">
                          {item.name}
                        </h5>
                        <p className="text-[9px] text-[#a0907a] line-clamp-1">{item.desc}</p>
                        <span className="text-[10px] font-bold text-[#c8a165]">{item.price}</span>
                      </div>
                    </div>
                  ))}
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
