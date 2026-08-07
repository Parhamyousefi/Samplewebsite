import React from 'react';
import { Search, ShieldCheck, Wrench, PhoneCall, UserCheck, LogIn } from 'lucide-react';
import { AdminUser } from '../types';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAdminModal: () => void;
  adminUser: AdminUser | null;
  onLogoutAdmin: () => void;
  onToggleAdminView: () => void;
  isAdminView: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAdminModal,
  adminUser,
  onLogoutAdmin,
  onToggleAdminView,
  isAdminView,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f17]/95 backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-3">
          
          {/* Right side: Logo & Title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 text-slate-950 font-extrabold flex items-center justify-center shadow-md shadow-sky-500/20">
              <Wrench className="w-4 h-4 transform -scale-x-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight font-['Vazirmatn'] text-white">
                  لوازم یدکی <span className="text-sky-400">دین محمدی</span>
                </h1>
                <span className="hidden lg:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-medium">
                  <ShieldCheck className="w-3 h-3 text-sky-400" />
                  اصالت کالا
                </span>
              </div>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-lg mx-2 hidden md:block">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="جستجوی قطعه، کد فنی (OEM) یا مدل خودرو (مثلا: لنت 206)..."
                className="w-full py-1.5 pr-9 pl-9 bg-slate-900 text-slate-100 placeholder-slate-500 text-xs rounded-lg border border-slate-800 focus:border-sky-500 focus:outline-none transition-colors font-['Vazirmatn']"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-2.5 text-[10px] text-slate-400 hover:text-white bg-slate-800 px-1.5 py-0.5 rounded"
                >
                  پاک کردن
                </button>
              )}
            </div>
          </div>

          {/* Left Side: Actions */}
          <div className="flex items-center gap-2">
            
            {/* Phone Call Quick Link */}
            <a
              href="tel:02156890790"
              className="flex items-center gap-1.5 min-h-[38px] px-3.5 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20 active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span className="font-mono text-xs ltr-num">021-56890790</span>
            </a>

            {/* Admin Controls */}
            {adminUser && (
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
                <button
                  onClick={onToggleAdminView}
                  className={`px-2.5 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1 ${
                    isAdminView
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isAdminView ? 'فروشگاه' : 'ادمین'}</span>
                </button>
                <button
                  onClick={onLogoutAdmin}
                  className="px-2 py-1.5 text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded font-semibold"
                  title="خروج از حساب مدیر"
                >
                  خروج
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Mobile Search bar */}
        <div className="pb-2.5 md:hidden">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="جستجوی قطعه، کد فنی OEM یا خودرو..."
              className="w-full py-1.5 pr-8 pl-3 bg-slate-900 text-slate-100 placeholder-slate-500 text-xs rounded-lg border border-slate-800 focus:border-sky-500 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>

      </div>
    </header>
  );
};


