import React, { useState } from 'react';
import type { Category, MenuItem } from '../types/admin';
import { Plus, Edit2, Trash2, Search, UtensilsCrossed, X, Sparkles } from 'lucide-react';

interface ProductManagerProps {
  categories: Category[];
  onSaveProduct: (categoryId: string, product: MenuItem) => void;
  onDeleteProduct: (categoryId: string, productId: number) => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({
  categories,
  onSaveProduct,
  onDeleteProduct,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MenuItem | null>(null);
  const [targetCategoryId, setTargetCategoryId] = useState<string>(categories[0]?.id || '');

  // Form Fields
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Collect all products for display
  const allProductsList: { categoryId: string; categoryTitle: string; item: MenuItem }[] = [];
  categories.forEach(cat => {
    (cat.items || []).forEach(item => {
      allProductsList.push({
        categoryId: cat.id,
        categoryTitle: cat.title,
        item,
      });
    });
  });

  // Filter products by selected category filter and search query
  const filteredProducts = allProductsList.filter(entry => {
    const matchesCategory = selectedCategoryFilter === 'all' || entry.categoryId === selectedCategoryFilter;
    const matchesSearch = searchQuery === '' || 
      entry.item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    const defaultCatId = selectedCategoryFilter !== 'all' ? selectedCategoryFilter : (categories[0]?.id || '');
    setTargetCategoryId(defaultCatId);
    
    const defaultCat = categories.find(c => c.id === defaultCatId);
    const defaultSub = defaultCat?.subCategories?.[0]?.id || '';

    setName('');
    setDesc('');
    setPrice('150,00 ₺');
    setImg('https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=400');
    setSubCategory(defaultSub);
    setTagsInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (catId: string, item: MenuItem) => {
    setEditingProduct(item);
    setTargetCategoryId(catId);
    setName(item.name);
    setDesc(item.desc || '');
    setPrice(item.price || '');
    setImg(item.img || '');
    setSubCategory(item.subCategory || '');
    setTagsInput((item.tags || []).join(', '));
    setIsModalOpen(true);
  };

  const handleCategoryChangeInForm = (newCatId: string) => {
    setTargetCategoryId(newCatId);
    const catObj = categories.find(c => c.id === newCatId);
    if (catObj && catObj.subCategories && catObj.subCategories.length > 0) {
      setSubCategory(catObj.subCategories[0].id);
    } else {
      setSubCategory('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const updatedProduct: MenuItem = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: name.trim(),
      desc: desc.trim(),
      price: price.trim(),
      img: img.trim(),
      subCategory: subCategory || undefined,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
      isAvailable: true,
    };

    onSaveProduct(targetCategoryId, updatedProduct);
    setIsModalOpen(false);
  };

  const selectedCategoryObj = categories.find(c => c.id === targetCategoryId);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      
      {/* Banner */}
      <div className="bg-[#181310] p-6 rounded-3xl border border-[#c8a165]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c8a165]/15 border border-[#c8a165]/40 text-[#c8a165] text-xs font-semibold uppercase tracking-wider mb-2">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Ürün Listesi & Fiyat Yönetimi</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#e2d8c3]">
            Menü Ürünleri Yönetimi
          </h2>
          <p className="text-xs text-[#a0907a] mt-1">
            Kategorilere ait ürün resmi, adı, açıklaması, fiyatı ve alt kategori atamasını yapın.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-gradient-to-r from-[#8b5a2b] via-[#c8a165] to-[#8b5a2b] hover:from-[#c8a165] hover:to-[#c8a165] text-[#0d0a08] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Ürün Ekle</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-[#16120f]/90 p-4 rounded-2xl border border-[#3a2e26] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        
        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto custom-scrollbar pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategoryFilter === 'all'
                ? 'bg-[#c8a165] text-[#0d0a08]'
                : 'bg-[#0d0a08] text-[#a0907a] hover:text-[#e2d8c3] border border-[#3a2e26]'
            }`}
          >
            Tüm Ürünler ({allProductsList.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategoryFilter === cat.id
                  ? 'bg-[#c8a165] text-[#0d0a08]'
                  : 'bg-[#0d0a08] text-[#a0907a] hover:text-[#e2d8c3] border border-[#3a2e26]'
              }`}
            >
              {cat.title} ({cat.items?.length || 0})
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a0907a]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ürün ara..."
            className="w-full pl-9 pr-4 py-2 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
          />
        </div>

      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-[#16120f]/60 rounded-3xl border border-[#3a2e26]">
            <UtensilsCrossed className="w-10 h-10 text-[#6b5a4b] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#a0907a]">Aranan kriterlere uygun ürün bulunamadı.</p>
            <button
              onClick={handleOpenAddModal}
              className="mt-4 px-4 py-2 bg-[#8b5a2b] text-[#0d0a08] font-bold text-xs rounded-xl cursor-pointer"
            >
              Hemen Yeni Ürün Ekle
            </button>
          </div>
        ) : (
          filteredProducts.map(({ categoryId, categoryTitle, item }) => (
            <div
              key={`${categoryId}-${item.id}`}
              className="bg-[#16120f]/90 border border-[#3a2e26] hover:border-[#c8a165]/50 rounded-2xl p-4 transition-all duration-200 shadow-lg flex flex-col justify-between space-y-4 group"
            >
              <div className="flex gap-3">
                {/* Product Image Thumbnail */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#0d0a08] border border-[#3a2e26] flex-shrink-0 relative">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                </div>

                {/* Product Text Details */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-serif text-sm font-bold text-[#e2d8c3] line-clamp-1">
                      {item.name}
                    </h4>
                  </div>
                  <span className="inline-block text-[10px] text-[#c8a165] font-semibold bg-[#0d0a08] px-2 py-0.5 rounded border border-[#3a2e26]">
                    {categoryTitle}
                  </span>
                  <p className="text-[11px] text-[#a0907a] line-clamp-2 leading-relaxed">
                    {item.desc || 'Açıklama girilmedi.'}
                  </p>
                </div>
              </div>

              {/* Price & Tags & Actions */}
              <div className="flex items-center justify-between border-t border-[#2a221b] pt-3">
                <div>
                  <span className="text-xs text-[#a0907a]">Fiyat: </span>
                  <span className="text-sm font-bold text-[#c8a165]">{item.price}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(categoryId, item)}
                    className="p-2 bg-[#1f1914] border border-[#3a2e26] hover:border-[#c8a165] text-[#c8a165] rounded-lg text-xs font-semibold cursor-pointer"
                    title="Düzenle"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`"${item.name}" ürününü silmek istediğinize emin misiniz?`)) {
                        onDeleteProduct(categoryId, item.id);
                      }
                    }}
                    className="p-2 bg-red-950/40 border border-red-900/40 hover:border-red-600 text-red-400 rounded-lg text-xs font-semibold cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Modal: Create / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#16120f] border border-[#c8a165]/40 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#3a2e26] pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#c8a165]" />
                <h3 className="font-serif text-xl font-bold text-[#e2d8c3]">
                  {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#a0907a] hover:text-[#e2d8c3] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Category & Subcategory Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#c8a165] uppercase tracking-wider mb-1.5">
                    Kategori Seçin *
                  </label>
                  <select
                    value={targetCategoryId}
                    onChange={(e) => handleCategoryChangeInForm(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#c8a165] uppercase tracking-wider mb-1.5">
                    Alt Kategori
                  </label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
                  >
                    <option value="">Alt Kategori Yok</option>
                    {selectedCategoryObj?.subCategories?.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Name & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#c8a165] uppercase tracking-wider mb-1.5">
                    Ürün Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: EKMEK ÜSTÜ KAHVALTI"
                    className="w-full px-4 py-3 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#c8a165] uppercase tracking-wider mb-1.5">
                    Fiyat (₺) *
                  </label>
                  <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Örn: 350,00 ₺"
                    className="w-full px-4 py-3 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#c8a165] uppercase tracking-wider mb-1.5">
                  Ürün Açıklaması / İçerik
                </label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="İçerik malzemelerini yazın..."
                  className="w-full px-4 py-3 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-[#c8a165] uppercase tracking-wider mb-1.5">
                  Ürün Görsel Adresi (Image URL) *
                </label>
                <input
                  type="text"
                  required
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
                />
              </div>

              {/* Tags (Optional) */}
              <div>
                <label className="block text-xs font-bold text-[#c8a165] uppercase tracking-wider mb-1.5">
                  Özel Etiketler (Virgülle Ayırın)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Örn: Popüler, Şefin Tavsiyesi, Yeni"
                  className="w-full px-4 py-3 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
                />
              </div>

              {/* Submit Buttons */}
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
                  Ürünü Kaydet
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
