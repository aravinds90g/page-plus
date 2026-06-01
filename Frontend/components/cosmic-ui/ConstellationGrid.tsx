"use client";

import { Book as BookType } from '@/lib/cosmicTypes';
import CelestialCard from './CelestialCard';
import VoidState from './VoidState';
import PulsarLoader from './PulsarLoader';

interface ConstellationGridProps {
  books: BookType[];
  isLoading: boolean;
  onEdit: (book: BookType) => void;
  onDelete: (id: string) => void;
  onInvoke: () => void;
}

export default function ConstellationGrid({ 
  books, 
  isLoading, 
  onEdit, 
  onDelete, 
  onInvoke 
}: ConstellationGridProps) {
  if (isLoading) {
    return <PulsarLoader />;
  }

  if (books.length === 0) {
    return <VoidState onInvoke={onInvoke} />;
  }

  return (
    <div className="cosmic-grid">
      {books.map((book, index) => (
        <CelestialCard
          key={book.id}
          book={book}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
