import { describe, it, expect } from 'vitest';
import { getCoverImage, GENRES, type Book } from '@/lib/cosmicTypes';

const baseBook: Book = {
  id: '1',
  title: 'Test Book',
  author: 'Test Author',
  genre: 'Fiction',
  year: 2020,
  description: 'A test book',
  cosmicAlignment: 'Test alignment',
};

describe('getCoverImage', () => {
  it('should return the book imageUrl when provided', () => {
    const book = { ...baseBook, imageUrl: 'https://example.com/cover.jpg' };
    expect(getCoverImage(book)).toBe('https://example.com/cover.jpg');
  });

  it('should return genre fallback for Sci-Fi', () => {
    const book = { ...baseBook, genre: 'Sci-Fi' };
    const url = getCoverImage(book);
    expect(url).toContain('unsplash.com');
    expect(url).toContain('photo-1451187580459-43490279c0fa');
  });

  it('should return genre fallback for Fantasy', () => {
    const book = { ...baseBook, genre: 'Fantasy' };
    const url = getCoverImage(book);
    expect(url).toContain('photo-1518709268805-4e9042af9f23');
  });

  it('should return genre fallback for Fiction', () => {
    const book = { ...baseBook, genre: 'Fiction' };
    const url = getCoverImage(book);
    expect(url).toContain('photo-1543002588-bfa74002ed7e');
  });

  it('should return genre fallback for Non-Fiction', () => {
    const book = { ...baseBook, genre: 'Non-Fiction' };
    const url = getCoverImage(book);
    expect(url).toContain('photo-1447069387593-a5de0862481e');
  });

  it('should return genre fallback for Mystery', () => {
    const book = { ...baseBook, genre: 'Mystery' };
    const url = getCoverImage(book);
    expect(url).toContain('photo-1509248961158-e54f6934749c');
  });

  it('should return genre fallback for Biography', () => {
    const book = { ...baseBook, genre: 'Biography' };
    const url = getCoverImage(book);
    expect(url).toContain('photo-1486312338219-ce68d2c6f44d');
  });

  it('should return default fallback for unknown genre', () => {
    const book = { ...baseBook, genre: 'Unknown' };
    const url = getCoverImage(book);
    expect(url).toContain('photo-1507842217343-583bb7270b66');
  });

  it('should return fallback when imageUrl is empty string', () => {
    const book = { ...baseBook, imageUrl: '' };
    const url = getCoverImage(book);
    expect(url).toContain('unsplash.com');
  });
});

describe('GENRES', () => {
  it('should contain all expected genres', () => {
    expect(GENRES).toEqual([
      'All',
      'Sci-Fi',
      'Fiction',
      'Non-Fiction',
      'Mystery',
      'Fantasy',
      'Biography',
    ]);
  });

  it('should have All as the first genre', () => {
    expect(GENRES[0]).toBe('All');
  });
});
