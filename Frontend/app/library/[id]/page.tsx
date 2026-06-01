"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag, Sparkles, Edit3, Trash2, Loader2, BookOpen } from 'lucide-react';
import { grimoireData } from '@/lib/grimoireData';
import { Book, getCoverImage } from '@/lib/cosmicTypes';
import { useAuth, API_URL } from '@/lib/AuthContext';
import { useBooks } from '@/hooks/useBooks';
import WormholeModal from '@/components/cosmic-ui/WormholeModal';
import { ToastContainer } from '@/components/cosmic-ui/SolarToast';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { rewriteTome, obliterateTome, toasts, removeToast } = useBooks();
  const { isAdmin } = useAuth();
  
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchSingleBook = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/books/${id}`);
      const data = await response.json();
      if (response.ok && data.success) {
        setBook({
          id: data.data._id,
          title: data.data.title,
          author: data.data.author,
          genre: data.data.genre,
          year: data.data.year,
          description: data.data.description || '',
          cosmicAlignment: data.data.cosmicAlignment || '',
          imageUrl: data.data.imageUrl || '',
        });
      } else {
        // Fallback to static grimoireData
        const found = grimoireData.find(b => b.id === id);
        if (found) {
          setBook(found);
        } else {
          setBook(null);
        }
      }
    } catch (err) {
      const found = grimoireData.find(b => b.id === id);
      if (found) {
        setBook(found);
      } else {
        setBook(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSingleBook();
  }, [fetchSingleBook]);

  const handleEditSubmit = async (updates: Omit<Book, 'id'>) => {
    if (!book) return;
    await rewriteTome(book.id, updates);
    setBook({
      id: book.id,
      ...updates,
    });
  };

  const handleDelete = async () => {
    if (!book) return;
    if (confirm('Are you sure you want to obliterate this tome from the archive?')) {
      await obliterateTome(book.id);
      // Wait a moment for deletion toast to show, then redirect
      setTimeout(() => {
        router.push('/library');
      }, 800);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blood-moon mx-auto mb-4 animate-spin" />
          <p className="font-orbitron text-xs text-void-silver uppercase tracking-widest">Querying the stars...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-void-silver mx-auto mb-4 animate-pulse" />
          <p className="font-crimson text-void-silver mb-4">Tome not found in the void...</p>
          <button
            onClick={() => router.push('/library')}
            className="px-6 py-2 border border-blood-moon/30 text-blood-moon font-orbitron text-xs tracking-wider uppercase hover:bg-blood-moon hover:text-starlight transition-all duration-300"
          >
            Return to Archive
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => router.push('/library')}
          className="flex items-center gap-2 text-void-silver hover:text-starlight font-orbitron text-xs tracking-wider uppercase mb-8 md:mb-12 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Archive
        </motion.button>

        {/* Book Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="relative bg-obsidian-card border border-[rgba(255,255,255,0.04)] p-6 md:p-10 lg:p-12"
        >
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blood-moon to-transparent" />

          {/* Corner ornaments */}
          <div className="absolute top-4 right-4 w-12 h-12 opacity-20 pointer-events-none">
            <svg viewBox="0 0 48 48" className="w-full h-full text-blood-moon">
              <path d="M0,0 L16,0 L16,4 L4,4 L4,16 L0,16 Z" fill="currentColor" />
              <circle cx="2" cy="2" r="1.5" fill="#FF6D2E" />
            </svg>
          </div>
          <div className="absolute bottom-4 left-4 w-12 h-12 opacity-20 rotate-180 pointer-events-none">
            <svg viewBox="0 0 48 48" className="w-full h-full text-blood-moon">
              <path d="M0,0 L16,0 L16,4 L4,4 L4,16 L0,16 Z" fill="currentColor" />
              <circle cx="2" cy="2" r="1.5" fill="#FF6D2E" />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
            {/* Left Column: Portrait Book Cover */}
            <div className="md:col-span-1">
              <div className="relative aspect-[3/4.5] w-full overflow-hidden border border-[rgba(255,255,255,0.06)] bg-void-deep">
                <img 
                  src={getCoverImage(book)} 
                  alt={book.title} 
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-card/40 via-transparent to-transparent" />
              </div>
            </div>

            {/* Right Column: Book Details */}
            <div className="md:col-span-2 flex flex-col justify-between">
              <div>
                {/* Genre Badge + Year */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-4 py-1.5 text-[10px] font-orbitron tracking-widest border border-blood-moon/30 text-blood-moon bg-blood-moon/5">
                    {book.genre.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2 text-void-silver">
                    <Calendar className="w-4 h-4" />
                    <span className="font-spacemono text-xs">{book.year}</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="font-cinzel text-3xl md:text-4xl text-starlight mb-4 leading-tight">
                  {book.title}
                </h1>

                {/* Author */}
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-4.5 h-4.5 text-void-silver" />
                  <p className="font-crimson italic text-lg md:text-xl text-void-silver">
                    {book.author}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-blood-moon/20 via-[rgba(255,255,255,0.04)] to-transparent mb-6" />

                {/* Description */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-3.5 h-3.5 text-void-silver" />
                    <span className="font-spacemono text-[9px] text-void-silver uppercase tracking-widest">Description</span>
                  </div>
                  <p className="font-crimson text-starlight/80 text-base leading-relaxed">
                    {book.description}
                  </p>
                </div>

                {/* Cosmic Alignment */}
                <div className="relative pl-4 py-1 mb-6 border-l border-blood-moon/25 bg-void-deep/30">
                  <p className="font-crimson italic text-blood-moon/75 text-base leading-relaxed">
                    &ldquo;{book.cosmicAlignment}&rdquo;
                  </p>
                  <Sparkles className="absolute -top-1 -left-[9px] w-3 h-3 text-solar-flare/40" />
                </div>
              </div>

              {/* Actions (Admins Only) */}
              {isAdmin && (
                <div className="flex flex-wrap gap-4 border-t border-[rgba(255,255,255,0.04)] pt-6 mt-6">
                  <button 
                    onClick={() => setIsEditOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 border border-[rgba(255,255,255,0.04)] text-void-silver font-orbitron text-[10px] tracking-wider hover:border-blood-moon/30 hover:text-starlight transition-all duration-500 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    EDIT TOME
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-5 py-2.5 border border-red-500/20 text-red-400/60 font-orbitron text-[10px] tracking-wider hover:border-red-500/50 hover:text-red-400 transition-all duration-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    DELETE
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Wormhole Edit Modal */}
      {book && (
        <WormholeModal 
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSubmit={handleEditSubmit}
          book={book}
        />
      )}

      {/* Toast Feedback */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
