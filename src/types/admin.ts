export interface MenuItem {
  id: number;
  name: string;
  desc: string;
  price: string;
  img: string;
  subCategory?: string;
  tags?: string[];
  isAvailable?: boolean;
}

export interface SubCategory {
  id: string;
  title: string;
  itemCount?: string;
}

export interface Category {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  itemCount?: string;
  videoUrl?: string; // Her kategorinin kendine ait GIF/Video medya adresi
  img: string;       // Sabit kapak resmi
  position: number;  // Ana sayfadaki görüntülenme sırası
  subCategories?: SubCategory[];
  items: MenuItem[];
}

export interface WelcomeMedia {
  videoUrl: string;
  posterImg: string;
  title: string;
  subtitle: string;
  durationSeconds: number;
}

export interface AdminUser {
  username: string;
  token: string;
  loginTime: string;
}
