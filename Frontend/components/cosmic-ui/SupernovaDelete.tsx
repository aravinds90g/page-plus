"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle } from 'lucide-react';

interface SupernovaDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookTitle: string;
}

export default function SupernovaDelete({ isOpen, onClose, onConfirm, bookTitle }: SupernovaDeleteProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-void-abyss/80 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative bg-obsidian-card border border-red-500/30 p-8 md:p-10 max-w-md w-full mx-4 text-center shadow-[0_0_40px_rgba(239,68,68,0.1)]"
          >
            {/* Expanding ring */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-5 md:mb-6">
              <div className="absolute inset-0 border-2 border-red-500 rounded-full animate-ping" />
              <div className="absolute inset-2 border border-red-500/50 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
              </div>
            </div>

            <h3 className="font-cinzel text-lg md:text-xl text-starlight mb-2">Obliterate Tome?</h3>
            <p className="font-crimson text-void-silver mb-1 text-sm">
              <span className="text-red-400 font-orbitron text-xs tracking-wider">"{bookTitle}"</span>
            </p>
            <p className="font-crimson text-void-silver/70 mb-6 md:mb-8 text-sm">
              This knowledge will be lost to the void forever.
            </p>

            <div className="flex gap-3 md:gap-4">
              <button
                onClick={onConfirm}
                className="flex-1 px-4 md:px-8 py-3 bg-red-500/20 border border-red-500 text-red-400 font-orbitron text-xs tracking-wider hover:bg-red-500 hover:text-white transition-all duration-500"
              >
                Cast into Void
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 md:px-8 py-3 border border-[rgba(255,255,255,0.04)] text-void-silver font-orbitron text-xs tracking-wider hover:border-void-silver/30 hover:text-starlight transition-all duration-500"
              >
                Preserve
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
