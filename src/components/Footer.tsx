import React from 'react';
import { Wrench, PhoneCall, MapPin, Clock, ShieldCheck, Navigation, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b0f17] border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Col 1: About */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Wrench className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white font-['Vazirmatn']">لوازم یدکی دین محمدی</h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              مرکز تخصصی تامین و توزیع قطعات اورجینال خودروهای داخلی و وارداتی با ضمانت کتبی اصالت.
            </p>
            <div className="pt-1 flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-sky-400 text-[11px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                تامین‌کننده مستقیم
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-emerald-400 text-[11px] font-bold">
                ضمانت اصالت ۱۰۰٪
              </span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white mb-2 border-r-2 border-sky-400 pr-2">
              دسته‌بندی‌های اصلی
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                <span>قطعات موتوری، تسمه و واشر سرسیلندر</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                <span>دیسک و صفحه کلاچ ولئو و عظام</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                <span>لنت ترمز تکستار و بوش اصلی</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                <span>جلوبندی، بوش، سیبک و کمک فنر</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                <span>شمع موتور، کویل و سنسورهای برقی</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info & Address */}
          <div className="space-y-2.5 lg:col-span-2">
            <h4 className="text-xs font-bold text-white mb-2 border-r-2 border-sky-400 pr-2">
              موقعیت مکانی و مسیریابی
            </h4>
            
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-3 shadow-md">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-slate-200 font-bold text-xs mb-1">آدرس فروشگاه (تحویل حضوری):</span>
                  <p className="text-slate-300 text-xs leading-relaxed font-medium">
                    تهران، پرند، فاز ۱ ، بلوار چهارباغ، بعد از البرز شمالی
                  </p>
                </div>
              </div>

              {/* Ultra Beautiful Navigation Buttons */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <span className="text-[11px] text-slate-400 font-semibold block">
                  مسیریابی مستقیم و هوشمند با اپلیکیشن‌ها:
                </span>
                
                <div className="grid grid-cols-3 gap-2">
                  {/* Google Maps Button */}
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=35.469389,50.975694"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative px-2.5 py-2 bg-gradient-to-r from-blue-950/80 to-indigo-950/80 hover:from-blue-600 hover:to-indigo-600 text-blue-300 hover:text-white rounded-lg border border-blue-500/30 hover:border-blue-400 text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm hover:shadow-blue-500/25 active:scale-95"
                  >
                    <Navigation className="w-3.5 h-3.5 text-blue-400 group-hover:text-white transition-colors shrink-0" />
                    <span>گوگل مپ</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 shrink-0" />
                  </a>

                  {/* Neshan Button */}
                  <a
                    href="https://neshan.org/maps/@35.469389,50.975694,16z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative px-2.5 py-2 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 hover:from-emerald-600 hover:to-teal-600 text-emerald-300 hover:text-white rounded-lg border border-emerald-500/30 hover:border-emerald-400 text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm hover:shadow-emerald-500/25 active:scale-95"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white transition-colors shrink-0" />
                    <span>نشان</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 shrink-0" />
                  </a>

                  {/* Waze Button */}
                  <a
                    href="https://waze.com/ul?ll=35.469389,50.975694&navigate=yes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative px-2.5 py-2 bg-gradient-to-r from-cyan-950/80 to-sky-950/80 hover:from-cyan-600 hover:to-sky-600 text-cyan-300 hover:text-white rounded-lg border border-cyan-500/30 hover:border-cyan-400 text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm hover:shadow-cyan-500/25 active:scale-95"
                  >
                    <Navigation className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white transition-colors shrink-0" />
                    <span>ویز (Waze)</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Direct Phone Call */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="text-slate-300 font-semibold">تلفن دفتر فروش:</span>
                </div>
                <a
                  href="tel:02156890790"
                  className="text-sky-400 hover:text-sky-300 ltr-num font-mono text-sm font-bold bg-slate-950 px-2.5 py-1 rounded border border-slate-800"
                >
                  021-56890790
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-right text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} کلیه حقوق مادی و معنوی متعلق به فروشگاه لوازم یدکی دین محمدی می‌باشد.
          </p>
          <div className="flex items-center gap-3 text-slate-400 font-medium">
            <span>ارتباط با پشتیبانی: ۰۲۱۵۶۸۹۰۷۹۰</span>
            <span>•</span>
            <span>تحویل فوری حضوری</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

