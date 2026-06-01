"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, BookOpen, Sparkles } from "lucide-react";

export default function SingularityHero() {
  return (
    <div className="relative h-screen overflow-hidden flex items-center justify-center px-4">
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-full max-w-5xl mx-auto text-center"
      >
          {/* Decorative heading pattern */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-blood-moon/50" />
              <Flame className="w-5 h-5 text-blood-moon" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-blood-moon/50" />
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="mb-6"
          >
            <span className="block text-starlight cinzel-decorative-black text-5xl sm:text-7xl md:text-[90px] lg:text-[110px] leading-[0.9] tracking-tighter my-10">
              YOUR
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blood-moon via-solar-flare to-nebula-ember cinzel-decorative-black text-7xl sm:text-9xl md:text-[170px] lg:text-[220px] leading-[0.9] tracking-tighter relative my-10">
              LIBRARY
              <span className="absolute -right-6 md:-right-12 top-1/2 w-2 h-2 md:w-3 md:h-3 bg-solar-flare rounded-full animate-ping" />
            </span>
            <span className="block text-starlight cinzel-decorative-black text-5xl sm:text-7xl md:text-[90px] lg:text-[110px] leading-[0.9] tracking-tighter my-10">
              ASCENDANT
            </span>
          </motion.h1>

          {/* Badges row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-3 flex-wrap mb-6"
          >
            <span className="px-3 py-1 text-[10px] font-orbitron tracking-widest border border-blood-moon/30 text-blood-moon bg-blood-moon/5">
              FANTASY
            </span>
            <span className="px-3 py-1 text-[10px] font-orbitron tracking-widest border border-solar-flare/30 text-solar-flare bg-solar-flare/5">
              SCI-FI
            </span>
            <span className="px-3 py-1 text-[10px] font-orbitron tracking-widest border border-nebula-ember/30 text-nebula-ember bg-nebula-ember/5">
              MYSTERY
            </span>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-blood-moon/50" />
              <p className="text-void-silver font-crimson italic text-base md:text-lg max-w-md">
                Where stories become constellations in the void
              </p>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-blood-moon/50" />
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mt-6"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 1, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <Link
              href="/login"
              className="inline-flex items-center gap-3 px-8 py-4 border border-blood-moon/30 text-blood-moon font-orbitron text-xs tracking-[0.2em] uppercase hover:bg-blood-moon hover:text-starlight transition-all duration-500 group"
            >
              <Sparkles className="w-4 h-4" />
              Sign In
            </Link>

            <Link
              href="/signup"
              className="inline-flex items-center gap-3 px-8 py-4 border border-blood-moon/30 text-blood-moon font-orbitron text-xs tracking-[0.2em] uppercase hover:bg-blood-moon hover:text-starlight transition-all duration-500 group"
            >
              <BookOpen className="w-4 h-4" />
              Create Account
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-void-abyss to-transparent z-10" />
    </div>
  );
}
