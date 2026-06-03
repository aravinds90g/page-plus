import { describe, it, expect } from 'vitest';
import { grimoireData } from '@/lib/grimoireData';

describe('grimoireData', () => {
  it('should have exactly 15 books', () => {
    expect(grimoireData).toHaveLength(15);
  });

  it('should have unique ids for all books', () => {
    const ids = grimoireData.map(b => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have unique titles for all books', () => {
    const titles = grimoireData.map(b => b.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('should have valid year ranges for all books', () => {
    grimoireData.forEach(book => {
      expect(book.year).toBeGreaterThanOrEqual(1000);
      expect(book.year).toBeLessThanOrEqual(2030);
    });
  });

  it('should have non-empty titles and authors', () => {
    grimoireData.forEach(book => {
      expect(book.title.trim()).toBeTruthy();
      expect(book.author.trim()).toBeTruthy();
    });
  });

  it('should have valid genres', () => {
    const validGenres = ['Sci-Fi', 'Fiction', 'Non-Fiction', 'Mystery', 'Fantasy', 'Biography'];
    grimoireData.forEach(book => {
      expect(validGenres).toContain(book.genre);
    });
  });

  it('should have at least one book per genre', () => {
    const genres = new Set(grimoireData.map(b => b.genre));
    expect(genres.size).toBe(6);
    expect(genres).toContain('Sci-Fi');
    expect(genres).toContain('Fiction');
    expect(genres).toContain('Non-Fiction');
    expect(genres).toContain('Mystery');
    expect(genres).toContain('Fantasy');
    expect(genres).toContain('Biography');
  });

  it('should have Dune as the first book', () => {
    expect(grimoireData[0].title).toBe('Dune');
    expect(grimoireData[0].author).toBe('Frank Herbert');
  });
});
