import React, { useRef } from 'react';
import { ProblemModel } from '../types/problemTypes';
import { MathView } from './MathView';
import { SummaryTable } from './SummaryTable';
import { FeasibleRegionCanvas } from './FeasibleRegionCanvas';
import { VertexTable } from './VertexTable';
import { Printer, Download, CheckCircle, Target, Lightbulb, FileText } from 'lucide-react';

interface ProblemReportViewProps {
  problem: ProblemModel;
}

/** Convert a LaTeX string to readable plain text for Word export. */
const latexToText = (latex: string): string => {
  let s = latex;
  s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)');
  s = s.replace(/\\le\b/g, '≤');
  s = s.replace(/\\ge\b/g, '≥');
  s = s.replace(/\\ne\b/g, '≠');
  s = s.replace(/\\approx\b/g, '≈');
  s = s.replace(/\\infty\b/g, '∞');
  s = s.replace(/\\Delta\b/g, 'Δ');
  s = s.replace(/\\sqrt\{([^{}]*)\}/g, '√($1)');
  s = s.replace(/\\times\b/g, '×');
  s = s.replace(/\\div\b/g, '÷');
  s = s.replace(/\\cdot\b/g, '·');
  s = s.replace(/\\pm\b/g, '±');
  s = s.replace(/\\mp\b/g, '∓');
  s = s.replace(/\\implies\b/g, '=>');
  s = s.replace(/\\iff\b/g, '<=>');
  s = s.replace(/\\Leftrightarrow\b/g, '<=>');
  s = s.replace(/\\Rightarrow\b/g, '=>');
  s = s.replace(/\\Leftarrow\b/g, '<=');
  s = s.replace(/\\ln\b/g, 'ln');
  s = s.replace(/\\log\b/g, 'log');
  s = s.replace(/\\sum\b/g, 'Σ');
  s = s.replace(/\\prod\b/g, 'Π');
  s = s.replace(/\\alpha\b/g, 'α');
  s = s.replace(/\\beta\b/g, 'β');
  s = s.replace(/\\gamma\b/g, 'γ');
  s = s.replace(/\\lambda\b/g, 'λ');
  s = s.replace(/\\mu\b/g, 'μ');
  s = s.replace(/\\pi\b/g, 'π');
  s = s.replace(/\\theta\b/g, 'θ');
  s = s.replace(/\\phi\b/g, 'φ');
  s = s.replace(/\\Omega\b/g, 'Ω');
  s = s.replace(/\\in\b/g, '∈');
  s = s.replace(/\\notin\b/g, '∉');
  s = s.replace(/\\subset\b/g, '⊂');
  s = s.replace(/\\subseteq\b/g, '⊆');
  s = s.replace(/\\cup\b/g, '∪');
  s = s.replace(/\\cap\b/g, '∩');
  s = s.replace(/\\emptyset\b/g, '∅');
  s = s.replace(/\\forall\b/g, '∀');
  s = s.replace(/\\exists\b/g, '∃');
  s = s.replace(/\\mathbb\{([^{}]*)\}/g, '$1');
  s = s.replace(/\\text\{([^{}]*)\}/g, '$1');
  s = s.replace(/\\quad\b/g, '  ');
  s = s.replace(/\\qquad\b/g, '    ');
  s = s.replace(/\\,\b/g, ' ');
  s = s.replace(/\\;/g, ' ');
  s = s.replace(/\\:/g, ' ');
  s = s.replace(/\\!/g, '');
  s = s.replace(/\\left\(/g, '(');
  s = s.replace(/\\right\)/g, ')');
  s = s.replace(/\\left\[/g, '[');
  s = s.replace(/\\right\]/g, ']');
  s = s.replace(/\\left\{/g, '{');
  s = s.replace(/\\right\}/g, '}');
  s = s.replace(/\\begin\{cases\}/g, '');
  s = s.replace(/\\end\{cases\}/g, '');
  s = s.replace(/\\begin\{align\*?\}/g, '');
  s = s.replace(/\\end\{align\*?\}/g, '');
  s = s.replace(/\\begin\{matrix\}/g, '');
  s = s.replace(/\\end\{matrix\}/g, '');
  s = s.replace(/\\begin\{pmatrix\}/g, '(');
  s = s.replace(/\\end\{pmatrix\}/g, ')');
  s = s.replace(/\\begin\{vmatrix\}/g, '|');
  s = s.replace(/\\end\{vmatrix\}/g, '|');
  s = s.replace(/\\\\/g, '\n  ');
  s = s.replace(/\\circ\b/g, '°');
  s = s.replace(/\\degree\b/g, '°');
  s = s.replace(/\\rightarrow\b/g, '→');
  s = s.replace(/\\leftarrow\b/g, '←');
  s = s.replace(/\\to\b/g, '→');
  s = s.replace(/\\partial\b/g, '∂');
  s = s.replace(/\\nabla\b/g, '∇');
  s = s.replace(/\\int\b/g, '∫');
  s = s.replace(/\\oint\b/g, '∮');
  s = s.replace(/\\geq\b/g, '≥');
  s = s.replace(/\\leq\b/g, '≤');
  s = s.replace(/\\neq\b/g, '≠');
  s = s.replace(/\\leqslant\b/g, '≤');
  s = s.replace(/\\geqslant\b/g, '≥');
  s = s.replace(/\\doteq\b/g, '≈');
  s = s.replace(/\\equiv\b/g, '≡');
  s = s.replace(/\\sim\b/g, '~');
  s = s.replace(/\\propto\b/g, '∝');
  s = s.replace(/\\angle\b/g, '∠');
  s = s.replace(/\\perp\b/g, '⊥');
  s = s.replace(/\\parallel\b/g, '∥');
  s = s.replace(/\\overline\{([^{}]*)\}/g, '$1');
  s = s.replace(/\\underline\{([^{}]*)\}/g, '$1');
  s = s.replace(/\\hat\{([^{}]*)\}/g, '$1');
  s = s.replace(/\\vec\{([^{}]*)\}/g, '$1');
  s = s.replace(/\\bar\{([^{}]*)\}/g, '$1');
  s = s.replace(/\\dot\{([^{}]*)\}/g, '$1');
  // Remove remaining backslash commands
  s = s.replace(/\\[a-zA-Z]+/g, '');
  // Clean up braces that were part of LaTeX grouping
  s = s.replace(/\{([^{}]*)\}/g, '$1');
  // Clean up extra whitespace
  s = s.replace(/\s+/g, ' ').trim();
  return s;
};

const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

export const ProblemReportView: React.FC<ProblemReportViewProps> = ({ problem }) => {
  const reportRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const equationsHtml = problem.equationLatexList
      .map((eq) => `<p style="font-family:'Cambria Math',serif;font-size:14pt;text-align:center;margin:6pt 0;">${escapeHtml(latexToText(eq))}</p>`)
      .join('');

    const subStepsHtml = problem.solutionSteps.subSteps
      .map(
        (st) => `
        <p style="font-weight:bold;font-size:12pt;color:#047857;margin-top:12pt;margin-bottom:4pt;">${escapeHtml(st.title)}</p>
        <p style="font-size:12pt;margin-bottom:4pt;">${escapeHtml(st.content)}</p>
        ${st.mathLatex ? `<p style="font-family:'Cambria Math',serif;font-size:13pt;text-align:center;margin:6pt 0;">${escapeHtml(latexToText(st.mathLatex))}</p>` : ''}
      `
      )
      .join('');

    const variablesHtml = problem.variables
      .map((v) => `<p style="font-size:12pt;margin:4pt 0;">- Gọi ${escapeHtml(v.symbol)} là: ${escapeHtml(v.meaning.toLowerCase())} (đơn vị: ${escapeHtml(v.unit)}, điều kiện: ${escapeHtml(latexToText(v.condition))}).</p>`)
      .join('');

    const setupHtml = problem.setupExplanation
      .map((exp, i) => `<p style="font-size:12pt;margin:4pt 0;">(${i + 1}) ${escapeHtml(exp)}</p>`)
      .join('');

    const answersHtml = problem.conclusion.finalAnswers
      .map((ans) => `<p style="font-size:12pt;margin:4pt 0;">+ ${escapeHtml(ans.label)}: ${escapeHtml(ans.value)}</p>`)
      .join('');

    const summaryTableHtml = problem.summaryTable
      ? `
        <h3 style="font-size:13pt;color:#047857;margin-top:14pt;">${escapeHtml(problem.summaryTable.title)}</h3>
        <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;font-size:11pt;width:100%;margin-top:6pt;">
          <thead>
            <tr style="background:#d1fae5;font-weight:bold;">
              ${problem.summaryTable.headers.map((h) => `<th style="border:1px solid #ccc;">${escapeHtml(h)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${problem.summaryTable.rows
              .map(
                (row) => `<tr>${row.map((cell) => `<td style="border:1px solid #ccc;">${escapeHtml(cell)}</td>`).join('')}</tr>`
              )
              .join('')}
          </tbody>
        </table>
      `
      : '';

    const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>${escapeHtml(problem.title)}</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml>
<![endif]-->
<style>
@page { size: A4; margin: 2cm; }
body { font-family: 'Times New Roman', serif; font-size: 12pt; color: #1e293b; line-height: 1.6; }
h1 { font-size: 16pt; color: #047857; text-align: center; margin-bottom: 4pt; }
h2 { font-size: 13pt; color: #047857; border-bottom: 2px solid #047857; padding-bottom: 3pt; margin-top: 18pt; }
h3 { font-size: 12pt; color: #065f46; margin-top: 12pt; }
.subtitle { text-align: center; font-size: 11pt; color: #64748b; margin-bottom: 16pt; }
</style>
</head>
<body>
<h1>LỜI GIẢI CHI TIẾT BÀI TOÁN THPT</h1>
<p class="subtitle">Chương trình GDPT 2018 - THPT Lê Hồng Phong</p>

<h2>Đề bài</h2>
<p style="font-size:12pt;font-weight:bold;">${escapeHtml(problem.statement)}</p>
${problem.practicalContext ? `<p style="font-size:11pt;color:#64748b;font-style:italic;">${escapeHtml(problem.practicalContext)}</p>` : ''}

<h2>I. Bước 1: Chọn ẩn, đặt điều kiện và lập quan hệ toán học</h2>
<h3>1. Chọn ẩn số và điều kiện:</h3>
${variablesHtml}
${summaryTableHtml}
<h3>2. Lập luận thiết lập:</h3>
${setupHtml}
<h3>3. Hệ phương trình / Phương trình được thiết lập:</h3>
${equationsHtml}

<h2>II. Bước 2: Giải</h2>
<p style="font-size:12pt;font-weight:bold;color:#047857;">Phương pháp: ${escapeHtml(problem.solutionSteps.methodTitle)}</p>
${subStepsHtml}
${
  problem.solutionSteps.roots && problem.solutionSteps.roots.length > 0
    ? `<h3>Đối chiếu nghiệm với điều kiện:</h3>${problem.solutionSteps.roots
        .map(
          (r) =>
            `<p style="font-size:12pt;margin:4pt 0;">[${r.isAccepted ? 'NHẬN' : 'LOẠI'}] Nghiệm: ${escapeHtml(latexToText(r.latex))} - ${escapeHtml(r.reason)}</p>`
        )
        .join('')}`
    : ''
}

<h2>III. Bước 3: Kết luận</h2>
<p style="font-size:12pt;">${escapeHtml(problem.conclusion.overview)}</p>
${answersHtml}
${problem.conclusion.practicalImplication ? `<p style="font-size:11pt;font-style:italic;margin-top:8pt;"><b>Ý nghĩa thực tiễn:</b> ${escapeHtml(problem.conclusion.practicalImplication)}</p>` : ''}
</body>
</html>`;

    const blob = new Blob(['\ufeff' + html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Loi_giai_${problem.id}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      ref={reportRef}
      className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-xl space-y-8 text-slate-800 print:border-none print:shadow-none print:p-0"
    >
      {/* Report Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="text-emerald-600 font-black uppercase tracking-wider text-[11px]">
              {problem.categoryName}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500 font-bold">{problem.topicName}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {problem.title}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0 print:hidden">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="In đề và bài giải chuẩn A4"
          >
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>In lời giải</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md shadow-emerald-200 flex items-center gap-1.5 cursor-pointer"
            title="Tải lời giải ra file Word (.doc)"
          >
            <Download className="w-4 h-4" />
            <span>Tải file Word</span>
          </button>
        </div>
      </div>

      {/* Problem Statement */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-600">
          <FileText className="w-4 h-4" />
          <span>Đề bài toán thực tế THPT:</span>
        </div>
        <p className="text-sm sm:text-base text-slate-900 leading-relaxed font-medium">
          {problem.statement}
        </p>
        {problem.practicalContext && (
          <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{problem.practicalContext}</span>
          </div>
        )}
      </section>

      {/* SECTION I: STEP 1 - SETUP */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
          <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
            I
          </div>
          <h3 className="text-base sm:text-lg font-black text-emerald-700 uppercase tracking-tight">
            Bước 1: Chọn ẩn, đặt điều kiện và lập quan hệ toán học
          </h3>
        </div>

        {/* 1. Variable definitions */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-700">
            1. Chọn ẩn số và xác định điều kiện thích hợp:
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {problem.variables.map((v, idx) => (
              <li
                key={idx}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1"
              >
                <div className="font-extrabold text-slate-900">
                  Gọi <span className="text-emerald-600 font-mono text-sm">{v.symbol}</span> là {v.meaning.toLowerCase()} (đơn vị: <span className="italic">{v.unit}</span>).
                </div>
                <div className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
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
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>2. Bảng phân tích và liên hệ các đại lượng:</span>
            </div>
            <SummaryTable data={problem.summaryTable} />
          </div>
        )}

        {/* 3. Logical explanations */}
        <div className="space-y-2 pt-1 text-xs sm:text-sm">
          <div className="text-xs font-bold text-slate-700">
            3. Lập luận biểu diễn các đại lượng:
          </div>
          <ul className="space-y-2 pl-2">
            {problem.setupExplanation.map((exp, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                <span>{exp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Established mathematical system */}
        <div className="space-y-2 pt-1">
          <div className="text-xs font-bold text-slate-700">
            4. Hệ phương trình / Hệ bất phương trình được thiết lập:
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 flex flex-col items-center justify-center">
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
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
          <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
            II
          </div>
          <h3 className="text-base sm:text-lg font-black text-emerald-700 uppercase tracking-tight">
            Bước 2: Giải toán đại số và hình học
          </h3>
        </div>

        <div className="text-xs font-extrabold text-emerald-600 flex items-center gap-2">
          <Target className="w-4 h-4" />
          <span>Phương pháp: {problem.solutionSteps.methodTitle}</span>
        </div>

        {/* Sub-steps of solution — continuous white flow, separated by subtle dividers */}
        <div className="space-y-0">
          {problem.solutionSteps.subSteps.map((st, idx) => (
            <div
              key={idx}
              className={`py-4 space-y-2 ${idx > 0 ? 'border-t border-slate-200' : ''}`}
            >
              <div className="text-xs font-bold text-emerald-600">
                {st.title}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
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

        {/* If Linear Programming: Interactive Coordinate Graph */}
        {problem.linearProgrammingData && (
          <div className="space-y-4 pt-2">
            <div className="text-xs font-black text-emerald-600 flex items-center gap-1.5 uppercase tracking-wider">
              <span>Biểu diễn miền nghiệm trên mặt phẳng tọa độ Oxy:</span>
            </div>

            <FeasibleRegionCanvas
              constraints={problem.linearProgrammingData.constraints}
              objective={problem.linearProgrammingData.objective}
              vertices={problem.solutionSteps.vertices}
              optimalVertex={problem.solutionSteps.vertices?.find((v) => v.isOptimal)}
              xRange={problem.linearProgrammingData.xRange}
              yRange={problem.linearProgrammingData.yRange}
            />

            {/* Table of Vertex Values */}
            {problem.solutionSteps.vertices && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-700">
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
            <div className="text-xs font-bold text-slate-700">
              Đối chiếu nghiệm tìm được với điều kiện bài toán:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {problem.solutionSteps.roots.map((r, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                    r.isAccepted
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
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
                    <div className="text-[11px] opacity-80 mt-0.5">{r.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* SECTION III: STEP 3 - CONCLUSION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
          <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
            III
          </div>
          <h3 className="text-base sm:text-lg font-black text-emerald-700 uppercase tracking-tight">
            Bước 3: Kết luận bài toán thực tế
          </h3>
        </div>

        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-black text-emerald-700 uppercase tracking-wider">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Kết quả trả lời câu hỏi của đề bài:</span>
          </div>

          <p className="text-sm sm:text-base text-slate-900 font-semibold leading-relaxed">
            {problem.conclusion.overview}
          </p>

          {/* Key Answers Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {problem.conclusion.finalAnswers.map((ans, idx) => (
              <div
                key={idx}
                className="p-3 bg-white border border-slate-200 rounded-xl space-y-1"
              >
                <div className="text-xs text-slate-500 font-medium">
                  {ans.label}
                </div>
                <div className="text-base font-black text-emerald-600">
                  {ans.value}
                </div>
              </div>
            ))}
          </div>

          {problem.conclusion.practicalImplication && (
            <div className="text-xs text-slate-600 pt-2 border-t border-emerald-200">
              <strong className="text-emerald-700">Ý nghĩa thực tiễn & Lời khuyên:</strong>{' '}
              {problem.conclusion.practicalImplication}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
