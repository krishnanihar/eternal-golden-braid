import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Activity } from 'lucide-react';

const Chapter20_Braid: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
    
    // Refs for cleanup
    const oscillatorsRef = useRef<any[]>([]);
    const animationRef = useRef<number>(0);

    // --- Audio System (Procedural Canon) ---
    useEffect(() => {
        if (!isMuted && !audioCtx) {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            setAudioCtx(ctx);
            startCanon(ctx);
        } else if (isMuted && audioCtx) {
            stopAudio();
        }
        return () => stopAudio();
    }, [isMuted]);

    const stopAudio = () => {
        oscillatorsRef.current.forEach(osc => {
            try { osc.stop(); osc.disconnect(); } catch (e) {}
        });
        oscillatorsRef.current = [];
        if (audioCtx) {
            audioCtx.close();
            setAudioCtx(null);
        }
    };

    const startCanon = (ctx: AudioContext) => {
        // Simple procedural melody (C minor harmonic)
        const scale = [261.63, 293.66, 311.13, 349.23, 392.00, 415.30, 493.88, 523.25]; 
        const melodyPattern = [0, 2, 3, 4, 7, 4, 3, 2, 0, -1, 0, 4, 7, 8, 7, 4]; // Indices
        
        const playVoice = (delay: number, transpose: number, pan: number) => {
            const gainNode = ctx.createGain();
            const panner = ctx.createStereoPanner();
            panner.pan.value = pan;
            
            gainNode.connect(panner);
            panner.connect(ctx.destination);
            gainNode.gain.value = 0.1; // Low volume

            const tempo = 0.25; // Seconds per note
            
            // Create an oscillator for each note in the infinite loop
            // In a real app we'd use a scheduler, here we just schedule a chunk
            const now = ctx.currentTime + delay;
            
            for(let i = 0; i < 32; i++) { // Play 32 notes
                const noteIndex = melodyPattern[i % melodyPattern.length];
                if (noteIndex === -1) continue; // Rest
                
                const osc = ctx.createOscillator();
                osc.type = transpose === 0 ? 'triangle' : 'sine';
                
                // Calculate freq based on scale index + octave offset
                const baseFreq = scale[noteIndex % scale.length];
                const octaveMultiplier = noteIndex >= scale.length ? 2 : 1;
                osc.frequency.value = baseFreq * octaveMultiplier * (transpose > 0 ? 1.5 : 1); // Simple harmony

                osc.connect(gainNode);
                osc.start(now + i * tempo);
                osc.stop(now + i * tempo + tempo * 0.9); // Staccato
                
                oscillatorsRef.current.push(osc);
            }
        };

        // Three voices entering sequentially (Fugue structure)
        playVoice(0, 0, 0);        // Subject (Center)
        setTimeout(() => { if(ctx.state === 'running') playVoice(0, 1, -0.5); }, 4000); // Answer (Left, transposed)
        setTimeout(() => { if(ctx.state === 'running') playVoice(0, 0, 0.5); }, 8000);  // Counter-Subject (Right)
    };

    // --- Visual System (3D Helix) ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let t = 0;

        const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            
            t += 0.005; // Rotation speed

            // Draw three strands
            const colors = ['#FCD34D', '#8B5CF6', '#3B82F6']; // Gold, Purple, Blue

            for (let i = 0; i < 3; i++) {
                const phase = (i * Math.PI * 2) / 3;
                
                ctx.beginPath();
                ctx.lineWidth = 3;
                ctx.strokeStyle = colors[i];
                
                // Draw segment by segment for depth
                let first = true;
                for (let y = -300; y < 300; y += 5) {
                    const angle = (y * 0.01) + t + phase;
                    const r = 80 + Math.sin(t * 0.5 + y * 0.01) * 20; // Breathing radius
                    
                    const x3d = Math.cos(angle) * r;
                    const z3d = Math.sin(angle) * r;
                    
                    // Perspective Projection
                    const perspective = 400;
                    const scale = perspective / (perspective + z3d);
                    const x2d = cx + x3d * scale;
                    const y2d = cy + y * scale * 0.8; // Compress height

                    // Depth opacity
                    ctx.globalAlpha = Math.max(0.2, scale * 0.8); // Fade back items

                    if (first) {
                        ctx.moveTo(x2d, y2d);
                        first = false;
                    } else {
                        ctx.lineTo(x2d, y2d);
                    }
                }
                ctx.stroke();
            }
            
            // Center Glow
            const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 200);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationRef.current);
    }, []);

    return (
        <div className="relative h-[60vh] bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl group">
            <canvas 
                ref={canvasRef} 
                width={800} 
                height={600} 
                className="w-full h-full object-cover"
            />
            
            <div className="absolute top-0 left-0 p-8 z-10 bg-gradient-to-br from-black/80 to-transparent w-full">
                <h2 className="text-3xl font-serif font-bold text-white drop-shadow-lg flex items-center gap-3">
                    The Eternal Golden Braid <Activity className="text-geb-gold animate-pulse" size={24}/>
                </h2>
                <p className="text-gray-300 text-sm mt-2 max-w-md drop-shadow-md font-mono leading-relaxed">
                    The visual braid mirrors the musical canon, which mirrors the logical hierarchy. 
                    Enable audio to hear the isomorphism.
                </p>
            </div>

            <div className="absolute bottom-8 right-8 z-20">
                <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className={`
                        flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-md transition-all border
                        ${!isMuted 
                            ? 'bg-geb-purple/20 border-geb-purple text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]' 
                            : 'bg-white/10 border-white/20 text-gray-400 hover:bg-white/20'}
                    `}
                >
                    {isMuted ? (
                        <>
                            <VolumeX size={20} /> <span>Enable Audio</span>
                        </>
                    ) : (
                        <>
                            <Volume2 size={20} className="text-geb-gold animate-pulse" /> <span>Playing Canon...</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Chapter20_Braid;
