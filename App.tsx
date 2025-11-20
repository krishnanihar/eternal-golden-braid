import React, { useState, useRef, useEffect } from 'react';
import { CHAPTERS } from './constants';
import { Chapter } from './types';
import ParticleBackground from './components/ParticleBackground';
import HeroSection from './components/HeroSection';
import ChapterCard from './components/ChapterCard';
import Modal from './components/Modal';
import MiuSandbox from './components/MiuSandbox';
import { motion } from 'framer-motion';

function App() {
  const [visitedChapters, setVisitedChapters] = useState<Set<number>>(new Set());
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Scroll State
  const [scrollY, setScrollY] = useState(0);
  const [loopCounter, setLoopCounter] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollY(y);
      
      // "Strange Loop Counter" - increments with scroll, resets at bottom
      const progress = y / max;
      const loops = Math.floor(progress * 10); // Just a visual number
      if (progress > 0.99) {
        setLoopCounter(0); // Reset at bottom
      } else {
        setLoopCounter(loops);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChapterClick = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setVisitedChapters(prev => {
      const next = new Set(prev);
      next.add(chapter.id);
      return next;
    });
  };

  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Easter Egg: Have all chapters been visited?
  const allVisited = visitedChapters.size === CHAPTERS.length;

  return (
    <div className="min-h-screen text-white selection:bg-geb-purple selection:text-white font-sans">
      <ParticleBackground />

      {/* Strange Loop Counter Fixed Element */}
      <div className="fixed bottom-4 right-4 z-40 font-mono text-xs text-gray-600 mix-blend-difference pointer-events-none">
        LOOP_DEPTH: {loopCounter}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <HeroSection onScrollRequest={scrollToGrid} easterEggActive={allVisited} />

        <div ref={gridRef} className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">The Golden Braid</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Select a strand to begin. The structure of this grid mirrors the structure of the book, 
              which mirrors the structure of a Bach fugue.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CHAPTERS.map(chapter => (
              <ChapterCard 
                key={chapter.id} 
                chapter={chapter} 
                onClick={handleChapterClick}
                isVisited={visitedChapters.has(chapter.id)}
              />
            ))}
          </div>
        </div>

        <footer className="py-12 text-center text-gray-600 font-mono text-sm border-t border-white/5 mt-12">
          <p>Recursive self-reference is the essence of consciousness.</p>
          <p className="mt-2 opacity-50">
            Visited: {visitedChapters.size} / {CHAPTERS.length}
          </p>
        </footer>
      </div>

      {/* Modal System */}
      <Modal
        isOpen={!!selectedChapter}
        onClose={() => setSelectedChapter(null)}
        title={selectedChapter?.title || ''}
      >
        <div className="space-y-6">
          <p className="text-lg text-gray-200 italic font-serif border-l-4 border-geb-purple pl-4">
            "{selectedChapter?.description}"
          </p>
          
          <div className="bg-black/40 p-6 rounded-lg border border-white/10">
            <h4 className="text-geb-gold font-mono uppercase text-sm mb-4">Interactive Module: Under Construction</h4>
            <p className="mb-4">
              This chapter is currently being compiled from the ether. 
              The strange loop required to generate this content is still iterating.
            </p>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-full bg-geb-purple"
              />
            </div>
          </div>

          {/* Special Interactive Element for Chapter 1 */}
          {selectedChapter?.id === 1 && <MiuSandbox />}

          {/* Content hint based on Part */}
          <div className="text-sm text-gray-500 font-mono mt-8">
            Part {selectedChapter?.part} // Visual Type: {selectedChapter?.visualType}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;