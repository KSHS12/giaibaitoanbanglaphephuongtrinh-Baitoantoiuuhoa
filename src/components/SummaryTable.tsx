import React from 'react';
import { SummaryTableData } from '../types/problemTypes';

interface SummaryTableProps {
  data: SummaryTableData;
}

export const SummaryTable: React.FC<SummaryTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto my-3 rounded-xl border border-slate-300 shadow-sm bg-white">
      {data.title && (
        <div className="bg-emerald-50 text-emerald-950 font-bold px-4 py-2 border-b border-emerald-100 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            {data.title}
          </span>
          <span className="text-[10px] uppercase font-semibold text-emerald-700 tracking-wider">
            Bảng phân tích đại lượng SGK
          </span>
        </div>
      )}
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-100 text-slate-900 border-b border-slate-300 font-black">
            {data.headers.map((header, idx) => (
              <th
                key={idx}
                className="px-3.5 py-2.5 font-extrabold text-slate-800 tracking-tight first:pl-4 last:pr-4 border-r border-slate-200 last:border-r-0"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 text-slate-800">
          {data.rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={`hover:bg-slate-50 transition-colors ${
                rowIdx % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'
              }`}
            >
              {row.map((cell, colIdx) => (
                <td
                  key={colIdx}
                  className={`px-3.5 py-2.5 first:pl-4 last:pr-4 border-r border-slate-200 last:border-r-0 ${
                    colIdx === 0 ? 'font-bold text-slate-900' : 'text-slate-700'
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
