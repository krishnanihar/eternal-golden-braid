import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

const MiuSandbox: React.FC = () => {
  const [str, setStr] = useState('MI');
  const [history, setHistory] = useState<string[]>([]);

  // Rule 1: Add U to the end if string ends in I
  const canApplyRule1 = str.endsWith('I');
  const applyRule1 = () => update(str + 'U');

  // Rule 2: Double string after M (Mx -> Mxx)
  const canApplyRule2 = str.startsWith('M');
  const applyRule2 = () => update('M' + str.slice(1) + str.slice(1));

  // Rule 3: Replace III with U
  const canApplyRule3 = str.includes('III');
  const applyRule3 = () => {
    // For simplicity in this mini-sandbox, we just replace the first occurrence
    update(str.replace('III', 'U'));
  };

  // Rule 4: Drop UU
  const canApplyRule4 = str.includes('UU');
  const applyRule4 = () => {
    update(str.replace('UU', ''));
  };

  const update = (newStr: string) => {
    if (newStr.length > 30) {
      alert("String getting too long! Resetting...");
      reset();
      return;
    }
    setHistory([...history, str]);
    setStr(newStr);
  };

  const reset = () => {
    setStr('MI');
    setHistory([]);
  };

  return (
    <div className="bg-black/30 rounded-lg p-6 border border-geb-purple/30 font-mono my-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg text-geb-gold font-bold">MIU System Sandbox</h3>
        <button onClick={reset} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
          <RotateCcw size={14} /> Reset
        </button>
      </div>
      
      <div className="text-center py-8 text-4xl tracking-widest text-white font-bold break-all">
        {str}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
        <button 
          onClick={applyRule1} 
          disabled={!canApplyRule1}
          className={`p-3 rounded text-sm border transition-all ${canApplyRule1 ? 'border-geb-purple text-white hover:bg-geb-purple/20' : 'border-gray-800 text-gray-600 cursor-not-allowed'}`}
        >
          Rule I: xI → xIU
        </button>
        <button 
          onClick={applyRule2} 
          disabled={!canApplyRule2}
          className={`p-3 rounded text-sm border transition-all ${canApplyRule2 ? 'border-geb-purple text-white hover:bg-geb-purple/20' : 'border-gray-800 text-gray-600 cursor-not-allowed'}`}
        >
          Rule II: Mx → Mxx
        </button>
        <button 
          onClick={applyRule3} 
          disabled={!canApplyRule3}
          className={`p-3 rounded text-sm border transition-all ${canApplyRule3 ? 'border-geb-purple text-white hover:bg-geb-purple/20' : 'border-gray-800 text-gray-600 cursor-not-allowed'}`}
        >
          Rule III: xIIIy → xUy
        </button>
        <button 
          onClick={applyRule4} 
          disabled={!canApplyRule4}
          className={`p-3 rounded text-sm border transition-all ${canApplyRule4 ? 'border-geb-purple text-white hover:bg-geb-purple/20' : 'border-gray-800 text-gray-600 cursor-not-allowed'}`}
        >
          Rule IV: xUUy → xy
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center italic">
        Goal: Produce "MU". (Spoiler: It's impossible inside the system)
      </p>
    </div>
  );
};

export default MiuSandbox;