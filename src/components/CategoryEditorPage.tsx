import React, { useState } from 'react';
import type { Category, SubCategory } from '../types/admin';
import { FileUploader } from './FileUploader';
import { ArrowLeft, Save, Sparkles, Film, FolderPlus, X, Check, FolderTree } from 'lucide-react';

interface CategoryEditorPageProps {
  category: Category | null;
  totalCategoriesCount: number;
  onSave: (updatedCategory: Category) => void;
  onBack: () => void;
}

export const CategoryEditorPage: React.FC<CategoryEditorPageProps> = ({
  category,
  totalCategoriesCount,
  onSave,
  onBack,
}) => {
  // Form State
  const [title, setTitle] = useState(category ? category.title : '');
  const [subtitle, setSubtitle] = useState(category ? category.subtitle || '' : '');
  const [num, setNum] = useState(category ? category.num || '01' : String(totalCategoriesCount + 1).padStart(2, '0'));
  const [videoUrl, setVideoUrl] = useState(category ? category.videoUrl || '' : 'https://assets.mixkit.co/videos/preview/mixkit-smoke-background-in-dark-room-41566-large.mp4');
  const [img, setImg] = useState(category ? category.img || '' : 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=800');
  const [position, setPosition] = useState(category ? category.position || 1 : totalCategoriesCount + 1);

  // Subcategories State
  const [subCategoryInput, setSubCategoryInput] = useState('');
  const [subCategoriesList, setSubCategoriesList] = useState<SubCategory[]>(category ? category.subCategories || [] : []);

  const [isSaved, setIsSaved] = useState(false);

  const handleAddSubCategory = () => {
    if (!subCategoryInput.trim()) return;
    const titleClean = subCategoryInput.trim().toUpperCase();
    const idSlug = titleClean.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    if (!subCategoriesList.some((s) => s.title.toLowerCase() === titleClean.toLowerCase())) {
      setSubCategoriesList([...subCategoriesList, { id: idSlug, title: titleClean }]);
    }
    setSubCategoryInput('');
  };

  const handleRemoveSubCategory = (id: string) => {
    setSubCategoriesList(subCategoriesList.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const catId = category ? category.id : title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const updatedCat: Category = {
      id: catId,
      num: num || '01',
      title: title.trim(),
      subtitle: subtitle.trim(),
      videoUrl: videoUrl.trim(),
      img: img.trim(),
      position: Number(position),
      subCategories: subCategoriesList,
      items: category ? category.items : [],
    };

    onSave(updatedCat);
    setIsSaved(true);
    setTimeout(() => {
      onBack();
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Top Full-Page Header */}
      <div className="bg-[#181310] p-6 rounded-3xl border border-[#c8a165]/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-24 z-30 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 bg-[#0d0a08] border border-[#3a2e26] hover:border-[#c8a165] text-[#c8a165] rounded-2xl transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Geri Dön</span>
          </button>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c8a165]/15 border border-[#c8a165]/40 text-[#c8a165] text-[11px] font-semibold uppercase tracking-wider mb-1">
              <FolderTree className="w-3.5 h-3.5" />
              <span>Tam Sayfa Kategori Düzenleme</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#e2d8c3]">
              {category ? `"${category.title}" Kategorisini Düzenle` : 'Yeni Ana Kategori Oluştur'}
            </h2>
          </div>
        </div>

        {isSaved ? (
          <div className="px-5 py-3 bg-emerald-950/80 border border-emerald-500 text-emerald-400 font-bold text-xs rounded-2xl flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Kategori Başarıyla Kaydedildi!</span>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-3.5 bg-gradient-to-r from-[#8b5a2b] via-[#c8a165] to-[#8b5a2b] hover:from-[#c8a165] hover:to-[#c8a165] text-[#0d0a08] font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Kategoriyi Kaydet</span>
          </button>
        )}
      </div>

      {/* Main Full-Page Form Cards */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Basic Information */}
        <div className="bg-[#16120f]/95 border border-[#3a2e26] rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-[#2a221b] pb-3 text-[#c8a165] font-serif font-bold text-lg">
            <Sparkles className="w-5 h-5" />
            <span>1. Kategori Temel Bilgileri</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#c8a165] uppercase tracking-wider mb-2">
                Kategori Adı *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Nargileler"
                className="w-full px-4 py-3 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-2xl text-xs text-[#e2d8c3] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#c8a165] uppercase tracking-wider mb-2">
                Slogan / Alt Başlık
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Örn: ÖZEL HARMAN & MAŞA SANATI"
                className="w-full px-4 py-3 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-2xl text-xs text-[#e2d8c3] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#c8a165] uppercase tracking-wider mb-2">
                Sıra Numarası Rozeti (Örn: 01, 02)
              </label>
              <input
                type="text"
                value={num}
                onChange={(e) => setNum(e.target.value)}
                placeholder="01"
                className="w-full px-4 py-3 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-2xl text-xs text-[#e2d8c3] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#c8a165] uppercase tracking-wider mb-2">
                Ana Sayfa Görüntülenme Sırası (Position)
              </label>
              <input
                type="number"
                value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
                min={1}
                className="w-full px-4 py-3 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-2xl text-xs text-[#e2d8c3] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Local Computer File Uploads (GIF/Video & Static Image) */}
        <div className="bg-[#16120f]/95 border border-[#3a2e26] rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-[#2a221b] pb-3 text-[#c8a165] font-serif font-bold text-lg">
            <Film className="w-5 h-5" />
            <span>2. Bilgisayardan Medya Dosyaları Yükleme</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Local GIF / MP4 Video Uploader */}
            <FileUploader
              label="1. Her Kategorinin Kendisine Özel GIF veya Video Dosyası"
              accept="image/gif,video/mp4,video/*"
              currentValue={videoUrl}
              onChange={(dataUrl) => setVideoUrl(dataUrl)}
              mediaType="video"
              description="Bilgisayarınızdan GIF veya MP4 video dosyası seçin"
            />

            {/* Local Static Cover Image Uploader */}
            <FileUploader
              label="2. Kategorinin Sabit Kapak Resmi Dosyası"
              accept="image/*"
              currentValue={img}
              onChange={(dataUrl) => setImg(dataUrl)}
              mediaType="image"
              description="Bilgisayarınızdan kapak resmi (PNG/JPG/WEBP) seçin"
            />
          </div>
        </div>

        {/* Section 3: Subcategories Management */}
        <div className="bg-[#16120f]/95 border border-[#3a2e26] rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-[#2a221b] pb-3 text-[#c8a165] font-serif font-bold text-lg">
            <FolderPlus className="w-5 h-5" />
            <span>3. Alt Kategoriler Oluşturma & Düzenleme</span>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={subCategoryInput}
                onChange={(e) => setSubCategoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubCategory();
                  }
                }}
                placeholder="Örn: PREMIUM TÜTÜNLER (Enter ile ekleyin)"
                className="flex-1 px-4 py-3 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-2xl text-xs text-[#e2d8c3] outline-none"
              />
              <button
                type="button"
                onClick={handleAddSubCategory}
                className="px-6 py-3 bg-[#8b5a2b] hover:bg-[#c8a165] text-[#0d0a08] font-bold text-xs rounded-2xl transition-all cursor-pointer flex-shrink-0"
              >
                + Alt Kategori Ekle
              </button>
            </div>

            {/* Added Subcategories Pills */}
            <div className="flex flex-wrap gap-2.5 min-h-[48px] p-3 bg-[#0d0a08] rounded-2xl border border-[#2a221b] items-center">
              {subCategoriesList.length === 0 ? (
                <span className="text-xs text-[#6b5a4b] italic p-1">
                  Henüz alt kategori eklenmedi. Yukarıdaki alandan yazıp ekleyebilirsiniz.
                </span>
              ) : (
                subCategoriesList.map((sub) => (
                  <span
                    key={sub.id}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#1f1914] border border-[#c8a165]/50 text-[#c8a165] text-xs font-bold rounded-xl"
                  >
                    • {sub.title}
                    <button
                      type="button"
                      onClick={() => handleRemoveSubCategory(sub.id)}
                      className="hover:text-red-400 cursor-pointer ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-[#1f1914] hover:bg-[#2a221b] border border-[#3a2e26] text-[#a0907a] text-xs font-bold rounded-2xl transition-colors cursor-pointer"
          >
            İptal ve Geri Dön
          </button>

          <button
            type="submit"
            className="px-8 py-3.5 bg-gradient-to-r from-[#8b5a2b] via-[#c8a165] to-[#8b5a2b] hover:from-[#c8a165] hover:to-[#c8a165] text-[#0d0a08] font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl cursor-pointer"
          >
            Kategoriyi Kaydet
          </button>
        </div>

      </form>
    </div>
  );
};
