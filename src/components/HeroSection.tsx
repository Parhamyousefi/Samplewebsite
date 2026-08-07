import React from 'react';
import { ShieldCheck, Clock, PhoneCall, Store, MapPin } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-3 sm:py-4 bg-[#0b0f17] border-b border-slate-800 font-['Vazirmatn']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
        
        {/* Top Hero Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          <div className="lg:col-span-7 space-y-2">
            <h2 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
              کاتالوگ تخصصی لوازم یدکی <span className="text-sky-400">دین محمدی</span>
            </h2>

            <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
              تامین قطعات اورجینال موتوری، جلوبندی، ترمز و برقی انواع خودروهای ایران‌خودرو، سایپا، پارس‌خودرو و وارداتی با ضمانت اصالت.
            </p>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <div>
                  <h4 className="text-[11px] font-bold text-slate-100">ضمانت اصالت قطعه</h4>
                  <p className="text-[9px] text-slate-400">کد شرکتی و فابریک</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg flex items-center gap-2">
                <Store className="w-4 h-4 text-sky-400 shrink-0" />
                <div>
                  <h4 className="text-[11px] font-bold text-slate-100">تحویل حضوری</h4>
                  <p className="text-[9px] text-slate-400">پرند، فاز ۱، چهارباغ</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg flex items-center gap-2 col-span-2 sm:col-span-1">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <div>
                  <h4 className="text-[11px] font-bold text-slate-100">ساعات کاری</h4>
                  <p className="text-[9px] text-slate-400">۸:۳۰ الی ۱۹:۰۰</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Contact Column */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2 shadow-md">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
                  <span>دفتر فروش و استعلام کالا</span>
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold">
                  پاسخگویی تلفنی
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">تلفن مستقیم سفارشات:</span>
                  <span className="text-sm font-bold text-sky-400 font-mono ltr-num">021-56890790</span>
                </div>
                <a
                  href="tel:02156890790"
                  className="px-3.5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs rounded-lg transition-all shadow-md shadow-sky-500/20 flex items-center gap-1 active:scale-95"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>تماس مستقیم</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};



