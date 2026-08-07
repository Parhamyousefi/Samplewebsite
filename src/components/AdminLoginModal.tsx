import React, { useState } from 'react';
import { loginAdmin } from '../api/client';
import { AdminUser } from '../types';
import { X, Lock, User, ShieldCheck, KeyRound, Eye, EyeOff } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AdminUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await loginAdmin({ username, password });
      setLoading(false);
      onSuccess(user);
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'ورود ناموفق بود.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#050608]/90 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Top Header */}
        <div className="p-6 border-b border-white/10 text-center bg-white/5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-white font-['Vazirmatn']">ورود به پنل مدیریت لوازم یدکی دین محمدی</h3>
          <p className="text-xs text-gray-400 mt-1">مدیریت قیمت‌ها، موجودی انبار و استعلام خریداران</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-gray-300 space-y-1 backdrop-blur-md">
            <p className="font-semibold text-blue-300">اطلاعات پیش‌فرض ورود مدیر:</p>
            <p className="font-mono ltr-num">نام کاربری: <span className="text-white">admin</span> | کلمه عبور: <span className="text-white">admin123</span></p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              نام کاربری مدیر
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pr-9 pl-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none ltr-num"
              />
              <User className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              کلمه عبور
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-9 pl-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:border-blue-500 focus:outline-none ltr-num"
              />
              <KeyRound className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            {loading ? 'در حال تایید اعتبار...' : 'ورود به پنل مدیریت'}
          </button>

        </form>

      </div>
    </div>
  );
};
