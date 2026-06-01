"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Sparkles } from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';
import { Book } from '@/lib/cosmicTypes';
import { useAuth } from '@/lib/AuthContext';
import NebulaSearch from '@/components/cosmic-ui/NebulaSearch';
import SpectralFilter from '@/components/cosmic-ui/SpectralFilter';
import ConstellationGrid from '@/components/cosmic-ui/ConstellationGrid';
import WormholeModal from '@/components/cosmic-ui/WormholeModal';
import SupernovaDelete from '@/components/cosmic-ui/SupernovaDelete';
import { ToastContainer } from '@/components/cosmic-ui/SolarToast';

export default function LibraryPage() {
  const {
    manifestedBooks,
    searchQuery,
    setSearchQuery,
    activeGenre,
    setActiveGenre,
    isLoading,
    toasts,
    genres,
    invokeTome,
    rewriteTome,
    obliterateTome,
    removeToast,
  } = useBooks();

  const { isAdmin } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const handleEdit = (book: Book) => {
    if (!isAdmin) return;
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!isAdmin) return;
    const book = manifestedBooks.find(b => b.id === id);
    if (book) {
      setDeleteTarget({ id, title: book.title });
    }
  };

  const handleModalSubmit = (bookData: Omit<Book, 'id'>) => {
    if (!isAdmin) return;
    if (editingBook) {
      rewriteTome(editingBook.id, bookData);
      setEditingBook(null);
    } else {
      invokeTome(bookData);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleConfirmDelete = () => {
    if (!isAdmin) return;
    if (deleteTarget) {
      obliterateTome(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-10 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-blood-moon" />
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-blood-moon/50" />
            <Sparkles className="w-4 h-4 text-solar-flare" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-blood-moon/50" />
          </div>
          <h1 className="font-cinzel text-3xl md:text-5xl lg:text-6xl text-starlight mb-3">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blood-moon to-solar-flare">Archive</span>
          </h1>
          <p className="font-crimson text-void-silver text-base md:text-lg max-w-lg mx-auto">
            Browse, inscribe, and manage your cosmic collection of tomes
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6 md:space-y-8"
        >
          <NebulaSearch value={searchQuery} onChange={setSearchQuery} />
          <SpectralFilter genres={genres} active={activeGenre} onChange={setActiveGenre} />
        </motion.div>
      </div>

      {/* Results count */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6">
        <p className="font-spacemono text-[10px] md:text-xs text-void-silver tracking-widest uppercase">
          {manifestedBooks.length} {manifestedBooks.length === 1 ? 'Tome' : 'Tomes'} Manifested
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <ConstellationGrid
          books={manifestedBooks}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onInvoke={() => {
            if (!isAdmin) return;
            setEditingBook(null);
            setIsModalOpen(true);
          }}
        />
      </div>

      {/* Floating Add Button — sharp corner */}
      {isAdmin && (
        <motion.button
          onClick={() => {
            setEditingBook(null);
            setIsModalOpen(true);
          }}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-3 px-5 py-3 bg-blood-moon text-starlight font-orbitron text-xs tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(255,61,0,0.4)] hover:bg-solar-flare hover:shadow-[0_0_40px_rgba(255,109,46,0.5)] transition-all duration-500 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <Plus className="w-5 h-5" />
          <span className="hidden md:inline">New Tome</span>
        </motion.button>
      )}

      {/* Modals */}
      <WormholeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        book={editingBook}
      />

      <SupernovaDelete
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        bookTitle={deleteTarget?.title || ''}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
