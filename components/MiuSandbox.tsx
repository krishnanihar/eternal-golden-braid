import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Share2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MIUNode } from '../types';

const MiuSandbox: React.FC = () => {
  const [str, setStr] = useState('MI');
  const [history, setHistory] = useState<string[]>([]);
  const [nodes, setNodes] = useState<MIUNode[]>([{ id: 'MI', value: 'MI', parent: null, depth: 0 }]);
  const [showProof, setShowProof] = useState(false);
  
  // Derived state for I-count analysis
  const iCount = (str.match(/I/g) || []).length;

  // Graph Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Rules ---
  const applyRule = (newStr: string) => {
    if (newStr.length > 30) return; // Soft limit to prevent UI explosion
    
    setHistory([...history, str]);
    setStr(newStr);
    
    // Add to graph nodes if unique path
    if (!nodes.find(n => n.value === newStr)) {
        setNodes(prev => [...prev, { 
            id: newStr, 
            value: newStr, 
            parent: str, 
            depth: (nodes.find(n => n.value === str)?.depth || 0) + 1 
        }]);
    }
  };

  const reset = () => {
    setStr('MI');
    setHistory([]);
    setNodes([{ id: 'MI', value: 'MI', parent: null, depth: 0 }]);
    setShowProof(false);
  };

  // --- Graph Visualization (Force Layout Engine) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    
    // Initialize positions if new nodes added
    const graphNodes = nodes.map(n => ({
        ...n,
        x: n.x || Math.random() * canvas.width,
        y: n.y || Math.random() * canvas.height,
        vx: n.vx || 0,
        vy: n.vy || 0
    }));

    const draw = () => {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Physics simulation steps
        graphNodes.forEach((node, i) => {
            // 1. Coulomb Repulsion (push away from others)
            graphNodes.forEach((other, j) => {
                if (i === j) return;
                const dx = node.x! - other.x!;
                const dy = node.y! - other.y!;
                const distSq = dx * dx + dy * dy || 1;
                const force = 3000 / distSq; 
                const dist = Math.sqrt(distSq);
                node.vx! += (dx / dist) * force;
                node.vy! += (dy / dist) * force;
            });

            // 2. Hooke's Law (attraction to parent)
            if (node.parent) {
                const parent = graphNodes.find(n => n.value === node.parent);
                if (parent) {
                    const dx = parent.x! - node.x!;
                    const dy = parent.y! - node.y!;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    const force = dist * 0.05; // Spring constant
                    node.vx! += (dx / dist) * force;
                    node.vy! += (dy / dist) * force;
                }
            }

            // 3. Center Gravity (keep it on screen)
            const dx = canvas.width / 2 - node.x!;
            const dy = canvas.height / 2 - node.y!;
            node.vx! += dx * 0.01;
            node.vy! += dy * 0.01;

            // 4. Damping (friction)
            node.vx! *= 0.85;
            node.vy! *= 0.85;
            
            // Apply velocity
            node.x! += node.vx!;
            node.y! += node.vy!;
        });

        // Draw Edges
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        graphNodes.forEach(node => {
            if (node.parent) {
                const parent = graphNodes.find(n => n.value === node.parent);
                if (parent) {
                    ctx.moveTo(node.x!, node.y!);
                    ctx.lineTo(parent.x!, parent.y!);
                }
            }
        });
        ctx.stroke();

        // Draw Nodes
        graphNodes.forEach(node => {
            const isCurrent = node.value === str;
            const isRoot = node.value === 'MI';
            const isTarget = node.value === 'MU'; // (Though impossible)
            
            ctx.beginPath();
            const size = isCurrent ? 8 : (node.value.length < 4 ? 5 : 3);
            ctx.arc(node.x!, node.y!, size, 0, Math.PI * 2);
            
            if (isCurrent) ctx.fillStyle = '#FCD34D'; // Gold
            else if (isRoot) ctx.fillStyle = '#8B5CF6'; // Purple
            else ctx.fillStyle = '#4B5563'; // Gray
            
            ctx.fill();
            
            // Draw Label
            if (isCurrent || isRoot || node.depth < 3) {
                ctx.fillStyle = '#E5E7EB';
                ctx.font = '10px monospace';
                ctx.fillText(node.value.length > 8 ? node.value.slice(0,6)+'..' : node.value, node.x! + 10, node.y! + 3);
            }
        });

        animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [nodes, str]); // Re-run effect partially if nodes/str change to update refs, but logic handles updates.

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4 h-full">
      {/* Left: Controls */}
      <div className="space-y-6 flex flex-col">
        <div className="bg-black/40 p-6 rounded-xl border border-geb-purple/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-20 text-6xl font-black font-serif text-geb-gold select-none">MIU</div>
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl text-geb-gold font-bold font-serif">Formal System</h3>
            <button onClick={reset} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
              <RotateCcw size={14} /> Reset System
            </button>
          </div>

          <div className="text-center py-8 mb-6 bg-black/50 rounded-lg border border-white/5 relative">
             <AnimatePresence mode="wait">
                <motion.div
                    key={str}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-3xl md:text-5xl font-mono tracking-widest text-white break-all px-4"
                >
                    {str}
                </motion.div>
             </AnimatePresence>
             <div className="mt-4 flex justify-center gap-4 text-xs font-mono text-gray-500">
                <span className="bg-white/5 px-2 py-1 rounded">LENGTH: {str.length}</span>
                <span className={`bg-white/5 px-2 py-1 rounded ${iCount % 3 === 0 ? 'text-red-400' : ''}`}>I-COUNT: {iCount} (mod 3 = {iCount % 3})</span>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <RuleButton 
                rule="I. xI → xIU" 
                desc="Add U to string ending in I"
                active={str.endsWith('I')}
                onClick={() => applyRule(str + 'U')}
            />
            <RuleButton 
                rule="II. Mx → Mxx" 
                desc="Double string after M"
                active={str.startsWith('M')}
                onClick={() => applyRule('M' + str.slice(1) + str.slice(1))}
            />
            <RuleButton 
                rule="III. xIIIy → xUy" 
                desc="Replace III with U"
                active={str.includes('III')}
                onClick={() => applyRule(str.replace('III', 'U'))}
            />
            <RuleButton 
                rule="IV. xUUy → xy" 
                desc="Drop UU"
                active={str.includes('UU')}
                onClick={() => applyRule(str.replace('UU', ''))}
            />
          </div>
        </div>

        <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg mt-auto">
            <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-400 shrink-0 mt-1" size={20} />
                <div className="flex-1">
                    <h4 className="text-red-200 font-bold text-sm mb-1">Goal: Produce "MU"</h4>
                    <p className="text-red-200/60 text-xs">
                        Is it possible to eliminate all 'I's starting from 'MI'?
                    </p>
                </div>
                <button 
                    onClick={() => setShowProof(!showProof)}
                    className="ml-auto text-xs bg-red-500/20 hover:bg-red-500/40 text-red-200 px-3 py-1 rounded transition-colors border border-red-500/20"
                >
                    {showProof ? "Hide Proof" : "Why impossible?"}
                </button>
            </div>
            
            <AnimatePresence>
                {showProof && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-black/60 p-4 rounded border-l-2 border-geb-gold font-mono text-sm text-gray-300">
                            <p className="mb-2 text-geb-gold font-bold uppercase">Invariant Property Proof:</p>
                            <ul className="space-y-2 list-disc pl-4 text-xs">
                                <li>Let <span className="text-white">N</span> be the number of 'I's. Start: <span className="text-white">N = 1</span> (MI).</li>
                                <li><span className="text-white">N mod 3</span> is currently 1.</li>
                                <li>Rule I & IV don't change N.</li>
                                <li>Rule II (Double): <span className="text-white">N → 2N</span>. If N%3=1, 2N%3=2. If N%3=2, 2N%3=1. (Never becomes 0).</li>
                                <li>Rule III (III→U): <span className="text-white">N → N-3</span>. This preserves N mod 3.</li>
                                <li className="text-red-300 font-bold pt-1">Conclusion: N mod 3 can never be 0. MU requires N=0. Thus, MU is unreachable.</li>
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>

      {/* Right: Visualization */}
      <div className="bg-black/20 rounded-xl border border-white/10 p-1 flex flex-col min-h-[500px] lg:min-h-0">
        <div className="p-3 flex justify-between items-center border-b border-white/5 bg-white/5 rounded-t-lg">
             <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Share2 size={12} /> Derivation Space
            </h4>
            <div className="flex gap-2 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-geb-gold"></span> Current</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-geb-purple"></span> Root</span>
            </div>
        </div>
       
        <canvas 
            ref={canvasRef} 
            width={600} 
            height={600}
            className="w-full flex-1 rounded-b-lg bg-black/40 cursor-move"
        />
      </div>
    </div>
  );
};

const RuleButton: React.FC<{ rule: string; desc: string; active: boolean; onClick: () => void }> = ({ rule, desc, active, onClick }) => (
    <button 
        onClick={onClick}
        disabled={!active}
        className={`
            w-full p-3 rounded flex items-center justify-between group transition-all duration-300
            ${active 
                ? 'bg-white/5 hover:bg-geb-purple/20 border border-white/10 hover:border-geb-purple/50 text-gray-200' 
                : 'opacity-40 cursor-not-allowed border border-transparent text-gray-600'}
        `}
    >
        <span className="font-mono font-bold">{rule}</span>
        <span className={`text-xs ${active ? 'text-gray-400 group-hover:text-gray-300' : ''}`}>{desc}</span>
    </button>
);

export default MiuSandbox;
