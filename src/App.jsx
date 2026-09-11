import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Activity, 
  Brain, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Info
} from 'lucide-react';

// Mathematical problems database
const problemsLevel2 = [
  {
    id: 1,
    funcText: "f(x) = x²",
    domain: "ℝ (All Reals)",
    codomain: "ℝ (All Reals)",
    mathNotation: "f: ℝ → ℝ",
    isInjective: false,
    isSurjective: false,
    plotFn: (x) => x * x,
    explanation: "Not injective because f(2) = f(-2) = 4 (fails horizontal line test). Not surjective because no real number squares to a negative number (e.g., -1 has no pre-image)."
  },
  {
    id: 2,
    funcText: "f(x) = x³",
    domain: "ℝ",
    codomain: "ℝ",
    mathNotation: "f: ℝ → ℝ",
    isInjective: true,
    isSurjective: true,
    plotFn: (x) => x * x * x,
    explanation: "Injective: every y-value is hit at most once. Surjective: the curve extends infinitely up and down, covering all real y-values. Therefore, it is Bijective."
  },
  {
    id: 3,
    funcText: "f(x) = |x|",
    domain: "ℝ",
    codomain: "[0, ∞) (Non-negative Reals)",
    mathNotation: "f: ℝ → [0, ∞)",
    isInjective: false,
    isSurjective: true,
    plotFn: (x) => Math.abs(x),
    explanation: "Not injective because f(3) = f(-3) = 3. It IS surjective because the codomain is restricted to [0, ∞), and the function covers all those non-negative values."
  },
  {
    id: 4,
    funcText: "f(x) = 2ˣ",
    domain: "ℝ",
    codomain: "ℝ",
    mathNotation: "f: ℝ → ℝ",
    isInjective: true,
    isSurjective: false,
    plotFn: (x) => Math.pow(2, x),
    explanation: "Injective: strictly increasing, passes the horizontal line test. Not surjective: 2ˣ is never negative or zero, so it doesn't cover the entire codomain of ℝ."
  }
];

const problemsLevel3 = [
  {
    id: 1,
    funcText: "f(n) = 2n",
    domain: "ℤ (Integers)",
    codomain: "ℤ (Integers)",
    mathNotation: "f: ℤ → ℤ",
    isInjective: true,
    isSurjective: false,
    explanation: "Injective: if 2a = 2b, then a = b. Not surjective: there is no integer 'n' such that f(n) = 3 (odd integers are missed)."
  },
  {
    id: 2,
    funcText: "f(x) = 3x - 5",
    domain: "ℝ (Reals)",
    codomain: "ℝ (Reals)",
    mathNotation: "f: ℝ → ℝ",
    isInjective: true,
    isSurjective: true,
    explanation: "It's a linear function with non-zero slope. It is both injective (one-to-one) and surjective (onto), making it bijective."
  },
  {
    id: 3,
    funcText: "f(x) = x²",
    domain: "[0, ∞)",
    codomain: "[0, ∞)",
    mathNotation: "f: [0, ∞) → [0, ∞)",
    isInjective: true,
    isSurjective: true,
    explanation: "Because the domain is restricted to non-negative numbers, it doesn't fail the horizontal line test. The codomain is also restricted to valid outputs. It is Bijective."
  },
  {
    id: 4,
    funcText: "f(n) = n + 1",
    domain: "ℕ (Natural numbers {1, 2, 3...})",
    codomain: "ℕ",
    mathNotation: "f: ℕ → ℕ",
    isInjective: true,
    isSurjective: false,
    explanation: "Injective: n+1 = m+1 implies n = m. Not surjective: the number 1 in the codomain has no pre-image, because n=0 is not in the domain ℕ."
  }
];

const SetMappingDiagram = ({ type }) => {
  // Define coordinate layouts for Domain (A) and Codomain (B)
  const setA = [20, 60, 100, 140];
  const setB = [20, 60, 100, 140];

  let links = [];
  
  if (type === 'general') {
    // Many to one, misses some
    links = [[0, 0], [1, 0], [2, 1], [3, 2]];
  } else if (type === 'injective') {
    // 1-1, but misses one in B
    links = [[0, 0], [1, 1], [2, 3]]; // Using 3 elements in A mapping to 4 in B
  } else if (type === 'surjective') {
    // Hits all in B, but many-to-one
    links = [[0, 0], [1, 1], [2, 2], [3, 2]]; // 4 elements in A to 3 in B
  } else if (type === 'bijective') {
    // Perfect 1-1 mapping
    links = [[0, 1], [1, 2], [2, 0], [3, 3]];
  }

  const renderA = type === 'injective' || type === 'bijective' ? [20, 60, 100] : setA;
  const renderB = type === 'surjective' || type === 'bijective' ? [20, 60, 100] : setB;
  if(type === 'bijective') {
      renderA.push(140);
      renderB.push(140);
  }

  return (
    <div className="flex justify-center p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <svg width="240" height="180" viewBox="0 0 240 180" className="overflow-visible">
        {/* Set A Ellipse */}
        <ellipse cx="40" cy="80" rx="30" ry="85" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
        <text x="40" y="-15" textAnchor="middle" className="font-semibold text-blue-800 text-sm">Domain</text>
        
        {/* Set B Ellipse */}
        <ellipse cx="200" cy="80" rx="30" ry="85" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
        <text x="200" y="-15" textAnchor="middle" className="font-semibold text-green-800 text-sm">Codomain</text>

        {/* Links */}
        {links.map((link, idx) => (
          <g key={`link-${idx}`}>
            <path
              d={`M 50 ${renderA[link[0]]} C 125 ${renderA[link[0]]}, 115 ${renderB[link[1]]}, 190 ${renderB[link[1]]}`}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              className="animate-[dash_2s_linear_infinite]"
              style={{ strokeDasharray: '4, 4' }}
            />
          </g>
        ))}

        {/* Nodes A */}
        {renderA.map((y, idx) => (
          <circle key={`a-${idx}`} cx="40" cy={y} r="5" fill="#1d4ed8" />
        ))}

        {/* Nodes B */}
        {renderB.map((y, idx) => (
          <circle key={`b-${idx}`} cx="200" cy={y} r="5" fill="#15803d" />
        ))}

        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

const FunctionPlotter = ({ func }) => {
  const width = 300;
  const height = 300;
  const scale = 30; // 30 pixels per unit => 10 units wide/high
  const cx = width / 2;
  const cy = height / 2;

  // Generate path for the function
  const points = [];
  for (let px = 0; px <= width; px += 2) {
    const mathX = (px - cx) / scale;
    const mathY = func(mathX);
    const py = cy - (mathY * scale);
    
    // Only add points that are somewhat within bounds to prevent extreme SVG lines
    if (py > -1000 && py < height + 1000) {
      points.push(`${px},${py}`);
    }
  }
  const polylineStr = points.join(" ");

  return (
    <div className="flex justify-center bg-white p-4 rounded-xl shadow-inner border border-slate-200">
      <svg width={width} height={height} className="bg-slate-50 rounded-lg">
        {/* Grid lines */}
        {Array.from({ length: 11 }).map((_, i) => (
          <React.Fragment key={`grid-${i}`}>
            <line x1={0} y1={i * scale} x2={width} y2={i * scale} stroke="#e2e8f0" strokeWidth="1" />
            <line x1={i * scale} y1={0} x2={i * scale} y2={height} stroke="#e2e8f0" strokeWidth="1" />
          </React.Fragment>
        ))}
        {/* Axes */}
        <line x1={0} y1={cy} x2={width} y2={cy} stroke="#64748b" strokeWidth="2" />
        <line x1={cx} y1={0} x2={cx} y2={height} stroke="#64748b" strokeWidth="2" />
        
        {/* Function Curve */}
        <polyline points={polylineStr} fill="none" stroke="#3b82f6" strokeWidth="3" />
      </svg>
    </div>
  );
};

const Level1Theory = () => {
  const [activeDiagram, setActiveDiagram] = useState('general');

  const diagramInfo = {
    general: { title: "Not Injective, Not Surjective", desc: "A standard function. Many inputs can map to the same output, and some outputs may not be hit at all." },
    injective: { title: "Injective (One-to-One)", desc: "Every element in the Codomain is mapped to by AT MOST one element from the Domain. No two inputs share an output." },
    surjective: { title: "Surjective (Onto)", desc: "Every element in the Codomain is mapped to by AT LEAST one element from the Domain. The entire Codomain is covered." },
    bijective: { title: "Bijective (Perfect Pairing)", desc: "Both Injective and Surjective. Every element pairs perfectly, one-to-one, with nothing left out." }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BookOpen className="text-blue-500" />
          Level 1: The Definitions
        </h2>
        <p className="text-slate-600 mb-6">
          A <strong>function</strong> maps elements from an input set (Domain) to an output set (Codomain). Let's explore the special properties a function can have.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="flex flex-col space-y-3 justify-center">
            {Object.keys(diagramInfo).map((type) => (
              <button
                key={type}
                onClick={() => setActiveDiagram(type)}
                className={`p-4 rounded-xl text-left transition-all ${
                  activeDiagram === type 
                    ? 'bg-blue-50 border-blue-400 border-2 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 border hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-slate-800 capitalize">{diagramInfo[type].title}</div>
                <div className="text-sm text-slate-500 mt-1">{diagramInfo[type].desc}</div>
              </button>
            ))}
          </div>

          {/* Visualization */}
          <div className="flex flex-col items-center justify-center space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="font-semibold text-lg text-slate-700">{diagramInfo[activeDiagram].title}</h3>
            <SetMappingDiagram type={activeDiagram} />
            <div className="text-sm text-slate-500 text-center flex items-center gap-2 mt-4 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
              Notice how the arrows behave for this specific type.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuizEngine = ({ level, problems }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selections, setSelections] = useState({ injective: null, surjective: null, bijective: null });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const problem = problems[currentIdx];

  const handleSelect = (property, value) => {
    if (hasSubmitted) return;
    setSelections(prev => {
      const next = { ...prev, [property]: value };
      // Auto-compute Bijective if both Inj and Surj are selected
      if (property !== 'bijective' && next.injective !== null && next.surjective !== null) {
        next.bijective = next.injective && next.surjective;
      }
      return next;
    });
  };

  const checkAnswer = () => {
    if (selections.injective === null || selections.surjective === null || selections.bijective === null) {
      return; // Force all to be answered
    }
    setHasSubmitted(true);
  };

  const nextProblem = () => {
    setHasSubmitted(false);
    setSelections({ injective: null, surjective: null, bijective: null });
    setCurrentIdx((prev) => (prev + 1) % problems.length);
  };

  const isCorrect = 
    selections.injective === problem.isInjective &&
    selections.surjective === problem.isSurjective &&
    selections.bijective === (problem.isInjective && problem.isSurjective);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8">
        
        {/* Left Col: Problem Description & Plot */}
        <div className="flex-1 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-400 tracking-wider uppercase">Problem {currentIdx + 1} of {problems.length}</span>
              <span className={`text-sm px-3 py-1 rounded-full font-semibold ${level === 2 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                {level === 2 ? 'Intermediate' : 'Difficult'}
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-800 font-serif tracking-tight">{problem.funcText}</h3>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Domain:</span>
              <span className="font-mono text-slate-800">{problem.domain}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Codomain:</span>
              <span className="font-mono text-slate-800">{problem.codomain}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 mt-2 flex items-center justify-between">
               <span className="text-slate-500 font-medium">Mapping:</span>
               <span className="font-mono font-bold text-blue-600">{problem.mathNotation}</span>
            </div>
          </div>

          {level === 2 && problem.plotFn && (
            <div>
              <p className="text-sm text-slate-500 mb-2 font-medium">Graph Visual (x, y axes):</p>
              <FunctionPlotter func={problem.plotFn} />
            </div>
          )}
          
          {level === 3 && (
            <div className="flex items-center justify-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
               <p className="text-slate-500 text-center italic">No graph provided at this level.<br/>Analyze the mathematical properties conceptually.</p>
            </div>
          )}
        </div>

        {/* Right Col: Interactive Quiz */}
        <div className="flex-1 flex flex-col">
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex-1 flex flex-col justify-between">
            
            <div className="space-y-6">
              <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-2">Classify this function:</h4>
              
              {/* Question Toggles */}
              {[
                { key: 'injective', label: '1. Is it Injective (1-1)?' },
                { key: 'surjective', label: '2. Is it Surjective (Onto)?' },
                { key: 'bijective', label: '3. Is it Bijective?' },
              ].map((q) => (
                <div key={q.key} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                  <span className="font-medium text-slate-700">{q.label}</span>
                  <div className="flex gap-2">
                    <button 
                      disabled={hasSubmitted}
                      onClick={() => handleSelect(q.key, true)}
                      className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                        selections[q.key] === true 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      } ${hasSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Yes
                    </button>
                    <button 
                      disabled={hasSubmitted}
                      onClick={() => handleSelect(q.key, false)}
                      className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                        selections[q.key] === false 
                          ? 'bg-slate-800 text-white shadow-md' 
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      } ${hasSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      No
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions & Feedback */}
            <div className="mt-8 space-y-4">
              {!hasSubmitted ? (
                <button 
                  onClick={checkAnswer}
                  disabled={selections.injective === null || selections.surjective === null || selections.bijective === null}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Check Answers
                </button>
              ) : (
                <div className="animate-fade-in space-y-4">
                  <div className={`p-4 rounded-xl flex items-start gap-3 border ${
                    isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    {isCorrect ? <CheckCircle2 className="text-green-600 w-6 h-6 flex-shrink-0" /> : <XCircle className="text-red-600 w-6 h-6 flex-shrink-0" />}
                    <div>
                      <h5 className={`font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                        {isCorrect ? 'Excellent!' : 'Not quite right.'}
                      </h5>
                      <p className={`text-sm mt-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        {problem.explanation}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={nextProblem}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    Next Problem <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentLevel, setCurrentLevel] = useState(1);

  const levels = [
    { id: 1, title: 'Basic', icon: BookOpen, desc: 'Definitions & Visuals' },
    { id: 2, title: 'Intermediate', icon: Activity, desc: 'Graphs & Classification' },
    { id: 3, title: 'Difficult', icon: Brain, desc: 'Abstract Classification' }
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans selection:bg-blue-200 selection:text-blue-900 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="font-extrabold text-xl tracking-tight text-slate-800">
              MathInteract <span className="text-blue-600 font-black">Functions</span>
            </h1>
          </div>
          <div className="text-sm font-medium text-slate-500 hidden sm:block">
            Injective, Surjective & Bijective Mapping
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        {/* Navigation / Level Selector */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {levels.map((lvl) => {
            const Icon = lvl.icon;
            const isActive = currentLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => setCurrentLevel(lvl.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all border ${
                  isActive 
                    ? 'bg-white border-blue-600 shadow-md ring-1 ring-blue-600 translate-y-[-2px]' 
                    : 'bg-slate-50 border-slate-200 hover:bg-white hover:shadow-sm hover:border-slate-300'
                }`}
              >
                <div className={`${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className={`font-bold ${isActive ? 'text-blue-900' : 'text-slate-600'}`}>
                    Level {lvl.id}: {lvl.title}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {lvl.desc}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Dynamic Content Area */}
        <div className="transition-all duration-300 ease-in-out">
          {currentLevel === 1 && <Level1Theory />}
          {currentLevel === 2 && <QuizEngine level={2} problems={problemsLevel2} />}
          {currentLevel === 3 && <QuizEngine level={3} problems={problemsLevel3} />}
        </div>
      </main>

      {/* Global Styles for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to { stroke-dashoffset: -8; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}} />
    </div>
  );
}
