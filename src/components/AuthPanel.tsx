import React, { useState } from 'react';
import { LogIn, LogOut, UserPlus, X, GraduationCap, Mail, Lock } from 'lucide-react';

interface AuthPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isTeacher: boolean;
  userEmail: string | null;
  onSignIn: (email: string, password: string) => Promise<{ error?: string }>;
  onSignUp: (email: string, password: string) => Promise<{ error?: string }>;
  onSignOut: () => Promise<void>;
}

export const AuthPanel: React.FC<AuthPanelProps> = ({
  isOpen,
  onClose,
  isTeacher,
  userEmail,
  onSignIn,
  onSignUp,
  onSignOut,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Vui lòng nhập đủ email và mật khẩu.');
      return;
    }
    setBusy(true);
    const result = mode === 'signin' ? await onSignIn(email, password) : await onSignUp(email, password);
    setBusy(false);
    if (result.error) {
      setError(result.error);
    } else {
      setEmail('');
      setPassword('');
      setError('');
      onClose();
    }
  };

  const handleSignOut = async () => {
    await onSignOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Khu vực giáo viên</h2>
              <p className="text-xs text-slate-400">Đăng nhập để xuất bản câu hỏi</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isTeacher ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-4 text-center">
              <p className="text-sm font-bold text-emerald-300">Đã đăng nhập</p>
              <p className="text-xs text-slate-300 mt-1 break-all">{userEmail}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Đăng xuất
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2 p-1 bg-slate-950 rounded-xl">
              <button
                onClick={() => setMode('signin')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  mode === 'signin' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 inline mr-1" /> Đăng nhập
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  mode === 'signup' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 inline mr-1" /> Tạo tài khoản
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="giaoVien@truong.edu.vn"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Mật khẩu
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              {error && <p className="text-xs font-semibold text-rose-400 bg-rose-950/30 border border-rose-500/20 rounded-lg px-3 py-2">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-black text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {busy ? 'Đang xử lý...' : mode === 'signin' ? 'Đăng nhập' : 'Tạo tài khoản'}
              </button>
            </form>
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              {mode === 'signup'
                ? 'Tài khoản giáo viên cho phép thêm, sửa, xóa và xuất bản câu hỏi vào kho chung.'
                : 'Chỉ giáo viên đã đăng nhập mới được thay đổi câu hỏi.'}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
