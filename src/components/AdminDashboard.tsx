import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { fetchProducts, createProduct, updateProduct, quickUpdateProduct, deleteProduct } from '../api/client';
import { formatToman, toPersianDigits } from '../lib/formatters';
import { INITIAL_CAR_MODELS } from '../data/initialProducts';
import {
  Package, Plus, Edit3, Trash2, Save, Search, RefreshCw, DollarSign, X, Download, Check, Upload, FileSpreadsheet, Image as ImageIcon, CheckCircle2, AlertCircle, Info, ShieldCheck
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  onViewStorefront: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onViewStorefront }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');

  // Inline Editing state map: productId -> { price: string, stockQuantity: string, saving: boolean, savedSuccess: boolean }
  const [inlineEdits, setInlineEdits] = useState<Record<string, { price: string; stockQuantity: string; saving?: boolean; savedSuccess?: boolean }>>({});

  // Product Edit/Add Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // CSV Import Modal State
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvPreviewItems, setCsvPreviewItems] = useState<Partial<Product>[]>([]);
  const [isImportingCsv, setIsImportingCsv] = useState(false);
  const csvFileInputRef = useRef<HTMLInputElement>(null);

  // Image Upload Ref for Product Modal
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Form State
  const [formData, setFormData] = useState({
    nameFa: '',
    nameEn: '',
    partNumber: '',
    oemCode: '',
    category: 'قطعات موتوری',
    carModel: 'پژو 206 و 207 (TU5/TU3)',
    brand: '',
    origin: 'ایران',
    price: 1000000,
    stockQuantity: 10,
    description: '',
    imageUrl: '',
    isOriginal: true,
    warrantyMonths: 12,
  });

  const [savingModal, setSavingModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const prods = await fetchProducts();
      setProducts(prods);

      // Initialize inline edits state
      const initialEdits: Record<string, { price: string; stockQuantity: string }> = {};
      prods.forEach(p => {
        initialEdits[p.id] = {
          price: String(p.price),
          stockQuantity: String(p.stockQuantity),
        };
      });
      setInlineEdits(initialEdits);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Inline Quick Save handler
  const handleQuickSave = async (productId: string) => {
    const edit = inlineEdits[productId];
    if (!edit) return;

    setInlineEdits(prev => ({
      ...prev,
      [productId]: { ...prev[productId], saving: true, savedSuccess: false }
    }));

    try {
      const newPrice = Number(edit.price);
      const newQty = Number(edit.stockQuantity);

      const res = await quickUpdateProduct(productId, {
        id: productId,
        price: newPrice,
        stockQuantity: newQty,
      });

      // Update local products list
      setProducts(prev => prev.map(p => p.id === productId ? res.product : p));

      setInlineEdits(prev => ({
        ...prev,
        [productId]: {
          price: String(res.product.price),
          stockQuantity: String(res.product.stockQuantity),
          saving: false,
          savedSuccess: true,
        }
      }));

      setTimeout(() => {
        setInlineEdits(prev => ({
          ...prev,
          [productId]: { ...prev[productId], savedSuccess: false }
        }));
      }, 2000);

      showToast(`قیمت و موجودی قطعه با موفقیت به‌روزرسانی شد.`, 'success');

    } catch (err) {
      showToast('خطا در بروزرسانی سریع قیمت/موجودی', 'error');
      setInlineEdits(prev => ({
        ...prev,
        [productId]: { ...prev[productId], saving: false }
      }));
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      nameFa: '',
      nameEn: '',
      partNumber: '',
      oemCode: '',
      category: 'قطعات موتوری',
      carModel: 'پژو 206 و 207 (TU5/TU3)',
      brand: '',
      origin: 'ایران',
      price: 1500000,
      stockQuantity: 10,
      description: 'قطعه اصلی با استانداردهای فابریک.',
      imageUrl: 'https://images.unsplash.com/photo-1600706432522-e3f4219a5833?auto=format&fit=crop&w=600&q=80',
      isOriginal: true,
      warrantyMonths: 12,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      nameFa: p.nameFa,
      nameEn: p.nameEn || '',
      partNumber: p.partNumber,
      oemCode: p.oemCode || '',
      category: p.category,
      carModel: p.carModel,
      brand: p.brand,
      origin: p.origin,
      price: p.price,
      stockQuantity: p.stockQuantity,
      description: p.description,
      imageUrl: p.imageUrl,
      isOriginal: p.isOriginal,
      warrantyMonths: p.warrantyMonths || 12,
    });
    setIsModalOpen(true);
  };

  // Image Upload handler (convert file to base64 Data URL)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('لطفاً یک فایل تصویری انتخاب کنید.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData(prev => ({ ...prev, imageUrl: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  // CSV File Parse Handler
  const handleCsvFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      if (csvText) {
        parseCsvContent(csvText);
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const parseCsvContent = (csvText: string) => {
    const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length <= 1) {
      alert('فایل CSV خالی است یا معتبر نیست.');
      return;
    }

    const delimiter = lines[0].includes(';') ? ';' : ',';
    const items: Partial<Product>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length < 2) continue;

      items.push({
        nameFa: cols[0] || 'قطعه جدید',
        partNumber: cols[1] || `PN-${Date.now()}-${i}`,
        carModel: cols[2] || 'همه خودروها',
        category: cols[3] || 'قطعات موتوری',
        price: Number(cols[4]) || 1000000,
        stockQuantity: Number(cols[5]) || 10,
        brand: cols[6] || 'شرکتی',
        origin: cols[7] || 'ایران',
        imageUrl: cols[8] || 'https://images.unsplash.com/photo-1600706432522-e3f4219a5833?auto=format&fit=crop&w=600&q=80',
        description: cols[9] || 'ثبت شده از طریق آپلود CSV',
        isOriginal: true,
      });
    }

    setCsvPreviewItems(items);
  };

  // Execute Bulk CSV Import
  const handleExecuteCsvImport = async () => {
    if (csvPreviewItems.length === 0) return;
    setIsImportingCsv(true);

    try {
      for (const item of csvPreviewItems) {
        await createProduct({
          nameFa: item.nameFa || 'قطعه جدید',
          nameEn: '',
          partNumber: item.partNumber || `PN-${Date.now()}`,
          oemCode: '',
          category: item.category || 'قطعات موتوری',
          carModel: item.carModel || 'همه خودروها',
          brand: item.brand || '',
          origin: item.origin || 'ایران',
          price: item.price || 1000000,
          stockQuantity: item.stockQuantity || 10,
          description: item.description || '',
          imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1600706432522-e3f4219a5833?auto=format&fit=crop&w=600&q=80',
          isOriginal: true,
          warrantyMonths: 12,
        });
      }

      showToast(`تعداد ${csvPreviewItems.length} قطعه با موفقیت در انبار ثبت گردید.`, 'success');
      setIsCsvModalOpen(false);
      setCsvPreviewItems([]);
      await loadData();
    } catch (err) {
      showToast('خطا در بارگذاری محصولات از CSV', 'error');
    } finally {
      setIsImportingCsv(false);
    }
  };

  // Download Sample CSV
  const handleDownloadSampleCsv = () => {
    const csvHeader = "NameFa,PartNumber,CarModel,Category,Price,StockQuantity,Brand,Origin,ImageUrl,Description\n";
    const sampleRows = [
      "تسمه تایم رانو ال 90,PN-L90-882,تندر 90 (L90) و ساندرو,قطعات موتوری,1250000,15,رنو اصلی,فرانسه,https://images.unsplash.com/photo-1600706432522-e3f4219a5833?auto=format&fit=crop&w=600&q=80,تسمه تایم اورجینال",
      "لنت ترمز جلو 206 تیپ 5,PN-206-T5-BRK,پژو 206 و 207 (TU5/TU3),سیستم ترمز و ایمنی,850000,20,تكستار,آلمان,https://images.unsplash.com/photo-1600706432522-e3f4219a5833?auto=format&fit=crop&w=600&q=80,لنت تکستار اصلی"
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvHeader + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_products_import.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit Modal Form
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingModal(true);

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        showToast(`اطلاعات قطعه «${formData.nameFa}» با موفقیت بروزرسانی شد.`, 'success');
      } else {
        await createProduct(formData);
        showToast(`قطعه جدید «${formData.nameFa}» با موفقیت به انبار اضافه شد.`, 'success');
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'خطا در ثبت قطعه', 'error');
    } finally {
      setSavingModal(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setDeleteConfirmId(null);
      showToast('قطعه با موفقیت از انبار حذف گردید.', 'info');
      await loadData();
    } catch (err) {
      showToast('خطا در حذف قطعه', 'error');
    }
  };

  // Filtered Products List
  const filteredProducts = products.filter(p => {
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery = !q || p.nameFa.toLowerCase().includes(q) || p.partNumber.toLowerCase().includes(q) || (p.oemCode && p.oemCode.toLowerCase().includes(q)) || p.carModel.toLowerCase().includes(q);
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchesStock = filterStock === 'all' || p.stockStatus === filterStock;
    return matchesQuery && matchesCategory && matchesStock;
  });

  // Calculate Dashboard Metrics
  const totalProducts = products.length;
  const totalStockValue = products.reduce((acc, p) => acc + (p.price * p.stockQuantity), 0);
  const inStockCount = products.filter(p => p.stockStatus === 'in_stock').length;

  return (
    <div className="min-h-screen bg-[#050608] text-zinc-100 p-4 sm:p-6 lg:p-8 space-y-5 font-['Vazirmatn'] relative">
      
      {/* Toast Notification Alert */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/95 text-white border border-sky-500/40 shadow-2xl backdrop-blur-lg animate-in fade-in slide-in-from-top-4 duration-200 min-w-[280px] max-w-md">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
          <span className="text-xs sm:text-sm font-bold flex-1">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* Admin Top Header */}
      <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white">
              پروژه مدیریت فروشگاه و انبارداری | <span className="text-amber-400">لوازم یدکی دین محمدی</span>
            </h2>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
              پنل مدیریت
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            ویرایش سریع قیمت‌ها، آپلود گروهی محصولات با فایل CSV و مدیریت کامل کاتالوگ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewStorefront}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold transition-colors"
          >
            کارت‌ها و کاتالوگ فروشگاه
          </button>
          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/20 text-xs font-semibold transition-colors"
          >
            خروج از پنل ادمین
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        <div className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-zinc-400 block font-bold">تعداد کل کالاها</span>
            <span className="text-xl font-extrabold text-amber-400 ltr-num font-mono">
              {toPersianDigits(totalProducts)} عدد
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-zinc-400 block font-bold">ارزش موجودی کل انبار</span>
            <span className="text-sm font-extrabold text-emerald-400 font-['Vazirmatn']">
              {formatToman(totalStockValue)}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-zinc-400 block font-bold">قطعات آماده تحویل</span>
            <span className="text-xl font-extrabold text-blue-400 ltr-num font-mono">
              {toPersianDigits(inStockCount)} قلم
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* PRODUCTS TABLE & CONTROL BAR */}
      <div className="space-y-4">
          
          {/* Controls Bar */}
          <div className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl flex flex-col md:flex-row gap-3 items-center justify-between">
            
            <div className="flex-1 w-full md:w-auto relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو بر اساس نام قطعه، کد OEM یا مدل خودرو..."
                className="w-full pr-8 pl-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded-lg px-2.5 py-1.5 focus:border-amber-500"
              >
                <option value="all">همه دسته‌ها</option>
                <option value="قطعات موتوری">قطعات موتوری</option>
                <option value="سیستم ترمز و ایمنی">سیستم ترمز</option>
                <option value="جلوبندی و تعلیق">جلوبندی و تعلیق</option>
                <option value="برقی و الکترونیک">برقی و الکترونیک</option>
                <option value="مصرفی، روغن و فیلتر">مصرفی و روغن</option>
              </select>

              {/* CSV Upload Button */}
              <button
                onClick={() => setIsCsvModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 font-bold text-xs flex items-center gap-1 transition-colors"
                title="آپلود محصولات به صورت فایل CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>آپلود CSV</span>
              </button>

              {/* Add New Product Button */}
              <button
                onClick={handleOpenAddModal}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1 shadow transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن قطعه جدید</span>
              </button>
            </div>

          </div>

          {/* TABLE CONTAINER */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-md">
            <div className="p-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
              <h2 className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                لیست قطعات موجود در انبار
              </h2>
              <span className="text-[11px] text-zinc-400">
                تعداد: {filteredProducts.length} قطعه
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 font-semibold text-[11px]">
                  <tr>
                    <th className="p-3">تصویر و نام قطعه</th>
                    <th className="p-3">کد فنی</th>
                    <th className="p-3">خودرو</th>
                    <th className="p-3 text-center">قیمت (تومان)</th>
                    <th className="p-3 text-center">موجودی انبار</th>
                    <th className="p-3 text-center">بروزرسانی</th>
                    <th className="p-3 text-left">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-200">
                  {filteredProducts.map((product) => {
                    const edit = inlineEdits[product.id] || { price: String(product.price), stockQuantity: String(product.stockQuantity) };

                    return (
                      <tr key={product.id} className="hover:bg-zinc-800/50 transition-colors">
                        
                        {/* Name & Image */}
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={product.imageUrl}
                              alt={product.nameFa}
                              className="w-9 h-9 rounded bg-zinc-950 border border-zinc-800 object-cover shrink-0"
                            />
                            <div>
                              <span className="font-bold text-white block text-xs line-clamp-1">
                                {product.nameFa}
                              </span>
                              <span className="text-[10px] text-amber-400">
                                {product.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Part Code */}
                        <td className="p-3">
                          <span className="font-mono text-zinc-400 ltr-num" dir="ltr">
                            {product.partNumber}
                          </span>
                        </td>

                        {/* Car Model */}
                        <td className="p-3 text-zinc-300">
                          <span>{product.carModel}</span>
                        </td>

                        {/* INLINE EDIT: PRICE */}
                        <td className="p-3 text-center">
                          <div className="flex flex-col items-center gap-0.5">
                            <div className="inline-flex items-center gap-1 bg-zinc-950 p-1 rounded border border-zinc-800">
                              <input
                                type="number"
                                value={edit.price}
                                onChange={(e) =>
                                  setInlineEdits(prev => ({
                                    ...prev,
                                    [product.id]: { ...prev[product.id], price: e.target.value }
                                  }))
                                }
                                className="w-24 bg-transparent text-center font-mono text-amber-400 focus:outline-none text-xs ltr-num"
                                dir="ltr"
                              />
                            </div>
                            <span className="text-[10px] text-sky-400 font-mono font-bold">
                              {formatToman(Number(edit.price))}
                            </span>
                          </div>
                        </td>

                        {/* INLINE EDIT: STOCK QTY */}
                        <td className="p-3 text-center">
                          <div className="inline-flex items-center gap-1 bg-zinc-950 p-1 rounded border border-zinc-800">
                            <input
                              type="number"
                              value={edit.stockQuantity}
                              onChange={(e) =>
                                setInlineEdits(prev => ({
                                  ...prev,
                                  [product.id]: { ...prev[product.id], stockQuantity: e.target.value }
                                }))
                              }
                              className="w-14 bg-transparent text-center font-mono text-emerald-400 focus:outline-none text-xs ltr-num"
                              dir="ltr"
                            />
                            <span className="text-[10px] text-zinc-500">عدد</span>
                          </div>
                        </td>

                        {/* INLINE QUICK SAVE BUTTON */}
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleQuickSave(product.id)}
                            disabled={edit.saving}
                            className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center justify-center gap-1 mx-auto ${
                              edit.savedSuccess
                                ? 'bg-emerald-500 text-zinc-950'
                                : 'bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-zinc-700'
                            }`}
                          >
                            {edit.savedSuccess ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>ثبت شد</span>
                              </>
                            ) : edit.saving ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <Save className="w-3.5 h-3.5" />
                                <span>ذخیره</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-left space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="text-amber-400 hover:underline text-[11px] font-semibold"
                          >
                            ویرایش
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="text-rose-400 hover:underline text-[11px] font-semibold"
                          >
                            حذف
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="p-8 text-center text-zinc-400 text-xs">
                  هیچ قطعه‌ای در انبار پیدا نشد.
                </div>
              )}
            </div>
          </div>

        </div>

      {/* CSV IMPORT MODAL */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>آپلود گروهی محصولات از طریق فایل CSV</span>
              </h3>
              <button onClick={() => setIsCsvModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <p>
                شما می‌توانید فایل اکسل یا CSV شامل مشخصات قطعات (نام، کد فنی، مدل خودرو، قیمت و...) را به یک‌باره آپلود نمایید.
              </p>

              <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <span className="text-[11px] text-zinc-400">دانلود نمونه ساختار استاندارد CSV:</span>
                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded text-xs font-semibold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>دانلود فایل نمونه</span>
                </button>
              </div>

              {/* Upload Drop Zone */}
              <div
                onClick={() => csvFileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-700 hover:border-emerald-500 bg-zinc-950 p-6 rounded-xl text-center cursor-pointer transition-colors space-y-2"
              >
                <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                <span className="block font-bold text-white text-xs">برای انتخاب فایل CSV کلیک کنید</span>
                <span className="block text-[10px] text-zinc-500">فرمت‌های پشتیبانی شده: .csv</span>
                <input
                  ref={csvFileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleCsvFileSelect}
                  className="hidden"
                />
              </div>

              {/* Parsed Preview Table */}
              {csvPreviewItems.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-emerald-400 block">
                    تعداد {csvPreviewItems.length} قطعه شناسایی گردید:
                  </span>
                  <div className="max-h-40 overflow-y-auto bg-zinc-950 p-2 rounded-lg border border-zinc-800 text-[11px] space-y-1">
                    {csvPreviewItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between border-b border-zinc-800 pb-1">
                        <span className="font-semibold text-white">{item.nameFa}</span>
                        <span className="font-mono text-amber-400">{item.partNumber}</span>
                        <span className="text-zinc-400">{formatToman(item.price || 0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsCsvModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 font-bold text-xs"
              >
                انصراف
              </button>
              <button
                type="button"
                disabled={csvPreviewItems.length === 0 || isImportingCsv}
                onClick={handleExecuteCsvImport}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-1.5 disabled:opacity-50"
              >
                {isImportingCsv ? 'در حال ثبت...' : `تایید و وارد کردن ${csvPreviewItems.length} محصول`}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FULL EDIT / ADD PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-5 my-6">
            
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-sm font-bold text-white">
                {editingProduct ? 'ویرایش کامل قطعه' : 'افزودن قطعه جدید به انبار'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1 font-semibold">نام فارسی قطعه *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameFa}
                    onChange={(e) => setFormData({ ...formData, nameFa: e.target.value })}
                    className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1 font-semibold">کد فنی (Part Number) *</label>
                  <input
                    type="text"
                    required
                    value={formData.partNumber}
                    onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                    className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono ltr-num"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1 font-semibold">کد OEM اصلی (اختیاری)</label>
                  <input
                    type="text"
                    value={formData.oemCode}
                    onChange={(e) => setFormData({ ...formData, oemCode: e.target.value })}
                    className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono ltr-num"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-zinc-300 font-semibold">قیمت فروش شرکتی (تومان) *</label>
                    <span className="text-xs text-sky-400 font-bold font-mono bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                      {formatToman(formData.price)}
                    </span>
                  </div>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono ltr-num"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1 font-semibold">دسته بندی</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                  >
                    <option value="قطعات موتوری">قطعات موتوری</option>
                    <option value="سیستم ترمز و ایمنی">سیستم ترمز و ایمنی</option>
                    <option value="جلوبندی و تعلیق">جلوبندی و تعلیق</option>
                    <option value="برقی و الکترونیک">برقی و الکترونیک</option>
                    <option value="بدنه، چراغ و تزئینات">بدنه و چراغ</option>
                    <option value="مصرفی، روغن و فیلتر">مصرفی و روغن</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1 font-semibold">سازگاری با خودرو</label>
                  <select
                    value={formData.carModel}
                    onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                    className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                  >
                    {INITIAL_CAR_MODELS.filter((m) => m.id !== 'all').map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.brand})
                      </option>
                    ))}
                    <option value="همه خودروها">همه خودروها</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1 font-semibold">موجودی انبار (عدد)</label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white ltr-num"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1 font-semibold">برند سازنده</label>
                  <input
                    type="text"
                    value={formData.brand}
                    placeholder="نام برند را وارد کنید (مثلاً: ایساکو، تکستار، عظام...)"
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1 font-semibold">کشور سازنده</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* REAL IMAGE FILE UPLOADER */}
              <div className="space-y-1.5">
                <label className="block text-zinc-300 font-semibold">تصویر محصول (انتخاب فایل عکس) *</label>
                
                <div className="flex items-center gap-3">
                  {/* Image Preview Box */}
                  <div className="w-16 h-16 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} alt="پیش‌نمایش" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-zinc-600" />
                    )}
                  </div>

                  {/* Uploader Drop/Click Zone */}
                  <div
                    onClick={() => imageFileInputRef.current?.click()}
                    className="flex-1 p-3 bg-zinc-950 hover:bg-zinc-800/80 border border-dashed border-zinc-700 hover:border-amber-400 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span className="text-zinc-300 text-xs font-semibold">
                      {formData.imageUrl ? 'تغییر فایل عکس' : 'انتخاب فایل عکس از کامپیوتر'}
                    </span>
                    <input
                      ref={imageFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">توضیحات و مشخصات کاربردی</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isOriginal}
                    onChange={(e) => setFormData({ ...formData, isOriginal: e.target.checked })}
                    className="rounded bg-zinc-950 border-zinc-800 text-amber-500 focus:ring-0"
                  />
                  <span>ضمانت اصالت قطعه (فابریک کارخانه)</span>
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-zinc-800 text-zinc-300 font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={savingModal}
                  className="flex-[2] py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow"
                >
                  {savingModal ? 'در حال ثبت...' : 'ذخیره قطعه'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 p-5 rounded-xl border border-rose-500/40 max-w-sm w-full space-y-3 text-center">
            <Trash2 className="w-8 h-8 text-rose-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">آیا از حذف این قطعه مطمئن هستید؟</h4>
            <p className="text-xs text-zinc-400">این قطعه از بانک اطلاعاتی پاک می‌شود.</p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 font-bold text-xs"
              >
                انصراف
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow"
              >
                حذف قطعه
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
