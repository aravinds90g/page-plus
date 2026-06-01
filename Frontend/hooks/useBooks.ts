"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Book, Toast, Genre, GENRES } from '@/lib/cosmicTypes';
import { useAuth, API_URL } from '@/lib/AuthContext';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState<Genre>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { token } = useAuth();

  const addToast = useCallback((message: string, type: Toast['type'] = 'cosmic') => {
    const id = crypto.randomUUID();
    const toast: Toast = { id, message, type, duration: 3000 };
    setToasts(prev => [...prev, toast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  // Fetch books from backend
  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/books?limit=100`);
      const data = await response.json();
      if (response.ok && data.success) {
        // Map backend _id to frontend id
        const mappedBooks: Book[] = data.data.map((b: any) => ({
          id: b._id,
          title: b.title,
          author: b.author,
          genre: b.genre,
          year: b.year,
          description: b.description || '',
          cosmicAlignment: b.cosmicAlignment || '',
          imageUrl: b.imageUrl || '',
        }));
        setBooks(mappedBooks);
      } else {
        addToast('Failed to pull archives from the stars', 'error');
      }
    } catch (err) {
      addToast('Cannot connect to the cosmic library', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const manifestedBooks = useMemo(() => {
    return books
      .filter(book => activeGenre === 'All' || book.genre === activeGenre)
      .filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [books, searchQuery, activeGenre]);

  const genres = GENRES;

  const invokeTome = useCallback(async (book: Omit<Book, 'id'>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(book),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const createdBook: Book = {
          id: data.data._id,
          title: data.data.title,
          author: data.data.author,
          genre: data.data.genre,
          year: data.data.year,
          description: data.data.description || '',
          cosmicAlignment: data.data.cosmicAlignment || '',
          imageUrl: data.data.imageUrl || '',
        };
        setBooks(prev => [createdBook, ...prev]);
        addToast('Tome inscribed in the archive', 'success');
        return createdBook;
      } else {
        addToast(data.error || 'Failed to inscribe tome', 'error');
      }
    } catch (err) {
      addToast('Cosmic interruption during inscription', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [token, addToast]);

  const rewriteTome = useCallback(async (id: string, updates: Partial<Book>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setBooks(prev => prev.map(book => 
          book.id === id ? { ...book, ...updates } : book
        ));
        addToast('Tome rewritten in the stars', 'success');
      } else {
        addToast(data.error || 'Failed to rewrite tome', 'error');
      }
    } catch (err) {
      addToast('Cosmic disruption during rewriting', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [token, addToast]);

  const obliterateTome = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setBooks(prev => prev.filter(book => book.id !== id));
        addToast('Tome cast into the void', 'cosmic');
      } else {
        addToast(data.error || 'Failed to obliterate tome', 'error');
      }
    } catch (err) {
      addToast('Cosmic protection shielded the tome', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [token, addToast]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return {
    books,
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
    addToast,
    refreshBooks: fetchBooks,
  };
}
