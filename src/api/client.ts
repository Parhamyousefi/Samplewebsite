import { Product, PriceInquiry, QuickUpdatePayload, AdminUser, FilterState } from '../types';

const API_BASE = '/api';

export async function fetchProducts(filters?: Partial<FilterState>): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.searchQuery) params.append('search', filters.searchQuery);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.carModel) params.append('carModel', filters.carModel);
    if (filters?.stockOnly) params.append('stockOnly', 'true');
    if (filters?.sortBy) params.append('sort', filters.sortBy);

    const res = await fetch(`${API_BASE}/products?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (error) {
    console.warn('API fetch failed, returning client fallback:', error);
    return [];
  }
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'خطا در ثبت قطعه');
  }
  return await res.json();
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'خطا در بروزرسانی قطعه');
  }
  return await res.json();
}

export async function quickUpdateProduct(id: string, payload: QuickUpdatePayload): Promise<{ success: boolean; product: Product }> {
  const res = await fetch(`${API_BASE}/products/${id}/quick-update`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'خطا در بروزرسانی سریع');
  }
  return await res.json();
}

export async function deleteProduct(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('خطا در حذف قطعه');
  return true;
}

export async function submitInquiry(data: { customerName: string; customerPhone: string; carModel: string; partNameOrCode: string; notes?: string }): Promise<any> {
  const res = await fetch(`${API_BASE}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'خطا در ثبت استعلام');
  }
  return await res.json();
}

export async function fetchInquiries(): Promise<PriceInquiry[]> {
  const res = await fetch(`${API_BASE}/inquiries`);
  if (!res.ok) throw new Error('خطا در دریافت استعلام‌ها');
  return await res.json();
}

export async function updateInquiryStatus(id: string, status: string): Promise<PriceInquiry> {
  const res = await fetch(`${API_BASE}/inquiries/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('خطا در تغییر وضعیت استعلام');
  return await res.json();
}

export async function loginAdmin(credentials: { username: string; password: string }): Promise<AdminUser> {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'اطلاعات ورود اشتباه است');
  }
  const data = await res.json();
  return data.user;
}

export async function askAiPartAssistant(query: string, carModel?: string): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/ai-assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, carModel }),
    });
    if (!res.ok) throw new Error('AI Server error');
    const data = await res.json();
    return data.text;
  } catch (error) {
    return 'پاسخ دستیار هوشمند: در حال حاضر امکان اتصال مستقیم به هوش مصنوعی وجود ندارد. می‌توانید با شماره ۰۲۱-۵۵۳۴۸۹۲۰ با کارشناسان دین محمدی تماس بگیرید.';
  }
}
