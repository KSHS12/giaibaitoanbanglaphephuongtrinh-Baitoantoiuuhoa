import React, { useState } from 'react';
import { Header } from './components/Header';
import { ProblemInput } from './components/ProblemInput';
import { ProblemReportView } from './components/ProblemReportView';
import { TheoryModal } from './components/TheoryModal';
import { Watermark } from './components/Watermark';
import { PROBLEM_PRESETS } from './math/problemPresets';
import { ProblemModel } from './types/problemTypes';

export default function App() {
  const [currentProblem, setCurrentProblem] = useState<ProblemModel>(PROBLEM_PRESETS[0]);
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);

  const handleSelectProblem = (problem: ProblemModel) => {
    setCurrentProblem(problem);
    // Smooth scroll down to solution report
    setTimeout(() => {
      const el = document.getElementById('loi-giai-chi-tiet');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleNewProblem = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-600 selection:text-white relative">
      {/* Floating Centered Watermark that travels across the page */}
      <Watermark />

      {/* 3-Zone Header Contract */}
      <Header
        onNewProblem={handleNewProblem}
        onOpenTheoryModal={() => setIsTheoryOpen(true)}
        onOpenGuideModal={() => setIsTheoryOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-7">
        {/* Title & Introduction */}
        <div className="space-y-2.5 text-center sm:text-left print:hidden">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-bold text-slate-400">
            <span className="text-emerald-400 font-black">Chương trình GDPT 2018</span>
            <span aria-hidden="true">·</span>
            <span>Toán 10 - 11 - 12 Kết nối tri thức</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-300 font-extrabold">Thầy Hữu — THPT Lê Hồng Phong</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            Giải bài toán bằng cách lập phương trình, hệ phương trình, hệ bất phương trình
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Hệ thống phương pháp và lời giải chuẩn mực: chọn ẩn và đặt điều kiện, lập bảng phân tích đại lượng, biểu diễn miền nghiệm hình học <span className="text-emerald-400 font-bold">Oxy</span> trên nền trắng, tính toán nghiệm đại số chính xác và kết luận bài toán thực tiễn.
          </p>
        </div>

        {/* Problem Selector & Custom Problem Builder */}
        <section id="kho-bai-toan" className="print:hidden">
          <ProblemInput currentProblem={currentProblem} onSelectProblem={handleSelectProblem} />
        </section>

        {/* Detailed Solution Report */}
        <section id="loi-giai-chi-tiet">
          <ProblemReportView problem={currentProblem} />
        </section>

        {/* Educational Reference Cards (3 nhóm bài toán) */}
        <section id="cac-dang-toan" className="pt-6 border-t border-slate-800 space-y-4 print:hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white">
              Phạm vi các dạng bài toán <span className="text-emerald-400 font-black">Toán THPT</span>
            </h3>
            <span className="text-xs text-emerald-400 font-extrabold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              Chuẩn GDPT 2018
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-2">
              <div className="font-extrabold text-emerald-400 text-base">1. Hệ BPT & Quy hoạch tuyến tính</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Trọng tâm Toán 10 mới: Tối ưu hóa lợi nhuận, chi phí dinh dưỡng, phân bổ ngân sách. Biểu diễn miền nghiệm đa giác trên mặt phẳng Oxy nền trắng, tìm min/max của F(x, y) = ax + by tại các đỉnh.
              </p>
              <div className="text-xs font-mono font-bold text-emerald-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                F(x, y) = 400x + 200y → Max
              </div>
            </div>

            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-2">
              <div className="font-extrabold text-emerald-400 text-base">2. Lập hệ phương trình</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hệ phương trình bậc nhất 2 ẩn và 3 ẩn: Bài toán năng suất làm chung làm riêng, chuyển động ngược chiều/cùng chiều, nồng độ dung dịch hóa học, cân bằng phản ứng, phân bổ danh mục đầu tư tài chính.
              </p>
              <div className="text-xs font-mono font-bold text-emerald-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                1/x + 1/y = 1/12, 4/x + 10/y = 1/2
              </div>
            </div>

            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-2">
              <div className="font-extrabold text-emerald-400 text-base">3. Lập phương trình bậc hai</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bài toán chuyển động xuôi - ngược dòng sông với vận tốc nước v ± v_n, xe tăng/giảm vận tốc đến sớm, hình học lối đi chu vi diện tích đất đai, tối ưu giá bán kích cầu doanh thu.
              </p>
              <div className="text-xs font-mono font-bold text-emerald-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                45/(v+3) + 18/(v-3) = 9/4
              </div>
            </div>
          </div>
        </section>

        {/* Pedagogical Guidelines */}
        <section className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl text-xs text-slate-300 space-y-2.5 print:hidden">
          <div className="font-extrabold text-emerald-400 text-sm">Lưu ý sư phạm & phương pháp giải:</div>
          <p>
            • Khi đặt ẩn, luôn ghi rõ <span className="text-emerald-400 font-bold">đơn vị đo</span> và <span className="text-emerald-400 font-bold">điều kiện ràng buộc</span> (ví dụ: x &gt; 0, x nguyên dương đối với số lượng sản phẩm, hoặc x &gt; v_n đối với chuyển động ngược dòng sông).
          </p>
          <p>
            • Bảng phân tích số liệu đại lượng giúp học sinh nhìn nhận trực quan mối liên hệ giữa các đại lượng trước khi viết thành phương trình đại số.
          </p>
          <p>
            • Trong bài toán Quy hoạch tuyến tính (Toán 10), định lý toán học khẳng định hàm mục tiêu tuyến tính đạt giá trị lớn nhất hoặc nhỏ nhất tại ít nhất một đỉnh của miền đa giác lồi các nghiệm.
          </p>
          <p>
            • Bạn có thể dùng nút <span className="text-emerald-400 font-bold">“In lời giải”</span> hoặc <span className="text-emerald-400 font-bold">“Tải lời giải”</span> để xuất đề bài và hướng dẫn chấm phục vụ giảng dạy, kiểm tra định kỳ hoặc học tập ôn luyện.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 mt-12 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            Giải Toán Bằng Cách Lập PT, Hệ PT, Hệ BPT - Thầy Hữu — Trường THPT Lê Hồng Phong — Chương trình GDPT 2018.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTheoryOpen(true)}
              className="hover:text-emerald-400 transition-colors cursor-pointer font-bold"
            >
              Lý thuyết SGK
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleNewProblem}
              className="hover:text-emerald-400 transition-colors cursor-pointer font-bold"
            >
              Lên đầu trang
            </button>
          </div>
        </div>
      </footer>

      {/* Theory Reference Modal */}
      <TheoryModal isOpen={isTheoryOpen} onClose={() => setIsTheoryOpen(false)} />
    </div>
  );
}
