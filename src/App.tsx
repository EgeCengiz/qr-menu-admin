import { useState, useEffect, useCallback } from 'react';
import type { Category, WelcomeMedia, AdminUser, MenuItem, SubCategory, StoreSettings } from './types/admin';
import {
  apiGetCategories,
  apiCreateCategory,
  apiUpdateCategory,
  apiDeleteCategory,
  apiReorderCategories,
  apiCreateSubCategory,
  apiUpdateSubCategory,
  apiDeleteSubCategory,
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProduct,
  apiReorderProducts,
  apiGetWelcome,
  apiUpdateWelcome,
  apiGetSettings,
  apiUpdateSettings,
} from './api/apiClient';
import { Login } from './components/Login';
import { Navbar } from './components/Navbar';
import { WelcomeManager } from './components/WelcomeManager';
import { MenuTreeManager } from './components/MenuTreeManager';
import { CategoryEditorPage } from './components/CategoryEditorPage';
import { StoreSettingsManager } from './components/StoreSettingsManager';

// ─── Helper: map API response → local Category type ──────────────────────────
function mapApiCategory(raw: Record<string, unknown>): Category {
  const rawItems = Array.isArray(raw.items) ? (raw.items as Record<string, unknown>[]) : [];
  const rawSubs = Array.isArray(raw.subCategories) ? (raw.subCategories as Record<string, unknown>[]) : [];

  return {
    id: raw.id as string,
    num: raw.num as string,
    title: raw.title as string,
    subtitle: raw.subtitle as string,
    img: raw.img as string,
    position: raw.position as number,
    videoUrl: raw.videoUrl as string | undefined,
    itemCount: raw.itemCount as string,
    subCategories: rawSubs.map((s) => {
      const fullId = s.id as string;
      const shortId = (s.shortId as string) || (fullId.includes('__') ? fullId.split('__')[1] : fullId);
      return {
        id: shortId,
        title: s.title as string,
        itemCount: s.itemCount as string,
      };
    }),
    items: rawItems.map((item) => {
      const subIdRaw = (item.subCategory as string) || (item.subCategoryId as string) || undefined;
      const subIdClean = subIdRaw ? (subIdRaw.includes('__') ? subIdRaw.split('__')[1] : subIdRaw) : undefined;
      return {
        id: item.id as number,
        name: item.name as string,
        desc: item.desc as string,
        price: item.price as string,
        img: item.img as string,
        subCategory: subIdClean,
        tags: Array.isArray(item.tags) ? (item.tags as string[]) : [],
        isAvailable: item.isAvailable as boolean,
      };
    }),
  };
}

function getStoredUser(): AdminUser | null {
  try {
    const token = localStorage.getItem('hookahlab_jwt_token');
    const userStr = localStorage.getItem('hookahlab_admin_user');
    if (token && userStr) return JSON.parse(userStr) as AdminUser;
  } catch {
    // ignore
  }
  return null;
}

export function App() {
  const [user, setUser] = useState<AdminUser | null>(getStoredUser());
  const [activeTab, setActiveTab] = useState<'menuTree' | 'welcome' | 'storeSettings'>('menuTree');
  const [categories, setCategories] = useState<Category[]>([]);
  const [welcomeMedia, setWelcomeMedia] = useState<WelcomeMedia | null>(null);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Full-page Category Editor state
  const [categoryToEdit, setCategoryToEdit] = useState<{ category: Category | null; isEditing: boolean }>({
    category: null,
    isEditing: false,
  });

  // ── Fetch categories from API ────────────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const data = (await apiGetCategories()) as Record<string, unknown>[];
      setCategories(data.map(mapApiCategory));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Kategoriler yüklenemedi';
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Fetch welcome from API ───────────────────────────────────────────────────
  const fetchWelcome = useCallback(async () => {
    try {
      const data = (await apiGetWelcome()) as WelcomeMedia;
      setWelcomeMedia(data);
    } catch {
      // silent
    }
  }, []);

  // ── Fetch store settings from API ─────────────────────────────────────────────
  const fetchStoreSettings = useCallback(async () => {
    try {
      const data = (await apiGetSettings()) as StoreSettings;
      setStoreSettings(data);
    } catch {
      // silent
    }
  }, []);

  // Load data on login
  useEffect(() => {
    if (user) {
      void fetchCategories();
      void fetchWelcome();
      void fetchStoreSettings();
    }
  }, [user, fetchCategories, fetchWelcome, fetchStoreSettings]);

  const handleLoginSuccess = (username: string, token: string) => {
    const newUser: AdminUser = {
      username,
      token,
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem('hookahlab_admin_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('hookahlab_jwt_token');
    localStorage.removeItem('hookahlab_admin_user');
    setUser(null);
    setCategories([]);
    setWelcomeMedia(null);
    setStoreSettings(null);
  };

  const handleResetDefaults = () => {
    // Not applicable for API-backed data
    if (confirm('Bu işlem kategorileri listeyi yeniden API\'den yükler.')) {
      void fetchCategories();
      void fetchWelcome();
      void fetchStoreSettings();
    }
  };

  // ── Category Operations ──────────────────────────────────────────────────────
  const handleSaveCategory = async (updatedCat: Category) => {
    try {
      const existing = categories.find((c) => c.id === updatedCat.id);
      if (existing) {
        await apiUpdateCategory(updatedCat.id, {
          num: updatedCat.num,
          title: updatedCat.title,
          subtitle: updatedCat.subtitle,
          img: updatedCat.img,
          position: updatedCat.position,
          videoUrl: updatedCat.videoUrl ?? null,
        });
      } else {
        await apiCreateCategory({
          id: updatedCat.id,
          num: updatedCat.num,
          title: updatedCat.title,
          subtitle: updatedCat.subtitle,
          img: updatedCat.img,
          position: updatedCat.position,
          videoUrl: updatedCat.videoUrl ?? null,
        });
      }
      await fetchCategories();
    } catch (err) {
      alert(`Hata: ${err instanceof Error ? err.message : 'Kategori kaydedilemedi'}`);
    }
    setCategoryToEdit({ category: null, isEditing: false });
  };

  const handleDeleteCategory = async (catId: string) => {
    try {
      await apiDeleteCategory(catId);
      await fetchCategories();
    } catch (err) {
      alert(`Hata: ${err instanceof Error ? err.message : 'Kategori silinemedi'}`);
    }
  };

  const handleReorderCategories = async (newOrderedCats: Category[]) => {
    const reorderItems = newOrderedCats.map((cat, idx) => ({
      id: cat.id,
      position: idx + 1,
    }));
    try {
      await apiReorderCategories(reorderItems);
      setCategories(newOrderedCats.map((cat, idx) => ({ ...cat, position: idx + 1 })));
    } catch (err) {
      alert(`Hata: ${err instanceof Error ? err.message : 'Sıralama güncellenemedi'}`);
    }
  };

  // ── Sub Category Operations ──────────────────────────────────────────────────
  const handleSaveSubCategory = async (categoryId: string, subCat: SubCategory) => {
    try {
      const cat = categories.find((c) => c.id === categoryId);
      const existingSub = cat?.subCategories?.find((s) => s.id === subCat.id || s.id === `${categoryId}__${subCat.id}`);

      if (existingSub) {
        // Update — find composite id
        const compositeId = existingSub.id.includes('__') ? existingSub.id : `${categoryId}__${existingSub.id}`;
        await apiUpdateSubCategory(categoryId, compositeId, { title: subCat.title });
      } else {
        await apiCreateSubCategory(categoryId, { id: subCat.id, title: subCat.title, position: 0 });
      }
      await fetchCategories();
    } catch (err) {
      alert(`Hata: ${err instanceof Error ? err.message : 'Alt kategori kaydedilemedi'}`);
    }
  };

  const handleDeleteSubCategory = async (categoryId: string, subCategoryId: string) => {
    try {
      // subCategoryId may already be composite or short
      const compositeId = subCategoryId.includes('__') ? subCategoryId : `${categoryId}__${subCategoryId}`;
      await apiDeleteSubCategory(categoryId, compositeId);
      await fetchCategories();
    } catch (err) {
      alert(`Hata: ${err instanceof Error ? err.message : 'Alt kategori silinemedi'}`);
    }
  };

  // ── Product Operations ───────────────────────────────────────────────────────
  const handleSaveProduct = async (categoryId: string, product: MenuItem) => {
    try {
      const cat = categories.find((c) => c.id === categoryId);
      const existingProduct = cat?.items?.find((i) => i.id === product.id);

      // Resolve subCategoryId: find the composite id from the short subCategory slug
      let subCategoryId: string | undefined;
      if (product.subCategory) {
        const matchedSub = cat?.subCategories?.find(
          (s) => s.id === product.subCategory || s.id === `${categoryId}__${product.subCategory}`,
        );
        subCategoryId = matchedSub ? (matchedSub.id.includes('__') ? matchedSub.id : `${categoryId}__${matchedSub.id}`) : `${categoryId}__${product.subCategory}`;
      }

      const payload = {
        name: product.name,
        desc: product.desc,
        price: product.price,
        img: product.img,
        tags: product.tags ?? [],
        isAvailable: product.isAvailable ?? true,
        subCategoryId: subCategoryId ?? null,
      };

      if (existingProduct) {
        await apiUpdateProduct(categoryId, product.id, payload);
      } else {
        await apiCreateProduct(categoryId, payload);
      }
      await fetchCategories();
    } catch (err) {
      alert(`Hata: ${err instanceof Error ? err.message : 'Ürün kaydedilemedi'}`);
    }
  };

  const handleDeleteProduct = async (categoryId: string, productId: number) => {
    try {
      await apiDeleteProduct(categoryId, productId);
      await fetchCategories();
    } catch (err) {
      alert(`Hata: ${err instanceof Error ? err.message : 'Ürün silinemedi'}`);
    }
  };

  const handleReorderProducts = async (categoryId: string, reorderedProducts: MenuItem[]) => {
    // Optimistic UI update
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, items: reorderedProducts } : cat)),
    );
    try {
      const itemsToReorder = reorderedProducts.map((p, idx) => ({
        id: p.id,
        position: idx,
      }));
      await apiReorderProducts(itemsToReorder);
    } catch (err) {
      alert(`Hata: ${err instanceof Error ? err.message : 'Ürün sıralaması kaydedilemedi'}`);
      await fetchCategories();
    }
  };

  // ── Welcome Media ────────────────────────────────────────────────────────────
  const handleSaveWelcome = async (updated: WelcomeMedia) => {
    await apiUpdateWelcome(updated);
    setWelcomeMedia(updated);
  };

  // ── Store Settings ───────────────────────────────────────────────────────────
  const handleSaveStoreSettings = async (updated: StoreSettings) => {
    await apiUpdateSettings(updated);
    setStoreSettings(updated);
  };

  const totalCategoriesCount = categories.length;
  const totalProductsCount = categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);

  // If user is not logged in, render Login screen
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#0d0a08] bg-waves text-[#e2d8c3] selection:bg-[#c8a165] selection:text-[#0d0a08]">
      
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setCategoryToEdit({ category: null, isEditing: false });
        }}
        onLogout={handleLogout}
        onResetDefaults={handleResetDefaults}
        totalCategories={totalCategoriesCount}
        totalProducts={totalProductsCount}
        username={user.username}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* API Error Banner */}
        {apiError && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/40 text-red-300 text-sm flex items-center justify-between">
            <span>⚠️ {apiError}</span>
            <button
              onClick={() => void fetchCategories()}
              className="ml-4 text-xs underline hover:text-red-200"
            >
              Yeniden dene
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-16 gap-3">
            <div className="w-6 h-6 border-2 border-[#c8a165] border-t-transparent rounded-full animate-spin" />
            <span className="text-[#a0907a] text-sm">Veriler yükleniyor...</span>
          </div>
        )}

        {/* Render Full Page Category Editor View when triggered */}
        {!isLoading && categoryToEdit.isEditing ? (
          <CategoryEditorPage
            category={categoryToEdit.category}
            totalCategoriesCount={totalCategoriesCount}
            onSave={handleSaveCategory}
            onBack={() => setCategoryToEdit({ category: null, isEditing: false })}
          />
        ) : (
          !isLoading && (
            <>
              {activeTab === 'menuTree' && (
                <MenuTreeManager
                  categories={categories}
                  onOpenCategoryEditor={(cat) => setCategoryToEdit({ category: cat, isEditing: true })}
                  onDeleteCategory={handleDeleteCategory}
                  onReorderCategories={handleReorderCategories}
                  onSaveProduct={handleSaveProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onReorderProducts={handleReorderProducts}
                  onSaveSubCategory={handleSaveSubCategory}
                  onDeleteSubCategory={handleDeleteSubCategory}
                />
              )}

              {activeTab === 'welcome' && welcomeMedia && (
                <WelcomeManager
                  welcomeMedia={welcomeMedia}
                  onSave={handleSaveWelcome}
                />
              )}

              {activeTab === 'storeSettings' && (
                <StoreSettingsManager
                  settings={
                    storeSettings || {
                      storeName: 'HOOKAHLAB RİZE',
                      title: 'Bize uğrayın.',
                      addressLine1: 'Çarşı Mahallesi, TOKİ AVM',
                      addressLine2: 'Merkez / Rize',
                      workingHours: 'Her gün 08:30 – 00:00',
                      breakfastWeekdays: 'Hafta içi 08:30–15:00',
                      breakfastWeekends: 'Hafta sonu 08:30–16:00',
                      phone: '05513832509',
                      phoneDisplay: '0 551 383 25 09',
                      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=HookahLab+Rize+TOK%C4%B0+AVM',
                      note: 'Resmî tatillerde çalışma saatleri değişebilir.',
                    }
                  }
                  onSave={handleSaveStoreSettings}
                />
              )}
            </>
          )
        )}

      </main>

    </div>
  );
}


export default App;
