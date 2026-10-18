import React, { useRef } from 'react';
import { ProblemModel } from '../types/problemTypes';
import { MathView } from './MathView';
import { SummaryTable } from './SummaryTable';
import { FeasibleRegionCanvas } from './FeasibleRegionCanvas';
import { VertexTable } from './VertexTable';
import { Printer, Download, CheckCircle, HelpCircle, Target, Lightbulb, FileText } from 'lucide-react';

interface ProblemReportViewProps {
  problem: ProblemModel;
}

export const ProblemReportView: React.FC<ProblemReportViewProps> = ({ problem }) => {
  const reportRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const textContent = `
======================================================
LỜI GIẢI CHI TIẾT BÀI TOÁN TOÁN THPT - THẦY HỮU
Chương trình GDPT 2018 - THPT Lê Hồng Phong
======================================================
Bài toán: ${problem.title}
Thể loại: ${problem.categoryName} (${problem.grade})
Chủ đề: ${problem.topicName}

ĐỀ BÀI:
${problem.statement}

I. BƯỚC 1: LẬP PHƯƠNG TRÌNH / HỆ PHƯƠNG TRÌNH / HỆ BẤT PHƯƠNG TRÌNH
1. Chọn ẩn và đặt điều kiện:
${problem.variables.map((v) => ` - Gọi ${v.symbol} là: ${v.meaning} (đơn vị: ${v.unit}, điều kiện: ${v.condition})`).join('\n')}

2. Lập luận thiết lập:
${problem.setupExplanation.map((exp, i) => ` (${i + 1}) ${exp}`).join('\n')}

Hệ / Phương trình biểu thị mối liên hệ:
${problem.equationLatexList.join('\n')}

II. BƯỚC 2: GIẢI
Phương pháp: ${problem.solutionSteps.methodTitle}
${problem.solutionSteps.subSteps.map((st, i) => ` [${i + 1}] ${st.title}\n     ${st.content}`).join('\n')}

III. BƯỚC 3: KIỂM TRA ĐIỀU KIỆN VÀ KẾT LUẬN
${problem.conclusion.overview}
Các đáp số cụ thể:
${problem.conclusion.finalAnswers.map((ans) => ` + ${ans.label}: ${ans.value}`).join('\n')}
${problem.conclusion.practicalImplication ? `Ý nghĩa thực tế: ${problem.conclusion.practicalImplication}` : ''}
======================================================
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Loi_giai_${problem.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      ref={reportRef}
      className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-8 text-slate-200 print:bg-white print:text-slate-900 print:border-none print:shadow-none print:p-0"
    >
      {/* Report Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 print:border-slate-300 pb-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 print:border-slate-400 print:bg-slate-100 print:text-slate-800 font-extrabold">
              {problem.grade}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-emerald-400 font-black uppercase tracking-wider text-[11px]">
              {problem.categoryName}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-300 font-bold">{problem.topicName}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white print:text-black tracking-tight">
            {problem.title}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0 print:hidden">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="In đề và bài giải chuẩn A4"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>In lời giải</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md shadow-emerald-950/60 flex items-center gap-1.5 cursor-pointer"
            title="Tải văn bản bài giải (.txt)"
          >
            <Download className="w-4 h-4" />
            <span>Tải lời giải</span>
          </button>
        </div>
      </div>

      {/* Problem Statement Card */}
      <section className="bg-slate-950/70 border border-slate-800 print:bg-slate-50 print:border-slate-300 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400 print:text-emerald-800">
          <FileText className="w-4 h-4" />
          <span>Đề bài toán thực tế THPT:</span>
        </div>
        <p className="text-sm sm:text-base text-slate-100 print:text-slate-900 leading-relaxed font-medium">
          {problem.statement}
        </p>
        {problem.practicalContext && (
          <div className="text-xs text-slate-400 print:text-slate-600 flex items-center gap-1.5 pt-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{problem.practicalContext}</span>
          </div>
        )}
      </section>

      {/* SECTION I: STEP 1 - SETUP */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800 print:border-slate-300">
          <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
            I
          </div>
          <h3 className="text-base sm:text-lg font-black text-emerald-400 print:text-emerald-800 uppercase tracking-tight">
            Bước 1: Chọn ẩn, đặt điều kiện và lập quan hệ toán học
          </h3>
        </div>

        {/* 1. Variable definitions */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300 print:text-slate-800">
            1. Chọn ẩn số và xác định điều kiện thích hợp:
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {problem.variables.map((v, idx) => (
              <li
                key={idx}
                className="p-3 bg-slate-950/80 border border-slate-800 print:bg-white print:border-slate-300 rounded-xl space-y-1"
              >
                <div className="font-extrabold text-white print:text-slate-900">
                  Gọi <span className="text-emerald-400 print:text-emerald-700 font-mono text-sm">{v.symbol}</span> là {v.meaning.toLowerCase()} (đơn vị: <span className="italic">{v.unit}</span>).
                </div>
                <div className="text-slate-400 print:text-slate-600 font-mono text-[11px] flex items-center gap-1">
                  <span>Điều kiện:</span>
                  <MathView math={v.condition} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Summary Table if present */}
        {problem.summaryTable && (
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-slate-300 print:text-slate-800 flex items-center gap-1.5">
              <span>2. Bảng phân tích và liên hệ các đại lượng:</span>
            </div>
            <SummaryTable data={problem.summaryTable} />
          </div>
        )}

        {/* 3. Logical explanations */}
        <div className="space-y-2 pt-1 text-xs sm:text-sm">
          <div className="text-xs font-bold text-slate-300 print:text-slate-800">
            3. Lập luận biểu diễn các đại lượng:
          </div>
          <ul className="space-y-2 pl-2">
            {problem.setupExplanation.map((exp, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-300 print:text-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                <span>{exp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Established mathematical system */}
        <div className="space-y-2 pt-1">
          <div className="text-xs font-bold text-slate-300 print:text-slate-800">
            4. Hệ phương trình / Hệ bất phương trình được thiết lập:
          </div>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 print:bg-slate-50 print:border-slate-300 space-y-2 flex flex-col items-center justify-center">
            {problem.equationLatexList.map((eq, idx) => (
              <div key={idx} className="text-sm sm:text-base">
                <MathView math={eq} displayMode={true} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION II: STEP 2 - SOLVE */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800 print:border-slate-300">
          <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
            II
          </div>
          <h3 className="text-base sm:text-lg font-black text-emerald-400 print:text-emerald-800 uppercase tracking-tight">
            Bước 2: Giải toán đại số và hình học
          </h3>
        </div>

        <div className="text-xs font-extrabold text-emerald-300 print:text-emerald-800 flex items-center gap-2">
          <Target className="w-4 h-4" />
          <span>Phương pháp: {problem.solutionSteps.methodTitle}</span>
        </div>

        {/* Sub-steps of solution */}
        <div className="space-y-3">
          {problem.solutionSteps.subSteps.map((st, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-950/70 border border-slate-800 print:bg-white print:border-slate-200 rounded-2xl space-y-2"
            >
              <div className="text-xs font-bold text-emerald-400 print:text-emerald-700">
                {st.title}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 print:text-slate-800 leading-relaxed">
                {st.content}
              </p>
              {st.mathLatex && (
                <div className="pt-1 overflow-x-auto text-center">
                  <MathView math={st.mathLatex} displayMode={true} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* If Linear Programming: Interactive Coordinate Graph (WHITE BACKGROUND) */}
        {problem.linearProgrammingData && (
          <div className="space-y-4 pt-2">
            <div className="text-xs font-black text-emerald-400 print:text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider">
              <span>Biểu diễn miền nghiệm trên mặt phẳng tọa độ Oxy (Nền trắng):</span>
            </div>

            <FeasibleRegionCanvas
              constraints={problem.linearProgrammingData.constraints}
              objective={problem.linearProgrammingData.objective}
              vertices={problem.solutionSteps.vertices}
              optimalVertex={problem.solutionSteps.vertices?.find((v) => v.isOptimal)}
              xRange={problem.linearProgrammingData.xRange}
              yRange={problem.linearProgrammingData.yRange}
            />

            {/* Table of Vertex Values (WHITE BACKGROUND) */}
            {problem.solutionSteps.vertices && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-300 print:text-slate-800">
                  Bảng so sánh giá trị hàm mục tiêu tại các đỉnh:
                </div>
                <VertexTable
                  vertices={problem.solutionSteps.vertices}
                  objective={problem.linearProgrammingData.objective}
                />
              </div>
            )}
          </div>
        )}

        {/* If Quadratic Equation: Root acceptance/rejection list */}
        {problem.solutionSteps.roots && problem.solutionSteps.roots.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-slate-300 print:text-slate-800">
              Đối chiếu nghiệm tìm được với điều kiện bài toán:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {problem.solutionSteps.roots.map((r, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                    r.isAccepted
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 print:bg-emerald-50 print:text-emerald-900'
                      : 'bg-rose-950/40 border-rose-500/50 text-rose-200 print:bg-rose-50 print:text-rose-900'
                  }`}
                >
                  <span
                    className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                      r.isAccepted ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {r.isAccepted ? 'NHẬN' : 'LOẠI'}
                  </span>
                  <div>
                    <div className="font-bold font-mono text-sm">
                      Nghiệm: {r.latex}
                    </div>
                    <div className="text-[11px] opacity-90 mt-0.5">{r.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* SECTION III: STEP 3 - CONCLUSION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800 print:border-slate-300">
          <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
            III
          </div>
          <h3 className="text-base sm:text-lg font-black text-emerald-400 print:text-emerald-800 uppercase tracking-tight">
            Bước 3: Kết luận bài toán thực tế
          </h3>
        </div>

        <div className="p-5 bg-gradient-to-br from-emerald-950/50 to-slate-950 border border-emerald-500/50 rounded-2xl space-y-4 print:bg-emerald-50/50 print:border-emerald-300">
          <div className="flex items-center gap-2 text-xs font-black text-emerald-400 print:text-emerald-800 uppercase tracking-wider">
            <CheckCircle className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
            <span>Kết quả trả lời câu hỏi của đề bài:</span>
          </div>

          <p className="text-sm sm:text-base text-white print:text-slate-900 font-semibold leading-relaxed">
            {problem.conclusion.overview}
          </p>

          {/* Key Answers Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {problem.conclusion.finalAnswers.map((ans, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-900/90 print:bg-white border border-slate-800 print:border-slate-300 rounded-xl space-y-1"
              >
                <div className="text-xs text-slate-400 print:text-slate-600 font-medium">
                  {ans.label}
                </div>
                <div className="text-base font-black text-emerald-400 print:text-emerald-700">
                  {ans.value}
                </div>
              </div>
            ))}
          </div>

          {problem.conclusion.practicalImplication && (
            <div className="text-xs text-slate-300 print:text-slate-700 pt-2 border-t border-emerald-900/50 print:border-emerald-200">
              <strong className="text-emerald-400 print:text-emerald-800">Ý nghĩa thực tiễn & Lời khuyên:</strong>{' '}
              {problem.conclusion.practicalImplication}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
