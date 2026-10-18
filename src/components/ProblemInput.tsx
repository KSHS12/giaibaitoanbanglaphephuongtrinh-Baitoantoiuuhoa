import React, { useState } from 'react';
import { ProblemModel, ProblemCategory, ProblemTopic } from '../types/problemTypes';
import { PROBLEM_PRESETS } from '../math/problemPresets';
import { BookOpen, Sliders, CheckCircle2, Sparkles, Plus, Trash2, ArrowRight } from 'lucide-react';
import { computeFeasiblePolygon, solveSystem2x2, solveQuadratic } from '../math/solvers';

interface ProblemInputProps {
  currentProblem: ProblemModel;
  onSelectProblem: (problem: ProblemModel) => void;
}

export const ProblemInput: React.FC<ProblemInputProps> = ({ currentProblem, onSelectProblem }) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');

  // Custom Solver State
  const [customType, setCustomType] = useState<ProblemCategory>('inequality_system');
  
  // Custom LP State
  const [customTitle, setCustomTitle] = useState('Bài toán tối ưu hóa tài nguyên sản xuất');
  const [customConstraints, setCustomConstraints] = useState<
    { a: number; b: number; op: '<=' | '>='; c: number; label: string }[]
  >([
    { a: 2, b: 1, op: '<=', c: 40, label: 'd1: Thời gian máy 1' },
    { a: 3, b: 1, op: '<=', c: 50, label: 'd2: Thời gian máy 2' },
  ]);
  const [customObj, setCustomObj] = useState<{ a: number; b: number; target: 'max' | 'min'; name: string }>({
    a: 400,
    b: 200,
    target: 'max',
    name: 'F(x, y)',
  });

  // Custom Linear System State
  const [sysA1, setSysA1] = useState(1);
  const [sysB1, setSysB1] = useState(1);
  const [sysC1, setSysC1] = useState(90);
  const [sysA2, setSysA2] = useState(1);
  const [sysB2, setSysB2] = useState(-2);
  const [sysC2, setSysC2] = useState(-20);
  const [sysVarX, setSysVarX] = useState('x');
  const [sysVarY, setSysVarY] = useState('y');
  const [sysUnit, setSysUnit] = useState('km/h');

  // Custom Quadratic State
  const [quadA, setQuadA] = useState(1);
  const [quadB, setQuadB] = useState(-28);
  const [quadC, setQuadC] = useState(27);
  const [quadVar, setQuadVar] = useState('v');
  const [quadMinVal, setQuadMinVal] = useState(3);

  // Filter Presets
  const filteredPresets = PROBLEM_PRESETS.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (topicFilter !== 'all' && p.topic !== topicFilter) return false;
    return true;
  });

  // Handle solve custom Linear Programming
  const handleSolveCustomLP = () => {
    const formattedConstraints = customConstraints.map((c, idx) => ({
      id: `c_${idx + 1}`,
      label: c.label || `d${idx + 1}`,
      a: Number(c.a) || 0,
      b: Number(c.b) || 0,
      op: c.op,
      c: Number(c.c) || 0,
      meaning: c.label || `Ràng buộc ${idx + 1}`,
    }));

    const obj = {
      name: customObj.name || 'F(x, y)',
      a: Number(customObj.a) || 0,
      b: Number(customObj.b) || 0,
      target: customObj.target,
      unit: 'đơn vị',
      description: 'Hàm mục tiêu tối ưu',
    };

    const { vertices, optimalVertex } = computeFeasiblePolygon(formattedConstraints, obj);

    const generatedProblem: ProblemModel = {
      id: `custom-lp-${Date.now()}`,
      title: customTitle || 'Bài toán Quy hoạch tuyến tính tùy chỉnh',
      category: 'inequality_system',
      categoryName: 'Hệ bất phương trình & Quy hoạch tuyến tính',
      grade: 'Toán 10',
      topic: 'quy_hoach_tuyen_tinh',
      topicName: 'Quy hoạch tuyến tính (Tự nhập)',
      statement: `Tìm giá trị ${customObj.target === 'max' ? 'lớn nhất' : 'nhỏ nhất'} của hàm mục tiêu ${customObj.name} = ${customObj.a}x + ${customObj.b}y trên miền nghiệm của hệ bất phương trình thỏa mãn các điều kiện tài nguyên đã nhập.`,
      practicalContext: 'Mô hình tối ưu hóa quy hoạch tuyến tính hai biến số trong kinh tế và quản trị nguồn lực.',
      variables: [
        { symbol: 'x', meaning: 'Đại lượng thứ nhất', unit: 'đơn vị', condition: 'x \\ge 0' },
        { symbol: 'y', meaning: 'Đại lượng thứ hai', unit: 'đơn vị', condition: 'y \\ge 0' },
      ],
      setupExplanation: [
        'Chọn ẩn x >= 0, y >= 0 biểu diễn các đại lượng cần tìm.',
        ...formattedConstraints.map((c) => `Ràng buộc ${c.label}: ${c.a}x + ${c.b}y ${c.op} ${c.c}`),
        `Thiết lập hàm mục tiêu: ${obj.name} = ${obj.a}x + ${obj.b}y (${obj.target === 'max' ? 'tìm giá trị lớn nhất' : 'tìm giá trị nhỏ nhất'}).`,
      ],
      equationLatexList: [
        `\\begin{cases} ${formattedConstraints.map((c) => `${c.a}x + ${c.b}y \\le ${c.c}`).join(' \\\\ ')} \\\\ x \\ge 0 \\\\ y \\ge 0 \\end{cases}`,
        `${obj.name} = ${obj.a}x + ${obj.b}y \\longrightarrow \\${obj.target}`,
      ],
      linearProgrammingData: {
        constraints: formattedConstraints,
        objective: obj,
      },
      solutionSteps: {
        methodTitle: 'Phương pháp hình học xác định miền đa giác nghiệm',
        subSteps: [
          {
            title: 'Bước 1: Vẽ các đường thẳng biên trên mặt phẳng tọa độ Oxy',
            content: 'Vẽ các đường thẳng d1, d2,... và các trục tọa độ x = 0, y = 0.',
          },
          {
            title: 'Bước 2: Xác định các đỉnh của đa giác miền nghiệm',
            content: `Tìm giao điểm các đường biên thỏa mãn tất cả các bất phương trình. Đa giác nghiệm có ${vertices.length} đỉnh.`,
          },
          {
            title: 'Bước 3: Tính giá trị hàm mục tiêu tại các đỉnh',
            content: 'Đối chiếu giá trị F(x, y) tại từng đỉnh để tìm phương án tối ưu.',
          },
        ],
        vertices,
      },
      conclusion: {
        overview: optimalVertex
          ? `Giá trị ${customObj.target === 'max' ? 'lớn nhất' : 'nhỏ nhất'} của hàm mục tiêu là ${optimalVertex.fValueLatex} đạt được tại đỉnh ${optimalVertex.name}(${optimalVertex.xLatex}; ${optimalVertex.yLatex}).`
          : 'Không tìm thấy miền nghiệm thỏa mãn.',
        finalAnswers: optimalVertex
          ? [
              { label: 'Giá trị tối ưu của x', value: `${optimalVertex.xLatex}` },
              { label: 'Giá trị tối ưu của y', value: `${optimalVertex.yLatex}` },
              { label: `Giá trị ${customObj.target === 'max' ? 'Max' : 'Min'} của F(x, y)`, value: `${optimalVertex.fValueLatex}` },
            ]
          : [{ label: 'Kết luận', value: 'Hệ vô nghiệm' }],
      },
    };

    onSelectProblem(generatedProblem);
  };

  // Handle solve custom Linear System
  const handleSolveCustomSys = () => {
    const res = solveSystem2x2(sysA1, sysB1, sysC1, sysA2, sysB2, sysC2);

    const generatedProblem: ProblemModel = {
      id: `custom-sys-${Date.now()}`,
      title: `Giải hệ phương trình bậc nhất 2 ẩn (${sysVarX}, ${sysVarY})`,
      category: 'linear_system',
      categoryName: 'Giải bài toán bằng cách lập hệ phương trình',
      grade: 'Toán 10 - THPT',
      topic: 'chuyen_dong',
      topicName: 'Hệ phương trình bậc nhất hai ẩn',
      statement: `Tìm hai đại lượng ${sysVarX} và ${sysVarY} thỏa mãn hai phương trình độc lập trong thực tế: ${sysA1}${sysVarX} + ${sysB1}${sysVarY} = ${sysC1} và ${sysA2}${sysVarX} + ${sysB2}${sysVarY} = ${sysC2}.`,
      practicalContext: 'Mô hình liên hệ hai đại lượng trong bài toán thực tế THPT.',
      variables: [
        { symbol: sysVarX, meaning: `Đại lượng thứ nhất (${sysVarX})`, unit: sysUnit, condition: `${sysVarX} > 0` },
        { symbol: sysVarY, meaning: `Đại lượng thứ hai (${sysVarY})`, unit: sysUnit, condition: `${sysVarY} > 0` },
      ],
      setupExplanation: [
        `Chọn ẩn ${sysVarX} và ${sysVarY} kèm đơn vị ${sysUnit}.`,
        `Biểu diễn quan hệ thứ nhất: ${sysA1}${sysVarX} + ${sysB1}${sysVarY} = ${sysC1}.`,
        `Biểu diễn quan hệ thứ hai: ${sysA2}${sysVarX} + ${sysB2}${sysVarY} = ${sysC2}.`,
      ],
      equationLatexList: [
        `\\begin{cases} ${sysA1}${sysVarX} + ${sysB1}${sysVarY} = ${sysC1} \\\\ ${sysA2}${sysVarX} + ${sysB2}${sysVarY} = ${sysC2} \\end{cases}`,
      ],
      linearSystemData: {
        varNames: [sysVarX, sysVarY],
        equations: [
          { coeffs: [sysA1, sysB1], rhs: sysC1, label: 'PT 1', meaning: 'Quan hệ 1' },
          { coeffs: [sysA2, sysB2], rhs: sysC2, label: 'PT 2', meaning: 'Quan hệ 2' },
        ],
      },
      solutionSteps: {
        methodTitle: 'Giải hệ phương trình bằng phương pháp định thức Cramer / cộng đại số',
        subSteps: [
          {
            title: 'Bước 1: Tính định thức của hệ phương trình',
            content: `D = (${sysA1}) × (${sysB2}) - (${sysA2}) × (${sysB1}) = ${res.D}.`,
            mathLatex: `D = \\begin{vmatrix} ${sysA1} & ${sysB1} \\\\ ${sysA2} & ${sysB2} \\end{vmatrix} = ${res.D}`,
          },
          {
            title: `Bước 2: Tính định thức D_${sysVarX} và D_${sysVarY}`,
            content: `D_${sysVarX} = ${res.Dx}, D_${sysVarY} = ${res.Dy}.`,
            mathLatex: `D_{${sysVarX}} = ${res.Dx}, \\quad D_{${sysVarY}} = ${res.Dy}`,
          },
          {
            title: `Bước 3: Kết luận nghiệm (${sysVarX}, ${sysVarY})`,
            content: `Nghiệm duy nhất: ${sysVarX} = D_${sysVarX}/D = ${res.xLatex}, ${sysVarY} = D_${sysVarY}/D = ${res.yLatex}.`,
            mathLatex: `${sysVarX} = ${res.xLatex}, \\quad ${sysVarY} = ${res.yLatex}`,
          },
        ],
      },
      conclusion: {
        overview:
          res.status === 'unique'
            ? `Hệ phương trình có nghiệm duy nhất: ${sysVarX} = ${res.xLatex} (${sysUnit}), ${sysVarY} = ${res.yLatex} (${sysUnit}).`
            : 'Hệ không có nghiệm duy nhất.',
        finalAnswers:
          res.status === 'unique'
            ? [
                { label: `Giá trị ${sysVarX}`, value: `${res.xLatex} ${sysUnit}` },
                { label: `Giá trị ${sysVarY}`, value: `${res.yLatex} ${sysUnit}` },
              ]
            : [{ label: 'Trạng thái', value: 'Vô nghiệm hoặc vô số nghiệm' }],
      },
    };

    onSelectProblem(generatedProblem);
  };

  // Handle solve custom Quadratic Equation
  const handleSolveCustomQuad = () => {
    const res = solveQuadratic(quadA, quadB, quadC);

    const generatedProblem: ProblemModel = {
      id: `custom-quad-${Date.now()}`,
      title: `Giải phương trình bậc hai thực tế (${quadA}${quadVar}² + ${quadB}${quadVar} + ${quadC} = 0)`,
      category: 'single_equation',
      categoryName: 'Giải bài toán bằng cách lập phương trình',
      grade: 'Toán 10 - THPT',
      topic: 'chuyen_dong',
      topicName: 'Phương trình bậc hai thực tế',
      statement: `Tìm đại lượng ${quadVar} thỏa mãn phương trình thực tiễn: ${quadA}${quadVar}^2 + (${quadB})${quadVar} + (${quadC}) = 0 với điều kiện ${quadVar} > ${quadMinVal}.`,
      practicalContext: 'Mô hình chuyển động hoặc hình học dẫn đến phương trình bậc hai.',
      variables: [
        { symbol: quadVar, meaning: `Đại lượng cần tìm (${quadVar})`, unit: 'đơn vị', condition: `${quadVar} > ${quadMinVal}` },
      ],
      setupExplanation: [
        `Chọn ẩn ${quadVar} thỏa mãn điều kiện thực tế: ${quadVar} > ${quadMinVal}.`,
        `Biến đổi và quy đồng đưa phương trình về dạng chính tắc: ${quadA}${quadVar}^2 + (${quadB})${quadVar} + (${quadC}) = 0.`,
      ],
      equationLatexList: [
        `${quadA}${quadVar}^2 + (${quadB})${quadVar} + (${quadC}) = 0 \\quad (${quadVar} > ${quadMinVal})`,
      ],
      singleEquationData: {
        form: 'quadratic',
        standardFormLatex: `${quadA}${quadVar}^2 + (${quadB})${quadVar} + (${quadC}) = 0`,
        a: quadA,
        b: quadB,
        c: quadC,
        variableName: quadVar,
        unit: 'đơn vị',
      },
      solutionSteps: {
        methodTitle: 'Biến đổi về phương trình bậc hai và tính biệt thức Delta',
        subSteps: [
          {
            title: 'Bước 1: Tính biệt thức Delta (Δ)',
            content: `Delta = b^2 - 4ac = (${quadB})^2 - 4 × (${quadA}) × (${quadC}) = ${(res as any).delta || 0}.`,
            mathLatex: `\\Delta = (${quadB})^2 - 4 \\cdot (${quadA}) \\cdot (${quadC}) = ${(res as any).delta || 0}`,
          },
          {
            title: 'Bước 2: Tìm nghiệm của phương trình',
            content: `Phương trình có ${res.roots.length} nghiệm thực: ${res.roots.map((r) => `${quadVar} = ${r.latex}`).join(', ')}.`,
          },
          {
            title: `Bước 3: Đối chiếu với điều kiện ${quadVar} > ${quadMinVal}`,
            content: 'Loại nghiệm không thỏa mãn điều kiện thực tế.',
          },
        ],
        roots: res.roots.map((r) => ({
          val: r.val,
          latex: r.latex,
          isAccepted: r.val > quadMinVal,
          reason: r.val > quadMinVal ? `Thỏa mãn điều kiện ${quadVar} > ${quadMinVal}` : `Loại vì ${quadVar} <= ${quadMinVal}`,
        })),
      },
      conclusion: {
        overview:
          res.roots.filter((r) => r.val > quadMinVal).length > 0
            ? `Nghiệm thỏa mãn bài toán thực tế là: ${quadVar} = ${
                res.roots.filter((r) => r.val > quadMinVal)[0].latex
              }.`
            : 'Không có nghiệm nào thỏa mãn điều kiện thực tế.',
        finalAnswers: res.roots
          .filter((r) => r.val > quadMinVal)
          .map((r, i) => ({ label: `Nghiệm ${i + 1}`, value: `${quadVar} = ${r.latex}` })),
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
            <span>Kho bài toán chuẩn SGK THPT ({PROBLEM_PRESETS.length} bài)</span>
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
          <span>Bài đang chọn:</span>
          <span className="text-emerald-400 font-black truncate max-w-[200px] sm:max-w-xs">
            {currentProblem.title}
          </span>
        </div>
      </div>

      {/* TAB 1: PRESETS */}
      {activeTab === 'presets' && (
        <div className="space-y-4">
          {/* Category & Topic Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold mr-1">Phân loại:</span>
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'inequality_system', label: 'Hệ BPT & Quy hoạch tuyến tính (Toán 10)' },
              { id: 'linear_system', label: 'Lập Hệ phương trình' },
              { id: 'single_equation', label: 'Lập Phương trình bậc 2' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-emerald-500 text-slate-950 font-black shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Preset Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
            {filteredPresets.map((preset) => {
              const isSelected = preset.id === currentProblem.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => onSelectProblem(preset)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/80 ring-1 ring-emerald-500'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                        {preset.grade}
                      </span>
                      <span className="text-emerald-400 font-extrabold text-[10px] uppercase tracking-wider">
                        {preset.topicName}
                      </span>
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
                      {preset.category === 'inequality_system'
                        ? 'Vẽ miền nghiệm Oxy'
                        : preset.category === 'linear_system'
                        ? 'Hệ PT đại số'
                        : 'Phương trình bậc 2'}
                    </span>
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
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOM SOLVER */}
      {activeTab === 'custom' && (
        <div className="space-y-5 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-400">Chọn dạng bài toán cần giải:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCustomType('inequality_system')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                  customType === 'inequality_system'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                1. Hệ BPT 2 ẩn & Tìm Min/Max F(x, y)
              </button>
              <button
                onClick={() => setCustomType('linear_system')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                  customType === 'linear_system'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                2. Hệ phương trình bậc nhất 2 ẩn
              </button>
              <button
                onClick={() => setCustomType('single_equation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                  customType === 'single_equation'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                3. Lập phương trình bậc hai
              </button>
            </div>
          </div>

          {/* SUB-FORM A: LINEAR PROGRAMMING */}
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
                    <div
                      key={idx}
                      className="flex flex-wrap items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800"
                    >
                      <span className="text-xs font-mono font-bold text-slate-400 w-6">d{idx + 1}:</span>
                      <input
                        type="number"
                        value={c.a}
                        onChange={(e) => {
                          const updated = [...customConstraints];
                          updated[idx].a = Number(e.target.value);
                          setCustomConstraints(updated);
                        }}
                        className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center"
                        title="Hệ số của x"
                      />
                      <span className="text-xs font-bold text-slate-300">x +</span>
                      <input
                        type="number"
                        value={c.b}
                        onChange={(e) => {
                          const updated = [...customConstraints];
                          updated[idx].b = Number(e.target.value);
                          setCustomConstraints(updated);
                        }}
                        className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center"
                        title="Hệ số của y"
                      />
                      <span className="text-xs font-bold text-slate-300">y</span>
                      <select
                        value={c.op}
                        onChange={(e) => {
                          const updated = [...customConstraints];
                          updated[idx].op = e.target.value as '<=' | '>=';
                          setCustomConstraints(updated);
                        }}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-emerald-400 font-bold"
                      >
                        <option value="<=">&le; (nhỏ hơn hoặc bằng)</option>
                        <option value=">=">&ge; (lớn hơn hoặc bằng)</option>
                      </select>
                      <input
                        type="number"
                        value={c.c}
                        onChange={(e) => {
                          const updated = [...customConstraints];
                          updated[idx].c = Number(e.target.value);
                          setCustomConstraints(updated);
                        }}
                        className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center"
                        title="Vế phải (c)"
                      />
                      <input
                        type="text"
                        value={c.label}
                        onChange={(e) => {
                          const updated = [...customConstraints];
                          updated[idx].label = e.target.value;
                          setCustomConstraints(updated);
                        }}
                        placeholder="Ý nghĩa thực tế..."
                        className="flex-1 min-w-[140px] bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-300"
                      />
                      {customConstraints.length > 1 && (
                        <button
                          onClick={() => setCustomConstraints(customConstraints.filter((_, i) => i !== idx))}
                          className="p-1 text-rose-400 hover:text-rose-300 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="text-[11px] text-slate-400 italic">
                    * Mặc định hệ luôn kèm điều kiện x &ge; 0 và y &ge; 0 (số lượng sản phẩm, tài nguyên không âm).
                  </div>
                </div>
              </div>

              {/* Objective Function Input */}
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <label className="text-xs font-extrabold text-emerald-400">
                  Hàm mục tiêu F(x, y) = ax + by cần tối ưu:
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-white">F(x, y) =</span>
                  <input
                    type="number"
                    value={customObj.a}
                    onChange={(e) => setCustomObj({ ...customObj, a: Number(e.target.value) })}
                    className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center"
                  />
                  <span className="text-xs font-bold text-white">x +</span>
                  <input
                    type="number"
                    value={customObj.b}
                    onChange={(e) => setCustomObj({ ...customObj, b: Number(e.target.value) })}
                    className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center"
                  />
                  <span className="text-xs font-bold text-white">y &rarr;</span>
                  <select
                    value={customObj.target}
                    onChange={(e) => setCustomObj({ ...customObj, target: e.target.value as 'max' | 'min' })}
                    className="bg-emerald-950 border border-emerald-500 rounded-lg px-3 py-1 text-xs text-emerald-300 font-black"
                  >
                    <option value="max">Tìm giá trị LỚN NHẤT (Max)</option>
                    <option value="min">Tìm giá trị NHỎ NHẤT (Min)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSolveCustomLP}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/80 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Giải & Biểu diễn miền nghiệm trên Oxy (Nền trắng)</span>
              </button>
            </div>
          )}

          {/* SUB-FORM B: LINEAR SYSTEM */}
          {customType === 'linear_system' && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400">Phương trình 1: a1·x + b1·y = c1</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={sysA1}
                      onChange={(e) => setSysA1(Number(e.target.value))}
                      className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center"
                    />
                    <span className="text-xs font-bold">x +</span>
                    <input
                      type="number"
                      value={sysB1}
                      onChange={(e) => setSysB1(Number(e.target.value))}
                      className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center"
                    />
                    <span className="text-xs font-bold">y =</span>
                    <input
                      type="number"
                      value={sysC1}
                      onChange={(e) => setSysC1(Number(e.target.value))}
                      className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center"
                    />
                  </div>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400">Phương trình 2: a2·x + b2·y = c2</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={sysA2}
                      onChange={(e) => setSysA2(Number(e.target.value))}
                      className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center"
                    />
                    <span className="text-xs font-bold">x +</span>
                    <input
                      type="number"
                      value={sysB2}
                      onChange={(e) => setSysB2(Number(e.target.value))}
                      className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center"
                    />
                    <span className="text-xs font-bold">y =</span>
                    <input
                      type="number"
                      value={sysC2}
                      onChange={(e) => setSysC2(Number(e.target.value))}
                      className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-400 font-bold">Tên ẩn & đơn vị:</span>
                <input
                  type="text"
                  value={sysVarX}
                  onChange={(e) => setSysVarX(e.target.value)}
                  placeholder="Ẩn 1 (x)"
                  className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white text-center"
                />
                <input
                  type="text"
                  value={sysVarY}
                  onChange={(e) => setSysVarY(e.target.value)}
                  placeholder="Ẩn 2 (y)"
                  className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white text-center"
                />
                <input
                  type="text"
                  value={sysUnit}
                  onChange={(e) => setSysUnit(e.target.value)}
                  placeholder="Đơn vị (km/h, ngày...)"
                  className="w-32 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white text-center"
                />
              </div>

              <button
                onClick={handleSolveCustomSys}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/80 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Giải hệ phương trình từng bước chi tiết</span>
              </button>
            </div>
          )}

          {/* SUB-FORM C: QUADRATIC EQUATION */}
          {customType === 'single_equation' && (
            <div className="space-y-4 pt-2">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-emerald-400">
                  Phương trình chính tắc dạng: a·x² + b·x + c = 0
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="number"
                    value={quadA}
                    onChange={(e) => setQuadA(Number(e.target.value))}
                    className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center"
                  />
                  <span className="text-xs font-bold">{quadVar}² +</span>
                  <input
                    type="number"
                    value={quadB}
                    onChange={(e) => setQuadB(Number(e.target.value))}
                    className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center"
                  />
                  <span className="text-xs font-bold">{quadVar} +</span>
                  <input
                    type="number"
                    value={quadC}
                    onChange={(e) => setQuadC(Number(e.target.value))}
                    className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center"
                  />
                  <span className="text-xs font-bold">= 0</span>
                </div>

                <div className="flex items-center gap-3 text-xs pt-2 border-t border-slate-800">
                  <span className="text-slate-400 font-bold">Tên biến:</span>
                  <input
                    type="text"
                    value={quadVar}
                    onChange={(e) => setQuadVar(e.target.value)}
                    className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white text-center"
                  />
                  <span className="text-slate-400 font-bold">Điều kiện thực tế ({quadVar} &gt;):</span>
                  <input
                    type="number"
                    value={quadMinVal}
                    onChange={(e) => setQuadMinVal(Number(e.target.value))}
                    className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white text-center"
                  />
                </div>
              </div>

              <button
                onClick={handleSolveCustomQuad}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/80 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Giải phương trình, tính biệt thức Δ & đối chiếu điều kiện</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
