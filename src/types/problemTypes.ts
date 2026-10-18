export type ProblemCategory = 'inequality_system' | 'linear_system' | 'single_equation';

export type ProblemTopic =
  | 'quy_hoach_tuyen_tinh'
  | 'chuyen_dong'
  | 'nang_suat'
  | 'kinh_te_tai_chinh'
  | 'hinh_hoc'
  | 'hoa_hoc_dinh_duong';

export interface VariableDef {
  symbol: string;
  meaning: string;
  unit: string;
  condition: string;
}

export interface LinearConstraint {
  id: string;
  label: string; // e.g. "Ràng buộc thời gian máy I", "d1"
  a: number; // a*x
  b: number; // b*y
  op: '<=' | '>=' | '<' | '>';
  c: number; // rhs
  meaning: string;
}

export interface ObjectiveFunction {
  name: string; // e.g. "F(x, y)"
  a: number;
  b: number;
  target: 'max' | 'min';
  unit: string;
  description: string;
}

export interface VertexPoint {
  name: string; // 'O', 'A', 'B', 'C', ...
  x: number;
  y: number;
  xLatex: string;
  yLatex: string;
  fValue?: number;
  fValueLatex?: string;
  isOptimal?: boolean;
}

export interface SummaryTableData {
  title?: string;
  headers: string[];
  rows: (string | number)[][];
}

export interface ProblemModel {
  id: string;
  title: string;
  category: ProblemCategory;
  categoryName: string;
  grade: string; // e.g. "Toán 10", "Toán 11", "Toán 12"
  topic: ProblemTopic;
  topicName: string;
  statement: string; // Problem statement
  practicalContext: string;
  
  // Step 1: Variables & Setup
  variables: VariableDef[];
  summaryTable?: SummaryTableData;
  setupExplanation: string[];
  equationLatexList: string[];

  // Data for solvers
  linearProgrammingData?: {
    constraints: LinearConstraint[];
    objective: ObjectiveFunction;
    xRange?: [number, number];
    yRange?: [number, number];
  };

  linearSystemData?: {
    varNames: string[];
    equations: {
      coeffs: number[];
      rhs: number;
      label: string;
      meaning: string;
    }[];
  };

  singleEquationData?: {
    form: 'quadratic' | 'fractional' | 'linear';
    standardFormLatex: string;
    a: number;
    b: number;
    c: number;
    variableName: string;
    unit: string;
  };

  // Step 2: Solution & Working steps
  solutionSteps: {
    methodTitle: string;
    subSteps: {
      title: string;
      content: string;
      mathLatex?: string;
    }[];
    vertices?: VertexPoint[];
    roots?: {
      val: number;
      latex: string;
      isAccepted: boolean;
      reason: string;
    }[];
  };

  // Step 3: Conclusion
  conclusion: {
    overview: string;
    finalAnswers: {
      label: string;
      value: string;
    }[];
    practicalImplication?: string;
  };
}
