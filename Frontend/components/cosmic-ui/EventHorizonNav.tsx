"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Library, Home, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function EventHorizonNav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Portal', icon: Home },
    { href: '/library', label: 'Archive', icon: Library },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled 
          ? 'backdrop-blur-2xl bg-void-abyss/70 border-b border-blood-moon/15' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <BookOpen className="w-7 h-7 text-blood-moon group-hover:text-solar-flare transition-colors duration-500" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-solar-flare rounded-full animate-ping opacity-50" />
          </div>
          <span className="font-cinzel text-xl tracking-wider text-starlight group-hover:text-solar-flare transition-colors duration-500">
            PAGEPULSE
          </span>
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-5 py-2 text-sm font-orbitron tracking-widest uppercase transition-all duration-500 group ${
                  isActive ? 'text-blood-moon' : 'text-void-silver hover:text-starlight'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {link.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blood-moon rounded-full shadow-[0_0_8px_rgba(255,61,0,0.8)]" />
                )}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-blood-moon transition-all duration-500 ${
                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            );
          })}
        </div>

        {/* Auth CTA */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 border border-[rgba(255,255,255,0.06)] bg-void-deep/80 rounded-full font-spacemono text-[9px] uppercase tracking-widest text-void-silver">
                <span className={`w-1.5 h-1.5 rounded-full ${user?.role === 'admin' ? 'bg-solar-flare animate-pulse' : 'bg-green-500'}`} />
                <span>{user?.name.split(' ')[0]}</span>
                <span className="text-void-silver/40">|</span>
                <span>{user?.role}</span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 border border-blood-moon/40 text-blood-moon font-orbitron text-[10px] tracking-widest uppercase bg-transparent hover:bg-blood-moon hover:text-starlight transition-all duration-500 flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <Link 
              href="/login"
              className="px-5 py-2 border border-blood-moon text-blood-moon font-orbitron text-[10px] tracking-widest uppercase bg-transparent hover:bg-blood-moon hover:text-starlight transition-all duration-500 flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
