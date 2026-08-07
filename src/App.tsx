import React, { useState, useEffect } from 'react';
import { Product, AdminUser, FilterState } from './types';
import { fetchProducts } from './api/client';
import { INITIAL_CATEGORIES, INITIAL_CAR_MODELS } from './data/initialProducts';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FilterBar } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { Package, RefreshCw, LayoutDashboard, Store, PhoneCall } from 'lucide-react';

export default function App() {
  // Navigation & View Mode
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Store Products Data
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    carModel: 'all',
    stockOnly: false,
    originalOnly: false,
    sortBy: 'popular',
  });

  // Modal States
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Load products on mount and when filters change
  useEffect(() => {
    loadStoreProducts();
  }, [filters]);

  const loadStoreProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts(filters);
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      carModel: 'all',
      stockOnly: false,
      originalOnly: false,
      sortBy: 'popular',
    });
  };

  // If viewing Admin Dashboard Project
  if (isAdminView && adminUser) {
    return (
      <div className="min-h-screen bg-[#0b0f17] text-slate-100 font-['Vazirmatn']">
        {/* Project Context Bar */}
        <div className="bg-sky-500/10 border-b border-sky-500/20 px-4 py-1.5 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="font-bold text-sky-300">بخش ادمین و انبارداری (پنل مدیریت)</span>
          </div>
          <button
            onClick={() => setIsAdminView(false)}
            className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold"
          >
            <Store className="w-3.5 h-3.5" />
            <span>مشاهده بخش خریداران (فروشگاه)</span>
          </button>
        </div>

        <AdminDashboard
          onLogout={() => {
            setAdminUser(null);
            setIsAdminView(false);
          }}
          onViewStorefront={() => setIsAdminView(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 font-['Vazirmatn'] flex flex-col selection:bg-sky-500/30 selection:text-sky-200 pb-16 md:pb-0">
      
      {/* Top Project Selector Notice */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 flex justify-between items-center text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold text-slate-300">بخش خریداران (کاتالوگ فروشگاه)</span>
        </div>
        <button
          onClick={() => {
            if (adminUser) {
              setIsAdminView(true);
            } else {
              setIsAdminLoginModalOpen(true);
            }
          }}
          className="flex items-center gap-1 text-sky-400 hover:underline font-semibold"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>ورود به بخش مدیریت و انبارداری</span>
        </button>
      </div>

      {/* Header Navbar */}
      <Navbar
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
        onOpenAdminModal={() => setIsAdminLoginModalOpen(true)}
        adminUser={adminUser}
        onLogoutAdmin={() => {
          setAdminUser(null);
          setIsAdminView(false);
        }}
        onToggleAdminView={() => setIsAdminView(!isAdminView)}
        isAdminView={isAdminView}
      />

      {/* Main Content */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <HeroSection />

        {/* Store Catalog Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
          
          {/* Unified Practical Filter Bar */}
          <FilterBar
            categories={INITIAL_CATEGORIES}
            carModels={INITIAL_CAR_MODELS}
            selectedCategory={filters.category}
            selectedCarModel={filters.carModel}
            searchQuery={filters.searchQuery}
            stockOnly={filters.stockOnly}
            sortBy={filters.sortBy}
            totalResultsCount={products.length}
            onCategoryChange={(catId) => setFilters((prev) => ({ ...prev, category: catId }))}
            onCarModelChange={(modelName) => setFilters((prev) => ({ ...prev, carModel: modelName }))}
            onSearchChange={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
            onStockOnlyChange={(val) => setFilters((prev) => ({ ...prev, stockOnly: val }))}
            onSortByChange={(sort) => setFilters((prev) => ({ ...prev, sortBy: sort }))}
            onResetFilters={handleResetFilters}
          />

          {/* Products Grid */}
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-7 h-7 text-sky-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400">در حال دریافت و بروزرسانی لیست قطعات...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={(p) => setSelectedProductDetail(p)}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-slate-900 rounded-xl border border-slate-800 space-y-3 max-w-md mx-auto p-6 shadow-md">
              <Package className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">قطعه‌ای با فیلترهای انتخابی یافت نشد</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ممکن است این قطعه به تازگی به انبار اضافه شده باشد. جهت استعلام تلفنی و ثبت سفارش با دفتر فروش تماس بگیرید.
              </p>
              <div className="pt-1 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
                >
                  پاک کردن همه فیلترها
                </button>
                <a
                  href="tel:02156890790"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>تماس با فروشگاه: 021-56890790</span>
                </a>
              </div>
            </div>
          )}

        </section>

      </main>

      {/* Floating Call Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 p-2.5 backdrop-blur-md shadow-2xl flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400">سفارش و استعلام تلفنی:</span>
          <span className="text-sm font-extrabold text-sky-400 font-mono ltr-num">021-56890790</span>
        </div>
        <a
          href="tel:02156890790"
          className="flex-1 min-h-[44px] rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-extrabold shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <PhoneCall className="w-4 h-4" />
          <span>تماس مستقیم با فروشگاه</span>
        </a>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
      />

      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccess={(user) => {
          setAdminUser(user);
          setIsAdminView(true);
        }}
      />

    </div>
  );
}


