export type ProblemCategory =
  | 'chuyen_dong'       // Chuyển động (vận tốc, quãng đường, thời gian)
  | 'nang_suat'         // Năng suất, làm chung làm riêng
  | 'kinh_te'           // Kinh tế, giá vốn, lãi suất, phần trăm
  | 'dung_dich'         // Pha trộn dung dịch, hợp kim, nồng độ %
  | 'hinh_hoc'          // Hình học (chu vi, diện tích hình chữ nhật, Pytago)
  | 'he_bat_phuong_trinh' // Hệ bất phương trình bậc nhất hai ẩn & Tối ưu hóa (Quy hoạch tuyến tính)
  | 'he_pt_bac_nhat'    // Hệ hai phương trình bậc nhất hai ẩn tổng quát
  | 'pt_bac_hai'        // Lập phương trình bậc hai
  | 'tu_do';            // Nhập bài toán tự do

export interface AnalysisTableRow {
  subject: string;      // Tên đối tượng (Xe 1, Xe 2, Đội 1, Đội 2, SP A, SP B...)
  col1: string;         // Đại lượng 1 (Vận tốc, Năng suất, v.v.)
  col2: string;         // Đại lượng 2 (Thời gian, Khối lượng, v.v.)
  col3: string;         // Đại lượng 3 (Quãng đường, Tổng sản phẩm, v.v.)
}

export interface AnalysisTable {
  headers: [string, string, string, string]; // [Đối tượng, Cột 1, Cột 2, Cột 3]
  rows: AnalysisTableRow[];
  note?: string;
}

export interface ConstraintLine {
  a: number; // a*x + b*y <= c (hoặc >= c)
  b: number;
  c: number;
  type: '<=' | '>=' | '=';
  label: string; // Biểu diễn phương trình dạng LaTeX: a x + b y \le c
  name: string;  // Tên ràng buộc (Thời gian máy, Nguyên liệu loại I, v.v.)
}

export interface Vertex {
  name: string;
  x: number;
  y: number;
  exactX: string;
  exactY: string;
  objValue?: number; // Giá trị F(x, y)
}

export interface LinearProgrammingData {
  constraints: ConstraintLine[];
  objectiveFunc: {
    A: number;
    B: number;
    latex: string; // F(x, y) = A x + B y
    goal: 'max' | 'min';
    unit: string;
  };
  vertices: Vertex[];
  optimalVertex: Vertex;
  feasibleRegionArea?: number;
}

export interface StepSolution {
  title: string;
  stepNum: number;
  content: string; // Có thể chứa mã LaTeX $...$
  subSteps?: { title?: string; latex?: string; text?: string }[];
}

export interface SolvedProblem {
  id: string;
  category: ProblemCategory;
  categoryName: string;
  title: string;
  problemStatement: string; // Đề bài gốc
  variables: { name: string; symbol: string; unit: string; condition: string }[];
  analysisTable?: AnalysisTable;
  systemType: 'phuong_trinh' | 'he_phuong_trinh' | 'he_bat_phuong_trinh';
  equationsLatex: string[]; // Các phương trình hoặc bất phương trình đã lập
  steps: StepSolution[];
  solutionValues: { symbol: string; value: number; exactLatex: string; unit: string }[];
  finalConclusion: string; // Câu trả lời hoàn chỉnh của bài toán
  lpData?: LinearProgrammingData; // Dữ liệu hình học nếu là bài toán hệ bất phương trình / quy hoạch tuyến tính
}

export interface ProblemPreset {
  id: string;
  category: ProblemCategory;
  categoryName: string;
  title: string;
  shortDesc: string;
  problemStatement: string;
  defaultParams: Record<string, number>;
  paramDescriptions?: { key: string; label: string; unit: string; min: number; max: number; step: number }[];
  solve: (params: Record<string, number>) => SolvedProblem;
}
