import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Neuron } from '../types';
import { Play, Pause, RefreshCw, Zap, Brain } from 'lucide-react';

const GRID_SIZE = 40; // 40x40 = 1600 neurons
const CANVAS_SIZE = 600;

const Chapter12_Minds: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [consciousnessLevel, setConsciousnessLevel] = useState(0);
    
    // Simulation State (Ref for performance)
    const neuronsRef = useRef<Neuron[]>([]);
    
    // Init Grid
    useEffect(() => {
        initializeNetwork();
    }, []);

    const initializeNetwork = () => {
        const neurons: Neuron[] = [];
        const cellSize = CANVAS_SIZE / GRID_SIZE;
        
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                neurons.push({
                    id: y * GRID_SIZE + x,
                    x: x * cellSize + cellSize/2,
                    y: y * cellSize + cellSize/2,
                    activation: 0,
                    threshold: 0.6 + Math.random() * 0.4, // Random threshold
                    connections: [],
                    lastFired: 0
                });
            }
        }

        // Wire up connections (Small world network: neighbors + random long range)
        neurons.forEach(n => {
            // Neighbors (Moore neighborhood)
            for(let dy = -1; dy <= 1; dy++) {
                for(let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    const nid = n.id + dy * GRID_SIZE + dx;
                    // Boundary checks
                    if (nid >= 0 && nid < neurons.length && Math.abs((nid % GRID_SIZE) - (n.id % GRID_SIZE)) <= 1) {
                         if (Math.random() > 0.5) n.connections.push(nid);
                    }
                }
            }

            // Random long range connections (creates complexity/small-world property)
            if (Math.random() > 0.97) {
                const randomId = Math.floor(Math.random() * neurons.length);
                n.connections.push(randomId);
            }
        });

        neuronsRef.current = neurons;
        draw();
    };

    // Main Loop
    useEffect(() => {
        let animationId: number;

        const loop = () => {
            if (isPlaying) {
                updateNetwork();
            }
            draw();
            animationId = requestAnimationFrame(loop);
        };

        loop();
        return () => cancelAnimationFrame(animationId);
    }, [isPlaying]);

    const updateNetwork = () => {
        const neurons = neuronsRef.current;
        const activations = new Float32Array(neurons.length);
        let activeCount = 0;
        let complexEvents = 0;

        // 1. Calculate input for next frame
        for (let i = 0; i < neurons.length; i++) {
            const n = neurons[i];
            if (n.activation > n.threshold) {
                // Fire!
                for (let j = 0; j < n.connections.length; j++) {
                    activations[n.connections[j]] += 0.25;
                }
                n.lastFired = Date.now();
                activeCount++;
                
                // Check for "thoughts" (clusters)
                if (n.connections.length > 4) complexEvents++;
            }
            // Decay current activation
            activations[i] += n.activation * 0.85; // Decay factor
        }

        // 2. Apply updates
        for (let i = 0; i < neurons.length; i++) {
            // Soft sigmoid cap
            neurons[i].activation = Math.min(activations[i], 1.5); 
        }

        // 3. Emergence Metric
        // Combination of total activity and "density" of activity
        const rawMetric = (activeCount / neurons.length) * 100 + (complexEvents / 10);
        setConsciousnessLevel(prev => prev * 0.95 + Math.min(rawMetric, 100) * 0.05);
    };

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear with trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        const neurons = neuronsRef.current;

        // Draw Synapses (only active ones for perf)
        ctx.lineWidth = 0.5;
        ctx.globalCompositeOperation = 'screen';
        
        // Batch drawing for performance
        ctx.beginPath();
        ctx.strokeStyle = '#8B5CF6';
        for (let i = 0; i < neurons.length; i++) {
            const n = neurons[i];
            if (n.activation > 0.5) {
                for (let j = 0; j < n.connections.length; j++) {
                     // Only draw if target is also somewhat active (Hebbian-ish viz)
                     if (neurons[n.connections[j]].activation > 0.1) {
                        const target = neurons[n.connections[j]];
                        ctx.moveTo(n.x, n.y);
                        ctx.lineTo(target.x, target.y);
                     }
                }
            }
        }
        ctx.stroke();

        // Draw Neurons
        for (let i = 0; i < neurons.length; i++) {
            const n = neurons[i];
            const val = n.activation;
            if (val > 0.1) {
                const size = Math.min(val * 3, 6);
                ctx.beginPath();
                ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
                
                if (val > n.threshold) {
                    ctx.fillStyle = '#FFF'; // Firing
                } else {
                    ctx.fillStyle = `rgba(139, 92, 246, ${val})`; // Potential
                }
                ctx.fill();
            }
        }
        ctx.globalCompositeOperation = 'source-over';
    };

    const handleCanvasClick = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        // Calculate scale for responsive canvas
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // Stimulate neurons near click (Blast radius)
        neuronsRef.current.forEach(n => {
            const dx = n.x - x;
            const dy = n.y - y;
            if (dx * dx + dy * dy < 4000) { 
                n.activation = 2.0; // Force fire
            }
        });
        
        if (!isPlaying) draw(); // Update immediately if paused
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[600px]">
            <div className="relative flex-1 bg-black rounded-xl overflow-hidden border border-white/10 cursor-crosshair shadow-2xl">
                <canvas
                    ref={canvasRef}
                    width={CANVAS_SIZE}
                    height={CANVAS_SIZE}
                    className="w-full h-full object-contain"
                    onClick={handleCanvasClick}
                    onMouseMove={(e) => { if (e.buttons === 1) handleCanvasClick(e); }}
                />
                <div className="absolute top-4 left-4 pointer-events-none mix-blend-difference">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><Brain size={20}/> Neural Substrate</h3>
                    <p className="text-xs text-gray-300">Click/Drag to inject signal</p>
                </div>
            </div>

            <div className="w-full lg:w-72 flex flex-col gap-6">
                <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                    <h4 className="text-geb-gold font-serif font-bold mb-4">Controls</h4>
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`flex-1 py-3 rounded flex items-center justify-center gap-2 transition-all ${isPlaying ? 'bg-red-500/20 text-red-200 hover:bg-red-500/30' : 'bg-geb-purple hover:bg-geb-purple/80 text-white'}`}
                        >
                            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                            {isPlaying ? "Pause" : "Simulate"}
                        </button>
                        <button
                            onClick={() => { 
                                neuronsRef.current.forEach(n => n.activation = 0); 
                                setConsciousnessLevel(0); 
                                draw(); 
                            }}
                            className="p-3 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        A simplified cortical model. Meaning emerges not from individual nodes ("neurons"), but from the 
                        <span className="text-white font-bold"> strange loops</span> of feedback between them.
                    </p>
                </div>

                <div className="bg-gradient-to-b from-gray-900 to-geb-purple/10 p-6 rounded-xl border border-geb-purple/30 flex-1 flex flex-col justify-end relative overflow-hidden">
                    {/* Background pulse */}
                    <motion.div 
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-geb-purple/10 pointer-events-none"
                    />
                    
                    <div className="text-center mb-4 relative z-10">
                        <Zap className={`mx-auto mb-2 ${consciousnessLevel > 60 ? 'text-geb-gold animate-pulse' : 'text-gray-600'}`} size={32} />
                        <div className="text-xs text-gray-400 uppercase tracking-widest font-mono">System Coherence</div>
                    </div>
                    
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700 mb-2 relative z-10">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-gold"
                            animate={{ width: `${Math.min(consciousnessLevel, 100)}%` }}
                            transition={{ type: "spring", stiffness: 100 }}
                        />
                    </div>
                    <div className="text-center font-mono text-xl font-bold relative z-10">
                        {Math.floor(consciousnessLevel)}%
                    </div>
                    
                    <AnimatePresence>
                    {consciousnessLevel > 80 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-4 text-center text-geb-gold font-serif italic text-sm relative z-10"
                        >
                            "I am a strange loop."
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Chapter12_Minds;