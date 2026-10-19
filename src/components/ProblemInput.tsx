import React, { useEffect, useRef, useState } from 'react';
import { ProblemModel, ProblemCategory, LinearConstraint, ObjectiveFunction, VertexPoint } from '../types/problemTypes';
import { PROBLEM_PRESETS } from '../math/problemPresets';
import { BookOpen, Sliders, CheckCircle2, Sparkles, Plus, Trash2, ArrowRight, Upload, Clipboard, Image, Save, Bookmark, X } from 'lucide-react';
import { computeFeasiblePolygon, solveSystem2x2, solveSystem3x3, solveQuadratic } from '../math/solvers';
import { loadCustomProblems, saveCustomProblem, deleteCustomProblem } from '../lib/customProblemsStore';

interface ProblemInputProps {
  currentProblem: ProblemModel;
  onSelectProblem: (problem: ProblemModel) => void;
}

export const ProblemInput: React.FC<ProblemInputProps> = ({ currentProblem, onSelectProblem }) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [customProblems, setCustomProblems] = useState<ProblemModel[]>([]);
  const [saveStatus, setSaveStatus] = useState('');
  const [customStatement, setCustomStatement] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [inputStatus, setInputStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [customType, setCustomType] = useState<ProblemCategory>('inequality_system');

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

  // 2x2 Linear System State
  const [sysA1, setSysA1] = useState(1);
  const [sysB1, setSysB1] = useState(1);
  const [sysC1, setSysC1] = useState(90);
  const [sysA2, setSysA2] = useState(1);
  const [sysB2, setSysB2] = useState(-2);
  const [sysC2, setSysC2] = useState(-20);
  const [sysVarX, setSysVarX] = useState('x');
  const [sysVarY, setSysVarY] = useState('y');
  const [sysUnit, setSysUnit] = useState('km/h');
  const [sysTitle, setSysTitle] = useState('Bài toán lập hệ phương trình hai ẩn');
  const [sysStatement, setSysStatement] = useState('');

  // 3x3 Linear System State
  const [sys3Equations, setSys3Equations] = useState([
    { a: 1, b: 1, c: 1, rhs: 1200, label: 'PT 1' },
    { a: 1, b: -2, c: 0, rhs: 0, label: 'PT 2' },
    { a: 6, b: 7, c: 10, rhs: 9800, label: 'PT 3' },
  ]);
  const [sys3VarNames, setSys3VarNames] = useState(['x', 'y', 'z']);
  const [sys3Unit, setSys3Unit] = useState('triệu đồng');
  const [sys3Title, setSys3Title] = useState('Bài toán lập hệ phương trình ba ẩn');
  const [sys3Statement, setSys3Statement] = useState('');

  // Quadratic State
  const [quadA, setQuadA] = useState(1);
  const [quadB, setQuadB] = useState(-50);
  const [quadC, setQuadC] = useState(616);
  const [quadVar, setQuadVar] = useState('x');
  const [quadMinVal, setQuadMinVal] = useState(0);
  const [quadMaxVal, setQuadMaxVal] = useState(25);
  const [quadUnit, setQuadUnit] = useState('m');
  const [quadTitle, setQuadTitle] = useState('Bài toán lập phương trình bậc hai');
  const [quadStatement, setQuadStatement] = useState('');

  // Load saved custom problems on mount
  useEffect(() => {
    loadCustomProblems().then((problems) => {
      setCustomProblems(problems);
    });
  }, []);

  const allPresets = [...PROBLEM_PRESETS, ...customProblems];

  const filteredPresets = allPresets.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    return true;
  });

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
    setInputStatus('Đã đọc đề bài. Hãy chọn dạng bài bên dưới và nhập các hệ số, sau đó bấm Giải.');
  };

  // ===== LP SOLVER =====
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

    // Compute x/y ranges from vertices for graph display
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

  // ===== 2x2 SYSTEM SOLVER =====
  const handleSolveCustomSys = () => {
    const res = solveSystem2x2(sysA1, sysB1, sysC1, sysA2, sysB2, sysC2);

    const detLatex = `D = \\begin{vmatrix} ${sysA1} & ${sysB1} \\\\ ${sysA2} & ${sysB2} \\end{vmatrix} = ${sysA1} \\cdot ${sysB2} - ${sysA2} \\cdot ${sysB1} = ${res.D}`;
    const dxLatex = `D_{${sysVarX}} = \\begin{vmatrix} ${sysC1} & ${sysB1} \\\\ ${sysC2} & ${sysB2} \\end{vmatrix} = ${res.Dx}`;
    const dyLatex = `D_{${sysVarY}} = \\begin{vmatrix} ${sysA1} & ${sysC1} \\\\ ${sysA2} & ${sysC2} \\end{vmatrix} = ${res.Dy}`;

    const generatedProblem: ProblemModel = {
      id: `custom-sys-${Date.now()}`,
      title: sysTitle || `Giải hệ phương trình bậc nhất 2 ẩn (${sysVarX}, ${sysVarY})`,
      category: 'linear_system',
      categoryName: 'Giải bài toán bằng cách lập hệ phương trình',
      grade: 'Toán 10 - THPT',
      topic: 'chuyen_dong',
      topicName: 'Hệ phương trình bậc nhất hai ẩn',
      statement:
        sysStatement.trim() ||
        `Tìm hai đại lượng ${sysVarX} và ${sysVarY} thỏa mãn: ${sysA1}${sysVarX} + ${sysB1}${sysVarY} = ${sysC1} và ${sysA2}${sysVarX} + ${sysB2}${sysVarY} = ${sysC2}.`,
      practicalContext: 'Mô hình liên hệ hai đại lượng trong bài toán thực tế THPT.',
      variables: [
        { symbol: sysVarX, meaning: `Đại lượng thứ nhất (${sysVarX})`, unit: sysUnit, condition: `${sysVarX} > 0` },
        { symbol: sysVarY, meaning: `Đại lượng thứ hai (${sysVarY})`, unit: sysUnit, condition: `${sysVarY} > 0` },
      ],
      setupExplanation: [
        `Gọi ${sysVarX} và ${sysVarY} là hai đại lượng cần tìm (đơn vị: ${sysUnit}), với điều kiện ${sysVarX} > 0, ${sysVarY} > 0.`,
        `Từ dữ kiện bài toán, lập được phương trình thứ nhất: ${sysA1}${sysVarX} + ${sysB1}${sysVarY} = ${sysC1}.`,
        `Từ dữ kiện bài toán, lập được phương trình thứ hai: ${sysA2}${sysVarX} + ${sysB2}${sysVarY} = ${sysC2}.`,
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
        methodTitle: 'Giải hệ phương trình bằng phương pháp định thức Cramer',
        subSteps:
          res.status === 'unique'
            ? [
                {
                  title: 'Bước 1: Tính định thức chính D của hệ',
                  content: `D = ${sysA1} × ${sysB2} - ${sysA2} × ${sysB1} = ${res.D}. Vì D ≠ 0 nên hệ có nghiệm duy nhất.`,
                  mathLatex: detLatex,
                },
                {
                  title: `Bước 2: Tính định thức D_${sysVarX} và D_${sysVarY}`,
                  content: `Thay cột thứ nhất bằng vế phải để tính D_${sysVarX} = ${res.Dx}. Thay cột thứ hai bằng vế phải để tính D_${sysVarY} = ${res.Dy}.`,
                  mathLatex: `${dxLatex}, \\quad ${dyLatex}`,
                },
                {
                  title: `Bước 3: Tìm nghiệm ${sysVarX} = D_${sysVarX}/D, ${sysVarY} = D_${sysVarY}/D`,
                  content: `${sysVarX} = ${res.Dx}/${res.D} = ${res.xLatex}, ${sysVarY} = ${res.Dy}/${res.D} = ${res.yLatex}.`,
                  mathLatex: `${sysVarX} = \\frac{${res.Dx}}{${res.D}} = ${res.xLatex}, \\quad ${sysVarY} = \\frac{${res.Dy}}{${res.D}} = ${res.yLatex}`,
                },
                {
                  title: 'Bước 4: Kiểm tra lại điều kiện thực tế',
                  content:
                    parseFloat(res.xLatex) > 0 && parseFloat(res.yLatex) > 0
                      ? `Nghiệm ${sysVarX} = ${res.xLatex} > 0 và ${sysVarY} = ${res.yLatex} > 0, thỏa mãn điều kiện thực tế.`
                      : `Cần đối chiếu nghiệm với điều kiện thực tế của bài toán.`,
                },
              ]
            : [
                {
                  title: 'Bước 1: Tính định thức chính D',
                  content: `D = ${res.D}. Vì D = 0 nên hệ không có nghiệm duy nhất (vô nghiệm hoặc vô số nghiệm).`,
                  mathLatex: detLatex,
                },
              ],
      },
      conclusion: {
        overview:
          res.status === 'unique'
            ? `Hệ phương trình có nghiệm duy nhất: ${sysVarX} = ${res.xLatex} (${sysUnit}), ${sysVarY} = ${res.yLatex} (${sysUnit}).`
            : 'Hệ phương trình không có nghiệm duy nhất (D = 0).',
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

  // ===== 3x3 SYSTEM SOLVER =====
  const handleSolveCustomSys3 = () => {
    const matrix = [
      [sys3Equations[0].a, sys3Equations[0].b, sys3Equations[0].c],
      [sys3Equations[1].a, sys3Equations[1].b, sys3Equations[1].c],
      [sys3Equations[2].a, sys3Equations[2].b, sys3Equations[2].c],
    ];
    const rhs = [sys3Equations[0].rhs, sys3Equations[1].rhs, sys3Equations[2].rhs];
    const res = solveSystem3x3(matrix, rhs);
    const [vx, vy, vz] = sys3VarNames;

    const generatedProblem: ProblemModel = {
      id: `custom-sys3-${Date.now()}`,
      title: sys3Title || `Giải hệ phương trình bậc nhất 3 ẩn (${vx}, ${vy}, ${vz})`,
      category: 'linear_system',
      categoryName: 'Giải bài toán bằng cách lập hệ phương trình',
      grade: 'Toán 10 - THPT',
      topic: 'kinh_te_tai_chinh',
      topicName: 'Hệ phương trình bậc nhất ba ẩn',
      statement:
        sys3Statement.trim() ||
        `Tìm ba đại lượng ${vx}, ${vy}, ${vz} thỏa mãn hệ ba phương trình: ${sys3Equations.map((eq) => `${eq.a}${vx} + ${eq.b}${vy} + ${eq.c}${vz} = ${eq.rhs}`).join('; ')}.`,
      practicalContext: 'Mô hình liên hệ ba đại lượng trong bài toán thực tế THPT (tài chính, chuyển động, nồng độ).',
      variables: [
        { symbol: vx, meaning: `Đại lượng thứ nhất (${vx})`, unit: sys3Unit, condition: `${vx} > 0` },
        { symbol: vy, meaning: `Đại lượng thứ hai (${vy})`, unit: sys3Unit, condition: `${vy} > 0` },
        { symbol: vz, meaning: `Đại lượng thứ ba (${vz})`, unit: sys3Unit, condition: `${vz} > 0` },
      ],
      setupExplanation: [
        `Gọi ${vx}, ${vy}, ${vz} là ba đại lượng cần tìm (đơn vị: ${sys3Unit}), với điều kiện mỗi ẩn > 0.`,
        ...sys3Equations.map((eq, i) => `Từ dữ kiện thứ ${i + 1}: ${eq.a}${vx} + ${eq.b}${vy} + ${eq.c}${vz} = ${eq.rhs}.`),
      ],
      equationLatexList: [
        `\\begin{cases} ${sys3Equations.map((eq) => `${eq.a}${vx} + ${eq.b}${vy} + ${eq.c}${vz} = ${eq.rhs}`).join(' \\\\ ')} \\end{cases}`,
      ],
      linearSystemData: {
        varNames: sys3VarNames,
        equations: sys3Equations.map((eq, i) => ({
          coeffs: [eq.a, eq.b, eq.c],
          rhs: eq.rhs,
          label: eq.label || `PT ${i + 1}`,
          meaning: `Quan hệ ${i + 1}`,
        })),
      },
      solutionSteps: {
        methodTitle: 'Giải hệ ba phương trình bậc nhất ba ẩn bằng phương pháp định thức Cramer',
        subSteps:
          res.status === 'unique'
            ? [
                {
                  title: 'Bước 1: Tính định thức chính D của hệ',
                  content: `D = ${res.D}. Vì D ≠ 0 nên hệ có nghiệm duy nhất.`,
                  mathLatex: `D = \\begin{vmatrix} ${matrix[0][0]} & ${matrix[0][1]} & ${matrix[0][2]} \\\\ ${matrix[1][0]} & ${matrix[1][1]} & ${matrix[1][2]} \\\\ ${matrix[2][0]} & ${matrix[2][1]} & ${matrix[2][2]} \\end{vmatrix} = ${res.D}`,
                },
                {
                  title: `Bước 2: Tính D_${vx}, D_${vy}, D_${vz}`,
                  content: `Thay lần lượt từng cột bằng vế phải: D_${vx} = ${res.Dx}, D_${vy} = ${res.Dy}, D_${vz} = ${res.Dz}.`,
                  mathLatex: `D_{${vx}} = ${res.Dx}, \\quad D_{${vy}} = ${res.Dy}, \\quad D_{${vz}} = ${res.Dz}`,
                },
                {
                  title: `Bước 3: Tìm nghiệm ${vx} = D_${vx}/D, ${vy} = D_${vy}/D, ${vz} = D_${vz}/D`,
                  content: `${vx} = ${res.Dx}/${res.D} = ${res.xLatex}, ${vy} = ${res.Dy}/${res.D} = ${res.yLatex}, ${vz} = ${res.Dz}/${res.D} = ${res.zLatex}.`,
                  mathLatex: `${vx} = ${res.xLatex}, \\quad ${vy} = ${res.yLatex}, \\quad ${vz} = ${res.zLatex}`,
                },
                {
                  title: 'Bước 4: Kiểm tra điều kiện thực tế',
                  content: `Nghiệm ${vx} = ${res.xLatex}, ${vy} = ${res.yLatex}, ${vz} = ${res.zLatex}. Đối chiếu với điều kiện thực tế của bài toán.`,
                },
              ]
            : [
                {
                  title: 'Bước 1: Tính định thức chính D',
                  content: `D = ${res.D}. Vì D = 0 nên hệ không có nghiệm duy nhất.`,
                  mathLatex: `D = ${res.D}`,
                },
              ],
      },
      conclusion: {
        overview:
          res.status === 'unique'
            ? `Hệ có nghiệm duy nhất: ${vx} = ${res.xLatex} (${sys3Unit}), ${vy} = ${res.yLatex} (${sys3Unit}), ${vz} = ${res.zLatex} (${sys3Unit}).`
            : 'Hệ không có nghiệm duy nhất (D = 0).',
        finalAnswers:
          res.status === 'unique'
            ? [
                { label: `Giá trị ${vx}`, value: `${res.xLatex} ${sys3Unit}` },
                { label: `Giá trị ${vy}`, value: `${res.yLatex} ${sys3Unit}` },
                { label: `Giá trị ${vz}`, value: `${res.zLatex} ${sys3Unit}` },
              ]
            : [{ label: 'Trạng thái', value: 'Vô nghiệm hoặc vô số nghiệm' }],
      },
    };

    onSelectProblem(generatedProblem);
  };

  // ===== QUADRATIC SOLVER =====
  const handleSolveCustomQuad = () => {
    const res = solveQuadratic(quadA, quadB, quadC);
    const delta = (res as { delta?: number }).delta;

    const generatedProblem: ProblemModel = {
      id: `custom-quad-${Date.now()}`,
      title: quadTitle || `Giải phương trình bậc hai ${quadA}${quadVar}² + ${quadB}${quadVar} + ${quadC} = 0`,
      category: 'single_equation',
      categoryName: 'Giải bài toán bằng cách lập phương trình',
      grade: 'Toán 10 - THPT',
      topic: 'chuyen_dong',
      topicName: 'Phương trình bậc hai thực tế',
      statement:
        quadStatement.trim() ||
        `Tìm đại lượng ${quadVar} thỏa mãn phương trình: ${quadA}${quadVar}² + (${quadB})${quadVar} + (${quadC}) = 0, với điều kiện ${quadMinVal} < ${quadVar} < ${quadMaxVal}.`,
      practicalContext: 'Mô hình chuyển động hoặc hình học dẫn đến phương trình bậc hai.',
      variables: [
        { symbol: quadVar, meaning: `Đại lượng cần tìm (${quadVar})`, unit: quadUnit, condition: `${quadMinVal} < ${quadVar} < ${quadMaxVal}` },
      ],
      setupExplanation: [
        `Gọi ${quadVar} là đại lượng cần tìm (đơn vị: ${quadUnit}), điều kiện: ${quadMinVal} < ${quadVar} < ${quadMaxVal}.`,
        `Từ dữ kiện bài toán, đưa về phương trình bậc hai dạng chính tắc: ${quadA}${quadVar}² + (${quadB})${quadVar} + (${quadC}) = 0.`,
      ],
      equationLatexList: [
        `${quadA}${quadVar}^2 + (${quadB})${quadVar} + (${quadC}) = 0 \\quad (${quadMinVal} < ${quadVar} < ${quadMaxVal})`,
      ],
      singleEquationData: {
        form: 'quadratic',
        standardFormLatex: `${quadA}${quadVar}^2 + (${quadB})${quadVar} + (${quadC}) = 0`,
        a: quadA,
        b: quadB,
        c: quadC,
        variableName: quadVar,
        unit: quadUnit,
      },
      solutionSteps: {
        methodTitle: 'Tính biệt thức Delta và công thức nghiệm phương trình bậc hai',
        subSteps:
          res.roots.length > 0
            ? [
                {
                  title: 'Bước 1: Tính biệt thức Delta (Δ)',
                  content: `Δ = b² - 4ac = (${quadB})² - 4 × (${quadA}) × (${quadC}) = ${delta}.`,
                  mathLatex: `\\Delta = (${quadB})^2 - 4 \\cdot (${quadA}) \\cdot (${quadC}) = ${delta}`,
                },
                {
                  title:
                    delta !== undefined && delta > 0
                      ? 'Bước 2: Phương trình có hai nghiệm phân biệt'
                      : delta === 0
                      ? 'Bước 2: Phương trình có nghiệm kép'
                      : 'Bước 2: Giải phương trình',
                  content:
                    res.roots.length === 2
                      ? `Áp dụng công thức nghiệm: ${quadVar} = (-b ± √Δ) / (2a). Nghiệm: ${quadVar}₁ = ${res.roots[0].latex}, ${quadVar}₂ = ${res.roots[1].latex}.`
                      : `Nghiệm: ${quadVar} = ${res.roots[0].latex}.`,
                  mathLatex:
                    res.roots.length === 2
                      ? `${quadVar}_{1,2} = \\frac{-(${quadB}) \\pm \\sqrt{${delta}}}{2 \\cdot ${quadA}}`
                      : `${quadVar} = ${res.roots[0].latex}`,
                },
                {
                  title: `Bước 3: Đối chiếu với điều kiện ${quadMinVal} < ${quadVar} < ${quadMaxVal}`,
                  content: res.roots
                    .map((r) => {
                      const ok = r.val > quadMinVal && r.val < quadMaxVal;
                      return `${quadVar} = ${r.latex}: ${ok ? 'thỏa mãn' : 'LOẠI'} (không thuộc khoảng ${quadMinVal} < ${quadVar} < ${quadMaxVal}).`;
                    })
                    .join(' '),
                  mathLatex: res.roots.map((r) => `${quadVar} = ${r.latex}`).join(', \\quad '),
                },
              ]
            : [
                {
                  title: 'Bước 1: Tính biệt thức Delta (Δ)',
                  content: `Δ = (${quadB})² - 4 × (${quadA}) × (${quadC}) = ${delta}. Δ < 0 nên phương trình vô nghiệm thực.`,
                  mathLatex: `\\Delta = (${quadB})^2 - 4 \\cdot (${quadA}) \\cdot (${quadC}) = ${delta} < 0`,
                },
              ],
        roots: res.roots.map((r) => ({
          val: r.val,
          latex: r.latex,
          isAccepted: r.val > quadMinVal && r.val < quadMaxVal,
          reason:
            r.val > quadMinVal && r.val < quadMaxVal
              ? `Thỏa mãn điều kiện ${quadMinVal} < ${quadVar} < ${quadMaxVal}`
              : `Loại vì không thuộc khoảng ${quadMinVal} < ${quadVar} < ${quadMaxVal}`,
        })),
      },
      conclusion: {
        overview:
          res.roots.filter((r) => r.val > quadMinVal && r.val < quadMaxVal).length > 0
            ? `Nghiệm thỏa mãn bài toán: ${quadVar} = ${res.roots.filter((r) => r.val > quadMinVal && r.val < quadMaxVal)[0].latex} (${quadUnit}).`
            : 'Không có nghiệm nào thỏa mãn điều kiện thực tế.',
        finalAnswers: res.roots
          .filter((r) => r.val > quadMinVal && r.val < quadMaxVal)
          .map((r, i) => ({ label: `Nghiệm ${i + 1}`, value: `${quadVar} = ${r.latex} ${quadUnit}` })),
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

      {/* SAVE BUTTON + STATUS */}
      {currentProblem.id.startsWith('custom-') && (
        <div className="flex flex-wrap items-center gap-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl px-4 py-2.5">
          <button
            onClick={handleSaveCurrent}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu bài toán vào kho</span>
          </button>
          <Bookmark className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-emerald-200">Bài giải này do bạn tự nhập. Lưu lại để dùng lại sau.</span>
          {saveStatus && <span className="text-xs font-bold text-amber-200 ml-auto">{saveStatus}</span>}
        </div>
      )}

      {/* TAB 1: PRESETS */}
      {activeTab === 'presets' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold mr-1">Phân loại:</span>
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'inequality_system', label: 'Hệ BPT & Quy hoạch tuyến tính' },
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

          {customProblems.length > 0 && (
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 bg-amber-950/30 border border-amber-500/20 rounded-lg px-3 py-2">
              <Bookmark className="w-3.5 h-3.5" />
              <span>{customProblems.length} bài toán đã lưu của bạn hiển thị bên dưới (có nút xóa).</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
            {filteredPresets.map((preset) => {
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
                      {preset.category === 'inequality_system'
                        ? 'Vẽ miền nghiệm Oxy'
                        : preset.category === 'linear_system'
                        ? 'Hệ PT đại số'
                        : 'Phương trình bậc 2'}
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
              placeholder="Ví dụ: Một thương nhân có 120 triệu đồng, mua tối đa 8 tấn trái cây..."
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

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-400">Chọn dạng bài toán cần giải:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCustomType('inequality_system')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                  customType === 'inequality_system' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                1. Hệ BPT 2 ẩn & Tìm Min/Max F(x, y)
              </button>
              <button
                onClick={() => setCustomType('linear_system')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                  customType === 'linear_system' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                2. Hệ phương trình bậc nhất 2 ẩn
              </button>
              <button
                onClick={() => setCustomType('single_equation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                  customType === 'single_equation' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
            </div>
          )}

          {/* SUB-FORM B: 2x2 LINEAR SYSTEM */}
          {customType === 'linear_system' && (
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Tên bài toán (tùy chọn):</label>
                <input type="text" value={sysTitle} onChange={(e) => setSysTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
                <textarea value={sysStatement} onChange={(e) => setSysStatement(e.target.value)} rows={2}
                  placeholder="Nhập đề bài thực tế (tùy chọn, giúp lời giải sát bài mẫu)..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400">Phương trình 1: a1·x + b1·y = c1</div>
                  <div className="flex items-center gap-2">
                    <input type="number" value={sysA1} onChange={(e) => setSysA1(Number(e.target.value))}
                      className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center" />
                    <span className="text-xs font-bold">x +</span>
                    <input type="number" value={sysB1} onChange={(e) => setSysB1(Number(e.target.value))}
                      className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center" />
                    <span className="text-xs font-bold">y =</span>
                    <input type="number" value={sysC1} onChange={(e) => setSysC1(Number(e.target.value))}
                      className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center" />
                  </div>
                </div>
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400">Phương trình 2: a2·x + b2·y = c2</div>
                  <div className="flex items-center gap-2">
                    <input type="number" value={sysA2} onChange={(e) => setSysA2(Number(e.target.value))}
                      className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center" />
                    <span className="text-xs font-bold">x +</span>
                    <input type="number" value={sysB2} onChange={(e) => setSysB2(Number(e.target.value))}
                      className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center" />
                    <span className="text-xs font-bold">y =</span>
                    <input type="number" value={sysC2} onChange={(e) => setSysC2(Number(e.target.value))}
                      className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-400 font-bold">Tên ẩn & đơn vị:</span>
                <input type="text" value={sysVarX} onChange={(e) => setSysVarX(e.target.value)} className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white text-center" />
                <input type="text" value={sysVarY} onChange={(e) => setSysVarY(e.target.value)} className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white text-center" />
                <input type="text" value={sysUnit} onChange={(e) => setSysUnit(e.target.value)} placeholder="Đơn vị" className="w-32 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white text-center" />
              </div>

              {/* 3x3 System toggle */}
              <details className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <summary className="text-xs font-bold text-emerald-400 cursor-pointer">Mở rộng: Hệ phương trình 3 ẩn (x, y, z)</summary>
                <div className="space-y-2">
                  {sys3Equations.map((eq, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-xs font-bold text-emerald-400 w-12">{eq.label}:</span>
                      <input type="number" value={eq.a}
                        onChange={(e) => { const u = [...sys3Equations]; u[i].a = Number(e.target.value); setSys3Equations(u); }}
                        className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-center" />
                      <span className="text-xs text-slate-300">{sys3VarNames[0]} +</span>
                      <input type="number" value={eq.b}
                        onChange={(e) => { const u = [...sys3Equations]; u[i].b = Number(e.target.value); setSys3Equations(u); }}
                        className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-center" />
                      <span className="text-xs text-slate-300">{sys3VarNames[1]} +</span>
                      <input type="number" value={eq.c}
                        onChange={(e) => { const u = [...sys3Equations]; u[i].c = Number(e.target.value); setSys3Equations(u); }}
                        className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-center" />
                      <span className="text-xs text-slate-300">{sys3VarNames[2]} =</span>
                      <input type="number" value={eq.rhs}
                        onChange={(e) => { const u = [...sys3Equations]; u[i].rhs = Number(e.target.value); setSys3Equations(u); }}
                        className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-center" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400 font-bold">Tên ẩn:</span>
                  {sys3VarNames.map((vn, i) => (
                    <input key={i} type="text" value={vn} maxLength={3}
                      onChange={(e) => { const u = [...sys3VarNames]; u[i] = e.target.value; setSys3VarNames(u); }}
                      className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-center" />
                  ))}
                  <input type="text" value={sys3Unit} onChange={(e) => setSys3Unit(e.target.value)} placeholder="Đơn vị" className="w-28 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-center" />
                </div>
                <button onClick={handleSolveCustomSys3}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl transition cursor-pointer flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Giải hệ 3 ẩn bằng định thức Cramer</span>
                </button>
              </details>

              <button onClick={handleSolveCustomSys}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/80 cursor-pointer flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Giải hệ 2 ẩn từng bước chi tiết (Cramer)</span>
              </button>
            </div>
          )}

          {/* SUB-FORM C: QUADRATIC EQUATION */}
          {customType === 'single_equation' && (
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Tên bài toán (tùy chọn):</label>
                <input type="text" value={quadTitle} onChange={(e) => setQuadTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
                <textarea value={quadStatement} onChange={(e) => setQuadStatement(e.target.value)} rows={2}
                  placeholder="Nhập đề bài thực tế (tùy chọn)..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-emerald-400">Phương trình chính tắc: a·x² + b·x + c = 0</div>
                <div className="flex flex-wrap items-center gap-2">
                  <input type="number" value={quadA} onChange={(e) => setQuadA(Number(e.target.value))}
                    className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center" />
                  <span className="text-xs font-bold">{quadVar}² +</span>
                  <input type="number" value={quadB} onChange={(e) => setQuadB(Number(e.target.value))}
                    className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center" />
                  <span className="text-xs font-bold">{quadVar} +</span>
                  <input type="number" value={quadC} onChange={(e) => setQuadC(Number(e.target.value))}
                    className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center" />
                  <span className="text-xs font-bold">= 0</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs pt-2 border-t border-slate-800">
                  <span className="text-slate-400 font-bold">Tên biến:</span>
                  <input type="text" value={quadVar} onChange={(e) => setQuadVar(e.target.value)} className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white text-center" />
                  <span className="text-slate-400 font-bold">Đơn vị:</span>
                  <input type="text" value={quadUnit} onChange={(e) => setQuadUnit(e.target.value)} className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white text-center" />
                  <span className="text-slate-400 font-bold">Điều kiện:</span>
                  <input type="number" value={quadMinVal} onChange={(e) => setQuadMinVal(Number(e.target.value))} className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white text-center" title="Giá trị nhỏ nhất" />
                  <span className="text-xs text-slate-300">&lt; {quadVar} &lt;</span>
                  <input type="number" value={quadMaxVal} onChange={(e) => setQuadMaxVal(Number(e.target.value))} className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white text-center" title="Giá trị lớn nhất" />
                </div>
              </div>

              <button onClick={handleSolveCustomQuad}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/80 cursor-pointer flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Giải phương trình, tính Δ & đối chiếu điều kiện</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
