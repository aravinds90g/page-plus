"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Book as BookType, getCoverImage } from '@/lib/cosmicTypes';
import { Edit3, Trash2, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

interface CelestialCardProps {
  book: BookType;
  index: number;
  onEdit: (book: BookType) => void;
  onDelete: (id: string) => void;
}

export default function CelestialCard({ book, index, onEdit, onDelete }: CelestialCardProps) {
  const { isAdmin } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
      className="group relative bg-obsidian-card border-l-[3px] border-blood-moon p-6 transition-all duration-700 celestial-glow cosmic-grid-item flex flex-col justify-between cursor-pointer"
    >
      <Link href={`/library/${book.id}`} className="absolute inset-0 z-30" aria-label={`View details for ${book.title}`} />

      <div className="pointer-events-none">
        {/* Corner ornament — animates on hover */}
        <div className="absolute top-4 right-4 w-8 h-8 text-blood-moon opacity-20 group-hover:opacity-60 group-hover:rotate-90 transition-all duration-700 pointer-events-none">
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <path d="M0,0 L12,0 L12,3 L3,3 L3,12 L0,12 Z" fill="currentColor" />
            <circle cx="1.5" cy="1.5" r="1" fill="#FF6D2E" />
          </svg>
        </div>

        {/* Cover Image Container — vertical portrait */}
        <div className="relative h-72 w-full overflow-hidden mb-5 border border-[rgba(255,255,255,0.06)] bg-void-deep">
          <img 
            src={getCoverImage(book)} 
            alt={book.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {/* Deep gradient overlay from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-card/60 via-obsidian-card/10 to-transparent" />
          {/* Hover-reveal bottom glow line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blood-moon to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-700" />

          {/* Genre badge */}
          <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[9px] font-orbitron tracking-widest border border-blood-moon/30 text-blood-moon bg-void-abyss/85 backdrop-blur-sm">
            {book.genre.toUpperCase()}
          </span>

          {/* Year badge — sharp corners */}
          <span className="absolute top-3 right-3 font-spacemono text-[9px] text-starlight bg-void-abyss/70 backdrop-blur-sm px-2 py-0.5">
            {book.year}
          </span>

          {/* Hover shimmer sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-starlight/3 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        {/* Title */}
        <h3 className="font-cinzel text-xl text-starlight mb-2 group-hover:text-solar-flare transition-colors duration-500 group-hover:[text-shadow:0_0_20px_rgba(255,109,46,0.3)]">
          {book.title}
        </h3>

        {/* Author */}
        <p className="font-crimson italic text-void-silver mb-3 text-sm">{book.author}</p>

        {/* Description */}
        <p className="font-crimson text-void-silver/70 text-sm leading-relaxed line-clamp-2 mb-4">
          {book.description}
        </p>

        {/* Cosmic alignment — styled with left accent */}
        <div className="relative pl-4 mb-5 border-l border-blood-moon/20">
          <p className="font-crimson italic text-blood-moon/60 text-xs leading-relaxed">
            &ldquo;{book.cosmicAlignment}&rdquo;
          </p>
          <Sparkles className="absolute -top-1 -left-[9px] w-3 h-3 text-solar-flare/40" />
        </div>
      </div>

      <div className="pointer-events-none">
        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-blood-moon/20 via-[rgba(255,255,255,0.04)] to-transparent mb-3" />

        {/* Actions (Only for Admins) — fade only, no slide */}
        {isAdmin ? (
          <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(book); }}
              className="pointer-events-auto flex items-center gap-2 text-[10px] font-orbitron tracking-wider text-void-silver hover:text-starlight transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> EDIT
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(book.id); }}
              className="pointer-events-auto flex items-center gap-2 text-[10px] font-orbitron tracking-wider text-void-silver hover:text-red-500 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> DELETE
            </button>
          </div>
        ) : (
          <div className="h-4" />
        )}
      </div>

      {/* Orbiting particle */}
      <div className="absolute -right-2 -bottom-2 w-3 h-3 bg-blood-moon opacity-0 group-hover:opacity-100 animate-ping pointer-events-none" />
    </motion.div>
  );
}
