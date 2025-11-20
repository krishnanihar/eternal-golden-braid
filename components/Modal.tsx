import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ModalProps } from '../types';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-gray-900/90 border border-geb-gold/30 rounded-xl shadow-2xl p-6 md:p-10 overflow-hidden"
          >
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-geb-gold/10 to-transparent pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
              <h2 className="text-2xl font-serif font-bold text-geb-gold">{title}</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="text-gray-400 hover:text-white" />
              </button>
            </div>
            
            <div className="text-gray-300 font-sans leading-relaxed">
              {children}
            </div>

            {/* Decorative bottom bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-geb-purple via-geb-gold to-geb-purple opacity-50" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;