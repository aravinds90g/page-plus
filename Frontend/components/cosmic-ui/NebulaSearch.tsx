"use client";

import { Search, X } from 'lucide-react';

interface NebulaSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function NebulaSearch({ value, onChange }: NebulaSearchProps) {
  return (
    <div className="relative max-w-xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-void-silver" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search the archives..."
        className="w-full bg-void-deep border border-[rgba(255,255,255,0.04)] focus:border-blood-moon/50 pl-14 pr-12 py-4 text-starlight font-crimson text-base outline-none transition-all duration-500 focus:shadow-[0_0_30px_rgba(255,61,0,0.1)] placeholder:text-void-silver/50"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-5 flex items-center text-void-silver hover:text-starlight transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blood-moon/20 to-transparent" />
    </div>
  );
}
