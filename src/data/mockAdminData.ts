import type { Category, WelcomeMedia } from '../types/admin';

export const DEFAULT_WELCOME_MEDIA: WelcomeMedia = {
  videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-smoke-background-in-dark-room-41566-large.mp4',
  posterImg: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=800',
  title: 'HOOKAHLAB LOUNGE & CAFE',
  subtitle: 'PREMIUM QR MENU EXPERIENCE',
  durationSeconds: 4,
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'nargileler',
    num: '01',
    title: 'Nargileler',
    subtitle: 'ÖZEL HARMAN & MAŞA SANATI',
    position: 1,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-smoke-background-in-dark-room-41566-large.mp4',
    img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=800',
    subCategories: [
      { id: 'premium-tütünler', title: 'PREMIUM TÜTÜNLER' },
      { id: 'klasik-nargileler', title: 'KLASİK NARGİLELER' },
      { id: 'special-meyveli', title: 'SPECIAL MEYVELİ' }
    ],
    items: [
      {
        id: 101,
        subCategory: 'premium-tütünler',
        name: 'HOOKAHLAB ROYAL TOUCH',
        desc: 'Özel narenciye harmanı, buzlu Marpuç, taze nane dokunuşları ve altın yaprak aroması ile',
        price: '480,00 ₺',
        img: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=400',
        tags: ['Şefin Seçimi', 'Popüler'],
        isAvailable: true
      },
      {
        id: 102,
        subCategory: 'klasik-nargileler',
        name: 'ÇİFT ELMA & NANE',
        desc: 'Geleneksel anason harmanı, soğuk su kapsülü ve yoğun duman aroması',
        price: '380,00 ₺',
        img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=400',
        isAvailable: true
      },
      {
        id: 103,
        subCategory: 'special-meyveli',
        name: 'ANANAS KAFALI SPECIAL',
        desc: 'Gerçek taze ananas lüle üzerinde tropikal meyve mixi ve özel şerbet',
        price: '650,00 ₺',
        img: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&q=80&w=400',
        tags: ['VIP Special'],
        isAvailable: true
      }
    ]
  },
  {
    id: 'kahvalti',
    num: '02',
    title: 'Kahvaltı',
    subtitle: 'GÜNE İYİ BAŞLA',
    position: 2,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-pouring-sauce-on-a-plate-42994-large.mp4',
    img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=800',
    subCategories: [
      { id: 'kahvaltilar', title: 'KAHVALTILAR' },
      { id: 'extra-kahvalti', title: 'EXTRA KAHVALTI' }
    ],
    items: [
      {
        id: 201,
        subCategory: 'kahvaltilar',
        name: 'SERPME KAHVALTI (2 KİŞİLİK)',
        desc: 'Ezine peyniri, bal-kaymak, organik reçeller, sahanda yumurta, sıcak pişiler, kolot mıhlaması ve sınırsız çay',
        price: '900,00 ₺',
        img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=400',
        tags: ['En Çok Satan'],
        isAvailable: true
      },
      {
        id: 202,
        subCategory: 'kahvaltilar',
        name: 'EKMEK ÜSTÜ AVOKADO & MOZZARELLA',
        desc: 'Ekşi mayalı ekmek üzerine taze avokado ezmesi, çeri domates, pesto sos ve parmak patates',
        price: '320,00 ₺',
        img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400',
        isAvailable: true
      },
      {
        id: 203,
        subCategory: 'extra-kahvalti',
        name: 'TRABZON KOLOT MİHLAMASI',
        desc: 'Yayla tereyağı, özel mısır unu ve uzayan Karadeniz kolot peyniri',
        price: '280,00 ₺',
        img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400',
        tags: ['Yöresel'],
        isAvailable: true
      }
    ]
  },
  {
    id: 'imza-kokteyller',
    num: '03',
    title: 'İmza Kokteyller',
    subtitle: 'SOĞUK DOKUNUŞLAR & FERAH SERİ',
    position: 3,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-a-cocktail-into-a-glass-41560-large.mp4',
    img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
    subCategories: [
      { id: 'alkolsuz-imza', title: 'ALKOLSÜZ İMZA' },
      { id: 'frozen-smoothie', title: 'FROZEN & SMOOTHIE' }
    ],
    items: [
      {
        id: 301,
        subCategory: 'alkolsuz-imza',
        name: 'HOOKAH DRAGON MOJITO',
        desc: 'Ejder meyvesi özü, taze nane, misket limonu, gazlı su ve kıran buz sunumu ile',
        price: '240,00 ₺',
        img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400',
        tags: ['Favori'],
        isAvailable: true
      },
      {
        id: 302,
        subCategory: 'frozen-smoothie',
        name: 'ORMAN MEYVELİ FROZEN',
        desc: 'Böğürtlen, frambuaz, çilek ezmesi ve kıran buzlu serinletici lezzet',
        price: '220,00 ₺',
        img: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&q=80&w=400',
        isAvailable: true
      }
    ]
  },
  {
    id: 'tatlilar',
    num: '04',
    title: 'Taze Tatlılar',
    subtitle: 'ŞEFİN ÖZEL REÇETELERİ',
    position: 4,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-melting-chocolate-on-a-cake-43003-large.mp4',
    img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800',
    subCategories: [
      { id: 'sıcak-tatlılar', title: 'SICAK TATLILAR' },
      { id: 'soğuk-pasta', title: 'SOĞUK PASTALAR' }
    ],
    items: [
      {
        id: 401,
        subCategory: 'sıcak-tatlılar',
        name: 'BELÇİKA ÇİKOLATALI SOUFFLE',
        desc: 'Akışkan sıcak Belçika çikolatası, vanilyalı Maraş dondurması ile',
        price: '260,00 ₺',
        img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400',
        tags: ['Sıcak Sunum'],
        isAvailable: true
      },
      {
        id: 402,
        subCategory: 'soğuk-pasta',
        name: 'SAN SEBASTIAN CHEESECAKE',
        desc: 'Karankaya yanık peynirli cheesecake, eritilmiş sıcak sütlü çikolata eşliğinde',
        price: '290,00 ₺',
        img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=400',
        tags: ['Gurme'],
        isAvailable: true
      }
    ]
  }
];

// LocalStorage Keys
const STORAGE_KEY_CATEGORIES = 'hookahlab_admin_categories';
const STORAGE_KEY_WELCOME = 'hookahlab_admin_welcome';
const STORAGE_KEY_USER = 'hookahlab_admin_user';

export const loadWelcomeMedia = (): WelcomeMedia => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_WELCOME);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load welcome media', e);
  }
  return DEFAULT_WELCOME_MEDIA;
};

export const saveWelcomeMedia = (media: WelcomeMedia): void => {
  localStorage.setItem(STORAGE_KEY_WELCOME, JSON.stringify(media));
};

export const loadCategories = (): Category[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (saved) {
      const parsed: Category[] = JSON.parse(saved);
      return parsed.sort((a, b) => a.position - b.position);
    }
  } catch (e) {
    console.error('Failed to load categories', e);
  }
  return INITIAL_CATEGORIES.sort((a, b) => a.position - b.position);
};

export const saveCategories = (categories: Category[]): void => {
  const sorted = [...categories].sort((a, b) => a.position - b.position);
  localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(sorted));
};

export const resetToDefaults = (): { categories: Category[]; welcomeMedia: WelcomeMedia } => {
  localStorage.removeItem(STORAGE_KEY_CATEGORIES);
  localStorage.removeItem(STORAGE_KEY_WELCOME);
  return {
    categories: INITIAL_CATEGORIES,
    welcomeMedia: DEFAULT_WELCOME_MEDIA,
  };
};

export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem(STORAGE_KEY_USER);
    if (userStr) return JSON.parse(userStr);
  } catch (e) {
    console.error(e);
  }
  return null;
};

export const setStoredUser = (user: { username: string; token: string } | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY_USER);
  }
};
