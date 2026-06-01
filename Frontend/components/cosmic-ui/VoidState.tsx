"use client";

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

interface VoidStateProps {
  onInvoke: () => void;
}

export default function VoidState({ onInvoke }: VoidStateProps) {
  const { isAdmin } = useAuth();

  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-20 md:py-32 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated SVG Book */}
      <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8 md:mb-12">
        <svg viewBox="0 0 256 256" className="w-full h-full opacity-30">
          {/* Orbiting stars */}
          <motion.g 
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '128px 128px' }}
          >
            <circle cx="128" cy="40" r="3" fill="#FF3D00" opacity="0.6" />
            <circle cx="200" cy="80" r="2" fill="#FF6D2E" opacity="0.4" />
            <circle cx="220" cy="140" r="2.5" fill="#FF9B5C" opacity="0.5" />
            <circle cx="180" cy="210" r="2" fill="#FF3D00" opacity="0.3" />
            <circle cx="100" cy="220" r="3" fill="#FF6D2E" opacity="0.4" />
            <circle cx="40" cy="180" r="2" fill="#FF9B5C" opacity="0.5" />
            <circle cx="30" cy="100" r="2.5" fill="#FF3D00" opacity="0.4" />
            <circle cx="60" cy="50" r="2" fill="#FF6D2E" opacity="0.3" />
          </motion.g>

          {/* Book silhouette */}
          <path 
            d="M64,48 L64,200 L128,184 L192,200 L192,48 L128,64 Z" 
            fill="none" 
            stroke="#FF3D00" 
            strokeWidth="1.5"
            opacity="0.5"
          />
          <path 
            d="M64,48 L128,64 L192,48" 
            fill="none" 
            stroke="#FF6D2E" 
            strokeWidth="1"
            opacity="0.3"
          />
          <line x1="128" y1="64" x2="128" y2="184" stroke="#FF3D00" strokeWidth="1" opacity="0.2" />
        </svg>
      </div>

      <h2 className="font-cinzel text-2xl md:text-3xl text-starlight mb-3 md:mb-4 text-center">
        The Void Awaits
      </h2>
      <p className="font-crimson text-void-silver mb-6 md:mb-8 text-center max-w-md text-sm md:text-base px-4">
        {isAdmin 
          ? "No tomes yet inscribed in this realm. Begin your collection and watch the constellations form." 
          : "No tomes yet inscribed in this realm. Please check back later once an Archivist has updated the archives."}
      </p>
      {isAdmin && (
        <button
          onClick={onInvoke}
          className="magnetic-btn px-6 md:px-8 py-3 md:py-4 bg-blood-moon text-starlight font-orbitron text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-solar-flare transition-all duration-500 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Inscribe First Tome
        </button>
      )}
    </motion.div>
  );
}
