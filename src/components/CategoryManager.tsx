import React, { useState } from 'react';
import type { Category, SubCategory } from '../types/admin';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Film, FolderTree, X, Sparkles } from 'lucide-react';

interface CategoryManagerProps {
  categories: Category[];
  onSaveCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onReorderCategories: (newOrder: Category[]) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onSaveCategory,
  onDeleteCategory,
  onReorderCategories,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [num, setNum] = useState('01');
  const [videoUrl, setVideoUrl] = useState('');
  const [img, setImg] = useState('');
  const [position, setPosition] = useState(1);
  const [subCategoryInput, setSubCategoryInput] = useState('');
  const [subCategoriesList, setSubCategoriesList] = useState<SubCategory[]>([]);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setTitle('');
    setSubtitle('');
    setNum(String(categories.length + 1).padStart(2, '0'));
    setVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-smoke-background-in-dark-room-41566-large.mp4');
    setImg('https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=800');
    setPosition(categories.length + 1);
    setSubCategoriesList([]);
    setSubCategoryInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setTitle(cat.title);
    setSubtitle(cat.subtitle || '');
    setNum(cat.num || '01');
    setVideoUrl(cat.videoUrl || '');
    setImg(cat.img || '');
    setPosition(cat.position || 1);
    setSubCategoriesList(cat.subCategories || []);
    setSubCategoryInput('');
    setIsModalOpen(true);
  };

  const handleAddSubCategory = () => {
    if (!subCategoryInput.trim()) return;
    const titleClean = subCategoryInput.trim();
    const idSlug = titleClean.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    if (!subCategoriesList.some(s => s.title.toLowerCase() === titleClean.toLowerCase())) {
      setSubCategoriesList([...subCategoriesList, { id: idSlug, title: titleClean.toUpperCase() }]);
    }
    setSubCategoryInput('');
  };

  const handleRemoveSubCategory = (id: string) => {
    setSubCategoriesList(subCategoriesList.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const catId = editingCategory ? editingCategory.id : title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const updatedCategory: Category = {
      id: catId,
      num: num || '01',
      title: title.trim(),
      subtitle: subtitle.trim(),
      videoUrl: videoUrl.trim(),
      img: img.trim(),
      position: Number(position),
      subCategories: subCategoriesList,
      items: editingCategory ? editingCategory.items : [],
    };

    onSaveCategory(updatedCategory);
    setIsModalOpen(false);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newCategories = [...categories];
    const temp = newCategories[index];
    newCategories[index] = newCategories[index - 1];
    newCategories[index - 1] = temp;

    // Update positions
    newCategories.forEach((cat, idx) => {
      cat.position = idx + 1;
      cat.num = String(idx + 1).padStart(2, '0');
    });

    onReorderCategories(newCategories);
  };

  const handleMoveDown = (index: number) => {
    if (index === categories.length - 1) return;
    const newCategories = [...categories];
    const temp = newCategories[index];
    newCategories[index] = newCategories[index + 1];
    newCategories[index + 1] = temp;

    // Update positions
    newCategories.forEach((cat, idx) => {
      cat.position = idx + 1;
      cat.num = String(idx + 1).padStart(2, '0');
    });

    onReorderCategories(newCategories);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      
      {/* Top Banner & Add Button */}
      <div className="bg-[#181310] p-6 rounded-3xl border border-[#c8a165]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c8a165]/15 border border-[#c8a165]/40 text-[#c8a165] text-xs font-semibold uppercase tracking-wider mb-2">
            <FolderTree className="w-3.5 h-3.5" />
            <span>Kategori Yönetimi & Sıralama</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#e2d8c3]">
            Menü Kategorileri ve Özel Medyaları
          </h2>
          <p className="text-xs text-[#a0907a] mt-1">
            Her kategorinin kendisine özel GIF/Video medyası, sabit kapağı, alt kategorileri ve ana sayfadaki sırası bulunur.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-gradient-to-r from-[#8b5a2b] via-[#c8a165] to-[#8b5a2b] hover:from-[#c8a165] hover:to-[#c8a165] text-[#0d0a08] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Kategori Ekle</span>
        </button>
      </div>

      {/* Categories Grid / Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="bg-[#16120f]/90 border border-[#3a2e26] hover:border-[#c8a165]/50 rounded-2xl p-4 md:p-6 transition-all duration-200 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            {/* Position Controls & Category Media Thumbnails */}
            <div className="flex items-center gap-4">
              
              {/* Order Up/Down buttons */}
              <div className="flex flex-col items-center gap-1 bg-[#0d0a08] p-1.5 rounded-xl border border-[#2a221b]">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-1 text-[#a0907a] hover:text-[#c8a165] disabled:opacity-30 cursor-pointer"
                  title="Yukarı Taşı"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-bold text-[#c8a165] px-1">
                  #{category.num || String(index + 1).padStart(2, '0')}
                </span>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === categories.length - 1}
                  className="p-1 text-[#a0907a] hover:text-[#c8a165] disabled:opacity-30 cursor-pointer"
                  title="Aşağı Taşı"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              {/* Media Preview (Video/GIF badge + static image thumbnail) */}
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-[#c8a165]/30 flex-shrink-0 bg-[#0d0a08]">
                {category.videoUrl && category.videoUrl.endsWith('.gif') ? (
                  <img
                    src={category.videoUrl}
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                ) : category.videoUrl ? (
                  <video
                    src={category.videoUrl}
                    poster={category.img}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={category.img}
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-1.5 left-1.5 text-[9px] bg-[#c8a165] text-[#0d0a08] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Film className="w-2.5 h-2.5" /> GIF/Video
                </span>
              </div>

              {/* Category Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-bold text-[#e2d8c3]">
                    {category.title}
                  </h3>
                  <span className="text-[10px] bg-[#2a221b] text-[#c8a165] px-2 py-0.5 rounded-full font-semibold border border-[#3a2e26]">
                    {category.items?.length || 0} Ürün
                  </span>
                </div>
                <p className="text-xs text-[#a0907a] uppercase tracking-wider font-medium">
                  {category.subtitle || 'Slogan Belirtilmedi'}
                </p>

                {/* Subcategories Pills */}
                {category.subCategories && category.subCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {category.subCategories.map((sub) => (
                      <span
                        key={sub.id}
                        className="text-[10px] bg-[#0d0a08] border border-[#3a2e26] text-[#e2d8c3] px-2 py-0.5 rounded-md"
                      >
                        • {sub.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Actions: Edit & Delete */}
            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => handleOpenEditModal(category)}
                className="px-3 py-2 bg-[#1f1914] border border-[#3a2e26] hover:border-[#c8a165] text-[#c8a165] hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Düzenle</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(`"${category.title}" kategorisini silmek istediğinize emin misiniz?`)) {
                    onDeleteCategory(category.id);
                  }
                }}
                className="p-2 bg-red-950/40 border border-red-900/40 hover:border-red-600 text-red-400 hover:text-white rounded-xl transition-all cursor-pointer"
                title="Kategoriyi Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Modal: Create / Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#16120f] border border-[#c8a165]/40 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#3a2e26] pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#c8a165]" />
                <h3 className="font-serif text-xl font-bold text-[#e2d8c3]">
                  {editingCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori Oluştur'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#a0907a] hover:text-[#e2d8c3] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Category Name & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#c8a165] uppercase tracking-wider mb-1.5">
                    Kategori Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Örn: Nargileler"
                    className="w-full px-4 py-3 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#c8a165] uppercase tracking-wider mb-1.5">
                    Slogan / Alt Başlık
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Örn: ÖZEL HARMAN & MAŞA SANATI"
                    className="w-full px-4 py-3 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
                  />
                </div>
              </div>

              {/* Number Badge & Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#c8a165] uppercase tracking-wider mb-1.5">
                    Sıra Numarası Rozeti (Örn: 01, 02)
                  </label>
                  <input
                    type="text"
                    value={num}
                    onChange={(e) => setNum(e.target.value)}
                    placeholder="01"
                    className="w-full px-4 py-3 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#c8a165] uppercase tracking-wider mb-1.5">
                    Ana Sayfa Sıralaması (Position)
                  </label>
                  <input
                    type="number"
                    value={position}
                    onChange={(e) => setPosition(Number(e.target.value))}
                    min={1}
                    className="w-full px-4 py-3 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
                  />
                </div>
              </div>

              {/* Media Requirements Requested by User: GIF/Video URL & Sabit Resim URL */}
              <div className="p-4 bg-[#0d0a08]/80 border border-[#3a2e26] rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-[#c8a165] text-xs font-bold uppercase tracking-wider border-b border-[#2a221b] pb-2">
                  <Film className="w-4 h-4" />
                  <span>Kategori Medya Bilgileri (GIF / Video & Kapak)</span>
                </div>

                {/* Video/GIF URL */}
                <div>
                  <label className="block text-xs font-semibold text-[#e2d8c3] mb-1">
                    1. Her Kategorinin Kendine Ait GIF / Video Adresi (URL) *
                  </label>
                  <input
                    type="text"
                    required
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://.../smoke.mp4 veya animation.gif"
                    className="w-full px-4 py-2.5 bg-[#16120f] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
                  />
                  <p className="text-[10px] text-[#8b5a2b] mt-1">
                    Bu video/GIF kategori açıldığında arka planda canlı oynatılacaktır.
                  </p>
                </div>

                {/* Static Image URL */}
                <div>
                  <label className="block text-xs font-semibold text-[#e2d8c3] mb-1">
                    2. Sabit Resim Adresi (Static Cover Image URL) *
                  </label>
                  <input
                    type="text"
                    required
                    value={img}
                    onChange={(e) => setImg(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-2.5 bg-[#16120f] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
                  />
                </div>
              </div>

              {/* Subcategories (Alt Kategori İsimleri) */}
              <div>
                <label className="block text-xs font-bold text-[#c8a165] uppercase tracking-wider mb-1.5">
                  Alt Kategori İsimleri (Ekleme Alanı)
                </label>
                <div className="flex gap-2 mb-3">
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
                    placeholder="Örn: PREMIUM TÜTÜNLER (Enter ile ekle)"
                    className="flex-1 px-4 py-2.5 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubCategory}
                    className="px-4 py-2.5 bg-[#8b5a2b] hover:bg-[#c8a165] text-[#0d0a08] font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Ekle
                  </button>
                </div>

                {/* Render Added Subcategories Pills */}
                <div className="flex flex-wrap gap-2 min-h-[36px] p-2 bg-[#0d0a08] rounded-xl border border-[#2a221b]">
                  {subCategoriesList.length === 0 ? (
                    <span className="text-[11px] text-[#6b5a4b] italic p-1">
                      Henüz alt kategori eklenmedi. Yukarıdaki alandan yazıp ekleyin.
                    </span>
                  ) : (
                    subCategoriesList.map((sub) => (
                      <span
                        key={sub.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1f1914] border border-[#c8a165]/40 text-[#c8a165] text-xs font-semibold rounded-lg"
                      >
                        {sub.title}
                        <button
                          type="button"
                          onClick={() => handleRemoveSubCategory(sub.id)}
                          className="hover:text-red-400 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#3a2e26]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-[#1f1914] hover:bg-[#2a221b] text-[#a0907a] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#8b5a2b] to-[#c8a165] hover:from-[#c8a165] hover:to-[#c8a165] text-[#0d0a08] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Kategoriyi Kaydet
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
