"use client";

import { Genre } from '@/lib/cosmicTypes';
import { motion } from 'framer-motion';

interface SpectralFilterProps {
  genres: Genre[];
  active: Genre;
  onChange: (genre: Genre) => void;
}

export default function SpectralFilter({ genres, active, onChange }: SpectralFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
      {genres.map((genre) => {
        const isActive = active === genre;
        return (
          <motion.button
            key={genre}
            onClick={() => onChange(genre)}
            className={`relative px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-orbitron tracking-widest uppercase border transition-all duration-500 genre-constellation ${
              isActive 
                ? 'border-blood-moon/50 text-blood-moon bg-blood-moon/10' 
                : 'border-[rgba(255,255,255,0.04)] text-void-silver hover:border-blood-moon/30 hover:text-starlight'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {genre}
            {isActive && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 border border-blood-moon/30 -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
