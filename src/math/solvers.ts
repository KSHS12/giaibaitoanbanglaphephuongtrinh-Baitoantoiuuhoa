import { Fraction, formatNumberLatex } from './fractions';
import { LinearConstraint, ObjectiveFunction, VertexPoint } from '../types/problemTypes';

/**
 * Find intersection of two lines:
 * a1*x + b1*y = c1
 * a2*x + b2*y = c2
 */
export function intersectLines(
  a1: number,
  b1: number,
  c1: number,
  a2: number,
  b2: number,
  c2: number
): { x: number; y: number; xLatex: string; yLatex: string } | null {
  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) < 1e-9) {
    return null; // Parallel or coincident lines
  }

  const detX = c1 * b2 - c2 * b1;
  const detY = a1 * c2 - a2 * c1;

  const xVal = detX / det;
  const yVal = detY / det;

  let xLatex = formatNumberLatex(xVal);
  let yLatex = formatNumberLatex(yVal);

  try {
    const fX = new Fraction(detX, det);
    const fY = new Fraction(detY, det);
    xLatex = fX.toLatex();
    yLatex = fY.toLatex();
  } catch {
    // fallback to formatNumberLatex
  }

  return { x: xVal, y: yVal, xLatex, yLatex };
}

/**
 * Checks if a point (x, y) satisfies a linear constraint within tolerance
 */
export function satisfiesConstraint(
  x: number,
  y: number,
  constraint: LinearConstraint,
  tolerance = 1e-5
): boolean {
  const val = constraint.a * x + constraint.b * y;
  const c = constraint.c;

  switch (constraint.op) {
    case '<=':
    case '<':
      return val <= c + tolerance;
    case '>=':
    case '>':
      return val >= c - tolerance;
    default:
      return true;
  }
}

/**
 * Compute Feasible Region Polygon Vertices for Linear Programming in 2D
 */
export function computeFeasiblePolygon(
  constraints: LinearConstraint[],
  objective?: ObjectiveFunction,
  defaultBounds: { minX: number; maxX: number; minY: number; maxY: number } = {
    minX: 0,
    maxX: 100,
    minY: 0,
    maxY: 100,
  }
): { vertices: VertexPoint[]; optimalVertex?: VertexPoint } {
  // Collect all lines: include x >= 0 (x = 0), y >= 0 (y = 0), and explicit constraints
  const allLines: { a: number; b: number; c: number; label: string }[] = [];

  // Add axis lines if not present
  allLines.push({ a: 1, b: 0, c: 0, label: 'x = 0 (Oy)' });
  allLines.push({ a: 0, b: 1, c: 0, label: 'y = 0 (Ox)' });

  // Add boundary lines for all constraints
  constraints.forEach((cstr, idx) => {
    allLines.push({
      a: cstr.a,
      b: cstr.b,
      c: cstr.c,
      label: cstr.label || `d_${idx + 1}`,
    });
  });

  // Also include bounds to keep polygon closed in display if unconstrained in some direction
  allLines.push({ a: 1, b: 0, c: defaultBounds.maxX, label: `x = ${defaultBounds.maxX}` });
  allLines.push({ a: 0, b: 1, c: defaultBounds.maxY, label: `y = ${defaultBounds.maxY}` });

  // Find candidate intersection points
  const candidatePoints: { x: number; y: number; xLatex: string; yLatex: string }[] = [];

  for (let i = 0; i < allLines.length; i++) {
    for (let j = i + 1; j < allLines.length; j++) {
      const pt = intersectLines(
        allLines[i].a,
        allLines[i].b,
        allLines[i].c,
        allLines[j].a,
        allLines[j].b,
        allLines[j].c
      );

      if (pt) {
        // Must be in realistic quadrant x >= -1e-5, y >= -1e-5
        if (pt.x >= -1e-5 && pt.y >= -1e-5) {
          // Check if satisfies all given constraints
          let satisfiesAll = true;
          for (const cstr of constraints) {
            if (!satisfiesConstraint(pt.x, pt.y, cstr)) {
              satisfiesAll = false;
              break;
            }
          }

          if (satisfiesAll) {
            // Deduplicate
            const isDup = candidatePoints.some(
              (p) => Math.abs(p.x - pt.x) < 1e-4 && Math.abs(p.y - pt.y) < 1e-4
            );
            if (!isDup) {
              candidatePoints.push({
                x: Math.abs(pt.x) < 1e-5 ? 0 : pt.x,
                y: Math.abs(pt.y) < 1e-5 ? 0 : pt.y,
                xLatex: pt.xLatex,
                yLatex: pt.yLatex,
              });
            }
          }
        }
      }
    }
  }

  if (candidatePoints.length === 0) {
    return { vertices: [] };
  }

  // Sort polygon vertices around centroid in counter-clockwise order
  const cx = candidatePoints.reduce((sum, p) => sum + p.x, 0) / candidatePoints.length;
  const cy = candidatePoints.reduce((sum, p) => sum + p.y, 0) / candidatePoints.length;

  candidatePoints.sort((p1, p2) => {
    const angle1 = Math.atan2(p1.y - cy, p1.x - cx);
    const angle2 = Math.atan2(p2.y - cy, p2.x - cx);
    return angle1 - angle2;
  });

  // Assign letters: O (if at origin), A, B, C, D...
  const letters = ['O', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  let letterIdx = 0;

  let optimalVertex: VertexPoint | undefined;
  let optimalVal = objective?.target === 'min' ? Infinity : -Infinity;

  const vertices: VertexPoint[] = candidatePoints.map((pt) => {
    let name: string;
    if (Math.abs(pt.x) < 1e-4 && Math.abs(pt.y) < 1e-4) {
      name = 'O';
    } else {
      name = letters[letterIdx] === 'O' ? letters[++letterIdx] : letters[letterIdx];
      letterIdx++;
    }

    let fVal: number | undefined;
    let fLatex: string | undefined;

    if (objective) {
      fVal = objective.a * pt.x + objective.b * pt.y;
      fLatex = formatNumberLatex(fVal);
    }

    return {
      name,
      x: pt.x,
      y: pt.y,
      xLatex: pt.xLatex,
      yLatex: pt.yLatex,
      fValue: fVal,
      fValueLatex: fLatex,
    };
  });

  if (objective && vertices.length > 0) {
    for (const v of vertices) {
      if (v.fValue !== undefined) {
        if (objective.target === 'max' && v.fValue > optimalVal) {
          optimalVal = v.fValue;
          optimalVertex = v;
        } else if (objective.target === 'min' && v.fValue < optimalVal) {
          optimalVal = v.fValue;
          optimalVertex = v;
        }
      }
    }

    if (optimalVertex) {
      optimalVertex.isOptimal = true;
    }
  }

  return { vertices, optimalVertex };
}

/**
 * Solve 2x2 System of Linear Equations using Cramer's rule:
 * a1*x + b1*y = c1
 * a2*x + b2*y = c2
 */
export function solveSystem2x2(
  a1: number,
  b1: number,
  c1: number,
  a2: number,
  b2: number,
  c2: number
) {
  const D = a1 * b2 - a2 * b1;
  const Dx = c1 * b2 - c2 * b1;
  const Dy = a1 * c2 - a2 * c1;

  if (Math.abs(D) < 1e-9) {
    if (Math.abs(Dx) < 1e-9 && Math.abs(Dy) < 1e-9) {
      return { status: 'infinite', D, Dx, Dy };
    }
    return { status: 'no_solution', D, Dx, Dy };
  }

  const x = Dx / D;
  const y = Dy / D;

  let xFrac: Fraction;
  let yFrac: Fraction;

  try {
    xFrac = new Fraction(Dx, D);
    yFrac = new Fraction(Dy, D);
  } catch {
    xFrac = Fraction.fromNumber(x);
    yFrac = Fraction.fromNumber(y);
  }

  return {
    status: 'unique',
    D,
    Dx,
    Dy,
    x,
    y,
    xFrac,
    yFrac,
    xLatex: xFrac.toLatex(),
    yLatex: yFrac.toLatex(),
  };
}

/**
 * Solve 3x3 System of Linear Equations using Cramer's Rule
 */
export function solveSystem3x3(
  matrix: number[][], // 3x3
  rhs: number[] // 3x1
) {
  const det3 = (m: number[][]) => {
    return (
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
    );
  };

  const D = det3(matrix);
  if (Math.abs(D) < 1e-9) {
    return { status: 'degenerate', D };
  }

  // Replace col 0 with rhs
  const mX = [
    [rhs[0], matrix[0][1], matrix[0][2]],
    [rhs[1], matrix[1][1], matrix[1][2]],
    [rhs[2], matrix[2][1], matrix[2][2]],
  ];
  const Dx = det3(mX);

  // Replace col 1 with rhs
  const mY = [
    [matrix[0][0], rhs[0], matrix[0][2]],
    [matrix[1][0], rhs[1], matrix[1][2]],
    [matrix[2][0], rhs[2], matrix[2][2]],
  ];
  const Dy = det3(mY);

  // Replace col 2 with rhs
  const mZ = [
    [matrix[0][0], matrix[0][1], rhs[0]],
    [matrix[1][0], matrix[1][1], rhs[1]],
    [matrix[2][0], matrix[2][1], rhs[2]],
  ];
  const Dz = det3(mZ);

  const x = Dx / D;
  const y = Dy / D;
  const z = Dz / D;

  const fX = Fraction.fromNumber(x);
  const fY = Fraction.fromNumber(y);
  const fZ = Fraction.fromNumber(z);

  return {
    status: 'unique',
    D,
    Dx,
    Dy,
    Dz,
    x,
    y,
    z,
    xLatex: fX.toLatex(),
    yLatex: fY.toLatex(),
    zLatex: fZ.toLatex(),
  };
}

/**
 * Solve Quadratic Equation: a*x^2 + b*x + c = 0
 */
export function solveQuadratic(a: number, b: number, c: number) {
  if (Math.abs(a) < 1e-9) {
    // Linear equation: b*x + c = 0
    if (Math.abs(b) < 1e-9) {
      return { status: c === 0 ? 'infinite' : 'no_solution', roots: [] };
    }
    const root = -c / b;
    const frac = Fraction.fromNumber(root);
    return {
      status: 'linear',
      roots: [{ val: root, latex: frac.toLatex(), isExact: true }],
    };
  }

  const delta = b * b - 4 * a * c;

  if (delta < -1e-9) {
    return { status: 'no_real_roots', delta, roots: [] };
  }

  if (Math.abs(delta) < 1e-9) {
    const root = -b / (2 * a);
    const frac = Fraction.fromNumber(root);
    return {
      status: 'double_root',
      delta: 0,
      roots: [{ val: root, latex: frac.toLatex(), isExact: true }],
    };
  }

  // Two distinct roots
  const sqrtDelta = Math.sqrt(delta);
  const r1 = (-b - sqrtDelta) / (2 * a);
  const r2 = (-b + sqrtDelta) / (2 * a);

  // Check if delta is a perfect square
  const isPerfectSquare = Number.isInteger(Math.round(sqrtDelta)) && Math.round(sqrtDelta) ** 2 === Math.round(delta);

  let r1Latex = '';
  let r2Latex = '';

  if (isPerfectSquare) {
    r1Latex = Fraction.fromNumber(r1).toLatex();
    r2Latex = Fraction.fromNumber(r2).toLatex();
  } else {
    // Irrational root representation: (-b \pm \sqrt{delta}) / (2a)
    r1Latex = formatNumberLatex(r1);
    r2Latex = formatNumberLatex(r2);
  }

  return {
    status: 'two_roots',
    delta,
    isPerfectSquare,
    roots: [
      { val: r1, latex: r1Latex, isExact: isPerfectSquare },
      { val: r2, latex: r2Latex, isExact: isPerfectSquare },
    ],
  };
}
