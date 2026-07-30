import React, { useState } from 'react';
import { Store, MapPin, Clock, Phone, Save, CheckCircle2, AlertCircle, Coffee } from 'lucide-react';

export interface StoreSettings {
  storeName: string;
  title: string;
  addressLine1: string;
  addressLine2: string;
  workingHours: string;
  breakfastWeekdays: string;
  breakfastWeekends: string;
  phone: string;
  phoneDisplay: string;
  googleMapsUrl: string;
  note: string;
}

interface StoreSettingsManagerProps {
  settings: StoreSettings;
  onSave: (updated: StoreSettings) => Promise<void>;
}

export const StoreSettingsManager: React.FC<StoreSettingsManagerProps> = ({
  settings,
  onSave,
}) => {
  const [form, setForm] = useState<StoreSettings>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (field: keyof StoreSettings, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);
    try {
      await onSave(form);
      setStatusMessage({ type: 'success', text: 'İletişim ve çalışma saatleri bilgileri başarıyla kaydedildi!' });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Kaydedilirken bir hata oluştu.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#16120e] border border-[#c8a165]/30 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#c8a165]/15 border border-[#c8a165]/40 flex items-center justify-center text-[#c8a165]">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-[#e2d8c3]">İletişim & Çalışma Saatleri</h2>
            <p className="text-xs text-[#a0907a] mt-0.5">
              Frontend "Bize Ulaşın" bölümünde yer alan adres, saat ve telefon bilgilerini buradan yönetebilirsiniz.
            </p>
          </div>
        </div>
      </div>

      {/* Alert Message */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-600/40 text-emerald-300'
              : 'bg-rose-950/60 border-rose-600/40 text-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Section 1: İşletme Kimliği & Adres */}
        <div className="p-6 rounded-2xl bg-[#16120e] border border-[#3a2e26] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#3a2e26] text-[#c8a165]">
            <MapPin className="w-4 h-4" />
            <h3 className="text-sm font-semibold tracking-wider uppercase">İşletme Adı & Konum Bilgisi</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#a0907a] uppercase mb-1.5">
                İşletme Adı (Etiket)
              </label>
              <input
                type="text"
                value={form.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                placeholder="HOOKAHLAB RİZE"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] text-sm text-[#e2d8c3] outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a0907a] uppercase mb-1.5">
                Ana Başlık
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Bize uğrayın."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] text-sm text-[#e2d8c3] outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a0907a] uppercase mb-1.5">
                Adres Satırı 1
              </label>
              <input
                type="text"
                value={form.addressLine1}
                onChange={(e) => handleChange('addressLine1', e.target.value)}
                placeholder="Çarşı Mahallesi, TOKİ AVM"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] text-sm text-[#e2d8c3] outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a0907a] uppercase mb-1.5">
                Adres Satırı 2 (İlçe / İl)
              </label>
              <input
                type="text"
                value={form.addressLine2}
                onChange={(e) => handleChange('addressLine2', e.target.value)}
                placeholder="Merkez / Rize"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] text-sm text-[#e2d8c3] outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#a0907a] uppercase mb-1.5">
                Google Maps Yol Tarifi URL
              </label>
              <input
                type="url"
                value={form.googleMapsUrl}
                onChange={(e) => handleChange('googleMapsUrl', e.target.value)}
                placeholder="https://www.google.com/maps/search/?api=1&query=..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] text-sm text-[#e2d8c3] outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Çalışma & Kahvaltı Saatleri */}
        <div className="p-6 rounded-2xl bg-[#16120e] border border-[#3a2e26] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#3a2e26] text-[#c8a165]">
            <Clock className="w-4 h-4" />
            <h3 className="text-sm font-semibold tracking-wider uppercase">Çalışma & Kahvaltı Servis Saatleri</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#a0907a] uppercase mb-1.5">
                Genel Çalışma Saatleri
              </label>
              <input
                type="text"
                value={form.workingHours}
                onChange={(e) => handleChange('workingHours', e.target.value)}
                placeholder="Her gün 08:30 – 00:00"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] text-sm text-[#e2d8c3] outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a0907a] uppercase mb-1.5 flex items-center gap-1">
                <Coffee className="w-3.5 h-3.5 text-[#c8a165]" /> Kahvaltı (Hafta İçi)
              </label>
              <input
                type="text"
                value={form.breakfastWeekdays}
                onChange={(e) => handleChange('breakfastWeekdays', e.target.value)}
                placeholder="Hafta içi 08:30–15:00"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] text-sm text-[#e2d8c3] outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a0907a] uppercase mb-1.5 flex items-center gap-1">
                <Coffee className="w-3.5 h-3.5 text-[#c8a165]" /> Kahvaltı (Hafta Sonu)
              </label>
              <input
                type="text"
                value={form.breakfastWeekends}
                onChange={(e) => handleChange('breakfastWeekends', e.target.value)}
                placeholder="Hafta sonu 08:30–16:00"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] text-sm text-[#e2d8c3] outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Section 3: İletişim / Rezervasyon Telefonu & Not */}
        <div className="p-6 rounded-2xl bg-[#16120e] border border-[#3a2e26] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#3a2e26] text-[#c8a165]">
            <Phone className="w-4 h-4" />
            <h3 className="text-sm font-semibold tracking-wider uppercase">Rezervasyon Telefonu & Bilgilendirme</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#a0907a] uppercase mb-1.5">
                Telefon (Görüntülenen Metin)
              </label>
              <input
                type="text"
                value={form.phoneDisplay}
                onChange={(e) => handleChange('phoneDisplay', e.target.value)}
                placeholder="0 551 383 25 09"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] text-sm text-[#e2d8c3] outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a0907a] uppercase mb-1.5">
                Telefon (Aranacak Numara / Boşluksuz)
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="05513832509"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] text-sm text-[#e2d8c3] outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#a0907a] uppercase mb-1.5">
                Dipnot / Açıklama Notu
              </label>
              <input
                type="text"
                value={form.note}
                onChange={(e) => handleChange('note', e.target.value)}
                placeholder="Resmî tatillerde çalışma saatleri değişabilir."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] text-sm text-[#e2d8c3] outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#8b5a2b] to-[#c8a165] text-[#0d0a08] font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
