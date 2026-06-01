"use client";

export default function PulsarLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div 
          key={i}
          className="skeleton-card bg-obsidian-card border border-[rgba(255,255,255,0.04)] p-6 md:p-8 h-[280px] md:h-[320px]"
        >
          <div className="flex justify-between mb-6">
            <div className="w-20 h-6 bg-void-deep rounded" />
            <div className="w-12 h-4 bg-void-deep rounded" />
          </div>
          <div className="w-3/4 h-8 bg-void-deep rounded mb-3" />
          <div className="w-1/2 h-4 bg-void-deep rounded mb-6" />
          <div className="w-full h-16 bg-void-deep rounded mb-4" />
          <div className="w-2/3 h-4 bg-void-deep rounded mb-6" />
          <div className="w-full h-px bg-void-deep mb-4" />
          <div className="flex gap-4">
            <div className="w-16 h-4 bg-void-deep rounded" />
            <div className="w-16 h-4 bg-void-deep rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
