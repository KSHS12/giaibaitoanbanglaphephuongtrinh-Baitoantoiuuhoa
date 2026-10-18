import React from 'react';
import { ObjectiveFunction, VertexPoint } from '../types/problemTypes';
import { MathView } from './MathView';
import { Trophy } from 'lucide-react';

interface VertexTableProps {
  vertices: VertexPoint[];
  objective?: ObjectiveFunction;
}

export const VertexTable: React.FC<VertexTableProps> = ({ vertices, objective }) => {
  if (!vertices || vertices.length === 0) return null;

  return (
    <div className="overflow-x-auto my-3 rounded-xl border border-slate-300 shadow-sm bg-white">
      <div className="bg-slate-100 text-slate-800 font-extrabold px-4 py-2 border-b border-slate-300 text-xs flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          Bảng tính giá trị hàm mục tiêu tại các đỉnh miền nghiệm
        </span>
        {objective && (
          <span className="text-emerald-700 font-mono text-[11px] font-bold">
            Mục tiêu: {objective.target === 'max' ? 'Lớn nhất (Max)' : 'Nhỏ nhất (Min)'}
          </span>
        )}
      </div>

      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-50 text-slate-900 border-b border-slate-200 font-black">
            <th className="px-3.5 py-2.5 font-extrabold border-r border-slate-200">Đỉnh</th>
            <th className="px-3.5 py-2.5 font-extrabold border-r border-slate-200">Tọa độ (x; y)</th>
            <th className="px-3.5 py-2.5 font-extrabold border-r border-slate-200">
              Công thức {objective?.name || 'F(x, y)'}
            </th>
            <th className="px-3.5 py-2.5 font-extrabold border-r border-slate-200">Giá trị đạt được</th>
            <th className="px-3.5 py-2.5 font-extrabold">Đánh giá kết quả</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 text-slate-800">
          {vertices.map((v, idx) => {
            const isOpt = v.isOptimal;
            return (
              <tr
                key={idx}
                className={`transition-colors ${
                  isOpt ? 'bg-emerald-50/90 font-bold text-emerald-950' : 'hover:bg-slate-50'
                }`}
              >
                <td className="px-3.5 py-2.5 border-r border-slate-200 font-black">
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs ${
                      isOpt ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {v.name}
                  </span>
                </td>
                <td className="px-3.5 py-2.5 border-r border-slate-200 font-mono">
                  ({v.xLatex}; {v.yLatex})
                </td>
                <td className="px-3.5 py-2.5 border-r border-slate-200 font-mono">
                  {objective ? `${objective.a} × (${v.xLatex}) + ${objective.b} × (${v.yLatex})` : '—'}
                </td>
                <td className="px-3.5 py-2.5 border-r border-slate-200 font-mono font-bold text-sm">
                  {v.fValueLatex ? (
                    <MathView math={v.fValueLatex} />
                  ) : (
                    v.fValue !== undefined ? Number(v.fValue.toFixed(2)) : '—'
                  )}
                  {objective?.unit ? ` ${objective.unit}` : ''}
                </td>
                <td className="px-3.5 py-2.5">
                  {isOpt ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                      <Trophy className="w-3.5 h-3.5" />
                      {objective?.target === 'max' ? 'Giá trị lớn nhất (Tối ưu)' : 'Giá trị nhỏ nhất (Tối ưu)'}
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[11px]">Chưa tối ưu</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
