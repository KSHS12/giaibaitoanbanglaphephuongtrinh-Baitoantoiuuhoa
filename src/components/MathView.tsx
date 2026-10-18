import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

const normalizeMath = (value: string): string =>
  value
    .trim()
    .replace(/[≤⩽]/g, '\\le ')
    .replace(/[≥⩾]/g, '\\ge ')
    .replace(/×/g, '\\times ')
    .replace(/÷/g, '\\div ')
    .replace(/−/g, '-')
    .replace(/√\s*([^\s+]+)/g, '\\sqrt{$1}')
    .replace(/(^|[^\\])\bln\s*/g, '$1\\ln ')
    .replace(/(^|[^\\])\blog\s*/g, '$1\\log ');

export const MathView: React.FC<MathViewProps> = ({ math, displayMode = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      let cleanMath = math.trim();
      if (cleanMath.startsWith('$$') && cleanMath.endsWith('$$')) {
        cleanMath = cleanMath.slice(2, -2).trim();
      } else if (cleanMath.startsWith('$') && cleanMath.endsWith('$')) {
        cleanMath = cleanMath.slice(1, -1).trim();
      }

      return katex.renderToString(normalizeMath(cleanMath), {
        displayMode,
        throwOnError: false,
        strict: false,
      });
    } catch (error) {
      console.error('KaTeX error:', error);
      return `<span class="text-rose-400 font-mono text-xs">${math}</span>`;
    }
  }, [math, displayMode]);

  return (
    <span
      className={`inline-block align-middle font-serif ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface MathTextProps {
  text: string;
  className?: string;
}

export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  const elements = useMemo(() => {
    if (!text) return null;

    const tokens = text.split(/(\$\$[\s\S]*?\$\$|\$[^$]+?\$|\\\\\[[\s\S]*?\\\\\]|\n)/g);

    return tokens.map((part, index) => {
      if (!part) return null;
      if (part === '\n') return <br key={`br-${index}`} />;

      if (part.startsWith('$$') && part.endsWith('$$')) {
        return (
          <div key={`dmath-${index}`} className="my-2 overflow-x-auto py-1 text-center">
            <MathView math={part.slice(2, -2).trim()} displayMode />
          </div>
        );
      }

      if (part.startsWith('\\\\[') && part.endsWith('\\\\]')) {
        return <MathView key={`dmath-${index}`} math={part.slice(2, -2).trim()} displayMode />;
      }

      if (part.startsWith('$') && part.endsWith('$')) {
        const isDisplay = part.startsWith('$$');
        return <MathView key={`imath-${index}`} math={part.slice(isDisplay ? 2 : 1, isDisplay ? -2 : -1).trim()} />;
      }

      return <span key={`txt-${index}`}>{part}</span>;
    });
  }, [text]);

  return <div className={`leading-relaxed ${className}`}>{elements}</div>;
};
