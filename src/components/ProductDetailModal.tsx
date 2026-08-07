import React from 'react';
import { Product } from '../types';
import { formatToman, getStockStatusInfo, toPersianDigits } from '../lib/formatters';
import { X, ShieldCheck, CheckCircle2, PhoneCall, Wrench } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  if (!product) return null;

  const stockInfo = getStockStatusInfo(product.stockStatus, product.stockQuantity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden my-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <h3 className="text-xs font-bold text-zinc-200">مشخصات فنی قطعه</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Image Side */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative aspect-square rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.nameFa}
                className="w-full h-full object-cover object-center"
              />
              {product.isOriginal && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-zinc-950 font-bold text-[10px] px-2 py-0.5 rounded shadow flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  اصلی و فابریک
                </div>
              )}
            </div>

            {/* Guarantees Box */}
            <div className="p-2.5 bg-zinc-950/80 rounded-lg border border-zinc-800 space-y-1.5 text-[11px] text-zinc-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>تضمین سلامت فیزیکی و استانداردهای OEM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>استعلام دقیق قیمت و موجودی با تلفن فروشگاه</span>
              </div>
            </div>
          </div>

          {/* Details Side */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-amber-400 text-[10px] font-semibold">
                  {product.category}
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-semibold">
                  {product.carModel}
                </span>
              </div>

              <h2 className="text-base font-bold text-white leading-snug">
                {product.nameFa}
              </h2>

              {/* Price & Stock info */}
              <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 block">وضعیت موجودی:</span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${stockInfo.badgeClass} px-1.5 py-0.5 rounded mt-0.5`}>
                    {stockInfo.label} ({stockInfo.qtyText})
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-zinc-400 block">قیمت شرکتی:</span>
                  <span className="text-base font-black text-amber-400 font-['Vazirmatn']">
                    {formatToman(product.price)}
                  </span>
                </div>
              </div>

              {/* Technical Specifications Table */}
              <div className="space-y-1.5 text-[11px] text-zinc-300">
                <h4 className="font-bold text-amber-400 flex items-center gap-1 text-xs">
                  <Wrench className="w-3.5 h-3.5" />
                  مشخصات فنی:
                </h4>

                <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">کد فنی (Part Number):</span>
                    <span className="font-mono text-amber-400 font-bold ltr-num">{product.partNumber}</span>
                  </div>

                  {product.oemCode && (
                    <div>
                      <span className="text-zinc-500 block text-[10px]">کد OEM اصلی:</span>
                      <span className="font-mono text-zinc-200 font-bold ltr-num">{product.oemCode}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-zinc-500 block text-[10px]">برند سازنده:</span>
                    <span className="font-semibold text-zinc-200">{product.brand}</span>
                  </div>

                  <div>
                    <span className="text-zinc-500 block text-[10px]">کشور سازنده:</span>
                    <span className="font-semibold text-zinc-200">{product.origin}</span>
                  </div>

                  {product.warrantyMonths !== undefined && product.warrantyMonths > 0 && (
                    <div className="col-span-2">
                      <span className="text-zinc-500 block text-[10px]">گارانتی:</span>
                      <span className="font-bold text-emerald-400">
                        {toPersianDigits(product.warrantyMonths)} ماه گارانتی تعویض دین محمدی
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-1">
                  <span className="text-zinc-500 block text-[10px] mb-0.5">توضیحات کاربردی:</span>
                  <p className="text-zinc-300 leading-relaxed text-[11px] bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                    {product.description || 'قطعه اورجینال با استانداردهای فابریک کارخانه سازنده خودرو.'}
                  </p>
                </div>

              </div>

            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
              <a
                href="tel:02156890790"
                className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>تماس مستقیم با دفتر فروشگاه (021-56890790)</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};


