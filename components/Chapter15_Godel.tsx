import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ChevronRight, ChevronLeft, Lock, Unlock, RotateCw } from 'lucide-react';

const STEPS = [
    { id: 1, title: "Isomorphism", desc: "Mapping logic to numbers" },
    { id: 2, title: "Diagonalization", desc: "Self-referencing the system" },
    { id: 3, title: "The Paradox", desc: "Constructing Statement G" },
    { id: 4, title: "Incompleteness", desc: "The limits of truth" }
];

const Chapter15_Godel: React.FC = () => {
    const [step, setStep] = useState(1);

    return (
        <div className="max-w-5xl mx-auto py-4 px-4 h-full flex flex-col">
            {/* Progress Stepper */}
            <div className="flex justify-between mb-8 relative px-10">
                <div className="absolute top-1/2 left-10 right-10 h-1 bg-gray-800 -z-10 transform -translate-y-1/2" />
                {STEPS.map((s) => (
                    <button 
                        key={s.id}
                        onClick={() => setStep(s.id)}
                        className={`flex flex-col items-center gap-2 transition-colors relative bg-geb-dark px-2 z-10 group`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all duration-300 ${step === s.id ? 'border-geb-gold bg-geb-gold text-black scale-110 shadow-[0_0_15px_rgba(252,211,77,0.5)]' : step > s.id ? 'border-geb-purple bg-geb-purple text-white' : 'border-gray-700 bg-gray-900 text-gray-500'}`}>
                            {s.id}
                        </div>
                        <span className={`text-xs font-mono hidden md:block absolute top-12 w-32 text-center ${step === s.id ? 'text-geb-gold' : 'text-gray-600'}`}>{s.title}</span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 relative mt-8 bg-white/5 rounded-2xl border border-white/10 p-8 overflow-hidden shadow-2xl">
                <AnimatePresence mode="wait">
                    {step === 1 && <ActOne key="act1" />}
                    {step === 2 && <ActTwo key="act2" />}
                    {step === 3 && <ActThree key="act3" />}
                    {step === 4 && <ActFour key="act4" />}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-4 border-t border-white/5">
                <button 
                    disabled={step === 1}
                    onClick={() => setStep(s => s - 1)}
                    className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent flex items-center gap-2 transition-colors text-sm font-mono"
                >
                    <ChevronLeft size={16} /> Previous
                </button>
                <button 
                    disabled={step === 4}
                    onClick={() => setStep(s => s + 1)}
                    className="px-6 py-3 rounded-lg bg-geb-purple hover:bg-geb-purple/80 text-white disabled:opacity-30 disabled:bg-gray-700 flex items-center gap-2 transition-colors text-sm font-mono shadow-lg shadow-geb-purple/20"
                >
                    {step === 4 ? 'Finish' : 'Next Phase'} <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

// --- Sub-components for Stages ---

const ActOne = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 h-full flex flex-col justify-center">
        <div className="text-center">
            <h3 className="text-3xl font-serif font-bold text-geb-gold mb-2">The Isomorphism</h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Mathematical statements are just patterns of symbols. Numbers can encode patterns. 
                Therefore, <span className="text-white">numbers can talk about mathematics</span>.
            </p>
        </div>

        <div className="bg-black/40 p-8 rounded-xl border border-gray-700 flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="text-center group cursor-default">
                <div className="text-2xl font-mono text-blue-300 mb-3 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30 group-hover:scale-105 transition-transform">"0 = 0"</div>
                <div className="text-xs text-gray-500 font-mono uppercase tracking-widest">Formal Logic</div>
            </div>
            
            <div className="flex flex-col items-center gap-2 text-gray-500">
                <span className="text-xs italic">Gödel Numbering</span>
                <ArrowDown className="rotate-0 md:-rotate-90 text-geb-gold animate-pulse" size={32} />
            </div>

            <div className="text-center group cursor-default">
                <div className="text-2xl font-mono text-green-300 mb-3 p-4 bg-green-900/20 rounded-lg border border-green-500/30 group-hover:scale-105 transition-transform break-all max-w-[200px]">243,112...</div>
                <div className="text-xs text-gray-500 font-mono uppercase tracking-widest">Arithmetic</div>
            </div>
        </div>
        
        <div className="text-center text-sm text-gray-500 italic border-t border-white/5 pt-6 max-w-xl mx-auto">
            "By reasoning about the properties of this huge number, we are secretly reasoning about the truth of the statement it encodes."
        </div>
    </motion.div>
);

const ActTwo = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
        <div className="text-center mb-6">
            <h3 className="text-3xl font-serif font-bold text-geb-gold mb-2">The Diagonal Lemma</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
                If we list every possible statement about numbers, we can construct a "diagonal" statement that refers to itself.
            </p>
        </div>
        
        {/* Diagonal Grid Viz */}
        <div className="grid grid-cols-6 gap-2 font-mono text-xs md:text-sm opacity-90 my-4 max-w-2xl mx-auto">
            <div className="col-span-1 text-right pr-4 pt-2 text-gray-500 italic">Number n</div>
            {[1,2,3,4,5].map(n => <div key={n} className="text-center text-gray-600 font-bold bg-gray-900/50 rounded py-2">{n}</div>)}
            
            {[1,2,3,4,5].map(row => (
                <React.Fragment key={row}>
                    <div className="text-gray-400 text-right pr-4 py-3 bg-gray-900/30 rounded-l flex items-center justify-end">Stmt P<sub>{row}</sub>(x)</div>
                    {[1,2,3,4,5].map(col => (
                        <div key={col} className={`
                            border  flex items-center justify-center h-12 rounded relative overflow-hidden transition-all duration-500
                            ${row === col ? 'bg-geb-purple/20 border-geb-purple text-geb-gold font-bold scale-105 z-10 shadow-lg' : 'border-gray-800 text-gray-700'}
                        `}>
                            {row === col ? (
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + row * 0.2 }}>
                                    SUB
                                </motion.span>
                            ) : '-'}
                        </div>
                    ))}
                </React.Fragment>
            ))}
        </div>
        
        <p className="text-sm text-gray-400 text-center bg-black/20 p-4 rounded-lg border border-white/5">
            The highlighted cells represent statements substituted with their own Gödel number. This creates a feedback loop within the system.
        </p>
    </motion.div>
);

const ActThree = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 flex flex-col justify-center h-full">
        <h3 className="text-3xl font-serif font-bold text-geb-gold text-center">Constructing 'G'</h3>
        
        <div className="bg-gradient-to-br from-geb-purple/10 to-black p-10 rounded-2xl border border-geb-purple/50 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute -right-10 -top-10 text-[200px] text-white/5 font-serif font-black select-none pointer-events-none">G</div>
            
            <div className="text-4xl md:text-6xl font-mono font-bold text-white mb-4 tracking-tighter z-10 relative drop-shadow-lg">
                G ≡ ¬Prov(G)
            </div>
            <p className="text-2xl text-geb-gold italic mb-10 z-10 relative font-serif">"This statement cannot be proven."</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left z-10 relative">
                <div className="bg-black/80 p-6 rounded-xl border border-red-500/30 backdrop-blur-sm">
                    <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2 uppercase tracking-wider text-sm"><Lock size={16}/> If G is PROVABLE...</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>Then G must be true (assuming system is consistent).</li>
                        <li>But G says "I am not provable".</li>
                        <li>So G is false.</li>
                        <li className="text-red-400 font-bold pt-2 border-t border-red-500/20 mt-2">CONTRADICTION DETECTED.</li>
                    </ul>
                </div>
                <div className="bg-black/80 p-6 rounded-xl border border-green-500/30 backdrop-blur-sm">
                    <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2 uppercase tracking-wider text-sm"><Unlock size={16}/> If G is UNPROVABLE...</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>Then what G says ("I am unprovable") is correct.</li>
                        <li>Therefore, G is <span className="text-white font-bold">TRUE</span>.</li>
                        <li>It is a truth that lies outside the system's reach.</li>
                        <li className="text-green-400 font-bold pt-2 border-t border-green-500/20 mt-2">SYSTEM IS INCOMPLETE.</li>
                    </ul>
                </div>
            </div>
        </div>
    </motion.div>
);

const ActFour = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center h-full flex flex-col justify-center items-center">
        <h3 className="text-4xl font-serif font-bold text-white mb-2">Incompleteness</h3>
        <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
            We have proven that any sufficiently powerful logical system contains truths it cannot prove.
        </p>
        
        <div className="py-8 flex justify-center relative">
            <div className="relative w-64 h-64">
                {/* Rotating Ring 1 */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                    className="absolute inset-0 border-2 border-dashed border-geb-gold/30 rounded-full"
                />
                 {/* Rotating Ring 2 */}
                 <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, ease: "linear", repeat: Infinity }}
                    className="absolute inset-4 border-2 border-dotted border-geb-purple/30 rounded-full"
                />
                
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-geb-gold to-geb-purple"
                    >
                        ∞
                    </motion.div>
                    <div className="text-xs text-gray-500 mt-4 uppercase tracking-widest font-mono">Strange Loop</div>
                </div>
            </div>
        </div>
        
        <div className="bg-white/5 p-6 rounded-lg border border-white/10 max-w-2xl">
            <p className="text-lg text-gray-300 font-serif italic">
                "Meaning transcends the system that contains it."
            </p>
        </div>
    </motion.div>
);

export default Chapter15_Godel;
