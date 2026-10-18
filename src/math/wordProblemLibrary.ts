import { formatNumberLatex, Fraction } from './fractions';
import {
  AnalysisTable,
  ConstraintLine,
  LinearProgrammingData,
  ProblemPreset,
  SolvedProblem,
  Vertex,
} from './wordProblemTypes';

/**
 * Solve a 2x2 linear system:
 * a1*x + b1*y = c1
 * a2*x + b2*y = c2
 */
export function solveLinearSystem2x2(
  a1: number,
  b1: number,
  c1: number,
  a2: number,
  b2: number,
  c2: number
): { x: number; y: number; exactX: string; exactY: string; D: number; Dx: number; Dy: number } | null {
  const D = a1 * b2 - a2 * b1;
  const Dx = c1 * b2 - c2 * b1;
  const Dy = a1 * c2 - a2 * c1;

  if (Math.abs(D) < 1e-10) {
    return null; // Vô nghiệm hoặc vô số nghiệm
  }

  const xVal = Dx / D;
  const yVal = Dy / D;

  let exactX = formatNumberLatex(xVal);
  let exactY = formatNumberLatex(yVal);

  try {
    const fx = new Fraction(Dx, D);
    const fy = new Fraction(Dy, D);
    exactX = fx.toLatex();
    exactY = fy.toLatex();
  } catch {
    // fallback
  }

  return { x: xVal, y: yVal, exactX, exactY, D, Dx, Dy };
}

/**
 * Geometry solver for 2D Linear Programming:
 * Given inequalities of form a*x + b*y <= c, with x >= 0, y >= 0.
 * Objective: F(x, y) = A*x + B*y -> max or min.
 */
export function solveLinearProgramming(
  constraints: ConstraintLine[],
  objA: number,
  objB: number,
  goal: 'max' | 'min' = 'max',
  unit = 'triệu đồng'
): LinearProgrammingData {
  // All boundary lines including axes x = 0 (x >= 0) and y = 0 (y >= 0)
  const allLines: { a: number; b: number; c: number; label: string }[] = [
    ...constraints.map((c) => ({ a: c.a, b: c.b, c: c.c, label: c.label })),
    { a: 1, b: 0, c: 0, label: 'x \\ge 0' },
    { a: 0, b: 1, c: 0, label: 'y \\ge 0' },
  ];

  // Find all pairwise intersection points
  const candidatePoints: { x: number; y: number }[] = [];

  for (let i = 0; i < allLines.length; i++) {
    for (let j = i + 1; j < allLines.length; j++) {
      const L1 = allLines[i];
      const L2 = allLines[j];
      const D = L1.a * L2.b - L2.a * L1.b;

      if (Math.abs(D) > 1e-7) {
        const x = (L1.c * L2.b - L2.c * L1.b) / D;
        const y = (L1.a * L2.c - L2.a * L1.c) / D;

        if (Number.isFinite(x) && Number.isFinite(y)) {
          // Check if point satisfies all constraints (with small numerical tolerance)
          let satisfies = true;

          // Non-negativity
          if (x < -1e-6 || y < -1e-6) {
            satisfies = false;
          }

          if (satisfies) {
            for (const c of constraints) {
              const val = c.a * x + c.b * y;
              if (c.type === '<=' && val > c.c + 1e-6) {
                satisfies = false;
                break;
              }
              if (c.type === '>=' && val < c.c - 1e-6) {
                satisfies = false;
                break;
              }
            }
          }

          if (satisfies) {
            const cleanX = Math.abs(x) < 1e-7 ? 0 : Number(x.toFixed(4));
            const cleanY = Math.abs(y) < 1e-7 ? 0 : Number(y.toFixed(4));
            // Avoid duplicate points
            if (!candidatePoints.some((p) => Math.abs(p.x - cleanX) < 1e-4 && Math.abs(p.y - cleanY) < 1e-4)) {
              candidatePoints.push({ x: cleanX, y: cleanY });
            }
          }
        }
      }
    }
  }

  // Sort candidate vertices in counter-clockwise order around centroid
  let vertices: Vertex[] = [];
  if (candidatePoints.length > 0) {
    const cx = candidatePoints.reduce((s, p) => s + p.x, 0) / candidatePoints.length;
    const cy = candidatePoints.reduce((s, p) => s + p.y, 0) / candidatePoints.length;

    const sorted = [...candidatePoints].sort((p1, p2) => {
      const a1 = Math.atan2(p1.y - cy, p1.x - cx);
      const a2 = Math.atan2(p2.y - cy, p2.x - cx);
      return a1 - a2;
    });

    const letterNames = ['O', 'A', 'B', 'C', 'D', 'E', 'F'];
    vertices = sorted.map((pt, idx) => {
      let name = letterNames[idx] || `P_{${idx}}`;
      if (Math.abs(pt.x) < 1e-5 && Math.abs(pt.y) < 1e-5) {
        name = 'O';
      }
      const objVal = objA * pt.x + objB * pt.y;
      return {
        name,
        x: pt.x,
        y: pt.y,
        exactX: formatNumberLatex(pt.x),
        exactY: formatNumberLatex(pt.y),
        objValue: objVal,
      };
    });
  }

  // Determine optimal vertex
  let optimalVertex: Vertex = vertices[0] || { name: 'O', x: 0, y: 0, exactX: '0', exactY: '0', objValue: 0 };
  for (const v of vertices) {
    if (goal === 'max') {
      if ((v.objValue ?? -Infinity) > (optimalVertex.objValue ?? -Infinity)) {
        optimalVertex = v;
      }
    } else {
      if ((v.objValue ?? Infinity) < (optimalVertex.objValue ?? Infinity)) {
        optimalVertex = v;
      }
    }
  }

  return {
    constraints,
    objectiveFunc: {
      A: objA,
      B: objB,
      latex: `F(x, y) = ${objA !== 1 ? objA : ''}x + ${objB !== 1 ? objB : ''}y`,
      goal,
      unit,
    },
    vertices,
    optimalVertex,
  };
}

/**
 * PRESETS OF HIGH SCHOOL WORD PROBLEMS
 */
export const PRESETS: ProblemPreset[] = [
  // 1. CHUYỂN ĐỘNG
  {
    id: 'chuyen_dong_nguoc_chieu',
    category: 'chuyen_dong',
    categoryName: 'Toán Chuyển Động',
    title: 'Hai xe đi ngược chiều gặp nhau',
    shortDesc: 'Tìm vận tốc ô tô và xe máy đi từ hai tỉnh A và B',
    problemStatement:
      'Hai tỉnh A và B cách nhau 150 km. Hai ô tô khởi hành cùng một lúc, một xe đi từ A đến B và một xe đi từ B về A. Sau 2 giờ thì hai xe gặp nhau. Biết vận tốc ô tô đi từ A lớn hơn vận tốc ô tô đi từ B là 15 km/h. Tính vận tốc của mỗi ô tô.',
    defaultParams: { distance: 150, time: 2, speedDiff: 15 },
    paramDescriptions: [
      { key: 'distance', label: 'Quãng đường AB', unit: 'km', min: 50, max: 500, step: 10 },
      { key: 'time', label: 'Thời gian gặp nhau', unit: 'giờ', min: 1, max: 10, step: 0.5 },
      { key: 'speedDiff', label: 'Chênh lệch vận tốc', unit: 'km/h', min: 5, max: 40, step: 1 },
    ],
    solve: (params) => {
      const S = params.distance ?? 150;
      const t = params.time ?? 2;
      const diff = params.speedDiff ?? 15;

      // x: vận tốc xe A, y: vận tốc xe B
      // x - y = diff
      // t*x + t*y = S  => x + y = S/t
      const sys = solveLinearSystem2x2(1, -1, diff, 1, 1, S / t);
      const vA = sys?.x ?? 45;
      const vB = sys?.y ?? 30;

      const analysisTable: AnalysisTable = {
        headers: ['Phương tiện', 'Vận tốc (km/h)', 'Thời gian (h)', 'Quãng đường đi được (km)'],
        rows: [
          { subject: 'Ô tô từ A', col1: 'x', col2: `${t}`, col3: `${t}x` },
          { subject: 'Ô tô từ B', col1: 'y', col2: `${t}`, col3: `${t}y` },
        ],
        note: `Tổng quãng đường hai xe đi được bằng khoảng cách AB: ${t}x + ${t}y = ${S}`,
      };

      return {
        id: 'chuyen_dong_nguoc_chieu',
        category: 'chuyen_dong',
        categoryName: 'Bài Toán Chuyển Động',
        title: 'Hai xe đi ngược chiều gặp nhau',
        problemStatement: `Hai tỉnh A và B cách nhau ${S} km. Hai ô tô khởi hành cùng một lúc, một xe đi từ A đến B và một xe đi từ B về A. Sau ${t} giờ thì hai xe gặp nhau. Biết vận tốc ô tô đi từ A lớn hơn vận tốc ô tô đi từ B là ${diff} km/h. Tính vận tốc của mỗi ô tô.`,
        systemType: 'he_phuong_trinh',
        variables: [
          { name: 'Vận tốc của ô tô đi từ A', symbol: 'x', unit: 'km/h', condition: `x > ${diff}` },
          { name: 'Vận tốc của ô tô đi từ B', symbol: 'y', unit: 'km/h', condition: 'y > 0' },
        ],
        analysisTable,
        equationsLatex: [
          `x - y = ${diff}`,
          `${t}x + ${t}y = ${S} \\Leftrightarrow x + y = ${S / t}`,
        ],
        steps: [
          {
            stepNum: 1,
            title: 'Bước 1: Chọn ẩn số và đặt điều kiện thích hợp cho ẩn',
            content: `Gọi vận tốc của ô tô đi từ A là $x$ (km/h) (điều kiện: $x > ${diff}$).\nGọi vận tốc của ô tô đi từ B là $y$ (km/h) (điều kiện: $y > 0$).`,
          },
          {
            stepNum: 2,
            title: 'Bước 2: Biểu diễn các đại lượng chưa biết theo ẩn và đại lượng đã biết',
            content: `• Quãng đường ô tô đi từ A trong ${t} giờ là: $${t}x$ (km).\n• Quãng đường ô tô đi từ B trong ${t} giờ là: $${t}y$ (km).`,
          },
          {
            stepNum: 3,
            title: 'Bước 3: Lập hệ phương trình',
            content: `• Vì vận tốc ô tô từ A lớn hơn vận tốc ô tô từ B là ${diff} km/h, ta có phương trình:\n$$x - y = ${diff} \\quad (1)$$\n• Vì hai xe đi ngược chiều gặp nhau sau ${t} giờ trên quãng đường ${S} km, tổng quãng đường hai xe đi được bằng ${S} km, ta có phương trình:\n$$${t}x + ${t}y = ${S} \\Leftrightarrow x + y = ${S / t} \\quad (2)$$\n• Từ (1) và (2), ta có hệ phương trình:\n$$\\begin{cases} x - y = ${diff} \\\\ x + y = ${S / t} \\end{cases}$$`,
          },
          {
            stepNum: 4,
            title: 'Bước 4: Giải hệ phương trình',
            content: `Cộng từng vế của phương trình (1) và phương trình (2) ta được:\n$$2x = ${diff + S / t} \\Leftrightarrow x = ${vA}$$\nThay $x = ${vA}$ vào phương trình (2) ta được:\n$$${vA} + y = ${S / t} \\Leftrightarrow y = ${vB}$$`,
          },
          {
            stepNum: 5,
            title: 'Bước 5: Đối chiếu điều kiện và Kết luận',
            content: `Ta thấy $x = ${vA} > ${diff}$ và $y = ${vB} > 0$ đều thỏa mãn điều kiện đặt ra.\n\n**Kết luận:**\n• Vận tốc của ô tô đi từ A là: **${vA} km/h**.\n• Vận tốc của ô tô đi từ B là: **${vB} km/h**.`,
          },
        ],
        solutionValues: [
          { symbol: 'x', value: vA, exactLatex: `${vA}`, unit: 'km/h' },
          { symbol: 'y', value: vB, exactLatex: `${vB}`, unit: 'km/h' },
        ],
        finalConclusion: `Vận tốc ô tô đi từ A là ${vA} km/h, vận tốc ô tô đi từ B là ${vB} km/h.`,
      };
    },
  },

  // 2. QUY HOẠCH TUYẾN TÍNH & HỆ BẤT PHƯƠNG TRÌNH (BÀI TOÁN TỐI ƯU SẢN XUẤT SGK TOÁN 10 & 12)
  {
    id: 'quy_hoach_tuyen_tinh_san_xuat',
    category: 'he_bat_phuong_trinh',
    categoryName: 'Hệ BPT & Bài Toán Tối Ưu',
    title: 'Bài toán tối ưu hóa lợi nhuận sản xuất',
    shortDesc: 'Tìm phương án sản xuất hai loại sản phẩm để lợi nhuận lớn nhất (Toán 10, 12)',
    problemStatement:
      'Một xưởng sản xuất hai loại sản phẩm I và II. Mỗi tấn sản phẩm I cần dùng 2 giờ máy cán và 1 tấn nguyên liệu. Mỗi tấn sản phẩm II cần 1 giờ máy cán và 2 tấn nguyên liệu. Xưởng có tối đa 12 giờ máy cán và 12 tấn nguyên liệu. Biết mỗi tấn sản phẩm I cho lợi nhuận 4 triệu đồng, mỗi tấn sản phẩm II cho lợi nhuận 3 triệu đồng. Hãy lập kế hoạch sản xuất để xưởng thu được lợi nhuận cao nhất.',
    defaultParams: { timeLimit: 12, matLimit: 12, profitI: 4, profitII: 3 },
    paramDescriptions: [
      { key: 'timeLimit', label: 'Thời gian máy cán tối đa', unit: 'giờ', min: 6, max: 24, step: 1 },
      { key: 'matLimit', label: 'Nguyên liệu tối đa', unit: 'tấn', min: 6, max: 24, step: 1 },
      { key: 'profitI', label: 'Lợi nhuận 1 tấn SP I', unit: 'triệu đồng', min: 1, max: 10, step: 0.5 },
      { key: 'profitII', label: 'Lợi nhuận 1 tấn SP II', unit: 'triệu đồng', min: 1, max: 10, step: 0.5 },
    ],
    solve: (params) => {
      const T = params.timeLimit ?? 12;
      const M = params.matLimit ?? 12;
      const p1 = params.profitI ?? 4;
      const p2 = params.profitII ?? 3;

      const constraints: ConstraintLine[] = [
        { a: 2, b: 1, c: T, type: '<=', label: `2x + y \\le ${T}`, name: 'Ràng buộc giờ máy cán' },
        { a: 1, b: 2, c: M, type: '<=', label: `x + 2y \\le ${M}`, name: 'Ràng buộc nguyên liệu' },
      ];

      const lpData = solveLinearProgramming(constraints, p1, p2, 'max', 'triệu đồng');
      const opt = lpData.optimalVertex;

      const analysisTable: AnalysisTable = {
        headers: ['Loại sản phẩm', 'Máy cán (giờ/tấn)', 'Nguyên liệu (tấn/tấn)', 'Lợi nhuận (triệu/tấn)'],
        rows: [
          { subject: 'Sản phẩm I (x tấn)', col1: '2x', col2: 'x', col3: `${p1}x` },
          { subject: 'Sản phẩm II (y tấn)', col1: 'y', col2: '2y', col3: `${p2}y` },
          { subject: 'Giới hạn nguồn lực', col1: `Tối đa ${T} giờ`, col2: `Tối đa ${M} tấn`, col3: `F(x,y) = ${p1}x + ${p2}y` },
        ],
        note: `Hệ bất phương trình ràng buộc: 2x + y <= ${T}, x + 2y <= ${M}, x >= 0, y >= 0`,
      };

      const vertexRows = lpData.vertices
        .map((v) => `• Tại đỉnh $${v.name}(${v.exactX};\\, ${v.exactY})$: $F(${v.exactX};\\, ${v.exactY}) = ${p1} \\cdot (${v.exactX}) + ${p2} \\cdot (${v.exactY}) = ${v.objValue}$ (triệu đồng).`)
        .join('\n');

      return {
        id: 'quy_hoach_tuyen_tinh_san_xuat',
        category: 'he_bat_phuong_trinh',
        categoryName: 'Hệ BPT & Quy Hoạch Tuyến Tính',
        title: 'Bài toán tối ưu hóa lợi nhuận sản xuất',
        problemStatement: `Một xưởng sản xuất hai loại sản phẩm I và II. Mỗi tấn sản phẩm I cần dùng 2 giờ máy cán và 1 tấn nguyên liệu. Mỗi tấn sản phẩm II cần 1 giờ máy cán và 2 tấn nguyên liệu. Xưởng có tối đa ${T} giờ máy cán và ${M} tấn nguyên liệu. Biết mỗi tấn sản phẩm I cho lợi nhuận ${p1} triệu đồng, mỗi tấn sản phẩm II cho lợi nhuận ${p2} triệu đồng. Hãy lập kế hoạch sản xuất để xưởng thu được lợi nhuận cao nhất.`,
        systemType: 'he_bat_phuong_trinh',
        variables: [
          { name: 'Số tấn sản phẩm loại I cần sản xuất', symbol: 'x', unit: 'tấn', condition: 'x \\ge 0' },
          { name: 'Số tấn sản phẩm loại II cần sản xuất', symbol: 'y', unit: 'tấn', condition: 'y \\ge 0' },
        ],
        analysisTable,
        equationsLatex: [
          `2x + y \\le ${T}`,
          `x + 2y \\le ${M}`,
          'x \\ge 0',
          'y \\ge 0',
        ],
        lpData,
        steps: [
          {
            stepNum: 1,
            title: 'Bước 1: Chọn ẩn số và xác định điều kiện của ẩn',
            content: `Gọi số tấn sản phẩm loại I xưởng cần sản xuất là $x$ ($x \\ge 0$, đơn vị: tấn).\nGọi số tấn sản phẩm loại II xưởng cần sản xuất là $y$ ($y \\ge 0$, đơn vị: tấn).`,
          },
          {
            stepNum: 2,
            title: 'Bước 2: Lập hệ bất phương trình ràng buộc và thiết lập hàm mục tiêu',
            content: `• Số giờ máy cán cần dùng là: $2x + y$. Do máy cán chỉ có tối đa ${T} giờ, ta có bất phương trình:\n$$2x + y \\le ${T} \\quad (d_1)$$\n• Lượng nguyên liệu cần dùng là: $x + 2y$. Do lượng nguyên liệu có tối đa ${M} tấn, ta có bất phương trình:\n$$x + 2y \\le ${M} \\quad (d_2)$$\n• Do số lượng sản phẩm không âm, ta có: $x \\ge 0,\\, y \\ge 0$.\n\nVậy ta có hệ bất phương trình bậc nhất hai ẩn mô tả bài toán:\n$$\\begin{cases} 2x + y \\le ${T} \\\\ x + 2y \\le ${M} \\\\ x \\ge 0 \\\\ y \\ge 0 \\end{cases}$$\n\n• Tổng lợi nhuận thu được là hàm số bậc nhất hai ẩn:\n$$F(x, y) = ${p1}x + ${p2}y \\quad \\text{(triệu đồng)}$$\nBài toán trở thành tìm $(x; y)$ thuộc miền nghiệm của hệ để $F(x, y)$ đạt giá trị lớn nhất.`,
          },
          {
            stepNum: 3,
            title: 'Bước 3: Biểu diễn hình học miền nghiệm trên mặt phẳng Oxy',
            content: `Miền nghiệm của hệ bất phương trình là miền đa giác lồi trên mặt phẳng tọa độ $Oxy$ giới hạn bởi các đường thẳng $2x + y = ${T}$, $x + 2y = ${M}$, trục $Ox$ ($y = 0$) và trục $Oy$ ($x = 0$).\n\nTọa độ các đỉnh của đa giác miền nghiệm được xác định bởi giao điểm các đường biên:\n${lpData.vertices.map((v) => `• $${v.name}(${v.exactX};\\, ${v.exactY})$`).join('\n')}`,
          },
          {
            stepNum: 4,
            title: 'Bước 4: Tính giá trị hàm mục tiêu tại các đỉnh và tìm phương án tối ưu',
            content: `Theo định lý quy hoạch tuyến tính, giá trị lớn nhất của $F(x, y)$ đạt tại một trong các đỉnh của miền đa giác nghiệm:\n\n${vertexRows}\n\nSo sánh các giá trị trên, ta thấy $F(x, y)$ đạt giá trị lớn nhất bằng **${opt.objValue} triệu đồng** tại đỉnh $${opt.name}(${opt.exactX};\\, ${opt.exactY})$.`,
          },
          {
            stepNum: 5,
            title: 'Bước 5: Kết luận bài toán thực tế',
            content: `Để thu được lợi nhuận cao nhất, xưởng cần sản xuất:\n• **${opt.exactX} tấn** sản phẩm loại I.\n• **${opt.exactY} tấn** sản phẩm loại II.\nLợi nhuận tối đa thu được là **${opt.objValue} triệu đồng**.`,
          },
        ],
        solutionValues: [
          { symbol: 'x', value: opt.x, exactLatex: opt.exactX, unit: 'tấn SP I' },
          { symbol: 'y', value: opt.y, exactLatex: opt.exactY, unit: 'tấn SP II' },
          { symbol: 'F_{max}', value: opt.objValue ?? 0, exactLatex: `${opt.objValue}`, unit: 'triệu đồng' },
        ],
        finalConclusion: `Xưởng cần sản xuất ${opt.exactX} tấn sản phẩm I và ${opt.exactY} tấn sản phẩm II để đạt lợi nhuận lớn nhất là ${opt.objValue} triệu đồng.`,
      };
    },
  },

  // 3. TOÁN NĂNG SUẤT / CÔNG VIỆC LÀM CHUNG LÀM RIÊNG
  {
    id: 'nang_suat_lam_chung_rieng',
    category: 'nang_suat',
    categoryName: 'Toán Năng Suất',
    title: 'Hai tổ công nhân cùng làm chung một công việc',
    shortDesc: 'Tìm thời gian mỗi tổ làm một mình xong toàn bộ công việc',
    problemStatement:
      'Hai tổ công nhân cùng làm chung một công việc thì hoàn thành trong 12 ngày. Nếu tổ I làm một mình trong 4 ngày rồi tổ II làm một mình trong 6 ngày tiếp theo thì cả hai tổ hoàn thành được 40% công việc. Hỏi nếu làm một mình thì mỗi tổ mất bao nhiêu ngày để xong công việc?',
    defaultParams: { togetherDays: 12, daysI: 4, daysII: 6, percentDone: 40 },
    paramDescriptions: [
      { key: 'togetherDays', label: 'Thời gian cùng làm xong việc', unit: 'ngày', min: 4, max: 30, step: 1 },
      { key: 'daysI', label: 'Số ngày tổ I làm trước', unit: 'ngày', min: 1, max: 15, step: 1 },
      { key: 'daysII', label: 'Số ngày tổ II làm sau', unit: 'ngày', min: 1, max: 15, step: 1 },
      { key: 'percentDone', label: 'Phần trăm công việc hoàn thành', unit: '%', min: 10, max: 90, step: 5 },
    ],
    solve: (params) => {
      const T = params.togetherDays ?? 12;
      const d1 = params.daysI ?? 4;
      const d2 = params.daysII ?? 6;
      const P = (params.percentDone ?? 40) / 100;

      // u = 1/x, v = 1/y
      // u + v = 1/T
      // d1*u + d2*v = P
      const sys = solveLinearSystem2x2(1, 1, 1 / T, d1, d2, P);
      const u = sys?.x ?? 1 / 20;
      const v = sys?.y ?? 1 / 30;

      const days1 = Math.round(1 / u);
      const days2 = Math.round(1 / v);

      const analysisTable: AnalysisTable = {
        headers: ['Đối tượng', 'Thời gian hoàn thành (ngày)', 'Năng suất 1 ngày (phần CV)', 'Khối lượng công việc'],
        rows: [
          { subject: 'Tổ I', col1: 'x', col2: '1/x', col3: `${d1}/x` },
          { subject: 'Tổ II', col1: 'y', col2: '1/y', col3: `${d2}/y` },
          { subject: 'Cả hai tổ', col1: `${T}`, col2: `1/${T}`, col3: 'Toàn bộ công việc (1)' },
        ],
        note: `Phương trình 1: 1/x + 1/y = 1/${T}. Phương trình 2: ${d1}/x + ${d2}/y = ${P}`,
      };

      return {
        id: 'nang_suat_lam_chung_rieng',
        category: 'nang_suat',
        categoryName: 'Bài Toán Năng Suất',
        title: 'Hai tổ công nhân cùng làm chung một công việc',
        problemStatement: `Hai tổ công nhân cùng làm chung một công việc thì hoàn thành trong ${T} ngày. Nếu tổ I làm một mình trong ${d1} ngày rồi tổ II làm một mình trong ${d2} ngày tiếp theo thì cả hai tổ hoàn thành được ${params.percentDone ?? 40}% công việc. Hỏi nếu làm một mình thì mỗi tổ mất bao nhiêu ngày để xong công việc?`,
        systemType: 'he_phuong_trinh',
        variables: [
          { name: 'Thời gian tổ I làm một mình hoàn thành công việc', symbol: 'x', unit: 'ngày', condition: `x > ${T}` },
          { name: 'Thời gian tổ II làm một mình hoàn thành công việc', symbol: 'y', unit: 'ngày', condition: `y > ${T}` },
        ],
        analysisTable,
        equationsLatex: [
          `\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{${T}}`,
          `${d1} \\cdot \\frac{1}{x} + ${d2} \\cdot \\frac{1}{y} = ${P}`,
        ],
        steps: [
          {
            stepNum: 1,
            title: 'Bước 1: Chọn ẩn số và xác định điều kiện của ẩn',
            content: `Gọi thời gian tổ I làm một mình xong toàn bộ công việc là $x$ ngày (điều kiện: $x > ${T}$).\nGọi thời gian tổ II làm một mình xong toàn bộ công việc là $y$ ngày (điều kiện: $y > ${T}$).`,
          },
          {
            stepNum: 2,
            title: 'Bước 2: Biểu diễn khối lượng công việc theo ẩn số',
            content: `• Trong 1 ngày, tổ I làm được: $\\frac{1}{x}$ (công việc).\n• Trong 1 ngày, tổ II làm được: $\\frac{1}{y}$ (công việc).\n• Trong 1 ngày, cả hai tổ cùng làm được: $\\frac{1}{${T}}$ (công việc).`,
          },
          {
            stepNum: 3,
            title: 'Bước 3: Lập hệ phương trình',
            content: `• Vì hai tổ làm chung thì sau ${T} ngày hoàn thành công việc, ta có phương trình:\n$$\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{${T}} \\quad (1)$$\n• Tổ I làm trong ${d1} ngày được $\\frac{${d1}}{x}$ công việc; tổ II làm trong ${d2} ngày được $\\frac{${d2}}{y}$ công việc. Theo đề bài, cả hai làm được ${params.percentDone}% = $${P}$ công việc, ta có phương trình:\n$$\\frac{${d1}}{x} + \\frac{${d2}}{y} = ${P} \\quad (2)$$\n• Từ (1) và (2), ta có hệ phương trình:\n$$\\begin{cases} \\frac{1}{x} + \\frac{1}{y} = \\frac{1}{${T}} \\\\ \\frac{${d1}}{x} + \\frac{${d2}}{y} = ${P} \\end{cases}$$`,
          },
          {
            stepNum: 4,
            title: 'Bước 4: Giải hệ phương trình bằng phương pháp đặt ẩn phụ',
            content: `Đặt $u = \\frac{1}{x}$ và $v = \\frac{1}{y}$ ($u > 0, v > 0$), hệ phương trình trở thành:\n$$\\begin{cases} u + v = \\frac{1}{${T}} \\\\ ${d1}u + ${d2}v = ${P} \\end{cases}$$\nNhân phương trình thứ nhất với ${d1} rồi trừ hai phương trình:\n$$(${d2} - ${d1})v = ${P} - \\frac{${d1}}{${T}} \\implies v = \\frac{1}{${days2}}$$\nThay vào phương trình thứ nhất:\n$$u = \\frac{1}{${T}} - \\frac{1}{${days2}} = \\frac{1}{${days1}}$$\nTừ đó suy ra:\n$$x = ${days1}, \\quad y = ${days2}$$`,
          },
          {
            stepNum: 5,
            title: 'Bước 5: Đối chiếu điều kiện và Kết luận',
            content: `Cả hai giá trị $x = ${days1} > ${T}$ và $y = ${days2} > ${T}$ đều thỏa mãn điều kiện đặt ra.\n\n**Kết luận:**\n• Tổ I làm một mình hoàn thành công việc trong **${days1} ngày**.\n• Tổ II làm một mình hoàn thành công việc trong **${days2} ngày**.`,
          },
        ],
        solutionValues: [
          { symbol: 'x', value: days1, exactLatex: `${days1}`, unit: 'ngày' },
          { symbol: 'y', value: days2, exactLatex: `${days2}`, unit: 'ngày' },
        ],
        finalConclusion: `Tổ I làm một mình trong ${days1} ngày, tổ II làm một mình trong ${days2} ngày thì hoàn thành công việc.`,
      };
    },
  },

  // 4. TOÁN KINH TẾ / PHẦN TRĂM GIÁ VỐN VÀ LÃI
  {
    id: 'kinh_te_gia_von_lai',
    category: 'kinh_te',
    categoryName: 'Toán Kinh Tế & Tài Chính',
    title: 'Phân bổ vốn kinh doanh và tính lãi suất',
    shortDesc: 'Tìm số vốn đầu tư vào hai mặt hàng để đạt tổng lợi nhuận',
    problemStatement:
      'Bác An đầu tư tổng cộng 400 triệu đồng vào hai khoản kinh doanh A và B. Sau một năm, khoản đầu tư A mang lại lợi nhuận 15%, còn khoản đầu tư B mang lại lợi nhuận 10%. Tổng số tiền lãi bác An nhận được từ cả hai khoản là 50 triệu đồng. Tính số tiền bác An đã đầu tư vào mỗi khoản.',
    defaultParams: { totalCapital: 400, rateA: 15, rateB: 10, totalProfit: 50 },
    paramDescriptions: [
      { key: 'totalCapital', label: 'Tổng số vốn đầu tư', unit: 'triệu đồng', min: 100, max: 2000, step: 50 },
      { key: 'rateA', label: 'Tỷ lệ lãi khoản A', unit: '%', min: 5, max: 30, step: 1 },
      { key: 'rateB', label: 'Tỷ lệ lãi khoản B', unit: '%', min: 5, max: 30, step: 1 },
      { key: 'totalProfit', label: 'Tổng tiền lãi thu được', unit: 'triệu đồng', min: 10, max: 300, step: 5 },
    ],
    solve: (params) => {
      const M = params.totalCapital ?? 400;
      const rA = params.rateA ?? 15;
      const rB = params.rateB ?? 10;
      const L = params.totalProfit ?? 50;

      // x + y = M
      // (rA/100)*x + (rB/100)*y = L  => rA*x + rB*y = 100*L
      const sys = solveLinearSystem2x2(1, 1, M, rA, rB, 100 * L);
      const capA = sys?.x ?? 200;
      const capB = sys?.y ?? 200;

      const analysisTable: AnalysisTable = {
        headers: ['Khoản đầu tư', 'Số tiền vốn (triệu đồng)', 'Tỷ suất lợi nhuận (%)', 'Tiền lãi thu được (triệu đồng)'],
        rows: [
          { subject: 'Khoản A', col1: 'x', col2: `${rA}%`, col3: `${rA / 100}x` },
          { subject: 'Khoản B', col1: 'y', col2: `${rB}%`, col3: `${rB / 100}y` },
          { subject: 'Tổng cộng', col1: `${M}`, col2: '—', col3: `${L}` },
        ],
        note: `Hệ phương trình: x + y = ${M} và ${rA}%x + ${rB}%y = ${L}`,
      };

      return {
        id: 'kinh_te_gia_von_lai',
        category: 'kinh_te',
        categoryName: 'Toán Kinh Tế & Tài Chính',
        title: 'Phân bổ vốn kinh doanh và tính lãi suất',
        problemStatement: `Bác An đầu tư tổng cộng ${M} triệu đồng vào hai khoản kinh doanh A và B. Sau một năm, khoản đầu tư A mang lại lợi nhuận ${rA}%, còn khoản đầu tư B mang lại lợi nhuận ${rB}%. Tổng số tiền lãi bác An nhận được từ cả hai khoản là ${L} triệu đồng. Tính số tiền bác An đã đầu tư vào mỗi khoản.`,
        systemType: 'he_phuong_trinh',
        variables: [
          { name: 'Số tiền đầu tư vào khoản A', symbol: 'x', unit: 'triệu đồng', condition: `0 < x < ${M}` },
          { name: 'Số tiền đầu tư vào khoản B', symbol: 'y', unit: 'triệu đồng', condition: `0 < y < ${M}` },
        ],
        analysisTable,
        equationsLatex: [
          `x + y = ${M}`,
          `\\frac{${rA}}{100}x + \\frac{${rB}}{100}y = ${L}`,
        ],
        steps: [
          {
            stepNum: 1,
            title: 'Bước 1: Chọn ẩn số và xác định điều kiện của ẩn',
            content: `Gọi số tiền bác An đầu tư vào khoản A là $x$ (triệu đồng) ($0 < x < ${M}$).\nGọi số tiền bác An đầu tư vào khoản B là $y$ (triệu đồng) ($0 < y < ${M}$).`,
          },
          {
            stepNum: 2,
            title: 'Bước 2: Biểu diễn các đại lượng theo ẩn số',
            content: `• Tiền lãi thu được từ khoản A sau một năm: $\\frac{${rA}}{100}x = ${rA / 100}x$ (triệu đồng).\n• Tiền lãi thu được từ khoản B sau một năm: $\\frac{${rB}}{100}y = ${rB / 100}y$ (triệu đồng).`,
          },
          {
            stepNum: 3,
            title: 'Bước 3: Lập hệ phương trình',
            content: `• Vì tổng số tiền đầu tư là ${M} triệu đồng, ta có phương trình:\n$$x + y = ${M} \\quad (1)$$\n• Vì tổng số tiền lãi thu được từ cả hai khoản là ${L} triệu đồng, ta có phương trình:\n$$${rA / 100}x + ${rB / 100}y = ${L} \\Leftrightarrow ${rA}x + ${rB}y = ${100 * L} \\quad (2)$$\n• Từ (1) và (2), ta có hệ phương trình:\n$$\\begin{cases} x + y = ${M} \\\\ ${rA}x + ${rB}y = ${100 * L} \\end{cases}$$`,
          },
          {
            stepNum: 4,
            title: 'Bước 4: Giải hệ phương trình',
            content: `Nhân cả hai vế của phương trình (1) với ${rB} rồi lấy phương trình (2) trừ đi:\n$$(${rA} - ${rB})x = ${100 * L} - ${rB * M}$$\n$$\\Leftrightarrow ${rA - rB}x = ${100 * L - rB * M} \\Leftrightarrow x = ${capA}$$\nThay $x = ${capA}$ vào phương trình (1) ta được:\n$$${capA} + y = ${M} \\Leftrightarrow y = ${capB}$$`,
          },
          {
            stepNum: 5,
            title: 'Bước 5: Đối chiếu điều kiện và Kết luận',
            content: `Cả hai giá trị $x = ${capA}$ và $y = ${capB}$ đều thỏa mãn điều kiện $0 < x, y < ${M}$.\n\n**Kết luận:**\n• Số tiền đầu tư vào khoản A là: **${capA} triệu đồng**.\n• Số tiền đầu tư vào khoản B là: **${capB} triệu đồng**.`,
          },
        ],
        solutionValues: [
          { symbol: 'x', value: capA, exactLatex: `${capA}`, unit: 'triệu đồng' },
          { symbol: 'y', value: capB, exactLatex: `${capB}`, unit: 'triệu đồng' },
        ],
        finalConclusion: `Bác An đã đầu tư ${capA} triệu đồng vào khoản A và ${capB} triệu đồng vào khoản B.`,
      };
    },
  },

  // 5. PHA TRỘN DUNG DỊCH HÓA CHẤT
  {
    id: 'pha_tron_dung_dich',
    category: 'dung_dich',
    categoryName: 'Toán Pha Trộn Dung Dịch',
    title: 'Pha trộn hai loại dung dịch muối nồng độ khác nhau',
    shortDesc: 'Tìm khối lượng mỗi dung dịch cần pha để được nồng độ mong muốn',
    problemStatement:
      'Có hai loại dung dịch muối: dung dịch I chứa 10% muối và dung dịch II chứa 30% muối. Cần pha trộn bao nhiêu gam mỗi loại dung dịch trên để thu được 500 gam dung dịch mới có nồng độ 18% muối?',
    defaultParams: { c1: 10, c2: 30, targetC: 18, totalWeight: 500 },
    paramDescriptions: [
      { key: 'c1', label: 'Nồng độ dung dịch I', unit: '%', min: 1, max: 20, step: 1 },
      { key: 'c2', label: 'Nồng độ dung dịch II', unit: '%', min: 20, max: 60, step: 1 },
      { key: 'targetC', label: 'Nồng độ mong muốn', unit: '%', min: 5, max: 50, step: 1 },
      { key: 'totalWeight', label: 'Tổng khối lượng cần tạo', unit: 'gam', min: 100, max: 2000, step: 50 },
    ],
    solve: (params) => {
      const c1 = params.c1 ?? 10;
      const c2 = params.c2 ?? 30;
      const c3 = params.targetC ?? 18;
      const M = params.totalWeight ?? 500;

      // x + y = M
      // c1*x + c2*y = c3*M
      const sys = solveLinearSystem2x2(1, 1, M, c1, c2, c3 * M);
      const w1 = sys?.x ?? 300;
      const w2 = sys?.y ?? 200;

      const analysisTable: AnalysisTable = {
        headers: ['Dung dịch', 'Khối lượng dung dịch (g)', 'Nồng độ (%)', 'Khối lượng muối nguyên chất (g)'],
        rows: [
          { subject: 'Dung dịch I', col1: 'x', col2: `${c1}%`, col3: `${c1 / 100}x` },
          { subject: 'Dung dịch II', col1: 'y', col2: `${c2}%`, col3: `${c2 / 100}y` },
          { subject: 'Dung dịch pha được', col1: `${M}`, col2: `${c3}%`, col3: `${(c3 * M) / 100}` },
        ],
        note: `Khối lượng muối trước và sau khi pha trộn không đổi: ${c1}%x + ${c2}%y = ${c3}% * ${M}`,
      };

      return {
        id: 'pha_tron_dung_dich',
        category: 'dung_dich',
        categoryName: 'Bài Toán Pha Trộn Dung Dịch',
        title: 'Pha trộn hai loại dung dịch muối',
        problemStatement: `Có hai loại dung dịch muối: dung dịch I chứa ${c1}% muối và dung dịch II chứa ${c2}% muối. Cần pha trộn bao nhiêu gam mỗi loại dung dịch trên để thu được ${M} gam dung dịch mới có nồng độ ${c3}% muối?`,
        systemType: 'he_phuong_trinh',
        variables: [
          { name: 'Khối lượng dung dịch I cần dùng', symbol: 'x', unit: 'gam', condition: `0 < x < ${M}` },
          { name: 'Khối lượng dung dịch II cần dùng', symbol: 'y', unit: 'gam', condition: `0 < y < ${M}` },
        ],
        analysisTable,
        equationsLatex: [
          `x + y = ${M}`,
          `\\frac{${c1}}{100}x + \\frac{${c2}}{100}y = \\frac{${c3}}{100} \\cdot ${M}`,
        ],
        steps: [
          {
            stepNum: 1,
            title: 'Bước 1: Chọn ẩn số và xác định điều kiện của ẩn',
            content: `Gọi khối lượng dung dịch I cần lấy là $x$ (gam) (điều kiện: $0 < x < ${M}$).\nGọi khối lượng dung dịch II cần lấy là $y$ (gam) (điều kiện: $0 < y < ${M}$).`,
          },
          {
            stepNum: 2,
            title: 'Bước 2: Biểu diễn lượng chất tan (muối nguyên chất) theo ẩn số',
            content: `• Khối lượng muối nguyên chất trong dung dịch I: $\\frac{${c1}}{100}x$ (gam).\n• Khối lượng muối nguyên chất trong dung dịch II: $\\frac{${c2}}{100}y$ (gam).\n• Khối lượng muối nguyên chất trong ${M} gam dung dịch mới: $\\frac{${c3}}{100} \\cdot ${M} = ${(c3 * M) / 100}$ (gam).`,
          },
          {
            stepNum: 3,
            title: 'Bước 3: Lập hệ phương trình',
            content: `• Tổng khối lượng dung dịch thu được là ${M} gam, ta có phương trình:\n$$x + y = ${M} \\quad (1)$$\n• Tổng khối lượng muối nguyên chất được bảo toàn, ta có phương trình:\n$$\\frac{${c1}}{100}x + \\frac{${c2}}{100}y = ${(c3 * M) / 100} \\Leftrightarrow ${c1}x + ${c2}y = ${c3 * M} \\quad (2)$$\n• Ta có hệ phương trình:\n$$\\begin{cases} x + y = ${M} \\\\ ${c1}x + ${c2}y = ${c3 * M} \\end{cases}$$`,
          },
          {
            stepNum: 4,
            title: 'Bước 4: Giải hệ phương trình',
            content: `Nhân phương trình (1) với ${c1} rồi trừ vào phương trình (2):\n$$(${c2} - ${c1})y = ${c3 * M} - ${c1 * M} \\Leftrightarrow ${c2 - c1}y = ${(c3 - c1) * M} \\Leftrightarrow y = ${w2}$$\nThay $y = ${w2}$ vào phương trình (1) ta được:\n$$x + ${w2} = ${M} \\Leftrightarrow x = ${w1}$$`,
          },
          {
            stepNum: 5,
            title: 'Bước 5: Đối chiếu điều kiện và Kết luận',
            content: `Cả hai giá trị $x = ${w1}$ và $y = ${w2}$ đều thỏa mãn điều kiện $0 < x, y < ${M}$.\n\n**Kết luận:**\n• Cần lấy **${w1} gam** dung dịch loại I.\n• Cần lấy **${w2} gam** dung dịch loại II.`,
          },
        ],
        solutionValues: [
          { symbol: 'x', value: w1, exactLatex: `${w1}`, unit: 'gam dung dịch I' },
          { symbol: 'y', value: w2, exactLatex: `${w2}`, unit: 'gam dung dịch II' },
        ],
        finalConclusion: `Cần pha trộn ${w1} gam dung dịch I và ${w2} gam dung dịch II.`,
      };
    },
  },

  // 6. TOÁN HÌNH HỌC THỰC TẾ (HÌNH CHỮ NHẬT / PYTAGO)
  {
    id: 'hinh_hoc_hcn',
    category: 'hinh_hoc',
    categoryName: 'Toán Hình Học Thực Tế',
    title: 'Thay đổi kích thước mảnh đất hình chữ nhật',
    shortDesc: 'Tìm chiều dài và chiều rộng mảnh vườn hình chữ nhật',
    problemStatement:
      'Một mảnh vườn hình chữ nhật có chu vi 100 mét. Nếu tăng chiều rộng thêm 5 mét và giảm chiều dài đi 5 mét thì diện tích mảnh vườn tăng thêm 50 mét vuông. Tính chiều dài và chiều rộng ban đầu của mảnh vườn.',
    defaultParams: { perimeter: 100, deltaWidth: 5, deltaLength: 5, deltaArea: 50 },
    paramDescriptions: [
      { key: 'perimeter', label: 'Chu vi mảnh vườn', unit: 'm', min: 40, max: 300, step: 10 },
      { key: 'deltaWidth', label: 'Tăng chiều rộng', unit: 'm', min: 1, max: 20, step: 1 },
      { key: 'deltaLength', label: 'Giảm chiều dài', unit: 'm', min: 1, max: 20, step: 1 },
      { key: 'deltaArea', label: 'Diện tích thay đổi (+ tăng, - giảm)', unit: 'm²', min: 10, max: 200, step: 10 },
    ],
    solve: (params) => {
      const P = params.perimeter ?? 100;
      const halfP = P / 2; // x + y = halfP
      const dw = params.deltaWidth ?? 5; // y + dw
      const dl = params.deltaLength ?? 5; // x - dl
      const dA = params.deltaArea ?? 50;

      // (x - dl)(y + dw) = x*y + dA
      // x*y + dw*x - dl*y - dl*dw = x*y + dA
      // dw*x - dl*y = dA + dl*dw
      const c2 = dA + dl * dw;
      const sys = solveLinearSystem2x2(1, 1, halfP, dw, -dl, c2);
      const len = sys?.x ?? 35;
      const wid = sys?.y ?? 15;

      const analysisTable: AnalysisTable = {
        headers: ['Trạng thái', 'Chiều dài (m)', 'Chiều rộng (m)', 'Diện tích (m²)'],
        rows: [
          { subject: 'Ban đầu', col1: 'x', col2: 'y', col3: 'xy' },
          { subject: 'Sau khi đổi kích thước', col1: `x - ${dl}`, col2: `y + ${dw}`, col3: `(x - ${dl})(y + ${dw})` },
          { subject: 'Chênh lệch', col1: `Giảm ${dl} m`, col2: `Tăng ${dw} m`, col3: `Tăng thêm ${dA} m²` },
        ],
        note: `Nửa chu vi x + y = ${halfP} m. Diện tích mới: (x - ${dl})(y + ${dw}) = xy + ${dA}`,
      };

      return {
        id: 'hinh_hoc_hcn',
        category: 'hinh_hoc',
        categoryName: 'Bài Toán Hình Học',
        title: 'Kích thước mảnh đất hình chữ nhật',
        problemStatement: `Một mảnh vườn hình chữ nhật có chu vi ${P} mét. Nếu tăng chiều rộng thêm ${dw} mét và giảm chiều dài đi ${dl} mét thì diện tích mảnh vườn tăng thêm ${dA} mét vuông. Tính chiều dài và chiều rộng ban đầu của mảnh vườn.`,
        systemType: 'he_phuong_trinh',
        variables: [
          { name: 'Chiều dài ban đầu của mảnh vườn', symbol: 'x', unit: 'm', condition: `0 < x < ${halfP}` },
          { name: 'Chiều rộng ban đầu của mảnh vườn', symbol: 'y', unit: 'm', condition: `0 < y < x` },
        ],
        analysisTable,
        equationsLatex: [
          `x + y = ${halfP}`,
          `(x - ${dl})(y + ${dw}) - xy = ${dA} \\Leftrightarrow ${dw}x - ${dl}y = ${c2}`,
        ],
        steps: [
          {
            stepNum: 1,
            title: 'Bước 1: Chọn ẩn số và xác định điều kiện của ẩn',
            content: `Gọi chiều dài ban đầu của mảnh vườn là $x$ (mét) ($0 < x < ${halfP}$).\nGọi chiều rộng ban đầu của mảnh vườn là $y$ (mét) ($0 < y < x$).\nNửa chu vi của mảnh vườn là: $${P} : 2 = ${halfP}$ (m).`,
          },
          {
            stepNum: 2,
            title: 'Bước 2: Biểu diễn diện tích trước và sau thay đổi kích thước',
            content: `• Diện tích ban đầu của mảnh vườn: $xy$ (m²).\n• Chiều dài sau khi giảm ${dl} m: $x - ${dl}$ (m).\n• Chiều rộng sau khi tăng ${dw} m: $y + ${dw}$ (m).\n• Diện tích mới của mảnh vườn: $(x - ${dl})(y + ${dw})$ (m²).`,
          },
          {
            stepNum: 3,
            title: 'Bước 3: Lập hệ phương trình',
            content: `• Do nửa chu vi bằng ${halfP} m, ta có phương trình:\n$$x + y = ${halfP} \\quad (1)$$\n• Do diện tích tăng thêm ${dA} m², ta có phương trình:\n$$(x - ${dl})(y + ${dw}) - xy = ${dA}$$\n$$\\Leftrightarrow xy + ${dw}x - ${dl}y - ${dl * dw} - xy = ${dA} \\Leftrightarrow ${dw}x - ${dl}y = ${c2} \\quad (2)$$\n• Từ (1) và (2), ta có hệ phương trình:\n$$\\begin{cases} x + y = ${halfP} \\\\ ${dw}x - ${dl}y = ${c2} \\end{cases}$$`,
          },
          {
            stepNum: 4,
            title: 'Bước 4: Giải hệ phương trình',
            content: `Từ (1) suy ra $y = ${halfP} - x$. Thay vào phương trình (2):\n$$${dw}x - ${dl}(${halfP} - x) = ${c2}$$\n$$\\Leftrightarrow ${dw + dl}x - ${dl * halfP} = ${c2} \\Leftrightarrow ${dw + dl}x = ${c2 + dl * halfP} \\Leftrightarrow x = ${len}$$\nThay $x = ${len}$ vào (1) ta được:\n$$y = ${halfP} - ${len} = ${wid}$$`,
          },
          {
            stepNum: 5,
            title: 'Bước 5: Đối chiếu điều kiện và Kết luận',
            content: `Ta thấy $x = ${len}$ và $y = ${wid}$ thỏa mãn điều kiện $0 < y < x < ${halfP}$.\n\n**Kết luận:**\n• Chiều dài ban đầu của mảnh vườn là: **${len} m**.\n• Chiều rộng ban đầu của mảnh vườn là: **${wid} m**.`,
          },
        ],
        solutionValues: [
          { symbol: 'x', value: len, exactLatex: `${len}`, unit: 'm (chiều dài)' },
          { symbol: 'y', value: wid, exactLatex: `${wid}`, unit: 'm (chiều rộng)' },
        ],
        finalConclusion: `Chiều dài mảnh vườn là ${len} mét, chiều rộng là ${wid} mét.`,
      };
    },
  },
];
