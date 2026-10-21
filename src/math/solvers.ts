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
