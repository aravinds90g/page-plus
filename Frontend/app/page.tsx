"use client";

import SingularityHero from "@/components/cosmic-ui/SingularityHero";
import QuantumStats from "@/components/cosmic-ui/QuantumStats";
import { grimoireData } from "@/lib/grimoireData";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Star, Flame } from "lucide-react";
import { useState, useEffect } from "react";
import { API_URL } from "@/lib/AuthContext";
import { Book, getCoverImage } from "@/lib/cosmicTypes";

export default function PortalPage() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/books?limit=100`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const mapped: Book[] = data.data.map((b: any) => ({
            id: b._id,
            title: b.title,
            author: b.author,
            genre: b.genre,
            year: b.year,
            description: b.description || '',
            cosmicAlignment: b.cosmicAlignment || '',
            imageUrl: b.imageUrl || '',
          }));
          setBooks(mapped);
        } else {
          setBooks(grimoireData);
        }
      })
      .catch(() => {
        setBooks(grimoireData);
      });
  }, []);

  const displayBooks = books.length > 0 ? books : grimoireData;

  return (
    <div>
      <SingularityHero />

      {/* Stats Section */}
      <QuantumStats books={displayBooks} />

      {/* Featured Tomes Preview */}
      <section className="py-20 md:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-blood-moon/50" />
                <Flame className="w-5 h-5 text-blood-moon" />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-blood-moon/50" />
              </div>
              <h2 className="cinzel-decorative-black text-3xl md:text-4xl text-starlight mb-3">
                Featured Constellations
              </h2>
              <p className="font-crimson text-void-silver text-base md:text-lg max-w-lg mx-auto">
                A glimpse into the most luminous tomes within our archive
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {displayBooks.slice(0, 3).map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group relative bg-obsidian-card border border-[rgba(255,255,255,0.04)] p-0 hover:border-blood-moon/20 transition-all duration-700 celestial-glow overflow-hidden flex flex-col"
              >
                {/* Cover Image — vertical portrait */}
                <div className="relative h-72 w-full overflow-hidden bg-void-deep border-b border-[rgba(255,255,255,0.04)]">
                  <img 
                    src={getCoverImage(book)} 
                    alt={book.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-card/60 via-obsidian-card/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blood-moon to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-700" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[9px] font-orbitron tracking-widest border border-blood-moon/30 text-blood-moon bg-void-abyss/85 backdrop-blur-sm">
                    {book.genre.toUpperCase()}
                  </span>
                  <Star className="absolute top-3 right-3 w-4 h-4 text-solar-flare opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-starlight/3 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>

                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-cinzel text-xl text-starlight mb-2 group-hover:text-solar-flare transition-colors duration-500 group-hover:[text-shadow:0_0_20px_rgba(255,109,46,0.3)]">
                      {book.title}
                    </h3>
                    <p className="font-crimson italic text-void-silver text-sm mb-3">{book.author}</p>
                    <p className="font-crimson text-void-silver/70 text-sm leading-relaxed line-clamp-3 mb-4">
                      {book.description}
                    </p>
                  </div>

                  {/* Cosmic alignment with left accent */}
                  <div className="relative pl-4 border-l border-blood-moon/20 mt-auto">
                    <p className="font-crimson italic text-blood-moon/50 text-xs leading-relaxed">
                      &ldquo;{book.cosmicAlignment}&rdquo;
                    </p>
                    <Star className="absolute -top-1 -left-[9px] w-2.5 h-2.5 text-solar-flare/40" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10 md:mt-14">
            <Link
              href="/library"
              className="inline-flex items-center gap-3 px-8 py-4 border border-blood-moon/30 text-blood-moon font-orbitron text-xs tracking-[0.2em] uppercase hover:bg-blood-moon hover:text-starlight transition-all duration-500 group"
            >
              <BookOpen className="w-4 h-4" />
              Explore Full Archive
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.04)] py-10 md:py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-blood-moon" />
            <span className="font-cinzel text-lg text-starlight">PAGEPULSE</span>
          </div>
          <p className="font-crimson text-void-silver text-sm">
            A forbidden library floating in the void between stars
          </p>
          <p className="font-spacemono text-[10px] text-void-silver/50 mt-4 tracking-widest uppercase">
            Built with cosmic precision · 2024
          </p>
        </div>
      </footer>
    </div>
  );
}
