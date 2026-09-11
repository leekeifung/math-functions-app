import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Layers, 
  Award, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ArrowRight, 
  MoveHorizontal, 
  Sparkles, 
  ChevronRight,
  Eye,
  RotateCcw,
  Sliders,
  Check,
  Info,
  Moon,
  Sun
} from 'lucide-react';

// Master list of standard functions for Level 1 Explorer
const EXPLORER_FUNCTIONS = [
  {
    id: 'linear',
    name: 'Linear Function',
    formula: 'f(x) = 2x + 1',
    latexFormula: 'f(x) = 2x + 1',
    inverseFormula: 'f⁻¹(x) = (x - 1) / 2',
    domainStr: '(-∞, ∞) or ℝ',
    rangeStr: '(-∞, ∞) or ℝ',
    isOneToOne: true,
    evalF: (x) => 2 * x + 1,
    evalInv: (y) => (y - 1) / 2,
    domainMin: -5,
    domainMax: 5,
    description: 'A linear function with a non-zero slope is strictly increasing and always 1-to-1.'
  },
  {
    id: 'cubic',
    name: 'Cubic Function',
    formula: 'f(x) = x³',
    latexFormula: 'f(x) = x^3',
    inverseFormula: 'f⁻¹(x) = ∛x',
    domainStr: '(-∞, ∞) or ℝ',
    rangeStr: '(-∞, ∞) or ℝ',
    isOneToOne: true,
    evalF: (x) => Math.pow(x, 3),
    evalInv: (y) => Math.cbrt(y),
    domainMin: -2.5,
    domainMax: 2.5,
    description: 'Strictly increasing on ℝ, making it 1-to-1 with a well-defined real cube root inverse.'
  },
  {
    id: 'quadratic',
    name: 'Quadratic (Unrestricted)',
    formula: 'f(x) = x²',
    latexFormula: 'f(x) = x^2',
    inverseFormula: 'None (Fails 1-to-1 test)',
    domainStr: '(-∞, ∞) or ℝ',
    rangeStr: '[0, ∞)',
    isOneToOne: false,
    evalF: (x) => x * x,
    evalInv: null,
    domainMin: -4,
    domainMax: 4,
    description: 'Fails the Horizontal Line Test because f(-a) = f(a) = a². Not 1-to-1 unless domain is restricted.'
  },
  {
    id: 'sqrt',
    name: 'Square Root Function',
    formula: 'f(x) = √(6 - 2x)',
    latexFormula: 'f(x) = \\sqrt{6 - 2x}',
    inverseFormula: 'f⁻¹(x) = (6 - x²) / 2, x ≥ 0',
    domainStr: '(-∞, 3]',
    rangeStr: '[0, ∞)',
    isOneToOne: true,
    evalF: (x) => (6 - 2 * x >= 0 ? Math.sqrt(6 - 2 * x) : NaN),
    evalInv: (y) => (y >= 0 ? (6 - y * y) / 2 : NaN),
    domainMin: -5,
    domainMax: 3,
    description: 'Requires 6 - 2x ≥ 0 ⇒ x ≤ 3. Strictly decreasing on (-∞, 3], so it is 1-to-1.'
  },
  {
    id: 'abs',
    name: 'Absolute Value',
    formula: 'f(x) = |x|',
    latexFormula: 'f(x) = |x|',
    inverseFormula: 'None (Fails 1-to-1 test)',
    domainStr: '(-∞, ∞) or ℝ',
    rangeStr: '[0, ∞)',
    isOneToOne: false,
    evalF: (x) => Math.abs(x),
    evalInv: null,
    domainMin: -4,
    domainMax: 4,
    description: 'Maps both x and -x to the same output |x|. Not 1-to-1.'
  },
  {
    id: 'piecewise',
    name: 'Piecewise Function',
    formula: 'f(x) = x+2 (x < -1) | x² (x ≥ -1)',
    latexFormula: 'f(x) = \\begin{cases} x+2 & x < -1 \\\\ x^2 & x \\ge -1 \\end{cases}',
    inverseFormula: 'None (Overlaps in output)',
    domainStr: '(-∞, ∞) or ℝ',
    rangeStr: '(-∞, 1) ∪ [0, ∞) = ℝ',
    isOneToOne: false,
    evalF: (x) => (x < -1 ? x + 2 : x * x),
    evalInv: null,
    domainMin: -4,
    domainMax: 3,
    description: 'Notice that x = -0.5 gives f(-0.5)=0.25, while x = -1.75 gives f(-1.75)=0.25. Overlaps prevent 1-to-1 property.'
  }
];

const LEVEL2_QUESTIONS = [
  {
    id: 1,
    title: 'Exponential Growth',
    formula: 'f(x) = 2^x',
    domain: '(-∞, ∞)',
    range: '(0, ∞)',
    isOneToOne: true,
    evalF: (x) => Math.pow(2, x),
    explanation: 'f(x) = 2^x is strictly increasing for all real x. Every horizontal line y > 0 intersects the graph at exactly one point.',
    domainMin: -3,
    domainMax: 3
  },
  {
    id: 2,
    title: 'Parabola shifted',
    formula: 'f(x) = (x - 2)^2 + 1',
    domain: '(-∞, ∞)',
    range: '[1, ∞)',
    isOneToOne: false,
    evalF: (x) => Math.pow(x - 2, 2) + 1,
    explanation: 'The vertex is at (2, 1). Horizontal lines above y = 1 intersect the parabola at two symmetrical points around x = 2.',
    domainMin: -1,
    domainMax: 5
  },
  {
    id: 3,
    title: 'Restricted Parabola',
    formula: 'f(x) = (x - 2)^2 + 1',
    domain: '[2, ∞)',
    range: '[1, ∞)',
    isOneToOne: true,
    evalF: (x) => (x >= 2 ? Math.pow(x - 2, 2) + 1 : NaN),
    explanation: 'By restricting the domain to x ≥ 2 (the right branch only), the function becomes strictly increasing and thus 1-to-1!',
    domainMin: 2,
    domainMax: 6
  },
  {
    id: 4,
    title: 'Rational Function',
    formula: 'f(x) = 1 / x',
    domain: 'ℝ \\ {0}',
    range: 'ℝ \\ {0}',
    isOneToOne: true,
    evalF: (x) => (x !== 0 ? 1 / x : NaN),
    explanation: 'For any output y ≠ 0, there is a unique input x = 1/y. Hence it is 1-to-1 on its domain.',
    domainMin: -4,
    domainMax: 4
  },
  {
    id: 5,
    title: 'Cosine Function',
    formula: 'f(x) = cos(x)',
    domain: '[0, 2π]',
    range: '[-1, 1]',
    isOneToOne: false,
    evalF: (x) => (x >= 0 && x <= 2 * Math.PI ? Math.cos(x) : NaN),
    explanation: 'On [0, 2π], cos(x) repeats values (e.g., cos(0) = cos(2π) = 1). Horizontal lines like y = 0.5 cross twice.',
    domainMin: 0,
    domainMax: 6.28
  }
];

const LEVEL3_QUESTIONS = [
  {
    id: 101,
    formula: 'f(x) = x^2 - 4x + 3',
    givenDomain: '[2, ∞)',
    optionsOneToOne: [true, false],
    correctOneToOne: true,
    correctInvFormula: 'f⁻¹(x) = 2 + √(x + 1)',
    optionsInvFormula: [
      'f⁻¹(x) = 2 + √(x + 1)',
      'f⁻¹(x) = 2 - √(x + 1)',
      'f⁻¹(x) = √(x - 3) + 2',
      'No inverse exists'
    ],
    invDomain: '[-1, ∞)',
    invRange: '[2, ∞)',
    evalF: (x) => (x >= 2 ? x * x - 4 * x + 3 : NaN),
    explanation: 'Completing the square gives f(x) = (x-2)² - 1. On [2, ∞), this is the right branch of the vertex at x=2. Solving y = (x-2)² - 1 ⇒ x = 2 + √(y+1). So f⁻¹(x) = 2 + √(x+1) with domain [-1, ∞).'
  },
  {
    id: 102,
    formula: 'f(x) = (2x + 1) / (x - 3)',
    givenDomain: '(-∞, 3) ∪ (3, ∞)',
    optionsOneToOne: [true, false],
    correctOneToOne: true,
    correctInvFormula: 'f⁻¹(x) = (3x + 1) / (x - 2)',
    optionsInvFormula: [
      'f⁻¹(x) = (3x + 1) / (x - 2)',
      'f⁻¹(x) = (x - 3) / (2x + 1)',
      'f⁻¹(x) = (2x - 1) / (x + 3)',
      'No inverse exists'
    ],
    invDomain: 'ℝ \\ {2}',
    invRange: 'ℝ \\ {3}',
    evalF: (x) => (x !== 3 ? (2 * x + 1) / (x - 3) : NaN),
    explanation: 'Solving y = (2x + 1)/(x - 3) ⇒ y(x - 3) = 2x + 1 ⇒ x(y - 2) = 3y + 1 ⇒ x = (3y + 1)/(y - 2). Thus f⁻¹(x) = (3x + 1)/(x - 2) with domain ℝ \\ {2}.'
  },
  {
    id: 103,
    formula: 'f(x) = x^3 - 3x',
    givenDomain: '(-∞, ∞)',
    optionsOneToOne: [true, false],
    correctOneToOne: false,
    correctInvFormula: 'No inverse exists',
    optionsInvFormula: [
      'f⁻¹(x) = ∛(x + 3)',
      'f⁻¹(x) = ∛x + 3',
      'No inverse exists',
      'f⁻¹(x) = √(x / 3)'
    ],
    invDomain: 'N/A',
    invRange: 'N/A',
    evalF: (x) => x * x * x - 3 * x,
    explanation: 'f(x) = x³ - 3x has local turning points at x = -1 (local max = 2) and x = 1 (local min = -2). Any horizontal line between -2 and 2 intersects the graph 3 times, so it fails the 1-to-1 test.'
  }
];

const CoordinateGraph = ({ 
  evalF, 
  evalInv, 
  showInverse = false, 
  showReflectionLine = true, 
  hltY = null, 
  onHltChange = null,
  activeX = 1.5,
  interactiveX = false,
  onXChange = null,
  xMin = -6, 
  xMax = 6, 
  yMin = -6, 
  yMax = 6,
  title = ""
}) => {
  const svgRef = useRef(null);
  const width = 460;
  const height = 360;

  // Convert Math coords to SVG canvas coords
  const toSvgX = (x) => ((x - xMin) / (xMax - xMin)) * width;
  const toSvgY = (y) => height - ((y - yMin) / (yMax - yMin)) * height;
  const toMathX = (svgX) => xMin + (svgX / width) * (xMax - xMin);
  const toMathY = (svgY) => yMin + ((height - svgY) / height) * (yMax - yMin);

  // Generate path string for a function evaluator
  const generatePath = (evaluator) => {
    if (!evaluator) return '';
    const steps = 300;
    const dx = (xMax - xMin) / steps;
    let path = '';
    let isDrawing = false;

    for (let i = 0; i <= steps; i++) {
      const x = xMin + i * dx;
      const y = evaluator(x);

      if (!isNaN(y) && isFinite(y) && y >= yMin - 10 && y <= yMax + 10) {
        const sx = toSvgX(x);
        const sy = toSvgY(y);
        if (!isDrawing) {
          path += `M ${sx.toFixed(1)} ${sy.toFixed(1)}`;
          isDrawing = true;
        } else {
          path += ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
        }
      } else {
        isDrawing = false;
      }
    }
    return path;
  };

  // Find intersection count for Horizontal Line Test (HLT)
  const calculateHltIntersections = () => {
    if (hltY === null || !evalF) return [];
    const intersections = [];
    const steps = 600;
    const dx = (xMax - xMin) / steps;

    for (let i = 0; i < steps; i++) {
      const x1 = xMin + i * dx;
      const x2 = x1 + dx;
      const y1 = evalF(x1);
      const y2 = evalF(x2);

      if (!isNaN(y1) && !isNaN(y2) && isFinite(y1) && isFinite(y2)) {
        if ((y1 - hltY) * (y2 - hltY) <= 0) {
          // Linear interpolation for exact intersection x
          const fraction = Math.abs(hltY - y1) / (Math.abs(y2 - y1) || 1e-6);
          const xIntersect = x1 + fraction * dx;
          intersections.push({ x: xIntersect, y: hltY });
        }
      }
    }
    return intersections;
  };

  const hltIntersections = calculateHltIntersections();

  // Handle Dragging HLT Line or Active Point
  const handleMouseDown = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const my = toMathY(e.clientY - rect.top);
    const mx = toMathX(e.clientX - rect.left);

    if (onHltChange && hltY !== null) {
      onHltChange(Math.max(yMin + 0.2, Math.min(yMax - 0.2, my)));
    } else if (interactiveX && onXChange) {
      onXChange(Math.max(xMin + 0.1, Math.min(xMax - 0.1, mx)));
    }
  };

  const handleMouseMove = (e) => {
    if (e.buttons !== 1 || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const my = toMathY(e.clientY - rect.top);
    const mx = toMathX(e.clientX - rect.left);

    if (onHltChange && hltY !== null) {
      onHltChange(Math.max(yMin + 0.2, Math.min(yMax - 0.2, my)));
    } else if (interactiveX && onXChange) {
      onXChange(Math.max(xMin + 0.1, Math.min(xMax - 0.1, mx)));
    }
  };

  // Active point evaluation
  const activeY = evalF ? evalF(activeX) : NaN;
  const invY = (showInverse && evalInv) ? evalInv(activeX) : NaN;

  return (
    <div className="relative flex flex-col items-center bg-slate-900 rounded-xl p-3 shadow-inner border border-slate-700 select-none">
      {title && <div className="text-xs font-semibold text-slate-300 mb-2 self-start flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-cyan-400" /> {title}</div>}
      
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="cursor-crosshair rounded bg-slate-950 w-full max-w-[460px] h-auto touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        {/* Grid Lines */}
        {Array.from({ length: xMax - xMin + 1 }).map((_, i) => {
          const val = xMin + i;
          const sx = toSvgX(val);
          return (
            <g key={`grid-x-${val}`}>
              <line x1={sx} y1={0} x2={sx} y2={height} stroke="#334155" strokeDasharray={val === 0 ? "" : "2,2"} strokeWidth={val === 0 ? 2 : 1} />
              {val !== 0 && val % 2 === 0 && (
                <text x={sx} y={toSvgY(0) + 14} fill="#64748b" fontSize="10" textAnchor="middle">{val}</text>
              )}
            </g>
          );
        })}

        {Array.from({ length: yMax - yMin + 1 }).map((_, i) => {
          const val = yMin + i;
          const sy = toSvgY(val);
          return (
            <g key={`grid-y-${val}`}>
              <line x1={0} y1={sy} x2={width} y2={sy} stroke="#334155" strokeDasharray={val === 0 ? "" : "2,2"} strokeWidth={val === 0 ? 2 : 1} />
              {val !== 0 && val % 2 === 0 && (
                <text x={toSvgX(0) - 10} y={sy + 3} fill="#64748b" fontSize="10" textAnchor="end">{val}</text>
              )}
            </g>
          );
        })}

        {/* Axes */}
        <line x1={0} y1={toSvgY(0)} x2={width} y2={toSvgY(0)} stroke="#94a3b8" strokeWidth={2} />
        <line x1={toSvgX(0)} y1={0} x2={toSvgX(0)} y2={height} stroke="#94a3b8" strokeWidth={2} />
        <text x={width - 15} y={toSvgY(0) - 6} fill="#cbd5e1" fontSize="12" fontWeight="bold">x</text>
        <text x={toSvgX(0) + 8} y={15} fill="#cbd5e1" fontSize="12" fontWeight="bold">y</text>

        {/* Reflection Line y = x */}
        {showReflectionLine && (
          <line
            x1={toSvgX(xMin)}
            y1={toSvgY(xMin)}
            x2={toSvgX(xMax)}
            y2={toSvgY(xMax)}
            stroke="#f59e0b"
            strokeDasharray="4,4"
            strokeWidth={1.5}
          />
        )}

        {/* Function Graph f(x) */}
        <path d={generatePath(evalF)} fill="none" stroke="#38bdf8" strokeWidth={3} strokeLinecap="round" />

        {/* Inverse Graph f⁻¹(x) */}
        {showInverse && evalInv && (
          <path d={generatePath(evalInv)} fill="none" stroke="#e879f9" strokeWidth={3} strokeDasharray="5,3" strokeLinecap="round" />
        )}

        {/* Active Point (x, f(x)) & Reflection Point (f(x), x) */}
        {!isNaN(activeY) && isFinite(activeY) && (
          <g>
            {/* Direct Point */}
            <circle cx={toSvgX(activeX)} cy={toSvgY(activeY)} r={6} fill="#0284c7" stroke="#ffffff" strokeWidth={2} />
            <text x={toSvgX(activeX) + 8} y={toSvgY(activeY) - 8} fill="#38bdf8" fontSize="11" fontWeight="bold">
              ({activeX.toFixed(1)}, {activeY.toFixed(1)})
            </text>

            {/* Symmetry Connection Line if Inverse Shown */}
            {showInverse && (
              <line 
                x1={toSvgX(activeX)} 
                y1={toSvgY(activeY)} 
                x2={toSvgX(activeY)} 
                y2={toSvgY(activeX)} 
                stroke="#c084fc" 
                strokeDasharray="2,2" 
              />
            )}

            {/* Reflected Point (y, x) */}
            {showInverse && !isNaN(activeY) && (
              <g>
                <circle cx={toSvgX(activeY)} cy={toSvgY(activeX)} r={6} fill="#c084fc" stroke="#ffffff" strokeWidth={2} />
                <text x={toSvgX(activeY) + 8} y={toSvgY(activeX) - 8} fill="#e879f9" fontSize="11" fontWeight="bold">
                  ({activeY.toFixed(1)}, {activeX.toFixed(1)})
                </text>
              </g>
            )}
          </g>
        )}

        {/* Horizontal Line Test Line */}
        {hltY !== null && (
          <g>
            <line
              x1={0}
              y1={toSvgY(hltY)}
              x2={width}
              y2={toSvgY(hltY)}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="6,4"
            />
            <text x={12} y={toSvgY(hltY) - 6} fill="#f87171" fontSize="11" fontWeight="bold">
              y = {hltY.toFixed(1)}
            </text>

            {/* Intersections */}
            {hltIntersections.map((pt, idx) => (
              <g key={`hlt-pt-${idx}`}>
                <circle cx={toSvgX(pt.x)} cy={toSvgY(pt.y)} r={7} fill="#ef4444" stroke="#ffffff" strokeWidth={2} />
                <circle cx={toSvgX(pt.x)} cy={toSvgY(pt.y)} r={11} fill="none" stroke="#f87171" strokeWidth={1.5} className="animate-ping" />
              </g>
            ))}
          </g>
        )}
      </svg>

      {/* Graph Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-2 text-xs font-medium text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-sky-400 rounded-full inline-block"></span>
          <span>f(x) Graph</span>
        </div>
        {showReflectionLine && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-400 border-b border-dashed border-amber-400 inline-block"></span>
            <span>Mirror Line y = x</span>
          </div>
        )}
        {showInverse && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-fuchsia-400 rounded-full inline-block"></span>
            <span>f⁻¹(x) Inverse</span>
          </div>
        )}
        {hltY !== null && (
          <div className="flex items-center gap-1.5 text-rose-400 font-bold">
            <span className="w-3 h-0.5 bg-rose-500 inline-block"></span>
            <span>HLT Intersections: {hltIntersections.length}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const MappingMachine = ({ selectedFunc, activeInputX, onInputXChange }) => {
  const inputs = [-3, -2, -1, 0, 1, 2, 3];
  
  // Calculate mapping pairs
  const mappings = inputs.map(x => ({
    x,
    y: selectedFunc.evalF(x)
  })).filter(m => !isNaN(m.y) && isFinite(m.y));

  const currentY = selectedFunc.evalF(activeInputX);
  const collisions = mappings.filter(m => m.y === currentY);

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-emerald-400" /> Domain → Range Mapping Machine
        </span>
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${selectedFunc.isOneToOne ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
          {selectedFunc.isOneToOne ? '1-to-1 Mapping' : 'Many-to-1 Mapping'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-950 p-4 rounded-lg border border-slate-800">
        {/* Domain Set A */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-sky-400 mb-2">Domain Set A (Inputs x)</span>
          <div className="flex flex-wrap justify-center gap-2 max-w-[200px]">
            {inputs.map(x => {
              const isSelected = x === activeInputX;
              return (
                <button
                  key={`in-${x}`}
                  onClick={() => onInputXChange(x)}
                  className={`w-9 h-9 rounded-full font-bold text-xs transition-all ${
                    isSelected 
                      ? 'bg-sky-500 text-white ring-4 ring-sky-500/30 scale-110' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {x}
                </button>
              );
            })}
          </div>
        </div>

        {/* Function Mapping Rule Arrow */}
        <div className="flex flex-col items-center justify-center my-2 md:my-0">
          <div className="text-xs font-semibold text-slate-400 mb-1">Rule: {selectedFunc.formula}</div>
          <div className="flex items-center text-slate-500">
            <div className="h-0.5 bg-slate-700 w-12"></div>
            <ArrowRight className="w-5 h-5 text-sky-400 -ml-1" />
          </div>
          {!isNaN(currentY) && (
            <div className="mt-2 text-xs font-mono bg-sky-950 text-sky-300 px-3 py-1 rounded border border-sky-800">
              f({activeInputX}) = {Number.isInteger(currentY) ? currentY : currentY.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      {/* Collision Diagnostic Note */}
      {collisions.length > 1 && (
        <div className="bg-amber-950/40 border border-amber-800/60 rounded-lg p-3 text-xs text-amber-200 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Many-to-One Detected!</strong> Multiple inputs x = {collisions.map(c => c.x).join(', ')} map to the same output y = {currentY}. Thus, this function is NOT one-to-one on this set.
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('level1'); // 'level1', 'level2', 'level3'
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Level 1 Explorer State
  const [selectedFuncId, setSelectedFuncId] = useState('linear');
  const [activeX, setActiveX] = useState(1.5);
  const [showInverse, setShowInverse] = useState(true);
  const [isHltEnabled, setIsHltEnabled] = useState(false);
  const [hltY, setHltY] = useState(2.0);

  // Level 2 Quiz State
  const [l2Index, setL2Index] = useState(0);
  const [l2Answer, setL2Answer] = useState(null); // true or false
  const [l2Submitted, setL2Submitted] = useState(false);
  const [l2Score, setL2Score] = useState(0);
  const [isL2HltEnabled, setIsL2HltEnabled] = useState(false);
  const [l2HltY, setL2HltY] = useState(2.0);

  // Level 3 Challenge State
  const [l3Index, setL3Index] = useState(0);
  const [l3OneToOneAns, setL3OneToOneAns] = useState(null);
  const [l3FormulaAns, setL3FormulaAns] = useState('');
  const [l3Submitted, setL3Submitted] = useState(false);
  const [l3Score, setL3Score] = useState(0);

  const currentFunc = EXPLORER_FUNCTIONS.find(f => f.id === selectedFuncId) || EXPLORER_FUNCTIONS[0];
  const currentL2 = LEVEL2_QUESTIONS[l2Index];
  const currentL3 = LEVEL3_QUESTIONS[l3Index];

  // Level 2 Handlers
  const handleL2Submit = () => {
    if (l2Answer === null) return;
    setL2Submitted(true);
    if (l2Answer === currentL2.isOneToOne) {
      setL2Score(prev => prev + 1);
    }
  };

  const handleL2Next = () => {
    if (l2Index < LEVEL2_QUESTIONS.length - 1) {
      setL2Index(prev => prev + 1);
      setL2Answer(null);
      setL2Submitted(false);
      setL2HltY(2.0);
    }
  };

  const resetL2 = () => {
    setL2Index(0);
    setL2Answer(null);
    setL2Submitted(false);
    setL2Score(0);
    setL2HltY(2.0);
  };

  // Level 3 Handlers
  const handleL3Submit = () => {
    if (l3OneToOneAns === null || !l3FormulaAns) return;
    setL3Submitted(true);
    const isCorrect = (l3OneToOneAns === currentL3.correctOneToOne) && (l3FormulaAns === currentL3.correctInvFormula);
    if (isCorrect) {
      setL3Score(prev => prev + 1);
    }
  };

  const handleL3Next = () => {
    if (l3Index < LEVEL3_QUESTIONS.length - 1) {
      setL3Index(prev => prev + 1);
      setL3OneToOneAns(null);
      setL3FormulaAns('');
      setL3Submitted(false);
    }
  };

  const resetL3 = () => {
    setL3Index(0);
    setL3OneToOneAns(null);
    setL3FormulaAns('');
    setL3Submitted(false);
    setL3Score(0);
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-all duration-300 ${!isDarkMode ? 'theme-light' : ''}`}>
      <style>{`
        .theme-light {
          filter: invert(1) hue-rotate(180deg);
        }
      `}</style>
      {}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Domain, Range & Inverse Functions
              </h1>
              <p className="text-xs text-slate-400">Interactive Visual Calculus Explorer & Practice Hub</p>
            </div>
          </div>

          {/* Level Navigation Tabs & Theme Toggle */}
          <div className="flex items-center gap-3">
            <nav className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('level1')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'level1' 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>1. Basic Concept</span>
              </button>

              <button
                onClick={() => setActiveTab('level2')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'level2' 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>2. Intermediate</span>
              </button>

              <button
                onClick={() => setActiveTab('level3')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'level3' 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>3. Difficult Challenge</span>
              </button>
            </nav>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-sky-400 hover:border-sky-500/50 transition-all shadow-sm"
              title="Toggle Light/Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        
        {}
        {activeTab === 'level1' && (
          <div className="space-y-6">
            {/* Theoretical Foundations & Definitions Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition">
                <div className="text-xs font-extrabold text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Info className="w-4 h-4" /> Domain & Range
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-2">
                  <strong className="text-white">Domain (Dom f):</strong> The complete set of allowable inputs $x$ for which $f(x)$ is defined.
                  <br />
                  <strong className="text-white">Range (Range f):</strong> The resulting set of output values $y = f(x)$ generated as $x$ ranges over Dom(f).
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition">
                <div className="text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MoveHorizontal className="w-4 h-4" /> One-to-One (1-to-1)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-2">
                  A function is <strong>One-to-One</strong> if it never takes on the same value twice:
                  <br />
                  <span className="font-mono text-amber-300">f(x₁) = f(x₂) ⟹ x₁ = x₂</span>.
                  <br />
                  <strong>Horizontal Line Test (HLT):</strong> Every horizontal line intersects the graph at <em>most once</em>.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition">
                <div className="text-xs font-extrabold text-fuchsia-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <RotateCcw className="w-4 h-4" /> Inverse Function f⁻¹
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-2">
                  An inverse $f^{-1}$ exists <strong>if and only if</strong> $f$ is one-to-one!
                  <br />
                  Key Identity: <span className="text-fuchsia-300">Dom(f⁻¹) = Range(f)</span> and <span className="text-fuchsia-300">Range(f⁻¹) = Dom(f)</span>.
                  <br />
                  Graphically, $f^{-1}(x)$ is the reflection of $f(x)$ across the line <span className="text-amber-400 font-bold">y = x</span>.
                </p>
              </div>
            </div>

            {/* Function Explorer Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Interactive Function Sandbox</span>
                  </h2>
                  <p className="text-xs text-slate-400">Select a function to inspect its domain, range, inverse reflection, and test 1-to-1 properties.</p>
                </div>

                {/* Function Picker */}
                <div className="flex flex-wrap gap-2">
                  {EXPLORER_FUNCTIONS.map(func => (
                    <button
                      key={func.id}
                      onClick={() => {
                        setSelectedFuncId(func.id);
                        setActiveX(1.5);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedFuncId === func.id
                          ? 'bg-sky-500 text-white ring-2 ring-sky-400 shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {func.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Function Details & Controls Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Controls & Analysis (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {/* Selected Function Card */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-sky-400">{currentFunc.name}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${currentFunc.isOneToOne ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                        {currentFunc.isOneToOne ? '1-to-1 (Has Inverse)' : 'Fails 1-to-1 Test'}
                      </span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                      <div className="text-xs text-slate-400">Formula: <span className="text-white font-mono font-bold text-sm">{currentFunc.formula}</span></div>
                      <div className="text-xs text-slate-400">Inverse Formula: <span className="text-fuchsia-300 font-mono font-bold">{currentFunc.inverseFormula}</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                        <span className="text-slate-400 block font-semibold mb-0.5">Dom(f)</span>
                        <span className="text-emerald-400 font-mono font-bold">{currentFunc.domainStr}</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                        <span className="text-slate-400 block font-semibold mb-0.5">Range(f)</span>
                        <span className="text-cyan-400 font-mono font-bold">{currentFunc.rangeStr}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-800/80">
                      {currentFunc.description}
                    </p>
                  </div>

                  {/* Interactive Sliders */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                    {/* Active Point Slider */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-slate-300 font-semibold">Inspect Point x = {activeX.toFixed(1)}</span>
                        <span className="text-sky-400 font-mono">f({activeX.toFixed(1)}) = {isNaN(currentFunc.evalF(activeX)) ? 'Undefined' : currentFunc.evalF(activeX).toFixed(2)}</span>
                      </div>
                      <input 
                        type="range" 
                        min={currentFunc.domainMin} 
                        max={currentFunc.domainMax} 
                        step="0.1" 
                        value={activeX} 
                        onChange={(e) => setActiveX(parseFloat(e.target.value))}
                        className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Horizontal Line Test Section */}
                    <div className="pt-2 border-t border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <MoveHorizontal className="w-4 h-4 text-rose-400" /> Enable Horizontal Line Test
                        </span>
                        <button
                          onClick={() => setIsHltEnabled(!isHltEnabled)}
                          className={`w-11 h-6 rounded-full transition-colors relative p-1 ${
                            isHltEnabled ? 'bg-rose-600' : 'bg-slate-800'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            isHltEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      {isHltEnabled && (
                        <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-slate-400">Test Line y = {hltY.toFixed(1)}</span>
                          </div>
                          <input 
                            type="range" 
                            min="-5" 
                            max="5" 
                            step="0.1" 
                            value={hltY} 
                            onChange={(e) => setHltY(parseFloat(e.target.value))}
                            className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      )}
                    </div>

                    {/* Reflection Toggle */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <RotateCcw className="w-4 h-4 text-fuchsia-400" /> Plot Inverse Function f⁻¹
                      </span>
                      <button
                        onClick={() => setShowInverse(!showInverse)}
                        disabled={!currentFunc.isOneToOne}
                        className={`w-11 h-6 rounded-full transition-colors relative p-1 ${
                          !currentFunc.isOneToOne ? 'opacity-50 cursor-not-allowed bg-slate-800' : showInverse ? 'bg-fuchsia-600' : 'bg-slate-800'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          showInverse && currentFunc.isOneToOne ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Mapping Machine Visualizer */}
                  <MappingMachine
                    selectedFunc={currentFunc}
                    activeInputX={Math.round(activeX)}
                    onInputXChange={(x) => setActiveX(x)}
                  />
                </div>

                {/* Right Interactive Graph (7 cols) */}
                <div className="lg:col-span-7 flex flex-col items-center justify-center">
                  <CoordinateGraph
                    evalF={currentFunc.evalF}
                    evalInv={currentFunc.isOneToOne ? currentFunc.evalInv : null}
                    showInverse={showInverse && currentFunc.isOneToOne}
                    showReflectionLine={true}
                    hltY={isHltEnabled ? hltY : null}
                    onHltChange={(y) => setHltY(y)}
                    activeX={activeX}
                    interactiveX={true}
                    onXChange={(x) => setActiveX(x)}
                    title={`Coordinate Graph: ${currentFunc.name}`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {}
        {activeTab === 'level2' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block">Level 2: Intermediate Practice</span>
                <h2 className="text-base font-bold text-white">Determine whether given functions are One-to-One</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-sky-400">
                  Score: {l2Score} / {LEVEL2_QUESTIONS.length}
                </span>
                <button
                  onClick={resetL2}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
                  title="Reset Practice"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800 pb-3">
                <span>Question {l2Index + 1} of {LEVEL2_QUESTIONS.length}</span>
                <span className="font-semibold text-slate-300">{currentL2.title}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Left Problem Info (5 cols) */}
                <div className="md:col-span-5 space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Given Function:</span>
                    <div className="text-lg font-mono font-bold text-sky-400">{currentL2.formula}</div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                      <div className="bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">Given Domain:</span>
                        <span className="text-emerald-400 font-mono font-bold">{currentL2.domain}</span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">Given Range:</span>
                        <span className="text-cyan-400 font-mono font-bold">{currentL2.range}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    Based on the plot and the specified domain, is this function <strong>One-to-One</strong> (and therefore possesses a valid inverse function)?
                  </p>

                  {/* Choice Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => !l2Submitted && setL2Answer(true)}
                      disabled={l2Submitted}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                        l2Answer === true 
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40' 
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Yes (1-to-1)
                    </button>

                    <button
                      onClick={() => !l2Submitted && setL2Answer(false)}
                      disabled={l2Submitted}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                        l2Answer === false 
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/40' 
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <XCircle className="w-4 h-4 text-rose-400" /> No (Fails)
                    </button>
                  </div>

                  {/* Submit / Next Actions */}
                  {!l2Submitted ? (
                    <button
                      onClick={handleL2Submit}
                      disabled={l2Answer === null}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                        l2Answer === currentL2.isOneToOne 
                          ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200' 
                          : 'bg-rose-950/60 border-rose-800 text-rose-200'
                      }`}>
                        <div className="font-bold mb-1 flex items-center gap-1.5">
                          {l2Answer === currentL2.isOneToOne ? (
                            <> <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Correct! </>
                          ) : (
                            <> <XCircle className="w-4 h-4 text-rose-400" /> Incorrect </>
                          )}
                        </div>
                        {currentL2.explanation}
                      </div>

                      {l2Index < LEVEL2_QUESTIONS.length - 1 ? (
                        <button
                          onClick={handleL2Next}
                          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white flex items-center justify-center gap-2 transition"
                        >
                          Next Question <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="text-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                          <span className="text-xs font-bold text-emerald-400 block mb-1">Level 2 Practice Completed!</span>
                          <span className="text-xs text-slate-400">Final Score: {l2Score} / {LEVEL2_QUESTIONS.length}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Interactive Graph for HLT Testing (7 cols) */}
                <div className="md:col-span-7 space-y-4">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <MoveHorizontal className="w-4 h-4 text-rose-400" />
                      Enable Horizontal Line Test
                    </span>
                    <button
                      onClick={() => setIsL2HltEnabled(!isL2HltEnabled)}
                      className={`w-11 h-6 rounded-full transition-colors relative p-1 ${
                        isL2HltEnabled ? 'bg-rose-600' : 'bg-slate-800'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        isL2HltEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                  
                  <CoordinateGraph
                    evalF={currentL2.evalF}
                    showReflectionLine={false}
                    hltY={isL2HltEnabled ? l2HltY : null}
                    onHltChange={(y) => setL2HltY(y)}
                    xMin={currentL2.domainMin - 1}
                    xMax={currentL2.domainMax + 1}
                    title={isL2HltEnabled ? "Drag the red Horizontal Line to test intersections!" : "Graph View"}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {}
        {activeTab === 'level3' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-extrabold text-fuchsia-400 uppercase tracking-wider block">Level 3: Advanced Challenge</span>
                <h2 className="text-base font-bold text-white">Domain Restrictions & Solving Inverse Equations</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-fuchsia-400">
                  Score: {l3Score} / {LEVEL3_QUESTIONS.length}
                </span>
                <button
                  onClick={resetL3}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
                  title="Reset Practice"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Problem Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800 pb-3">
                <span>Challenge {l3Index + 1} of {LEVEL3_QUESTIONS.length}</span>
                <span className="font-semibold text-slate-300">Advanced Algebraic Assessment</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Questions Form (6 cols) */}
                <div className="md:col-span-6 space-y-5">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Given Function & Restricted Domain:</span>
                    <div className="text-lg font-mono font-bold text-sky-400">{currentL3.formula}</div>
                    <div className="text-xs text-emerald-400 font-semibold">Dom(f) = {currentL3.givenDomain}</div>
                  </div>

                  {/* Part A: 1-to-1 Evaluation */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-200 block">
                      Part A: Is f(x) One-to-One on the domain {currentL3.givenDomain}?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => !l3Submitted && setL3OneToOneAns(true)}
                        disabled={l3Submitted}
                        className={`p-2.5 rounded-lg border text-xs font-bold transition ${
                          l3OneToOneAns === true 
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        Yes, 1-to-1
                      </button>
                      <button
                        onClick={() => !l3Submitted && setL3OneToOneAns(false)}
                        disabled={l3Submitted}
                        className={`p-2.5 rounded-lg border text-xs font-bold transition ${
                          l3OneToOneAns === false 
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300' 
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        No, Not 1-to-1
                      </button>
                    </div>
                  </div>

                  {/* Part B: Select Inverse Formula */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-200 block">
                      Part B: Select the correct Inverse Function f⁻¹(x):
                    </label>
                    <div className="space-y-2">
                      {currentL3.optionsInvFormula.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => !l3Submitted && setL3FormulaAns(opt)}
                          disabled={l3Submitted}
                          className={`w-full p-2.5 rounded-lg border text-xs font-mono text-left transition flex items-center justify-between ${
                            l3FormulaAns === opt 
                              ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-200 ring-1 ring-fuchsia-500' 
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span>{opt}</span>
                          {l3FormulaAns === opt && <Check className="w-4 h-4 text-fuchsia-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit / Next Button */}
                  {!l3Submitted ? (
                    <button
                      onClick={handleL3Submit}
                      disabled={l3OneToOneAns === null || !l3FormulaAns}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 font-bold text-xs text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
                        (l3OneToOneAns === currentL3.correctOneToOne && l3FormulaAns === currentL3.correctInvFormula)
                          ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200' 
                          : 'bg-rose-950/60 border-rose-800 text-rose-200'
                      }`}>
                        <div className="font-bold flex items-center gap-1.5 text-sm">
                          {(l3OneToOneAns === currentL3.correctOneToOne && l3FormulaAns === currentL3.correctInvFormula) ? (
                            <> <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Excellent! Correct Response. </>
                          ) : (
                            <> <XCircle className="w-4 h-4 text-rose-400" /> Incorrect Solution </>
                          )}
                        </div>

                        <div className="pt-1 border-t border-slate-800/80">
                          <strong>Full Step-by-Step Explanation:</strong>
                          <p className="mt-1">{currentL3.explanation}</p>
                        </div>

                        {currentL3.correctOneToOne && (
                          <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                            <div className="bg-slate-900/80 p-2 rounded">
                              <span className="block text-slate-400">Dom(f⁻¹) = Range(f):</span>
                              <span className="font-mono text-emerald-300 font-bold">{currentL3.invDomain}</span>
                            </div>
                            <div className="bg-slate-900/80 p-2 rounded">
                              <span className="block text-slate-400">Range(f⁻¹) = Dom(f):</span>
                              <span className="font-mono text-cyan-300 font-bold">{currentL3.invRange}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {l3Index < LEVEL3_QUESTIONS.length - 1 ? (
                        <button
                          onClick={handleL3Next}
                          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white flex items-center justify-center gap-2 transition"
                        >
                          Next Challenge <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="text-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                          <span className="text-xs font-bold text-fuchsia-400 block mb-1">Level 3 Master Challenge Complete!</span>
                          <span className="text-xs text-slate-400">Final Score: {l3Score} / {LEVEL3_QUESTIONS.length}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Graph Viewer (6 cols) */}
                <div className="md:col-span-6">
                  <CoordinateGraph
                    evalF={currentL3.evalF}
                    showReflectionLine={true}
                    xMin={-6}
                    xMax={6}
                    yMin={-6}
                    yMax={6}
                    title={`Function Plot: ${currentL3.formula}`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-3 text-center text-xs text-slate-500">
        Interactive Math Learning Engine • Domain, Range & Inverse Functions Master
      </footer>
    </div>
  );
}