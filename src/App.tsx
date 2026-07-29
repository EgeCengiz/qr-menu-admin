import { useState, useEffect } from 'react';
import type { Category, WelcomeMedia, AdminUser, MenuItem, SubCategory } from './types/admin';
import {
  loadCategories,
  saveCategories,
  loadWelcomeMedia,
  saveWelcomeMedia,
  resetToDefaults,
  getStoredUser,
  setStoredUser,
} from './data/mockAdminData';
import { Login } from './components/Login';
import { Navbar } from './components/Navbar';
import { WelcomeManager } from './components/WelcomeManager';
import { MenuTreeManager } from './components/MenuTreeManager';
import { CategoryEditorPage } from './components/CategoryEditorPage';

export function App() {
  const [user, setUser] = useState<AdminUser | null>(getStoredUser());
  const [activeTab, setActiveTab] = useState<'menuTree' | 'welcome'>('menuTree');
  const [categories, setCategories] = useState<Category[]>(loadCategories());
  const [welcomeMedia, setWelcomeMedia] = useState<WelcomeMedia>(loadWelcomeMedia());

  // Full-page Category Editor state (null = list view, object = editing, { isNew: true } = adding new)
  const [categoryToEdit, setCategoryToEdit] = useState<{ category: Category | null; isEditing: boolean }>({
    category: null,
    isEditing: false,
  });

  // Sync categories to localStorage whenever they change
  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  // Sync welcomeMedia to localStorage whenever it changes
  useEffect(() => {
    saveWelcomeMedia(welcomeMedia);
  }, [welcomeMedia]);

  const handleLoginSuccess = (username: string) => {
    const newUser: AdminUser = {
      username,
      token: 'demo-token-' + Date.now(),
      loginTime: new Date().toISOString(),
    };
    setStoredUser(newUser);
    setUser(newUser);
  };

  const handleLogout = () => {
    setStoredUser(null);
    setUser(null);
  };

  const handleResetDefaults = () => {
    if (confirm('Tüm mock verileri ve ayarları başlangıç durumuna sıfırlamak istediğinize emin misiniz?')) {
      const { categories: defCats, welcomeMedia: defMedia } = resetToDefaults();
      setCategories(defCats);
      setWelcomeMedia(defMedia);
      setCategoryToEdit({ category: null, isEditing: false });
    }
  };

  // Category Operations
  const handleSaveCategory = (updatedCat: Category) => {
    setCategories((prevCats) => {
      const existingIdx = prevCats.findIndex((c) => c.id === updatedCat.id);
      if (existingIdx >= 0) {
        const copy = [...prevCats];
        copy[existingIdx] = updatedCat;
        return copy.sort((a, b) => a.position - b.position);
      } else {
        return [...prevCats, updatedCat].sort((a, b) => a.position - b.position);
      }
    });
    setCategoryToEdit({ category: null, isEditing: false });
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
  };

  const handleReorderCategories = (newOrderedCats: Category[]) => {
    setCategories(newOrderedCats);
  };

  // Subcategory Operations
  const handleSaveSubCategory = (categoryId: string, subCat: SubCategory) => {
    setCategories((prevCats) => {
      return prevCats.map((cat) => {
        if (cat.id !== categoryId) return cat;

        const existingSubs = cat.subCategories || [];
        const subIdx = existingSubs.findIndex((s) => s.id === subCat.id);

        let newSubs;
        if (subIdx >= 0) {
          newSubs = [...existingSubs];
          newSubs[subIdx] = subCat;
        } else {
          newSubs = [...existingSubs, subCat];
        }

        return {
          ...cat,
          subCategories: newSubs,
        };
      });
    });
  };

  const handleDeleteSubCategory = (categoryId: string, subCategoryId: string) => {
    setCategories((prevCats) => {
      return prevCats.map((cat) => {
        if (cat.id !== categoryId) return cat;

        const newSubs = (cat.subCategories || []).filter((s) => s.id !== subCategoryId);
        const newItems = (cat.items || []).filter((i) => i.subCategory !== subCategoryId);

        return {
          ...cat,
          subCategories: newSubs,
          items: newItems,
          itemCount: `${newItems.length} ÜRÜN`,
        };
      });
    });
  };

  // Product Operations
  const handleSaveProduct = (categoryId: string, product: MenuItem) => {
    setCategories((prevCats) => {
      return prevCats.map((cat) => {
        if (cat.id !== categoryId) return cat;

        const existingItems = cat.items || [];
        const itemIdx = existingItems.findIndex((i) => i.id === product.id);

        let newItems;
        if (itemIdx >= 0) {
          newItems = [...existingItems];
          newItems[itemIdx] = product;
        } else {
          newItems = [product, ...existingItems];
        }

        return {
          ...cat,
          items: newItems,
          itemCount: `${newItems.length} ÜRÜN`,
        };
      });
    });
  };

  const handleDeleteProduct = (categoryId: string, productId: number) => {
    setCategories((prevCats) => {
      return prevCats.map((cat) => {
        if (cat.id !== categoryId) return cat;
        const newItems = (cat.items || []).filter((i) => i.id !== productId);
        return {
          ...cat,
          items: newItems,
          itemCount: `${newItems.length} ÜRÜN`,
        };
      });
    });
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
        
        {/* Render Full Page Category Editor View when triggered */}
        {categoryToEdit.isEditing ? (
          <CategoryEditorPage
            category={categoryToEdit.category}
            totalCategoriesCount={totalCategoriesCount}
            onSave={handleSaveCategory}
            onBack={() => setCategoryToEdit({ category: null, isEditing: false })}
          />
        ) : (
          <>
            {activeTab === 'menuTree' && (
              <MenuTreeManager
                categories={categories}
                onOpenCategoryEditor={(cat) => setCategoryToEdit({ category: cat, isEditing: true })}
                onDeleteCategory={handleDeleteCategory}
                onReorderCategories={handleReorderCategories}
                onSaveProduct={handleSaveProduct}
                onDeleteProduct={handleDeleteProduct}
                onSaveSubCategory={handleSaveSubCategory}
                onDeleteSubCategory={handleDeleteSubCategory}
              />
            )}

            {activeTab === 'welcome' && (
              <WelcomeManager
                welcomeMedia={welcomeMedia}
                onSave={(updated) => setWelcomeMedia(updated)}
              />
            )}
          </>
        )}

      </main>

    </div>
  );
}

export default App;
