import React, { useState } from 'react';
import type { WelcomeMedia } from '../types/admin';
import { FileUploader } from './FileUploader';
import { Type, Save, Check, Sparkles } from 'lucide-react';

interface WelcomeManagerProps {
  welcomeMedia: WelcomeMedia;
  onSave: (updated: WelcomeMedia) => void;
}

export const WelcomeManager: React.FC<WelcomeManagerProps> = ({ welcomeMedia, onSave }) => {
  const [formData, setFormData] = useState<WelcomeMedia>({ ...welcomeMedia });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#181310] via-[#201914] to-[#181310] p-6 rounded-3xl border border-[#c8a165]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c8a165]/15 border border-[#c8a165]/40 text-[#c8a165] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome Giriş Ekranı Yönetimi</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#e2d8c3]">
            Giriş Ekranı GIF & Video Yükleme
          </h2>
          <p className="text-xs text-[#a0907a] mt-1">
            Müşteriler QR menüyü ilk açtıklarında karşılarına çıkacak olan GIF veya MP4 videosunu bilgisayarınızdan seçip yükleyebilirsiniz.
          </p>
        </div>

        {isSaved && (
          <div className="px-4 py-2 bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4" />
            <span>Değişiklikler Kaydedildi!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Computer File Uploaders */}
        <div className="lg:col-span-7 bg-[#16120f]/90 border border-[#3a2e26] rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Local Video / GIF File Uploader */}
            <FileUploader
              label="Giriş Ekranı GIF / Video Dosyası (Bilgisayardan Seçin)"
              accept="image/gif,video/mp4,video/*"
              currentValue={formData.videoUrl ?? undefined}
              onChange={(dataUrl) => setFormData({ ...formData, videoUrl: dataUrl })}
              mediaType="video"
              description="Bilgisayarınızdan GIF veya MP4 video dosyası seçin"
            />

            {/* Local Poster Image Uploader */}
            <FileUploader
              label="Kapak Resmi Dosyası (Poster)"
              accept="image/*"
              currentValue={formData.posterImg}
              onChange={(dataUrl) => setFormData({ ...formData, posterImg: dataUrl })}
              mediaType="image"
              description="Bilgisayarınızdan kapak resmi (JPG/PNG) seçin"
            />

            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#c8a165] uppercase tracking-wider mb-2">
                  Ana Başlık
                </label>
                <div className="relative">
                  <Type className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0907a]" />
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Örn: HOOKAHLAB LOUNGE"
                    className="w-full pl-10 pr-4 py-3 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#c8a165] uppercase tracking-wider mb-2">
                  Alt Başlık / Tagline
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Örn: PREMIUM QR MENU EXPERIENCE"
                  className="w-full px-4 py-3 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#8b5a2b] via-[#c8a165] to-[#8b5a2b] hover:from-[#c8a165] hover:to-[#c8a165] text-[#0d0a08] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Welcome Ekranı Değişikliklerini Kaydet</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Preview Card: Live Preview of Welcome Screen */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full max-w-xs aspect-[9/16] bg-[#0d0a08] border-4 border-[#3a2e26] rounded-[36px] overflow-hidden shadow-2xl relative flex flex-col justify-between p-6">
            
            {/* Background Media player preview */}
            {formData.videoUrl && (formData.videoUrl.startsWith('data:image/gif') || formData.videoUrl.endsWith('.gif') || formData.videoUrl.includes('giphy')) ? (
              <img
                src={formData.videoUrl}
                alt="Welcome GIF"
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
            ) : (
              <video
                src={formData.videoUrl ?? undefined}
                poster={formData.posterImg}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
            )}

            {/* Overlay dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0d0a08]/80 via-transparent to-[#0d0a08]/90" />

            {/* Top Tag */}
            <div className="relative z-10 text-center pt-4">
              <span className="inline-block px-3 py-1 rounded-full border border-[#c8a165]/40 bg-[#0d0a08]/80 text-[#c8a165] text-[9px] font-bold tracking-widest uppercase">
                RİZE ÇARŞI · HOOKAHLAB
              </span>
            </div>

            {/* Animated Center Logo */}
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
                {formData.title || 'HOOKAHLAB'}
              </h3>
              <p className="text-[10px] text-[#c8a165] tracking-widest mt-1 uppercase font-medium">
                {formData.subtitle || 'PREMIUM MENU'}
              </p>
            </div>

            {/* Bottom Progress Simulation */}
            <div className="relative z-10 pb-4 text-center">
              <div className="w-full bg-[#2a221b] h-1 rounded-full overflow-hidden mb-2">
                <div className="bg-[#c8a165] h-full w-2/3 animate-pulse" />
              </div>
              <span className="text-[9px] text-[#a0907a] uppercase tracking-wider">
                Yüklenen Medya Canlı Görünümü
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
