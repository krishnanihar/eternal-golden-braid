import React, { useState, useRef, useEffect } from 'react';
import { CHAPTERS } from './constants';
import { Chapter } from './types';
import ParticleBackground from './components/ParticleBackground';
import HeroSection from './components/HeroSection';
import ChapterCard from './components/ChapterCard';
import Modal from './components/Modal';
import MiuSandbox from './components/MiuSandbox';
import Chapter8_TNT from './components/Chapter8_TNT';
import Chapter12_Minds from './components/Chapter12_Minds';
import Chapter15_Godel from './components/Chapter15_Godel';
import Chapter20_Braid from './components/Chapter20_Braid';
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
      const loops = Math.floor(progress * 10); 
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

  // --- Router Logic for Modal Content ---
  const renderChapterContent = (chapter: Chapter) => {
    switch(chapter.id) {
      case 1: return <MiuSandbox />;
      case 8: return <Chapter8_TNT />;
      case 12: return <Chapter12_Minds />;
      case 15: return <Chapter15_Godel />;
      case 20: return <Chapter20_Braid />;
      default:
        return (
           <div className="bg-black/40 p-12 rounded-lg border border-white/10 mt-4 text-center min-h-[400px] flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-geb-purple border-t-geb-gold rounded-full animate-spin mb-8"></div>
            <h4 className="text-geb-gold font-mono uppercase text-lg mb-4">Interactive Module Under Construction</h4>
            <p className="mb-4 text-gray-400 max-w-md">
              The meta-program is currently compiling this reality. 
              Please explore the completed chapters (1, 8, 12, 15, 20) for the full experience.
            </p>
          </div>
        );
    }
  };

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
        chapterId={selectedChapter?.id}
      >
        <div className="space-y-8 h-full flex flex-col">
          <div className="bg-white/5 p-4 rounded-lg border-l-4 border-geb-purple">
            <p className="text-lg text-gray-200 italic font-serif">
                "{selectedChapter?.description}"
            </p>
          </div>
          
          {/* Dynamic Content Render */}
          <div className="flex-1 min-h-0">
             {selectedChapter && renderChapterContent(selectedChapter)}
          </div>

          <div className="text-xs text-gray-500 font-mono mt-4 flex justify-between items-center border-t border-white/5 pt-4 shrink-0">
            <span>PART {selectedChapter?.part}</span>
            <span className="uppercase tracking-widest">VISUAL MODE: {selectedChapter?.visualType}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
