import React from 'react';
import { LogIn, LogOut, GraduationCap } from 'lucide-react';

interface HeaderProps {
  onNewProblem: () => void;
  onOpenTheoryModal?: () => void;
  onOpenGuideModal?: () => void;
  isTeacher: boolean;
  userEmail: string | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewProblem,
  onOpenTheoryModal,
  onOpenGuideModal,
  isTeacher,
  userEmail,
  onOpenAuth,
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 print:hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand title wordmark */}
        <a
          href="/"
          className="text-base sm:text-lg font-black tracking-tight text-white whitespace-nowrap shrink-0 hover:text-emerald-400 transition-colors"
        >
          <span className="text-emerald-400 font-black">Toán THPT</span> — Hệ BPT-QHTT - Thầy Hữu
        </a>

        {/* Zone 2: nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-300">
          <button
            onClick={onOpenTheoryModal}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Lý thuyết SGK
          </button>
          <a
            href="#kho-bai-toan"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Kho bài toán
          </a>
          <a
            href="#cac-dang-toan"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Các dạng toán
          </a>
          <button
            onClick={onOpenGuideModal}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Quy tắc giải 3 bước
          </button>
        </nav>

        {/* Zone 3: auth + primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {isTeacher ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 rounded-lg px-2.5 py-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="truncate max-w-[120px]">{userEmail}</span>
              </span>
              <button
                onClick={onSignOut}
                className="p-2 text-slate-400 hover:text-rose-400 rounded-lg transition cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-emerald-400 transition px-2.5 py-2 rounded-lg cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Giáo viên</span>
            </button>
          )}
          <button
            onClick={onNewProblem}
            className="px-4 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md shadow-emerald-950 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Chọn bài toán
          </button>
        </div>
      </div>
    </header>
  );
};
