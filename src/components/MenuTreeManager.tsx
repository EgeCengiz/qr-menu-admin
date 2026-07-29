import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Category, SubCategory, MenuItem } from '../types/admin';
import { FileUploader } from './FileUploader';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Film,
  FolderTree,
  FolderPlus,
  PackagePlus,
  ChevronDown,
  ChevronRight,
  Search,
  X,
  UtensilsCrossed,
  ChevronsDown,
  ChevronsUp
} from 'lucide-react';

interface MenuTreeManagerProps {
  categories: Category[];
  onOpenCategoryEditor: (category: Category | null) => void;
  onDeleteCategory: (id: string) => void;
  onReorderCategories: (newOrder: Category[]) => void;
  onSaveProduct: (categoryId: string, product: MenuItem) => void;
  onDeleteProduct: (categoryId: string, productId: number) => void;
  onSaveSubCategory: (categoryId: string, subCategory: SubCategory) => void;
  onDeleteSubCategory: (categoryId: string, subCategoryId: string) => void;
}

export const MenuTreeManager: React.FC<MenuTreeManagerProps> = ({
  categories,
  onOpenCategoryEditor,
  onDeleteCategory,
  onReorderCategories,
  onSaveProduct,
  onDeleteProduct,
  onSaveSubCategory,
  onDeleteSubCategory,
}) => {
  // Collapse/Expand state for categories (Default: all categories collapsed)
  const [collapsedCats, setCollapsedCats] = useState<Record<string, boolean>>({});

  // Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state for subcategories & products
  const [subCatModal, setSubCatModal] = useState<{ open: boolean; categoryId: string; subCategory: SubCategory | null }>({ open: false, categoryId: '', subCategory: null });
  const [productModal, setProductModal] = useState<{ open: boolean; categoryId: string; subCategoryId: string; product: MenuItem | null }>({ open: false, categoryId: '', subCategoryId: '', product: null });

  // --- SUBCATEGORY MODAL FORM STATE ---
  const [subCatTitle, setSubCatTitle] = useState('');

  // --- PRODUCT MODAL FORM STATE ---
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImg, setProdImg] = useState('');
  const [prodSubCatId, setProdSubCatId] = useState('');

  // Lock body scroll and Escape key listener when any modal is open
  useEffect(() => {
    const isAnyModalOpen = subCatModal.open || productModal.open;
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (subCatModal.open) setSubCatModal({ open: false, categoryId: '', subCategory: null });
        if (productModal.open) setProductModal({ open: false, categoryId: '', subCategoryId: '', product: null });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [subCatModal.open, productModal.open]);

  // Toggle Collapse for a single category
  const toggleCollapse = (catId: string) => {
    setCollapsedCats(prev => {
      const isCurrentlyCollapsed = prev[catId] ?? true;
      return { ...prev, [catId]: !isCurrentlyCollapsed };
    });
  };

  // Expand All Categories
  const handleExpandAll = () => {
    const newMap: Record<string, boolean> = {};
    categories.forEach(c => {
      newMap[c.id] = false;
    });
    setCollapsedCats(newMap);
  };

  // Collapse All Categories
  const handleCollapseAll = () => {
    const newMap: Record<string, boolean> = {};
    categories.forEach(c => {
      newMap[c.id] = true;
    });
    setCollapsedCats(newMap);
  };

  // Open Subcategory Modal
  const handleOpenSubCatModal = (catId: string, sub?: SubCategory) => {
    setSubCatModal({ open: true, categoryId: catId, subCategory: sub || null });
    setSubCatTitle(sub ? sub.title : '');
  };

  // Submit Subcategory
  const handleSubCatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCatTitle.trim()) return;

    const cleanTitle = subCatTitle.trim().toUpperCase();
    const subId = subCatModal.subCategory ? subCatModal.subCategory.id : cleanTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    onSaveSubCategory(subCatModal.categoryId, {
      id: subId,
      title: cleanTitle
    });

    setSubCatModal({ open: false, categoryId: '', subCategory: null });
  };

  // Open Product Modal
  const handleOpenProdModal = (catId: string, subCatId?: string, prod?: MenuItem) => {
    const parentCat = categories.find(c => c.id === catId);
    const defaultSub = subCatId || parentCat?.subCategories?.[0]?.id || '';

    setProductModal({
      open: true,
      categoryId: catId,
      subCategoryId: defaultSub,
      product: prod || null
    });

    if (prod) {
      setProdName(prod.name);
      setProdDesc(prod.desc || '');
      setProdPrice(prod.price || '');
      setProdImg(prod.img || '');
      setProdSubCatId(prod.subCategory || defaultSub);
    } else {
      setProdName('');
      setProdDesc('');
      setProdPrice('150,00 ₺');
      setProdImg('https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=400');
      setProdSubCatId(defaultSub);
    }
  };

  // Submit Product
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const updatedProd: MenuItem = {
      id: productModal.product ? productModal.product.id : Date.now(),
      name: prodName.trim(),
      desc: prodDesc.trim(),
      price: prodPrice.trim(),
      img: prodImg.trim(),
      subCategory: prodSubCatId || undefined,
      isAvailable: true,
    };

    onSaveProduct(productModal.categoryId, updatedProd);
    setProductModal({ open: false, categoryId: '', subCategoryId: '', product: null });
  };

  // Move Up / Down
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const copy = [...categories];
    const temp = copy[index];
    copy[index] = copy[index - 1];
    copy[index - 1] = temp;

    copy.forEach((c, i) => {
      c.position = i + 1;
      c.num = String(i + 1).padStart(2, '0');
    });
    onReorderCategories(copy);
  };

  const handleMoveDown = (index: number) => {
    if (index === categories.length - 1) return;
    const copy = [...categories];
    const temp = copy[index];
    copy[index] = copy[index + 1];
    copy[index + 1] = temp;

    copy.forEach((c, i) => {
      c.position = i + 1;
      c.num = String(i + 1).padStart(2, '0');
    });
    onReorderCategories(copy);
  };

  // Filter categories and items if search query is active
  const filteredCategories = categories.filter(category => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchCat = category.title.toLowerCase().includes(q) || (category.subtitle && category.subtitle.toLowerCase().includes(q));
    const matchSub = category.subCategories?.some(s => s.title.toLowerCase().includes(q));
    const matchProd = category.items?.some(i => i.name.toLowerCase().includes(q) || (i.desc && i.desc.toLowerCase().includes(q)));
    return matchCat || matchSub || matchProd;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      
      {/* Top Banner & Primary Action Button */}
      <div className="bg-[#181310] p-6 rounded-3xl border border-[#c8a165]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c8a165]/15 border border-[#c8a165]/40 text-[#c8a165] text-xs font-semibold uppercase tracking-wider mb-2">
            <FolderTree className="w-3.5 h-3.5" />
            <span>Hiyerarşik Menü Ağacı Yönetimi</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#e2d8c3]">
            Kategoriler, Alt Kategoriler ve Ürünler
          </h2>
          <p className="text-xs text-[#a0907a] mt-1">
            Kategorilerin altında alt kategorileri, onların içerisinde ürünleri net bir şekilde görebilir ve yönetebilirsiniz.
          </p>
        </div>

        {/* Opens Full-Page Category Editor */}
        <button
          onClick={() => onOpenCategoryEditor(null)}
          className="px-5 py-3 bg-gradient-to-r from-[#8b5a2b] via-[#c8a165] to-[#8b5a2b] hover:from-[#c8a165] hover:to-[#c8a165] text-[#0d0a08] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Yeni Ana Kategori Ekle (Tam Sayfa)</span>
        </button>
      </div>

      {/* Search Input & Expand/Collapse All Toolbar */}
      <div className="bg-[#16120f]/90 p-4 rounded-2xl border border-[#3a2e26] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0907a]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kategori, alt kategori veya ürün ismi ara..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleExpandAll}
            className="px-3 py-2 bg-[#0d0a08] border border-[#3a2e26] hover:border-[#c8a165] text-[#c8a165] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            title="Tüm kategorileri aç"
          >
            <ChevronsDown className="w-4 h-4" />
            <span>Tümünü Aç</span>
          </button>

          <button
            onClick={handleCollapseAll}
            className="px-3 py-2 bg-[#0d0a08] border border-[#3a2e26] hover:border-[#8b5a2b] text-[#a0907a] hover:text-[#e2d8c3] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            title="Tüm kategorileri kapat"
          >
            <ChevronsUp className="w-4 h-4" />
            <span>Tümünü Kapat</span>
          </button>
        </div>
      </div>

      {/* HIERARCHICAL TREE VIEW LIST */}
      <div className="space-y-6">
        {filteredCategories.map((category, catIdx) => {
          // Default: Collapsed (isCollapsed is true unless explicitly set to false or search is active)
          const isCollapsed = searchQuery.trim() ? false : (collapsedCats[category.id] ?? true);
          const subCats = category.subCategories || [];
          const items = category.items || [];

          return (
            <div
              key={category.id}
              className="bg-[#16120f]/95 border border-[#3a2e26] hover:border-[#c8a165]/40 rounded-3xl overflow-hidden shadow-xl transition-all duration-200"
            >
              {/* CATEGORY HEADER ROW */}
              <div className="p-4 md:p-5 bg-gradient-to-r from-[#1b1511] via-[#16120f] to-[#1b1511] border-b border-[#2a221b] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                {/* Left: Reorder, Collapsible Arrow, Thumbnail & Info */}
                <div className="flex items-center gap-3">
                  
                  {/* Up / Down Reorder */}
                  <div className="flex flex-col items-center gap-0.5 bg-[#0d0a08] p-1 rounded-xl border border-[#2a221b]">
                    <button
                      onClick={() => handleMoveUp(catIdx)}
                      disabled={catIdx === 0}
                      className="p-1 text-[#a0907a] hover:text-[#c8a165] disabled:opacity-20 cursor-pointer"
                      title="Yukarı Taşı"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-bold text-[#c8a165] px-1">
                      #{category.num || String(catIdx + 1).padStart(2, '0')}
                    </span>
                    <button
                      onClick={() => handleMoveDown(catIdx)}
                      disabled={catIdx === categories.length - 1}
                      className="p-1 text-[#a0907a] hover:text-[#c8a165] disabled:opacity-20 cursor-pointer"
                      title="Aşağı Taşı"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Collapse Toggle Button */}
                  <button
                    onClick={() => toggleCollapse(category.id)}
                    className="p-2 text-[#c8a165] hover:bg-[#2a221b] rounded-xl cursor-pointer"
                    title={isCollapsed ? 'Kategoriyi Aç' : 'Kategoriyi Kapat'}
                  >
                    {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>

                  {/* Category Thumbnail (GIF/Video & Cover) */}
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-[#c8a165]/30 bg-[#0d0a08] flex-shrink-0">
                    {category.videoUrl && (category.videoUrl.startsWith('data:image/gif') || category.videoUrl.endsWith('.gif')) ? (
                      <img src={category.videoUrl} alt={category.title} className="w-full h-full object-cover" />
                    ) : category.videoUrl ? (
                      <video src={category.videoUrl} poster={category.img} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    ) : (
                      <img src={category.img} alt={category.title} className="w-full h-full object-cover" />
                    )}
                    <span className="absolute bottom-1 left-1 text-[8px] bg-[#c8a165] text-[#0d0a08] font-bold px-1 rounded flex items-center gap-0.5">
                      <Film className="w-2 h-2" /> GIF
                    </span>
                  </div>

                  {/* Category Text Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg font-bold text-[#e2d8c3]">
                        {category.title}
                      </h3>
                      <span className="text-[10px] bg-[#2a221b] text-[#c8a165] px-2 py-0.5 rounded-full font-semibold border border-[#3a2e26]">
                        {items.length} Ürün • {subCats.length} Alt Kategori
                      </span>
                    </div>
                    <p className="text-xs text-[#a0907a] uppercase font-medium">
                      {category.subtitle || 'Alt Başlık Belirtilmedi'}
                    </p>
                  </div>

                </div>

                {/* Right: Category Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
                  {/* + Alt Kategori Ekle Button */}
                  <button
                    onClick={() => handleOpenSubCatModal(category.id)}
                    className="px-3 py-2 bg-[#8b5a2b]/30 border border-[#8b5a2b] hover:bg-[#8b5a2b] text-[#c8a165] hover:text-[#0d0a08] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FolderPlus className="w-4 h-4" />
                    <span>+ Alt Kategori Ekle</span>
                  </button>

                  {/* + Hızlı Ürün Ekle Button */}
                  <button
                    onClick={() => handleOpenProdModal(category.id)}
                    className="px-3 py-2 bg-[#c8a165]/20 border border-[#c8a165]/50 hover:bg-[#c8a165] text-[#c8a165] hover:text-[#0d0a08] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <PackagePlus className="w-4 h-4" />
                    <span>+ Ürün Ekle</span>
                  </button>

                  {/* Edit Category Full Page Button */}
                  <button
                    onClick={() => onOpenCategoryEditor(category)}
                    className="px-3 py-2 bg-[#1f1914] border border-[#3a2e26] hover:border-[#c8a165] text-[#c8a165] rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    title="Kategoriyi Düzenle (Tam Sayfa)"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Düzenle</span>
                  </button>

                  {/* Delete Category */}
                  <button
                    onClick={() => {
                      if (confirm(`"${category.title}" kategorisini silmek istediğinize emin misiniz?`)) {
                        onDeleteCategory(category.id);
                      }
                    }}
                    className="p-2 bg-red-950/40 border border-red-900/40 hover:border-red-600 text-red-400 rounded-xl text-xs font-semibold cursor-pointer"
                    title="Kategoriyi Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* SUBCATEGORIES & PRODUCTS LIST (COLLAPSIBLE - DEFAULT COLLAPSED) */}
              {!isCollapsed && (
                <div className="p-4 md:p-6 space-y-6 bg-[#0d0a08]/40 border-t border-[#2a221b] animate-fade-in">
                  {subCats.length === 0 ? (
                    <div className="p-6 text-center bg-[#16120f] border border-[#2a221b] rounded-2xl space-y-3">
                      <p className="text-xs text-[#a0907a]">Bu kategoride henüz alt kategori oluşturulmadı.</p>
                      <button
                        onClick={() => handleOpenSubCatModal(category.id)}
                        className="px-4 py-2 bg-[#8b5a2b] text-[#0d0a08] font-bold text-xs rounded-xl cursor-pointer"
                      >
                        + Alt Kategori Oluştur
                      </button>
                    </div>
                  ) : (
                    subCats.map((sub) => {
                      // Get items under this subcategory
                      const subItems = items.filter(i => i.subCategory === sub.id || (!i.subCategory && subCats[0]?.id === sub.id));

                      return (
                        <div
                          key={sub.id}
                          className="bg-[#16120f] border border-[#3a2e26] rounded-2xl p-4 space-y-4 shadow-md"
                        >
                          {/* Subcategory Header */}
                          <div className="flex items-center justify-between border-b border-[#2a221b] pb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#c8a165]" />
                              <h4 className="font-serif text-sm font-bold text-[#c8a165] tracking-wider uppercase">
                                {sub.title}
                              </h4>
                              <span className="text-[10px] bg-[#0d0a08] text-[#a0907a] px-2 py-0.5 rounded border border-[#2a221b]">
                                {subItems.length} Ürün
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* + Ürün Ekle button for this specific subcategory */}
                              <button
                                onClick={() => handleOpenProdModal(category.id, sub.id)}
                                className="px-3 py-1.5 bg-[#8b5a2b]/30 hover:bg-[#8b5a2b] border border-[#8b5a2b] text-[#e2d8c3] hover:text-[#0d0a08] rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Ürün Ekle</span>
                              </button>

                              {/* Delete subcategory button */}
                              <button
                                onClick={() => {
                                  if (confirm(`"${sub.title}" alt kategorisini silmek istediğinize emin misiniz?`)) {
                                    onDeleteSubCategory(category.id, sub.id);
                                  }
                                }}
                                className="p-1.5 text-red-400 hover:text-red-300 rounded-lg cursor-pointer"
                                title="Alt Kategoriyi Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* PRODUCTS LIST UNDER THIS SUBCATEGORY (STACKED ALT ALTA) */}
                          <div className="space-y-3">
                            {subItems.length === 0 ? (
                              <div className="p-4 text-center text-xs text-[#6b5a4b] italic bg-[#0d0a08] rounded-xl border border-[#2a221b]">
                                Bu alt kategoride henüz ürün yok. Sağ üstteki "+ Ürün Ekle" butonunu kullanabilirsiniz.
                              </div>
                            ) : (
                              subItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="bg-[#0d0a08] border border-[#2a221b] hover:border-[#c8a165]/50 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                                >
                                  {/* Product Details (Image, Name, Desc) */}
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={item.img}
                                      alt={item.name}
                                      className="w-14 h-14 rounded-xl object-cover bg-[#16120f] border border-[#3a2e26] flex-shrink-0"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=400';
                                      }}
                                    />
                                    <div>
                                      <h5 className="font-serif text-sm font-bold text-[#e2d8c3]">
                                        {item.name}
                                      </h5>
                                      <p className="text-[11px] text-[#a0907a] line-clamp-1 max-w-md">
                                        {item.desc || 'Açıklama girilmedi.'}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Price Tag & Actions */}
                                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-[#1f1914] pt-2 sm:pt-0">
                                    <span className="text-sm font-bold text-[#c8a165] bg-[#16120f] px-3 py-1 rounded-xl border border-[#3a2e26]">
                                      {item.price}
                                    </span>

                                    <div className="flex items-center gap-1.5">
                                      <button
                                        onClick={() => handleOpenProdModal(category.id, sub.id, item)}
                                        className="p-2 bg-[#1f1914] border border-[#3a2e26] hover:border-[#c8a165] text-[#c8a165] rounded-xl text-xs cursor-pointer"
                                        title="Ürünü Düzenle"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm(`"${item.name}" ürününü silmek istediğinize emin misiniz?`)) {
                                            onDeleteProduct(category.id, item.id);
                                          }
                                        }}
                                        className="p-2 bg-red-950/40 border border-red-900/40 hover:border-red-600 text-red-400 rounded-xl text-xs cursor-pointer"
                                        title="Ürünü Sil"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                </div>
                              ))
                            )}
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* SUBCATEGORY MODAL - RENDERED VIA PORTAL DIRECTLY ON BODY (SCREEN CENTERED) */}
      {subCatModal.open && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#16120f] border border-[#c8a165]/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-zoom-in"
          >
            <div className="flex items-center justify-between border-b border-[#3a2e26] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#e2d8c3]">
                {subCatModal.subCategory ? 'Alt Kategoriyi Düzenle' : 'Yeni Alt Kategori Ekle'}
              </h3>
              <button onClick={() => setSubCatModal({ open: false, categoryId: '', subCategory: null })} className="text-[#a0907a] hover:text-[#e2d8c3] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubCatSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#c8a165] uppercase mb-1">Alt Kategori İsim / Başlık *</label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={subCatTitle}
                  onChange={(e) => setSubCatTitle(e.target.value)}
                  placeholder="Örn: PREMIUM TÜTÜNLER"
                  className="w-full px-4 py-3 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#3a2e26]">
                <button type="button" onClick={() => setSubCatModal({ open: false, categoryId: '', subCategory: null })} className="px-4 py-2 bg-[#1f1914] text-[#a0907a] text-xs rounded-xl cursor-pointer">
                  İptal
                </button>
                <button type="submit" className="px-5 py-2 bg-[#c8a165] text-[#0d0a08] font-bold text-xs rounded-xl cursor-pointer">
                  Alt Kategoriyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* PRODUCT MODAL - RENDERED VIA PORTAL DIRECTLY ON BODY (SCREEN CENTERED) */}
      {productModal.open && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#16120f] border border-[#c8a165]/50 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar animate-zoom-in"
          >
            <div className="flex items-center justify-between border-b border-[#3a2e26] pb-3">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-[#c8a165]" />
                <h3 className="font-serif text-lg font-bold text-[#e2d8c3]">
                  {productModal.product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                </h3>
              </div>
              <button onClick={() => setProductModal({ open: false, categoryId: '', subCategoryId: '', product: null })} className="text-[#a0907a] hover:text-[#e2d8c3] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              
              {/* Category & Subcategory Info Display */}
              <div className="p-3 bg-[#0d0a08] rounded-xl border border-[#2a221b] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#a0907a]">Kategori: </span>
                  <strong className="text-[#c8a165]">
                    {categories.find(c => c.id === productModal.categoryId)?.title}
                  </strong>
                </div>
                <div>
                  <label className="text-[#a0907a] mr-2">Alt Kategori:</label>
                  <select
                    value={prodSubCatId}
                    onChange={(e) => setProdSubCatId(e.target.value)}
                    className="bg-[#16120f] border border-[#3a2e26] text-[#c8a165] font-bold px-2 py-1 rounded-lg text-xs outline-none"
                  >
                    {categories.find(c => c.id === productModal.categoryId)?.subCategories?.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#c8a165] uppercase mb-1">Ürün Adı *</label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Örn: EKMEK ÜSTÜ KAHVALTI"
                  className="w-full px-4 py-2.5 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#c8a165] uppercase mb-1">Fiyat (₺) *</label>
                <input
                  type="text"
                  required
                  value={prodPrice}
                  onChange={(e) => setProdPrice(e.target.value)}
                  placeholder="Örn: 300,00 ₺"
                  className="w-full px-4 py-2.5 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#c8a165] uppercase mb-1">Ürün Açıklaması</label>
                <textarea
                  rows={2}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Malzemeleri ve içerik detayını girin..."
                  className="w-full px-4 py-2.5 bg-[#0d0a08] border border-[#3a2e26] focus:border-[#c8a165] rounded-xl text-xs text-[#e2d8c3] outline-none"
                />
              </div>

              {/* LOCAL COMPUTER FILE UPLOADER FOR PRODUCT IMAGE */}
              <FileUploader
                label="Ürün Görsel Dosyası (Bilgisayardan Seçin)"
                accept="image/*"
                currentValue={prodImg}
                onChange={(dataUrl) => setProdImg(dataUrl)}
                mediaType="image"
                description="Bilgisayarınızdan ürün resmi seçin"
              />

              <div className="flex justify-end gap-3 pt-3 border-t border-[#3a2e26]">
                <button type="button" onClick={() => setProductModal({ open: false, categoryId: '', subCategoryId: '', product: null })} className="px-4 py-2 bg-[#1f1914] text-[#a0907a] text-xs rounded-xl cursor-pointer">
                  İptal
                </button>
                <button type="submit" className="px-5 py-2 bg-[#c8a165] text-[#0d0a08] font-bold text-xs rounded-xl cursor-pointer">
                  Ürünü Kaydet
                </button>
              </div>

            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
