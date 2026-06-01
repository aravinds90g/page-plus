"use client";

import { useEffect, useRef, useState } from 'react';
import { Book, Star, Zap, Globe } from 'lucide-react';
import { Book as BookType } from '@/lib/cosmicTypes';

interface QuantumStatsProps {
  books: BookType[];
}

function AnimatedNumber({ target, duration = 2500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function QuantumStats({ books }: QuantumStatsProps) {
  const totalBooks = books.length;
  const genres = new Set(books.map(b => b.genre)).size;
  const avgYear = books.length ? Math.round(books.reduce((sum, b) => sum + b.year, 0) / books.length) : 0;
  const sciFiCount = books.filter(b => b.genre === 'Sci-Fi').length;

  const stats = [
    { 
      icon: Book, 
      value: totalBooks, 
      label: 'Total Tomes',
      suffix: ''
    },
    { 
      icon: Star, 
      value: genres, 
      label: 'Constellations',
      suffix: ''
    },
    { 
      icon: Zap, 
      value: sciFiCount, 
      label: 'Sci-Fi Tomes',
      suffix: ''
    },
    { 
      icon: Globe, 
      value: avgYear, 
      label: 'Avg Year',
      suffix: ''
    },
  ];

  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div 
                key={i}
                className="group relative p-6 md:p-8 border border-[rgba(255,255,255,0.04)] hover:border-blood-moon/30 transition-all duration-700 bg-obsidian-card/50 backdrop-blur-sm celestial-glow"
              >
                {/* Rotating rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 border border-blood-moon/10 rounded-full group-hover:border-blood-moon/30 group-hover:rotate-180 transition-all duration-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 border border-solar-flare/5 rounded-full group-hover:border-solar-flare/20 group-hover:-rotate-90 transition-all duration-700" />

                <div className="relative z-10 text-center">
                  <Icon className="w-5 h-5 text-void-silver mx-auto mb-3 group-hover:text-blood-moon transition-colors duration-500" />
                  <span className="block font-orbitron text-3xl md:text-5xl text-starlight group-hover:text-blood-moon transition-colors duration-500">
                    <AnimatedNumber target={stat.value} />
                  </span>
                  <span className="block font-spacemono text-[10px] md:text-xs text-void-silver uppercase tracking-widest mt-2 md:mt-3">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
