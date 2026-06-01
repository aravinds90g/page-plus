"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book as BookType } from '@/lib/cosmicTypes';
import { X } from 'lucide-react';

interface WormholeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (book: Omit<BookType, 'id'>) => void;
  book?: BookType | null;
}

const emptyBook: Omit<BookType, 'id'> = {
  title: '',
  author: '',
  genre: 'Sci-Fi',
  year: new Date().getFullYear(),
  description: '',
  cosmicAlignment: '',
  imageUrl: '',
};

const GENRE_OPTIONS = ['Sci-Fi', 'Fiction', 'Non-Fiction', 'Mystery', 'Fantasy', 'Biography'];

export default function WormholeModal({ isOpen, onClose, onSubmit, book }: WormholeModalProps) {
  const [formData, setFormData] = useState<Omit<BookType, 'id'>>(emptyBook);
  const isEdit = !!book;

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        year: book.year,
        description: book.description,
        cosmicAlignment: book.cosmicAlignment,
        imageUrl: book.imageUrl || '',
      });
    } else {
      setFormData(emptyBook);
    }
  }, [book, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim()) return;
    onSubmit(formData);
    setFormData(emptyBook);
    onClose();
  };

  const handleChange = (field: keyof Omit<BookType, 'id'>, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-void-abyss/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Portal rings */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute w-[500px] h-[500px] md:w-[600px] md:h-[600px] border border-blood-moon/20 rounded-full portal-ring pointer-events-none"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="absolute w-[400px] h-[400px] md:w-[500px] md:h-[500px] border border-solar-flare/10 rounded-full portal-ring-reverse pointer-events-none"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 40 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative bg-obsidian-card border border-blood-moon/20 p-6 md:p-10 max-w-lg w-full mx-4 shadow-[0_0_60px_rgba(255,61,0,0.1)] overflow-y-auto max-h-[90vh]"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blood-moon to-transparent animate-pulse" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-void-silver hover:text-starlight transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-cinzel text-xl md:text-2xl text-starlight mb-6">
              {isEdit ? 'Rewrite the Tome' : 'Inscribe New Tome'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div>
                <label className="block font-spacemono text-[10px] text-void-silver uppercase tracking-widest mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Title of the Tome..."
                  className="w-full bg-void-deep border border-[rgba(255,255,255,0.04)] focus:border-blood-moon/50 p-3 text-starlight font-crimson outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(255,61,0,0.1)] text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-spacemono text-[10px] text-void-silver uppercase tracking-widest mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  placeholder="Author's name..."
                  className="w-full bg-void-deep border border-[rgba(255,255,255,0.04)] focus:border-blood-moon/50 p-3 text-starlight font-crimson outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(255,61,0,0.1)] text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-spacemono text-[10px] text-void-silver uppercase tracking-widest mb-2">Cover Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-void-deep border border-[rgba(255,255,255,0.04)] focus:border-blood-moon/50 p-3 text-starlight font-crimson outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(255,61,0,0.1)] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-spacemono text-[10px] text-void-silver uppercase tracking-widest mb-2">Genre</label>
                  <select
                    value={formData.genre}
                    onChange={(e) => handleChange('genre', e.target.value)}
                    className="w-full bg-void-deep border border-[rgba(255,255,255,0.04)] focus:border-blood-moon/50 p-3 text-starlight font-crimson outline-none transition-all duration-300 text-sm appearance-none cursor-pointer"
                  >
                    {GENRE_OPTIONS.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-spacemono text-[10px] text-void-silver uppercase tracking-widest mb-2">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleChange('year', parseInt(e.target.value) || 0)}
                    className="w-full bg-void-deep border border-[rgba(255,255,255,0.04)] focus:border-blood-moon/50 p-3 text-starlight font-crimson outline-none transition-all duration-300 text-sm"
                    min="1000"
                    max="9999"
                  />
                </div>
              </div>

              <div>
                <label className="block font-spacemono text-[10px] text-void-silver uppercase tracking-widest mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the tome..."
                  rows={2}
                  className="w-full bg-void-deep border border-[rgba(255,255,255,0.04)] focus:border-blood-moon/50 p-3 text-starlight font-crimson outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(255,61,0,0.1)] text-sm resize-none"
                />
              </div>

              <div>
                <label className="block font-spacemono text-[10px] text-void-silver uppercase tracking-widest mb-2">Cosmic Alignment</label>
                <input
                  type="text"
                  value={formData.cosmicAlignment}
                  onChange={(e) => handleChange('cosmicAlignment', e.target.value)}
                  placeholder="A cosmic phrase..."
                  className="w-full bg-void-deep border border-[rgba(255,255,255,0.04)] focus:border-blood-moon/50 p-3 text-starlight font-crimson outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(255,61,0,0.1)] text-sm"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blood-moon text-starlight font-orbitron text-xs tracking-[0.2em] uppercase hover:bg-solar-flare transition-colors duration-500"
                >
                  {isEdit ? 'Rewrite' : 'Invoke'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-[rgba(255,255,255,0.04)] text-void-silver font-orbitron text-xs tracking-[0.2em] uppercase hover:border-blood-moon/30 hover:text-starlight transition-all duration-500"
                >
                  Dismiss
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
