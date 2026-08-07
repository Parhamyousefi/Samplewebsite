/**
 * Formats a number in Tomans with 3-digit comma separation (e.g., 1,500,000 تومان)
 */
export function formatToman(amount: number): string {
  if (amount === 0 || amount === undefined || amount === null) return 'استعلام تلفنی';
  return amount.toLocaleString('en-US') + ' تومان';
}

export function formatTomanEn(amount: number): string {
  if (amount === 0 || amount === undefined || amount === null) return 'Call for price';
  return amount.toLocaleString('en-US') + ' Toman';
}

export function formatNumberWithCommas(num: number | string): string {
  if (!num) return '0';
  const val = typeof num === 'string' ? parseFloat(String(num).replace(/,/g, '')) : num;
  if (isNaN(val)) return '0';
  return val.toLocaleString('en-US');
}

/**
 * Converts English digits to Persian digits
 */
export function toPersianDigits(str: string | number): string {
  if (str === null || str === undefined) return '';
  const persians = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(str).replace(/[0-9]/g, (w) => persians[Number(w)]);
}

/**
 * Returns color classes for stock status
 */
export function getStockStatusInfo(status: 'in_stock' | 'low_stock' | 'out_of_stock', qty: number) {
  switch (status) {
    case 'in_stock':
      return {
        label: 'موجود در انبار',
        badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        dotClass: 'bg-emerald-400',
        qtyText: `${toPersianDigits(qty)} عدد موجود`,
      };
    case 'low_stock':
      return {
        label: 'موجودی محدود',
        badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        dotClass: 'bg-amber-400 animate-pulse',
        qtyText: `فقط ${toPersianDigits(qty)} عدد باقی مانده`,
      };
    case 'out_of_stock':
      return {
        label: 'ناموجود (تماس بگیرید)',
        badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        dotClass: 'bg-rose-500',
        qtyText: 'عدم موجودی فعلی',
      };
  }
}
