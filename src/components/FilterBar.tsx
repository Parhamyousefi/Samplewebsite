import React from 'react';
import { Search, Filter, X, RotateCcw, Car, Layers, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { Category, CarModel } from '../types';

interface FilterBarProps {
  categories: Category[];
  carModels: CarModel[];
  selectedCategory: string;
  selectedCarModel: string;
  searchQuery: string;
  stockOnly: boolean;
  sortBy: 'popular' | 'price_asc' | 'price_desc' | 'newest';
  totalResultsCount: number;
  onCategoryChange: (catId: string) => void;
  onCarModelChange: (modelName: string) => void;
  onSearchChange: (q: string) => void;
  onStockOnlyChange: (val: boolean) => void;
  onSortByChange: (sort: 'popular' | 'price_asc' | 'price_desc' | 'newest') => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  carModels,
  selectedCategory,
  selectedCarModel,
  searchQuery,
  stockOnly,
  sortBy,
  totalResultsCount,
  onCategoryChange,
  onCarModelChange,
  onSearchChange,
  onStockOnlyChange,
  onSortByChange,
  onResetFilters,
}) => {
  const isAnyFilterActive =
    selectedCategory !== 'all' ||
    selectedCarModel !== 'all' ||
    searchQuery.trim() !== '' ||
    stockOnly;

  // Find active category title
  const activeCategoryTitle =
    selectedCategory === 'all'
      ? 'همه دسته‌ها'
      : categories.find((c) => c.id === selectedCategory)?.titleFa || selectedCategory;

  // Find active car model title
  const activeCarModelTitle =
    selectedCarModel === 'all'
      ? 'همه خودروها'
      : carModels.find((m) => m.name === selectedCarModel || m.id === selectedCarModel)?.name || selectedCarModel;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-5 space-y-4 shadow-lg text-xs font-['Vazirmatn']">
      
      {/* Search & Main Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        
        {/* Search Bar (lg:col-span-4) */}
        <div className="lg:col-span-4 relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجوی نام قطعه، کد OEM یا مدل (مثلاً: لنت، تسمه، 206)..."
            className="w-full min-h-[44px] pr-9 pl-8 bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl border border-slate-800 focus:border-sky-500 focus:outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute left-2.5 p-1 text-slate-400 hover:text-white bg-slate-800 rounded-md transition-colors"
              title="پاک کردن جستجو"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Car Model Selector (lg:col-span-3) */}
        <div className="lg:col-span-3 flex items-center gap-2 bg-slate-950 px-3 min-h-[44px] rounded-xl border border-slate-800">
          <Car className="w-4 h-4 text-sky-400 shrink-0" />
          <select
            value={selectedCarModel}
            onChange={(e) => onCarModelChange(e.target.value)}
            className="w-full bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer py-2 font-medium"
          >
            <option value="all" className="bg-slate-900 text-slate-200">
              انتخاب مدل خودرو (همه خودروها)
            </option>
            {carModels
              .filter((m) => m.id !== 'all')
              .map((m) => (
                <option key={m.id} value={m.name} className="bg-slate-900 text-slate-200">
                  {m.name}
                </option>
              ))}
          </select>
        </div>

        {/* Category Selector (lg:col-span-3) */}
        <div className="lg:col-span-3 flex items-center gap-2 bg-slate-950 px-3 min-h-[44px] rounded-xl border border-slate-800">
          <Layers className="w-4 h-4 text-sky-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer py-2 font-medium"
          >
            <option value="all" className="bg-slate-900 text-slate-200">
              انتخاب دسته‌بندی (همه دسته‌ها)
            </option>
            {categories
              .filter((c) => c.id !== 'all')
              .map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                  {c.titleFa}
                </option>
              ))}
          </select>
        </div>

        {/* Sort Selector (lg:col-span-2) */}
        <div className="lg:col-span-2 flex items-center gap-2 bg-slate-950 px-3 min-h-[44px] rounded-xl border border-slate-800">
          <SlidersHorizontal className="w-4 h-4 text-sky-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as any)}
            className="w-full bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer py-2 font-medium"
          >
            <option value="popular" className="bg-slate-900 text-slate-200">محبوب‌ترین</option>
            <option value="newest" className="bg-slate-900 text-slate-200">جدیدترین</option>
            <option value="price_asc" className="bg-slate-900 text-slate-200">ارزان‌ترین</option>
            <option value="price_desc" className="bg-slate-900 text-slate-200">گران‌ترین</option>
          </select>
        </div>

      </div>

      {/* Bottom Bar: In-Stock Toggle, Results Count & Active Filters summary with Reset Button */}
      <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        <div className="flex items-center gap-3 flex-wrap">
          {/* Toggle stock button */}
          <label
            onClick={() => onStockOnlyChange(!stockOnly)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer select-none text-slate-200 hover:border-slate-700 transition-colors"
          >
            <input
              type="checkbox"
              checked={stockOnly}
              onChange={(e) => onStockOnlyChange(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0 cursor-pointer"
            />
            <span className="text-xs font-semibold">فقط کالاهای موجود در انبار</span>
          </label>

          <span className="text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
            تعداد نتایج: <strong className="text-sky-400 font-bold">{totalResultsCount}</strong> قطعه
          </span>
        </div>

        {/* Active Filters Badges + Reset Button */}
        {isAnyFilterActive && (
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
            <span className="text-[11px] text-slate-400 font-semibold">فیلترهای فعال:</span>

            {selectedCarModel !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[11px] font-bold">
                خودرو: {activeCarModelTitle}
                <button onClick={() => onCarModelChange('all')} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[11px] font-bold">
                دسته: {activeCategoryTitle}
                <button onClick={() => onCategoryChange('all')} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[11px] font-bold">
                جستجو: "{searchQuery}"
                <button onClick={() => onSearchChange('')} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {stockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                فقط موجود
                <button onClick={() => onStockOnlyChange(false)} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Clear All Filters Button */}
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors ml-auto sm:ml-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>حذف فیلترها</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
