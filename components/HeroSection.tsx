import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

interface HeroProps {
  onScrollRequest: () => void;
  easterEggActive: boolean;
}

const HeroSection: React.FC<HeroProps> = ({ onScrollRequest, easterEggActive }) => {
  const names = easterEggActive 
    ? ["Strange Loop", "Consciousness", "Meaning"] 
    : ["Gödel", "Escher", "Bach"];
  
  const [nameIndex, setNameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setNameIndex((prev) => (prev + 1) % names.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [names.length]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      
      {/* Rotating impossible geometry background placeholder */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute opacity-10 w-[600px] h-[600px] border-[1px] border-white rounded-full pointer-events-none"
        style={{ borderStyle: 'dashed' }}
      >
        <div className="absolute inset-4 border border-geb-purple/30 rotate-45 rounded-full" />
        <div className="absolute inset-8 border border-geb-gold/20 -rotate-45 rounded-full" />
      </motion.div>

      {/* Recursive Title */}
      <div className="z-10 relative">
        <h1 className="text-6xl md:text-9xl font-bold font-serif tracking-tight mb-6">
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-geb-gold via-white to-geb-purple drop-shadow-lg">
            <motion.span
              key={names[nameIndex]}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="inline-block"
            >
              {names[nameIndex]}
            </motion.span>
          </span>
        </h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-xl md:text-2xl text-geb-purple/80 font-mono mb-10 max-w-2xl mx-auto"
        >
          {easterEggActive ? "You have completed the Loop." : "An Interactive Exploration of Strange Loops"}
        </motion.p>
      </div>

      {/* Intro Prose */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="max-w-3xl text-gray-400 text-lg leading-relaxed z-10 mb-12"
      >
        <p>
          In this digital journey, we illuminate how meaning emerges from meaningless rules, 
          how consciousness arises from mindless matter, and how 
          <span className="text-geb-gold italic"> 'I'</span> creates itself by thinking about itself thinking.
        </p>
      </motion.div>

      {/* Call to Action */}
      <motion.button
        onClick={onScrollRequest}
        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(252, 211, 77, 0.3)" }}
        whileTap={{ scale: 0.95 }}
        className="z-10 px-8 py-4 bg-white/5 border border-geb-gold/50 text-geb-gold rounded-full font-mono uppercase tracking-widest hover:bg-geb-gold/10 transition-all duration-300 group"
      >
        Begin the Loop
        <span className="inline-block ml-2 group-hover:rotate-180 transition-transform duration-500">∞</span>
      </motion.button>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 opacity-50"
      >
        <ArrowDown className="text-white" />
      </motion.div>
    </section>
  );
};

export default HeroSection;