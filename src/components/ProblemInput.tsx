import React, { useEffect, useRef, useState } from 'react';
import { ProblemModel, ProblemCategory, LinearConstraint, ObjectiveFunction } from '../types/problemTypes';
import { PROBLEM_PRESETS } from '../math/problemPresets';
import { BookOpen, Sliders, CheckCircle2, Sparkles, Plus, Trash2, ArrowRight, Upload, Clipboard, Image, Save, Bookmark, X } from 'lucide-react';
import { computeFeasiblePolygon } from '../math/solvers';
import { loadCustomProblems, saveCustomProblem, deleteCustomProblem } from '../lib/customProblemsStore';

interface ProblemInputProps {
  currentProblem: ProblemModel;
  onSelectProblem: (problem: ProblemModel) => void;
}

export const ProblemInput: React.FC<ProblemInputProps> = ({ currentProblem, onSelectProblem }) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [customProblems, setCustomProblems] = useState<ProblemModel[]>([]);
  const [saveStatus, setSaveStatus] = useState('');
  const [customStatement, setCustomStatement] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [inputStatus, setInputStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [customType] = useState<ProblemCategory>('inequality_system');

  const [customTitle, setCustomTitle] = useState('Bài toán tối ưu hóa tài nguyên sản xuất');
  const [customConstraints, setCustomConstraints] = useState<
    { a: number; b: number; op: '<=' | '>='; c: number; label: string }[]
  >([
    { a: 2, b: 1, op: '<=', c: 40, label: 'd1: Thời gian máy 1' },
    { a: 3, b: 1, op: '<=', c: 50, label: 'd2: Thời gian máy 2' },
  ]);
  const [customObj, setCustomObj] = useState<{ a: number; b: number; target: 'max' | 'min'; name: string; unit: string }>({
    a: 400,
    b: 200,
    target: 'max',
    name: 'F(x, y)',
    unit: 'nghìn đồng',
  });
  const [lpVarXMeaning, setLpVarXMeaning] = useState('Số lượng sản phẩm loại 1');
  const [lpVarYMeaning, setLpVarYMeaning] = useState('Số lượng sản phẩm loại 2');
  const [lpUnit, setLpUnit] = useState('sản phẩm');

  useEffect(() => {
    loadCustomProblems().then((problems) => {
      setCustomProblems(problems);
    });
  }, []);

  const allPresets = [...PROBLEM_PRESETS, ...customProblems];

  const isCustomProblem = (id: string) => customProblems.some((p) => p.id === id);

  const handleDeleteCustom = async (id: string) => {
    const result = await deleteCustomProblem(id);
    if (result.success) {
      setCustomProblems(customProblems.filter((p) => p.id !== id));
      setSaveStatus('Đã xóa bài toán khỏi kho.');
    } else {
      setSaveStatus('Lỗi xóa: ' + result.error);
    }
  };

  const handleSaveCurrent = async () => {
    const problem = currentProblem;
    if (!problem.id.startsWith('custom-')) {
      setSaveStatus('Chỉ lưu được bài toán do bạn tự nhập và giải.');
      return;
    }
    const result = await saveCustomProblem(problem);
    if (result.success) {
      setSaveStatus('Đã lưu bài toán vào kho!');
      const refreshed = await loadCustomProblems();
      setCustomProblems(refreshed);
    } else {
      setSaveStatus('Lỗi lưu: ' + result.error);
    }
  };

  const handleStatementPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const imageItem = Array.from(event.clipboardData.items).find((item) => item.type.startsWith('image/'));
    if (!imageItem) return;
    const file = imageItem.getAsFile();
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage(typeof reader.result === 'string' ? reader.result : null);
      setInputStatus('Đã nhận ảnh từ bộ nhớ tạm. Hãy nhập hoặc dán phần chữ của đề để bộ giải kiểm tra chính xác.');
    };
    reader.readAsDataURL(file);
  };

  const handleStatementFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImage(typeof reader.result === 'string' ? reader.result : null);
        setInputStatus('Đã tải ảnh đề bài. Hiện bộ giải cần phần văn bản để phân tích công thức chính xác.');
      };
      reader.readAsDataURL(file);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCustomStatement(typeof reader.result === 'string' ? reader.result : '');
      setInputStatus('Đã đọc nội dung tệp. Bạn có thể chỉnh sửa trước khi phân tích.');
    };
    reader.readAsText(file);
  };

  const handleAnalyzeStatement = () => {
    const statement = customStatement.trim();
    if (!statement) {
      setInputStatus('Hãy nhập hoặc dán đề bài trước khi phân tích.');
      return;
    }

    if (/trái cây|loại\s*a|loại\s*b|120\s*triệu/i.test(statement)) {
      const fruitProblem = PROBLEM_PRESETS.find((problem) => problem.id === 'bpt-thuong-nhan-trai-cay');
      if (fruitProblem) {
        onSelectProblem(fruitProblem);
        setInputStatus('Đã nhận diện bài toán mua trái cây và mở lời giải tối ưu.');
        return;
      }
    }

    setCustomTitle(statement.split(/[.!?\n]/)[0].slice(0, 120) || 'Bài toán tự nhập');
    setInputStatus('Đã đọc đề bài. Hãy nhập các hệ số ràng buộc và hàm mục tiêu, sau đó bấm Giải.');
  };

  const handleSolveCustomLP = () => {
    const formattedConstraints: LinearConstraint[] = customConstraints.map((c, idx) => ({
      id: `c_${idx + 1}`,
      label: c.label || `d${idx + 1}`,
      a: Number(c.a) || 0,
      b: Number(c.b) || 0,
      op: c.op,
      c: Number(c.c) || 0,
      meaning: c.label || `Ràng buộc ${idx + 1}`,
    }));

    const obj: ObjectiveFunction = {
      name: customObj.name || 'F(x, y)',
      a: Number(customObj.a) || 0,
      b: Number(customObj.b) || 0,
      target: customObj.target,
      unit: customObj.unit || 'đơn vị',
      description: 'Hàm mục tiêu tối ưu',
    };

    const { vertices, optimalVertex } = computeFeasiblePolygon(formattedConstraints, obj);

    const xs = vertices.map((v) => v.x);
    const ys = vertices.map((v) => v.y);
    const xRange: [number, number] = xs.length ? [0, Math.max(...xs) * 1.3] : [0, 50];
    const yRange: [number, number] = ys.length ? [0, Math.max(...ys) * 1.3] : [0, 50];

    const vertexList = vertices.map((v) => `${v.name}(${v.xLatex}; ${v.yLatex})`).join(', \\; ');

    const generatedProblem: ProblemModel = {
      id: `custom-lp-${Date.now()}`,
      title: customTitle || 'Bài toán Quy hoạch tuyến tính tùy chỉnh',
      category: 'inequality_system',
      categoryName: 'Hệ bất phương trình & Quy hoạch tuyến tính',
      grade: 'Toán 10',
      topic: 'quy_hoach_tuyen_tinh',
      topicName: 'Quy hoạch tuyến tính (Tự nhập)',
      statement:
        customStatement.trim() ||
        `Tìm giá trị ${customObj.target === 'max' ? 'lớn nhất' : 'nhỏ nhất'} của hàm mục tiêu ${customObj.name} = ${customObj.a}x + ${customObj.b}y trên miền nghiệm của hệ bất phương trình đã nhập.`,
      practicalContext: 'Mô hình tối ưu hóa quy hoạch tuyến tính hai biến số trong kinh tế và quản trị nguồn lực.',
      variables: [
        { symbol: 'x', meaning: lpVarXMeaning || 'Đại lượng thứ nhất', unit: lpUnit, condition: 'x \\ge 0' },
        { symbol: 'y', meaning: lpVarYMeaning || 'Đại lượng thứ hai', unit: lpUnit, condition: 'y \\ge 0' },
      ],
      summaryTable: {
        title: 'Bảng phân tích ràng buộc và hàm mục tiêu',
        headers: ['Ràng buộc', 'Biểu thức', 'Vế phải', 'Ý nghĩa'],
        rows: formattedConstraints.map((c) => [
          c.label,
          `${c.a}x + ${c.b}y`,
          c.op === '<=' ? `≤ ${c.c}` : `≥ ${c.c}`,
          c.meaning,
        ]),
      },
      setupExplanation: [
        `Gọi x là ${lpVarXMeaning.toLowerCase()}, y là ${lpVarYMeaning.toLowerCase()} (đơn vị: ${lpUnit}), với điều kiện x ≥ 0, y ≥ 0.`,
        ...formattedConstraints.map((c) => `Ràng buộc ${c.label}: ${c.a}x + ${c.b}y ${c.op === '<=' ? '\\le' : '\\ge'} ${c.c}.`),
        `Hàm mục tiêu: ${obj.name} = ${obj.a}x + ${obj.b}y, cần tìm giá trị ${obj.target === 'max' ? 'lớn nhất (Max)' : 'nhỏ nhất (Min)'}.`,
      ],
      equationLatexList: [
        `\\begin{cases} ${formattedConstraints.map((c) => `${c.a}x + ${c.b}y ${c.op === '<=' ? '\\le' : '\\ge'} ${c.c}`).join(' \\\\ ')} \\\\ x \\ge 0 \\\\ y \\ge 0 \\end{cases}`,
        `${obj.name} = ${obj.a}x + ${obj.b}y \\longrightarrow \\${obj.target}`,
      ],
      linearProgrammingData: {
        constraints: formattedConstraints,
        objective: obj,
        xRange,
        yRange,
      },
      solutionSteps: {
        methodTitle: 'Phương pháp hình học giải bài toán Quy hoạch tuyến tính',
        subSteps: [
          {
            title: 'Bước 1: Xác định các đường thẳng biên trên mặt phẳng tọa độ Oxy',
            content: `Vẽ các đường thẳng biên: ${formattedConstraints.map((c) => `(${c.label}): ${c.a}x + ${c.b}y = ${c.c}`).join('; ')}, cùng hai trục tọa độ x = 0 (Oy) và y = 0 (Ox).`,
            mathLatex: formattedConstraints.map((c) => `(${c.label}):\\; ${c.a}x + ${c.b}y = ${c.c}`).join('\\quad '),
          },
          {
            title: 'Bước 2: Xác định miền nghiệm (đa giác lồi)',
            content:
              vertices.length > 0
                ? `Gạch bỏ các nửa mặt phẳng không thỏa mãn. Miền nghiệm là đa giác lồi gồm ${vertices.length} đỉnh: ${vertices.map((v) => `${v.name}(${v.xLatex}; ${v.yLatex})`).join(', ')}.`
                : 'Không tìm thấy miền nghiệm thỏa mãn tất cả các ràng buộc. Hãy kiểm tra lại các bất phương trình.',
            mathLatex: vertexList,
          },
          {
            title: 'Bước 3: Tính giá trị hàm mục tiêu tại tất cả các đỉnh',
            content:
              'Theo định lý quy hoạch tuyến tính, giá trị lớn nhất / nhỏ nhất của hàm bậc nhất F(x, y) trên miền đa giác lồi đạt được tại ít nhất một đỉnh của đa giác.',
            mathLatex: vertices
              .map((v) => `${obj.name}\\big(${v.xLatex}; ${v.yLatex}\\big) = ${v.fValueLatex || '?'}`)
              .join('\\quad '),
          },
        ],
        vertices,
      },
      conclusion: {
        overview: optimalVertex
          ? `Giá trị ${customObj.target === 'max' ? 'lớn nhất' : 'nhỏ nhất'} của ${obj.name} là ${optimalVertex.fValueLatex} ${obj.unit}, đạt được tại đỉnh ${optimalVertex.name}(${optimalVertex.xLatex}; ${optimalVertex.yLatex}).`
          : 'Không tìm thấy miền nghiệm thỏa mãn.',
        finalAnswers: optimalVertex
          ? [
              { label: `Giá trị x ( ${lpVarXMeaning} )`, value: `${optimalVertex.xLatex} ${lpUnit}` },
              { label: `Giá trị y ( ${lpVarYMeaning} )`, value: `${optimalVertex.yLatex} ${lpUnit}` },
              { label: `Giá trị ${customObj.target === 'max' ? 'Max' : 'Min'} của ${obj.name}`, value: `${optimalVertex.fValueLatex} ${obj.unit}` },
            ]
          : [{ label: 'Kết luận', value: 'Hệ vô nghiệm' }],
      },
    };

    onSelectProblem(generatedProblem);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Kho bài toán ({allPresets.length} bài)</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Tự nhập & Giải bài toán tùy chỉnh</span>
          </button>
        </div>

        <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Đang chọn:</span>
          <span className="text-emerald-400 font-black truncate max-w-[200px] sm:max-w-xs">
            {currentProblem.title}
          </span>
        </div>
      </div>

      {/* TAB 1: PRESETS */}
      {activeTab === 'presets' && (
        <div className="space-y-4">
          {customProblems.length > 0 && (
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 bg-amber-950/30 border border-amber-500/20 rounded-lg px-3 py-2">
              <Bookmark className="w-3.5 h-3.5" />
              <span>{customProblems.length} bài toán đã lưu của bạn hiển thị bên dưới (có nút xóa).</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
            {allPresets.map((preset) => {
              const isSelected = preset.id === currentProblem.id;
              const isSaved = isCustomProblem(preset.id);
              return (
                <div
                  key={preset.id}
                  onClick={() => onSelectProblem(preset)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/80 ring-1 ring-emerald-500'
                      : isSaved
                      ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] gap-2">
                      <span className="text-emerald-400 font-extrabold text-[10px] uppercase tracking-wider">
                        {preset.topicName}
                      </span>
                      {isSaved && (
                        <span className="flex items-center gap-1 text-amber-400 font-bold text-[10px]">
                          <Bookmark className="w-3 h-3" /> Đã lưu
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {preset.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {preset.statement}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-emerald-400/90 font-bold">
                      Vẽ miền nghiệm Oxy
                    </span>
                    <div className="flex items-center gap-2">
                      {isSaved && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCustom(preset.id);
                          }}
                          className="p-1 text-rose-400 hover:text-rose-300 rounded cursor-pointer"
                          title="Xóa bài toán đã lưu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <span
                        className={`flex items-center gap-1 font-black ${
                          isSelected ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Đang giải</span>
                          </>
                        ) : (
                          <>
                            <span>Xem giải</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOM SOLVER */}
      {activeTab === 'custom' && (
        <div className="space-y-5 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
          <div className="space-y-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-black text-emerald-300">Nhập đề bài linh hoạt</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">Có thể gõ, dán văn bản, tải tệp .txt/.md hoặc dán/tải ảnh đề bài.</p>
              </div>
              <Clipboard className="h-5 w-5 shrink-0 text-emerald-400" />
            </div>
            <textarea
              value={customStatement}
              onChange={(event) => setCustomStatement(event.target.value)}
              onPaste={handleStatementPaste}
              rows={4}
              placeholder="Ví dụ: Một xưởng mộc sản xuất bàn và ghế, máy xẻ có 40 giờ, thợ ráp có 50 giờ..."
              className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-3 text-sm leading-relaxed text-white outline-none transition focus:border-emerald-500"
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleAnalyzeStatement}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-black text-white transition hover:bg-emerald-500 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" /> Phân tích đề bài
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-200 transition hover:border-emerald-500 hover:text-white cursor-pointer"
              >
                <Upload className="h-4 w-4" /> Tải tệp hoặc ảnh
              </button>
              <input ref={fileInputRef} type="file" accept=".txt,.md,text/plain,text/markdown,image/*" capture="environment" onChange={handleStatementFile} className="hidden" />
              {attachedImage && <Image className="h-4 w-4 text-amber-300" aria-label="Đã đính kèm ảnh" />}
              {attachedImage && (
                <button
                  onClick={() => setAttachedImage(null)}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Xóa ảnh
                </button>
              )}
            </div>
            {attachedImage && <img src={attachedImage} alt="Ảnh đề bài đã dán" className="max-h-48 rounded-xl border border-slate-700 object-contain" />}
            {inputStatus && <p className="text-xs font-semibold leading-relaxed text-amber-200">{inputStatus}</p>}
          </div>

          {/* LP SOLVER FORM */}
          {customType === 'inequality_system' && (
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Tên bài toán / Đề bài tóm tắt:</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Nhập tiêu đề hoặc tình huống bài toán..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Ý nghĩa biến x:</label>
                  <input type="text" value={lpVarXMeaning} onChange={(e) => setLpVarXMeaning(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" placeholder="VD: Số lượng bàn" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Ý nghĩa biến y:</label>
                  <input type="text" value={lpVarYMeaning} onChange={(e) => setLpVarYMeaning(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" placeholder="VD: Số lượng ghế" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Đơn vị:</label>
                  <input type="text" value={lpUnit} onChange={(e) => setLpUnit(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" placeholder="VD: chiếc, kg, lạng" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Đơn vị hàm mục tiêu:</label>
                  <input type="text" value={customObj.unit} onChange={(e) => setCustomObj({ ...customObj, unit: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" placeholder="VD: nghìn đồng" />
                </div>
              </div>

              {/* Constraints List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-emerald-400">
                    Các bất phương trình ràng buộc (ax + by ≤ c hoặc ≥ c):
                  </label>
                  <button
                    onClick={() =>
                      setCustomConstraints([
                        ...customConstraints,
                        { a: 1, b: 1, op: '<=', c: 30, label: `d${customConstraints.length + 1}` },
                      ])
                    }
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm bất phương trình
                  </button>
                </div>
                <div className="space-y-2">
                  {customConstraints.map((c, idx) => (
                    <div key={idx} className="flex flex-wrap items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-xs font-mono font-bold text-slate-400 w-6">d{idx + 1}:</span>
                      <input type="number" value={c.a}
                        onChange={(e) => { const u = [...customConstraints]; u[idx].a = Number(e.target.value); setCustomConstraints(u); }}
                        className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center" title="Hệ số của x" />
                      <span className="text-xs font-bold text-slate-300">x +</span>
                      <input type="number" value={c.b}
                        onChange={(e) => { const u = [...customConstraints]; u[idx].b = Number(e.target.value); setCustomConstraints(u); }}
                        className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center" title="Hệ số của y" />
                      <span className="text-xs font-bold text-slate-300">y</span>
                      <select value={c.op}
                        onChange={(e) => { const u = [...customConstraints]; u[idx].op = e.target.value as '<=' | '>='; setCustomConstraints(u); }}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-emerald-400 font-bold">
                        <option value="<=">&le; (nhỏ hơn hoặc bằng)</option>
                        <option value=">=">&ge; (lớn hơn hoặc bằng)</option>
                      </select>
                      <input type="number" value={c.c}
                        onChange={(e) => { const u = [...customConstraints]; u[idx].c = Number(e.target.value); setCustomConstraints(u); }}
                        className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center" title="Vế phải (c)" />
                      <input type="text" value={c.label}
                        onChange={(e) => { const u = [...customConstraints]; u[idx].label = e.target.value; setCustomConstraints(u); }}
                        placeholder="Ý nghĩa thực tế..."
                        className="flex-1 min-w-[140px] bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-300" />
                      {customConstraints.length > 1 && (
                        <button onClick={() => setCustomConstraints(customConstraints.filter((_, i) => i !== idx))}
                          className="p-1 text-rose-400 hover:text-rose-300 rounded cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="text-[11px] text-slate-400 italic">* Mặc định hệ luôn kèm điều kiện x &ge; 0 và y &ge; 0.</div>
                </div>
              </div>

              {/* Objective Function */}
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <label className="text-xs font-extrabold text-emerald-400">Hàm mục tiêu F(x, y) = ax + by cần tối ưu:</label>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-white">F(x, y) =</span>
                  <input type="number" value={customObj.a}
                    onChange={(e) => setCustomObj({ ...customObj, a: Number(e.target.value) })}
                    className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center" />
                  <span className="text-xs font-bold text-white">x +</span>
                  <input type="number" value={customObj.b}
                    onChange={(e) => setCustomObj({ ...customObj, b: Number(e.target.value) })}
                    className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center" />
                  <span className="text-xs font-bold text-white">y &rarr;</span>
                  <select value={customObj.target}
                    onChange={(e) => setCustomObj({ ...customObj, target: e.target.value as 'max' | 'min' })}
                    className="bg-emerald-950 border border-emerald-500 rounded-lg px-3 py-1 text-xs text-emerald-300 font-black">
                    <option value="max">Tìm giá trị LỚN NHẤT (Max)</option>
                    <option value="min">Tìm giá trị NHỎ NHẤT (Min)</option>
                  </select>
                </div>
              </div>

              <button onClick={handleSolveCustomLP}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/80 cursor-pointer flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Giải & Biểu diễn miền nghiệm trên Oxy</span>
              </button>

              {currentProblem.id.startsWith('custom-lp-') && (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-4 py-3">
                  <button
                    onClick={handleSaveCurrent}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-black text-white transition hover:bg-emerald-500 cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    <span>Lưu vào kho bài toán</span>
                  </button>
                  <Bookmark className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs text-emerald-200">Lưu bài đã giải để cập nhật kho bài toán.</span>
                  {saveStatus && <span className="ml-auto text-xs font-bold text-amber-200">{saveStatus}</span>}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
