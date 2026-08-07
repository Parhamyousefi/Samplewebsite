import React from 'react';
import { Product } from '../types';
import { formatToman, getStockStatusInfo } from '../lib/formatters';
import { ShieldCheck, Eye, PhoneCall } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
}) => {
  const stockInfo = getStockStatusInfo(product.stockStatus, product.stockQuantity);

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-sky-500/50 transition-all duration-200 flex flex-col h-full shadow-md hover:shadow-sky-500/10">
      
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer" onClick={() => onSelectProduct(product)}>
        <img
          src={product.imageUrl}
          alt={product.nameFa}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {product.isOriginal && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[9px] shadow flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" />
              اصلی
            </span>
          )}
        </div>

        {/* Brand badge */}
        <div className="absolute bottom-2 right-2">
          <span className="px-2 py-0.5 rounded bg-slate-950/90 text-sky-400 border border-slate-800 text-[10px] font-bold">
            {product.brand}
          </span>
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between space-y-2">
        
        <div className="space-y-1 sm:space-y-1.5">
          {/* Category & Car Model compatibility */}
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 gap-1">
            <span className="text-sky-400/90 font-medium truncate max-w-[50%]">
              {product.category}
            </span>
            <span className="bg-slate-950 text-slate-300 px-1 py-0.5 rounded border border-slate-800 truncate max-w-[50%]">
              {product.carModel}
            </span>
          </div>

          {/* Title in Persian */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-[11px] sm:text-xs font-bold text-slate-100 hover:text-sky-400 transition-colors line-clamp-2 cursor-pointer leading-tight sm:leading-snug min-h-[32px] sm:min-h-[36px]"
            title={product.nameFa}
          >
            {product.nameFa}
          </h3>

          {/* Part Number (OEM) in LTR Monospace */}
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] bg-slate-950 p-1 sm:p-1.5 rounded border border-slate-800">
            <span className="text-slate-500">OEM:</span>
            <span className="ltr-num font-mono text-slate-300 font-semibold truncate max-w-[100px]">
              {product.partNumber}
            </span>
          </div>
        </div>

        {/* Stock & Price Row */}
        <div className="pt-1.5 sm:pt-2 border-t border-slate-800 space-y-1.5 sm:space-y-2">
          
          <div className="flex items-center justify-between gap-1">
            {/* Stock indicator badge */}
            <span className={`inline-flex items-center gap-1 text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded border whitespace-nowrap ${stockInfo.badgeClass}`}>
              <span className={`w-1 h-1 rounded-full ${stockInfo.dotClass}`} />
              {stockInfo.label}
            </span>

            {/* Price tag */}
            <div className="text-left">
              {product.price > 0 ? (
                <span className="text-xs sm:text-sm font-extrabold text-sky-400 font-['Vazirmatn'] whitespace-nowrap">
                  {formatToman(product.price)}
                </span>
              ) : (
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                  تماس تلفنی
                </span>
              )}
            </div>
          </div>

          {/* Buttons Row */}
          <div className="grid grid-cols-2 gap-1 pt-0.5">
            <button
              onClick={() => onSelectProduct(product)}
              className="w-full min-h-[36px] sm:min-h-[40px] px-1 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 text-[10px] sm:text-xs font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>مشخصات</span>
            </button>

            <a
              href="tel:02156890790"
              className="w-full min-h-[36px] sm:min-h-[40px] px-1 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:from-sky-600 active:to-blue-700 text-white text-[10px] sm:text-xs font-bold shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-1 whitespace-nowrap active:scale-95"
            >
              <PhoneCall className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>تماس/خرید</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};

