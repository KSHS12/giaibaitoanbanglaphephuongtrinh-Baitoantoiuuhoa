import React from 'react';
import { X, BookOpen, CheckCircle2, Lightbulb } from 'lucide-react';
import { MathView } from './MathView';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Phương pháp giải bài toán bằng cách lập PT, Hệ PT, Hệ BPT
              </h2>
              <p className="text-xs text-emerald-400 font-bold">
                Chuẩn SGK Toán THPT (GDPT 2018 — Kết nối tri thức, Cánh diều)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Section: 3 Bước cơ bản */}
        <div className="space-y-5 text-xs sm:text-sm leading-relaxed">
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl space-y-2">
            <div className="font-black text-emerald-300 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Quy trình 3 bước chuẩn mực theo SGK Toán THPT:</span>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-slate-200 pl-1">
              <li>
                <strong className="text-white">Bước 1: Lập phương trình / hệ phương trình / hệ bất phương trình:</strong>
                <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-slate-300 text-xs">
                  <li>Chọn ẩn số và đặt điều kiện thích hợp cho ẩn (kèm đơn vị thực tế).</li>
                  <li>Biểu diễn các đại lượng chưa biết thông qua ẩn và các đại lượng đã biết.</li>
                  <li>Lập bảng phân tích đại lượng (nếu cần) để thấy rõ mối tương quan.</li>
                  <li>Thiết lập phương trình, hệ phương trình hoặc hệ bất phương trình biểu thị mối quan hệ giữa các đại lượng.</li>
                </ul>
              </li>
              <li>
                <strong className="text-white">Bước 2: Giải phương trình / hệ phương trình / hệ bất phương trình:</strong>
                <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-slate-300 text-xs">
                  <li>Với hệ bất phương trình 2 ẩn (Toán 10): Biểu diễn hình học miền nghiệm trên hệ trục tọa độ Oxy, tìm tọa độ các đỉnh của đa giác miền nghiệm và tính giá trị hàm mục tiêu F(x, y) = ax + by tại các đỉnh.</li>
                  <li>Với hệ phương trình bậc nhất: Dùng phương pháp cộng đại số, thế hoặc định thức Gauss/Cramer.</li>
                  <li>Với phương trình bậc hai: Đưa về dạng chính tắc ax² + bx + c = 0, tính biệt thức Δ và tìm nghiệm.</li>
                </ul>
              </li>
              <li>
                <strong className="text-white">Bước 3: Kiểm tra và kết luận:</strong>
                <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-slate-300 text-xs">
                  <li>Đối chiếu các nghiệm tìm được với điều kiện ban đầu của bài toán (loại nghiệm âm, nghiệm không nguyên nếu ẩn là số lượng sản phẩm/người...).</li>
                  <li>Trả lời rõ ràng câu hỏi thực tế của đề bài kèm đầy đủ đơn vị.</li>
                </ul>
              </li>
            </ol>
          </div>

          {/* Section: Công thức các dạng toán thực tế */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Các công thức toán học thực tế thường gặp:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-black text-emerald-400">1. Chuyển động cơ học:</div>
                <p className="text-slate-300">
                  <MathView math="s = v \cdot t \iff v = \frac{s}{t} \iff t = \frac{s}{v}" />
                </p>
                <p className="text-slate-400 text-[11px]">
                  Xuôi dòng: <MathView math="v_x = v_{thực} + v_{nước}" />
                  <br />
                  Ngược dòng: <MathView math="v_{ng} = v_{thực} - v_{nước}" />
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-black text-emerald-400">2. Năng suất & Công việc:</div>
                <p className="text-slate-300">
                  <MathView math="\text{Khối lượng} = \text{Năng suất} \times \text{Thời gian}" />
                </p>
                <p className="text-slate-400 text-[11px]">
                  Làm chung: <MathView math="\frac{1}{x} + \frac{1}{y} = \frac{1}{T_{chung}}" /> (x, y là thời gian hoàn thành riêng).
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-black text-emerald-400">3. Quy hoạch tuyến tính (Toán 10):</div>
                <p className="text-slate-300">
                  <MathView math="F(x, y) = ax + by \longrightarrow \max / \min" />
                </p>
                <p className="text-slate-400 text-[11px]">
                  Giá trị lớn nhất / nhỏ nhất của hàm mục tiêu luôn đạt được tại ít nhất một trong các đỉnh của miền đa giác nghiệm.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-black text-emerald-400">4. Nồng độ & Dung dịch:</div>
                <p className="text-slate-300">
                  <MathView math="C\% = \frac{m_{chất\,tan}}{m_{dung\,dịch}} \times 100\%" />
                </p>
                <p className="text-slate-400 text-[11px]">
                  Bảo toàn khối lượng chất tan: <MathView math="m_{tan\,1} + m_{tan\,2} = m_{tan\,hỗn\,hợp}" />.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-950"
          >
            Đã hiểu & Đóng lại
          </button>
        </div>
      </div>
    </div>
  );
};
