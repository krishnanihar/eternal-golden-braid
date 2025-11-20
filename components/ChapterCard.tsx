import React from 'react';
import { motion } from 'framer-motion';
import { Chapter } from '../types';
import { Brain, Network, Box, Code, RefreshCcw, Hexagon } from 'lucide-react';

interface ChapterCardProps {
  chapter: Chapter;
  onClick: (chapter: Chapter) => void;
  isVisited: boolean;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, onClick, isVisited }) => {
  // Choose icon based on visualType
  const getIcon = () => {
    switch (chapter.visualType) {
      case 'code': return <Code className="text-geb-purple" />;
      case 'geometry': return <Box className="text-blue-400" />;
      case 'recursive': return <RefreshCcw className="text-green-400" />;
      case 'network': return <Network className="text-pink-400" />;
      case 'gold': return <Hexagon className="text-geb-gold" />;
      case 'logic': return <Brain className="text-indigo-400" />;
      default: return <Box />;
    }
  };

  return (
    <motion.div
      layoutId={`card-${chapter.id}`}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      onClick={() => onClick(chapter)}
      className={`
        relative group cursor-pointer overflow-hidden rounded-xl border p-6 h-64 flex flex-col justify-between
        transition-colors duration-500
        ${isVisited 
          ? 'bg-geb-purple/5 border-geb-gold/40 shadow-[0_0_15px_rgba(252,211,77,0.1)]' 
          : 'bg-white/5 border-white/10 hover:border-geb-purple/50 hover:bg-white/10'}
      `}
    >
      {/* Background Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-geb-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top Section */}
      <div className="relative z-10 flex justify-between items-start">
        <span className="font-mono text-xs text-gray-500 group-hover:text-geb-gold transition-colors">
          {chapter.part} • CH {chapter.id}
        </span>
        <div className="p-2 bg-black/20 rounded-lg backdrop-blur-sm">
          {getIcon()}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl font-serif font-bold text-gray-100 mb-2 group-hover:text-white leading-tight">
          {chapter.title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 group-hover:text-gray-300">
          {chapter.description}
        </p>
      </div>

      {/* Bottom Status */}
      <div className="relative z-10 mt-4 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isVisited ? 'bg-geb-gold animate-pulse' : 'bg-gray-700'}`} />
        <span className="text-xs font-mono text-gray-600 uppercase tracking-wider">
          {isVisited ? 'Explored' : 'Unexplored'}
        </span>
      </div>
    </motion.div>
  );
};

export default ChapterCard;