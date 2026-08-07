export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: string;
  partNumber: string; // e.g. "DM-10492" or OEM code "58101-2EA10"
  oemCode?: string; // Original Equipment Manufacturer Code
  nameFa: string; // e.g. "لنت ترمز جلو تکستار"
  nameEn?: string; // e.g. "Textar Front Brake Pads"
  category: string; // e.g. "ترمز و ایمنی"
  carModel: string; // e.g. "پژو 206 تیپ 5 / 207"
  brand: string; // e.g. "تکستار (Textar)", "ایساکو", "عظام"
  origin: string; // e.g. "فرانسه", "ایران", "کره جنوبی"
  price: number; // Price in Toman (تومان)
  stockStatus: StockStatus;
  stockQuantity: number;
  description: string;
  imageUrl: string;
  isOriginal: boolean; // ضمانت اصالت کالا
  warrantyMonths?: number;
  updatedAt: string;
}

export interface Category {
  id: string;
  titleFa: string;
  titleEn: string;
  iconName: string;
  count?: number;
}

export interface CarModel {
  id: string;
  name: string;
  brand: string; // e.g. "ایران خودرو", "سایپا", "رنو", "هیوندای"
  iconUrl?: string;
}

export interface PriceInquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  carModel: string;
  partNameOrCode: string;
  notes?: string;
  status: 'pending' | 'responded' | 'archived';
  createdAt: string;
}

export interface QuickUpdatePayload {
  id: string;
  price?: number;
  stockQuantity?: number;
  stockStatus?: StockStatus;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  carModel: string;
  stockOnly: boolean;
  originalOnly: boolean;
  sortBy: 'popular' | 'price_asc' | 'price_desc' | 'newest';
}

export interface AdminUser {
  username: string;
  token: string;
  name: string;
  role: string;
}
