import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Calculator, Terminal, RotateCcw } from 'lucide-react';
import { TNTSymbol } from '../types';

// --- Constants & Setup ---
const SYMBOLS = [
    { char: '0', type: 'number', val: 666 },
    { char: 'S', type: 'operator', val: 123 },
    { char: '=', type: 'operator', val: 112 },
    { char: '+', type: 'operator', val: 232 },
    { char: '*', type: 'operator', val: 322 },
    { char: '(', type: 'punctuation', val: 362 },
    { char: ')', type: 'punctuation', val: 326 },
    { char: 'a', type: 'variable', val: 262 },
    { char: 'b', type: 'variable', val: 263 },
    { char: 'c', type: 'variable', val: 264 },
    { char: '∀', type: 'quantifier', val: 622 },
    { char: '∃', type: 'quantifier', val: 633 },
    { char: '~', type: 'operator', val: 223 },
    { char: '∧', type: 'operator', val: 161 },
    { char: '∨', type: 'operator', val: 162 },
    { char: '⊃', type: 'operator', val: 636 },
];

// Simplified Primes for Visualization
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

const Chapter8_TNT: React.FC = () => {
    const [tape, setTape] = useState<TNTSymbol[]>([]);
    const [godelNumber, setGodelNumber] = useState<string>("0");
    const [validity, setValidity] = useState<'valid' | 'invalid' | 'unknown'>('unknown');
    const [interpretation, setInterpretation] = useState<string>("");

    // Add symbol to tape
    const addSymbol = (s: typeof SYMBOLS[0]) => {
        setTape([...tape, { ...s, type: s.type as any }]);
    };

    const backspace = () => setTape(tape.slice(0, -1));
    const clear = () => setTape([]);

    // Interpretation & Encoding Logic
    useEffect(() => {
        if (tape.length === 0) {
            setGodelNumber("0");
            setValidity('unknown');
            setInterpretation("");
            return;
        }

        // 1. Interpretation
        const str = tape.map(s => s.char).join('');
        
        // Simple heuristic translator
        let interp = str
            .replace(/S0/g, "1")
            .replace(/SS0/g, "2")
            .replace(/SSS0/g, "3")
            .replace(/SSSS0/g, "4")
            .replace(/∀/g, "for all ")
            .replace(/∃/g, "there exists ")
            .replace(/~/g, "it is not true that ")
            .replace(/∧/g, " and ")
            .replace(/∨/g, " or ")
            .replace(/⊃/g, " implies ")
            .replace(/=/g, " equals ");
        
        setInterpretation(interp);

        // 2. Validity Check (Very simplified WFF check)
        let isValid = true;
        // Can't start with + or * or )
        if (['+', '*', ')', '='].includes(tape[0].char)) isValid = false;
        // Parentheses matching
        let pCount = 0;
        tape.forEach(s => {
            if (s.char === '(') pCount++;
            if (s.char === ')') pCount--;
        });
        if (pCount !== 0) isValid = false;

        setValidity(isValid ? 'valid' : 'invalid');

        // 3. Gödel Number Visualization
        // Since JS can't handle 2^112 * 3^232..., we visualize the factors
        const factors = tape.map((sym, i) => {
            const prime = PRIMES[i] || `P${i}`;
            return `<span class="text-geb-gold">${prime}</span><sup class="text-geb-purple">${sym.val}</sup>`;
        }).join(' × ');

        setGodelNumber(factors);

    }, [tape]);

    return (
        <div className="flex flex-col h-full max-h-[80vh] font-mono text-sm">
            {/* Tape Display (The "Typographical" part) */}
            <div className="bg-black/50 p-6 rounded-xl border border-geb-purple/30 min-h-[120px] flex items-center flex-wrap gap-2 mb-6 relative overflow-hidden shadow-inner">
                <div className="absolute top-2 right-3 text-[10px] text-gray-600 font-bold uppercase tracking-widest">Statement Tape</div>
                
                {tape.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                        <p>Select symbols to construct a formula...</p>
                    </div>
                )}
                
                <AnimatePresence>
                    {tape.map((sym, i) => (
                        <motion.div 
                            layout
                            initial={{ scale: 0, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0, opacity: 0 }}
                            key={`${i}-${sym.char}`} 
                            className={`
                                relative min-w-[32px] h-10 flex flex-col items-center justify-center rounded border border-b-4
                                ${sym.type === 'number' ? 'bg-blue-900/20 border-blue-500/30 text-blue-200' : ''}
                                ${sym.type === 'operator' ? 'bg-purple-900/20 border-purple-500/30 text-purple-200' : ''}
                                ${sym.type === 'variable' ? 'bg-green-900/20 border-green-500/30 text-green-200' : ''}
                                ${sym.type === 'quantifier' ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-200' : ''}
                                ${sym.type === 'punctuation' ? 'bg-gray-800/50 border-gray-600 text-gray-300' : ''}
                            `}
                        >
                            <span className="text-lg font-bold leading-none mt-1">{sym.char}</span>
                            <span className="text-[8px] opacity-40 mb-1 font-sans">{sym.val}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Keyboard */}
            <div className="grid grid-cols-8 sm:grid-cols-8 lg:grid-cols-12 gap-2 mb-6 select-none">
                {SYMBOLS.map((s) => (
                    <button
                        key={s.char}
                        onClick={() => addSymbol(s)}
                        className="p-2 bg-white/5 hover:bg-white/10 active:bg-white/20 rounded border border-white/5 hover:border-geb-gold/30 transition-colors flex flex-col items-center justify-center h-12"
                    >
                        <span className="text-base font-bold">{s.char}</span>
                    </button>
                ))}
                <button onClick={backspace} className="col-span-2 bg-red-900/20 hover:bg-red-900/30 border border-red-500/20 text-red-200 rounded">⌫</button>
                <button onClick={clear} className="col-span-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 rounded"><RotateCcw size={14} className="mx-auto"/></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-auto">
                {/* Gödel Number Panel */}
                <div className="bg-black/80 border border-green-500/20 p-4 rounded-lg font-mono text-xs text-green-400 relative overflow-hidden flex flex-col">
                    <div className="flex items-center gap-2 mb-3 text-green-600 border-b border-green-900/30 pb-2">
                        <Calculator size={14} />
                        <span className="font-bold uppercase tracking-wider">Gödelization (Arithmetization)</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <p className="mb-2 text-gray-500">G(Statement) = 2<sup>a</sup> · 3<sup>b</sup> · 5<sup>c</sup> ...</p>
                        <div 
                            className="text-sm leading-relaxed break-words"
                            dangerouslySetInnerHTML={{ __html: godelNumber }} 
                        />
                    </div>
                </div>
                
                {/* Interpretation Panel */}
                <div className="bg-geb-purple/10 border border-geb-purple/20 p-4 rounded-lg flex flex-col">
                    <div className="flex items-center justify-between mb-3 border-b border-geb-purple/20 pb-2">
                         <div className="flex items-center gap-2 text-geb-purple">
                            <Terminal size={14} />
                            <span className="font-bold uppercase tracking-wider">Semantics</span>
                         </div>
                         <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${validity === 'valid' ? 'bg-green-500/20 text-green-400' : validity === 'invalid' ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-400'}`}>
                            {validity} Syntax
                         </div>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center text-center p-2">
                         {interpretation ? (
                             <p className="text-lg text-white font-serif italic">"{interpretation}"</p>
                         ) : (
                             <p className="text-gray-600 italic">Construct a statement to see its meaning...</p>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chapter8_TNT;
