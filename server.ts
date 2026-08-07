import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_CAR_MODELS } from './src/data/initialProducts';
import { Product, PriceInquiry, QuickUpdatePayload } from './src/types';

// Data storage file path for persistent auto parts data
const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load initial products or write defaults if missing
function loadProducts(): Product[] {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading products JSON, initializing defaults:', err);
  }
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(INITIAL_PRODUCTS, null, 2), 'utf-8');
  return INITIAL_PRODUCTS;
}

function saveProducts(products: Product[]) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write products to disk:', err);
  }
}

function loadInquiries(): PriceInquiry[] {
  try {
    if (fs.existsSync(INQUIRIES_FILE)) {
      const data = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading inquiries JSON:', err);
  }
  const defaultInquiries: PriceInquiry[] = [
    {
      id: 'inq-1',
      customerName: 'محمد رضایی',
      customerPhone: '09123456789',
      carModel: 'پژو 206 تیپ 5',
      partNameOrCode: 'کویل و شمع موتور بوش',
      notes: 'لطفا قیمت اصلی و طرح اصلی هر دو را پیامک کنید.',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'inq-2',
      customerName: 'علی کاظمی',
      customerPhone: '09351234567',
      carModel: 'چری تیگو 5',
      partNameOrCode: 'سنسور اکسیژن بالا اصلی',
      notes: 'عجله دارم برای تهران پیک کنید.',
      status: 'responded',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    }
  ];
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(defaultInquiries, null, 2), 'utf-8');
  return defaultInquiries;
}

function saveInquiries(inquiries: PriceInquiry[]) {
  try {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write inquiries to disk:', err);
  }
}

let productsMemory = loadProducts();
let inquiriesMemory = loadInquiries();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', storeName: 'لوازم یدکی دین محمدی' });
  });

  // Categories & Car Models metadata
  app.get('/api/categories', (req, res) => {
    res.json(INITIAL_CATEGORIES);
  });

  app.get('/api/car-models', (req, res) => {
    res.json(INITIAL_CAR_MODELS);
  });

  // GET Products
  app.get('/api/products', (req, res) => {
    const { search, category, carModel, stockOnly, sort } = req.query;

    let filtered = [...productsMemory];

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(p =>
        p.nameFa.toLowerCase().includes(q) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
        p.partNumber.toLowerCase().includes(q) ||
        (p.oemCode && p.oemCode.toLowerCase().includes(q)) ||
        p.brand.toLowerCase().includes(q) ||
        p.carModel.toLowerCase().includes(q)
      );
    }

    if (category && typeof category === 'string' && category !== 'all') {
      filtered = filtered.filter(p => p.category.includes(category) || category.includes(p.category));
    }

    if (carModel && typeof carModel === 'string' && carModel !== 'all') {
      filtered = filtered.filter(p =>
        p.carModel.includes(carModel) ||
        p.carModel === 'همه خودروها'
      );
    }

    if (stockOnly === 'true') {
      filtered = filtered.filter(p => p.stockStatus !== 'out_of_stock' && p.stockQuantity > 0);
    }

    if (sort === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }

    res.json(filtered);
  });

  // GET Single Product
  app.get('/api/products/:id', (req, res) => {
    const product = productsMemory.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'قطعه مورد نظر یافت نشد' });
    }
    res.json(product);
  });

  // POST Add Product (Admin)
  app.post('/api/products', (req, res) => {
    const body = req.body;
    if (!body.nameFa || !body.partNumber || !body.price) {
      return res.status(400).json({ error: 'نام قطعه، کد فنی و قیمت الزامی است' });
    }

    const newProduct: Product = {
      id: 'prod-' + Date.now(),
      partNumber: body.partNumber.toUpperCase().trim(),
      oemCode: body.oemCode ? body.oemCode.trim() : '',
      nameFa: body.nameFa.trim(),
      nameEn: body.nameEn ? body.nameEn.trim() : '',
      category: body.category || 'قطعات موتوری',
      carModel: body.carModel || 'همه خودروها',
      brand: body.brand || 'ایساکو',
      origin: body.origin || 'ایران',
      price: Number(body.price),
      stockQuantity: Number(body.stockQuantity || 10),
      stockStatus: Number(body.stockQuantity || 10) > 5 ? 'in_stock' : (Number(body.stockQuantity) > 0 ? 'low_stock' : 'out_of_stock'),
      description: body.description || '',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1600706432522-e3f4219a5833?auto=format&fit=crop&w=600&q=80',
      isOriginal: body.isOriginal !== undefined ? Boolean(body.isOriginal) : true,
      warrantyMonths: Number(body.warrantyMonths || 12),
      updatedAt: new Date().toISOString(),
    };

    productsMemory.unshift(newProduct);
    saveProducts(productsMemory);

    res.status(201).json(newProduct);
  });

  // PUT Update Product
  app.put('/api/products/:id', (req, res) => {
    const index = productsMemory.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'قطعه یافت نشد' });
    }

    const body = req.body;
    const existing = productsMemory[index];

    const stockQty = body.stockQuantity !== undefined ? Number(body.stockQuantity) : existing.stockQuantity;
    let stockStatus = existing.stockStatus;
    if (stockQty <= 0) stockStatus = 'out_of_stock';
    else if (stockQty <= 5) stockStatus = 'low_stock';
    else stockStatus = 'in_stock';

    const updatedProduct: Product = {
      ...existing,
      ...body,
      partNumber: (body.partNumber || existing.partNumber).toUpperCase(),
      price: body.price !== undefined ? Number(body.price) : existing.price,
      stockQuantity: stockQty,
      stockStatus,
      updatedAt: new Date().toISOString(),
    };

    productsMemory[index] = updatedProduct;
    saveProducts(productsMemory);

    res.json(updatedProduct);
  });

  // PATCH Quick Update (Inline editing for Admin table)
  app.patch('/api/products/:id/quick-update', (req, res) => {
    const { id } = req.params;
    const { price, stockQuantity, stockStatus } = req.body as QuickUpdatePayload;

    const index = productsMemory.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'قطعه یافت نشد' });
    }

    const item = productsMemory[index];

    if (price !== undefined) {
      item.price = Number(price);
    }

    if (stockQuantity !== undefined) {
      item.stockQuantity = Number(stockQuantity);
      if (item.stockQuantity <= 0) {
        item.stockStatus = 'out_of_stock';
      } else if (item.stockQuantity <= 5) {
        item.stockStatus = 'low_stock';
      } else {
        item.stockStatus = 'in_stock';
      }
    }

    if (stockStatus !== undefined) {
      item.stockStatus = stockStatus;
    }

    item.updatedAt = new Date().toISOString();

    productsMemory[index] = item;
    saveProducts(productsMemory);

    res.json({
      success: true,
      message: 'بروزرسانی سریع با موفقیت انجام شد',
      product: item,
    });
  });

  // DELETE Product
  app.delete('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const exists = productsMemory.some(p => p.id === id);
    if (!exists) {
      return res.status(404).json({ error: 'قطعه پیدا نشد' });
    }

    productsMemory = productsMemory.filter(p => p.id !== id);
    saveProducts(productsMemory);

    res.json({ success: true, id, message: 'قطعه با موفقیت حذف شد' });
  });

  // Inquiries endpoints
  app.get('/api/inquiries', (req, res) => {
    res.json(inquiriesMemory);
  });

  app.post('/api/inquiries', (req, res) => {
    const { customerName, customerPhone, carModel, partNameOrCode, notes } = req.body;
    if (!customerName || !customerPhone || !partNameOrCode) {
      return res.status(400).json({ error: 'لطفا نام، شماره تماس و قطعه مورد نظر را وارد نمایید.' });
    }

    const newInquiry: PriceInquiry = {
      id: 'inq-' + Date.now(),
      customerName,
      customerPhone,
      carModel: carModel || 'مشخص نشده',
      partNameOrCode,
      notes: notes || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    inquiriesMemory.unshift(newInquiry);
    saveInquiries(inquiriesMemory);

    res.status(201).json({
      success: true,
      message: 'درخواست استعلام شما ثبت شد. کارشناسان لوازم یدکی دین محمدی به‌زودی با شما تماس خواهند گرفت.',
      inquiry: newInquiry,
    });
  });

  app.patch('/api/inquiries/:id', (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const index = inquiriesMemory.findIndex(i => i.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'استعلام یافت نشد' });
    }

    inquiriesMemory[index].status = status;
    saveInquiries(inquiriesMemory);

    res.json(inquiriesMemory[index]);
  });

  // Admin Auth Login
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    // Simple secure admin check for preview mode
    if ((username === 'admin' && password === 'admin123') || (username === 'dinmohammadi' && password === 'din1403')) {
      return res.json({
        success: true,
        user: {
          username,
          name: 'مدیریت لوازم یدکی دین محمدی',
          role: 'Super Admin',
          token: 'token-dm-admin-' + Date.now(),
        }
      });
    }

    res.status(401).json({ error: 'نام کاربری یا کلمه عبور اشتباه است.' });
  });

  // AI Assistant for Auto Part Finder
  app.post('/api/ai-assistant', async (req, res) => {
    const { query, carModel } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'پرسش یا نشانه خودرو الزامی است.' });
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `شما دستیار فنی فروشگاه "لوازم یدکی دین محمدی" هستید.
کاربر مشکل خودرو یا کد قطعه زیر را مطرح کرده است:
خودرو: ${carModel || 'مشخص نشده'}
پرسش/نشانه: "${query}"

لیست قطعات موجود در انبار دین محمدی:
${JSON.stringify(productsMemory.map(p => ({ id: p.id, partNumber: p.partNumber, oem: p.oemCode, name: p.nameFa, car: p.carModel, price: p.price, stock: p.stockStatus })))}

پاسخ را بسیار کوتاه، حرفه‌ای و به زبان فارسی بنویسید.
۱. قطعه فنی یا عیب احتمالی خودرو را تشخیص دهید.
۲. قطعات پیشنهادی موجود در انبار را دقیقاً با نام و پارت نامبر ذکر کنید.
۳. راهنمایی کوتاهی برای خرید و استعلام قیمت ارائه دهید.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        return res.json({ text: response.text });
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart matching engine:', err);
    }

    // Smart fallback engine
    const queryLower = query.toLowerCase();
    const matched = productsMemory.filter(p =>
      p.nameFa.includes(query) ||
      p.partNumber.toLowerCase().includes(queryLower) ||
      p.category.includes(query) ||
      p.carModel.includes(query)
    );

    let fallbackText = `با درود از لوازم یدکی دین محمدی.\n`;
    if (matched.length > 0) {
      fallbackText += `قطعات پیشنهادی مرتبط با درخواست شما در انبار موجود است:\n`;
      matched.forEach(m => {
        fallbackText += `• ${m.nameFa} (کد فنی: ${m.partNumber}) - قیمت: ${m.price.toLocaleString('fa-IR')} تومان\n`;
      });
      fallbackText += `جهت ثبت سفارش سریع یا استعلام تلفنی می‌توانید با بخش فروش تماس بگیرید.`;
    } else {
      fallbackText += `قطعه درخواستی شما نیاز به بررسی کد فنی OEM دارد. لطفا با شماره تماس فروشگاه تماس بگیرید تا کارشناسان قطعه مناسب خودروی ${carModel || 'شما'} را تامین نمایند.`;
    }

    res.json({ text: fallbackText });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Din Mohammadi Auto Parts Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
