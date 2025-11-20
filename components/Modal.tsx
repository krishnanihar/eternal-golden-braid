import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ModalProps } from '../types';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          
          {/* Modal Content - Max width increased to 7xl for immersive tools */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-7xl max-h-[95vh] flex flex-col bg-gray-900/95 border border-geb-gold/30 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-geb-gold/10 to-transparent pointer-events-none" />
            
            <div className="flex justify-between items-center p-6 border-b border-gray-700 shrink-0 bg-black/20">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-geb-gold flex items-center gap-2">
                  <span className="w-2 h-8 bg-geb-purple rounded-sm inline-block mr-2"></span>
                  {title}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors z-50 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 text-gray-300 font-sans leading-relaxed custom-scrollbar bg-gradient-to-b from-gray-900 to-black">
              {children}
            </div>

            {/* Decorative bottom bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-geb-purple via-geb-gold to-geb-purple opacity-50 pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
