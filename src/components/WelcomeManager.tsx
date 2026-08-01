import React, { useState } from 'react';
import type { WelcomeMedia } from '../types/admin';
import { FileUploader } from './FileUploader';
import { resolveMediaUrl } from '../api/apiClient';
import { Type, Save, Sparkles, CheckCircle2, XCircle, X, Loader2 } from 'lucide-react';

interface WelcomeManagerProps {
  welcomeMedia: WelcomeMedia;
  onSave: (updated: WelcomeMedia) => Promise<void> | void;
}

type ModalState = 'idle' | 'loading' | 'success' | 'error';

export const WelcomeManager: React.FC<WelcomeManagerProps> = ({ welcomeMedia, onSave }) => {
  const [formData, setFormData] = useState<WelcomeMedia>({ ...welcomeMedia });
  const [modalState, setModalState] = useState<ModalState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setModalState('loading');
    setErrorMessage('');

    try {
      await onSave(formData);
      setModalState('success');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Kayıt sırasında bir hata oluştu.');
      setModalState('error');
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setModalState('idle');
    setErrorMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">

      {/* ── Success / Error / Loading Modal ── */}
      {modalState !== 'idle' && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={modalState !== 'loading' ? closeModal : undefined}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal Card */}
          <div
            className="relative z-10 w-full max-w-sm rounded-3xl border shadow-2xl p-8 flex flex-col items-center text-center gap-4 animate-fade-in"
            style={{
              background: modalState === 'success'
                ? 'linear-gradient(135deg, #0a1f12 0%, #0d1a10 100%)'
                : modalState === 'error'
                ? 'linear-gradient(135deg, #1a0a0a 0%, #1f0d0d 100%)'
                : 'linear-gradient(135deg, #14100d 0%, #1a140f 100%)',
              borderColor: modalState === 'success'
                ? 'rgba(52, 211, 153, 0.35)'
                : modalState === 'error'
                ? 'rgba(239, 68, 68, 0.35)'
                : 'rgba(200, 161, 101, 0.35)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button (not shown during loading) */}
            {modalState !== 'loading' && (
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Icon */}
            {modalState === 'loading' && (
              <div className="w-16 h-16 rounded-full bg-[#c8a165]/15 border border-[#c8a165]/40 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#c8a165] animate-spin" />
              </div>
            )}
            {modalState === 'success' && (
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
            )}
            {modalState === 'error' && (
              <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/40 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            )}

            {/* Title */}
            <div>
              {modalState === 'loading' && (
                <>
                  <h3 className="text-lg font-serif font-bold text-[#e2d8c3] mb-1">Kaydediliyor...</h3>
                  <p className="text-xs text-[#a0907a]">Lütfen bekleyin, değişiklikler kaydediliyor.</p>
                </>
              )}
              {modalState === 'success' && (
                <>
                  <h3 className="text-lg font-serif font-bold text-emerald-300 mb-1">Kayıt Başarılı! ✓</h3>
                  <p className="text-xs text-emerald-400/80">
                    Welcome ekranı değişiklikleri başarıyla kaydedildi.<br />
                    Müşteriler yeni videoyu görecek.
                  </p>
                </>
              )}
              {modalState === 'error' && (
                <>
                  <h3 className="text-lg font-serif font-bold text-red-300 mb-1">Kayıt Başarısız!</h3>
                  <p className="text-xs text-red-400/80 max-w-[260px]">
                    {errorMessage || 'Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.'}
                  </p>
                </>
              )}
            </div>

            {/* Action Buttons */}
            {modalState === 'success' && (
              <button
                onClick={closeModal}
                className="mt-2 px-6 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Tamam
              </button>
            )}
            {modalState === 'error' && (
              <div className="flex gap-3 mt-2">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/20 text-white/70 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Kapat
                </button>
                <button
                  onClick={() => {
                    closeModal();
                    setTimeout(() => void handleSubmit(new Event('submit') as unknown as React.FormEvent), 100);
                  }}
                  className="px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Tekrar Dene
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form */}
        <div className="lg:col-span-7 bg-[#16120f]/90 border border-[#3a2e26] rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-6">
          <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-6">
            
            {/* Local Video / GIF File Uploader */}
            <FileUploader
              label="Giriş Ekranı GIF / Video Dosyası (Bilgisayardan Seçin)"
              accept="image/gif,video/mp4,video/*"
              currentValue={formData.videoUrl ?? undefined}
              onChange={(url) => setFormData({ ...formData, videoUrl: url })}
              mediaType="video"
              description="Bilgisayarınızdan GIF veya MP4 video dosyası seçin"
            />

            {/* Local Poster Image Uploader */}
            <FileUploader
              label="Kapak Resmi Dosyası (Poster)"
              accept="image/*"
              currentValue={formData.posterImg}
              onChange={(url) => setFormData({ ...formData, posterImg: url })}
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
                disabled={isSaving}
                className="w-full py-3.5 bg-gradient-to-r from-[#8b5a2b] via-[#c8a165] to-[#8b5a2b] hover:from-[#c8a165] hover:to-[#c8a165] disabled:opacity-60 disabled:cursor-not-allowed text-[#0d0a08] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSaving ? 'Kaydediliyor...' : 'Welcome Ekranı Değişikliklerini Kaydet'}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Preview Card */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <p className="text-xs text-[#a0907a] mb-3 uppercase tracking-widest font-semibold">Canlı Önizleme</p>
          <div className="w-full max-w-xs aspect-[9/16] bg-black border-4 border-[#3a2e26] rounded-[36px] overflow-hidden shadow-2xl relative flex flex-col justify-end">
            
            {/* Full-screen background video or image preview */}
            {formData.videoUrl ? (
              formData.videoUrl.endsWith('.gif') || formData.videoUrl.includes('image/gif') ? (
                <img
                  src={resolveMediaUrl(formData.videoUrl)}
                  alt="Welcome GIF"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <video
                  src={resolveMediaUrl(formData.videoUrl)}
                  poster={resolveMediaUrl(formData.posterImg) || undefined}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )
            ) : formData.posterImg ? (
              <img
                src={resolveMediaUrl(formData.posterImg)}
                alt="Poster"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[#0d0a08]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,161,101,0.12)_0%,transparent_70%)]" />
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />

            {/* Bottom text + progress */}
            <div className="relative z-10 w-full px-4 pb-6 flex flex-col items-center gap-2">
              <div className="text-center mb-1">
                <p className="font-serif text-sm font-bold text-white tracking-wide drop-shadow">
                  {formData.title || 'HookahLab Lounge'}
                </p>
                <p className="text-[9px] text-white/70 tracking-wider mt-0.5">
                  {formData.subtitle || 'Kahve, Lezzet & Nargile'}
                </p>
              </div>
              <div className="w-full bg-white/20 h-[2px] rounded-full overflow-hidden">
                <div className="bg-[#c8a165] h-full w-2/3 animate-pulse" />
              </div>
              <span className="text-[8px] text-white/50 uppercase tracking-widest">
                Menüye Geçiliyor
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
