export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  description: string;
  cosmicAlignment: string;
  imageUrl?: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'cosmic';
  duration?: number;
}

export type Genre = 'All' | 'Sci-Fi' | 'Fiction' | 'Non-Fiction' | 'Mystery' | 'Fantasy' | 'Biography';

export const GENRES: Genre[] = ['All', 'Sci-Fi', 'Fiction', 'Non-Fiction', 'Mystery', 'Fantasy', 'Biography'];

// Helper to resolve cover image. Fall back to genre-specific high quality cosmic Unsplash images.
export function getCoverImage(book: Book): string {
  if (book.imageUrl && book.imageUrl.trim() !== '') {
    return book.imageUrl;
  }

  // Genre themed fallback cover images (cosmic aesthetic)
  switch (book.genre) {
    case 'Sci-Fi':
      return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400'; // Deep space nebula
    case 'Fantasy':
      return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400'; // Magical starlight
    case 'Fiction':
      return 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400'; // Mysterious ancient book
    case 'Non-Fiction':
      return 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=400'; // Astronomical map / archive
    case 'Mystery':
      return 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=400'; // Dark starry mist
    case 'Biography':
      return 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=400'; // Celestial constellation chart
    default:
      return 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400'; // Old library in the stars
  }
}
