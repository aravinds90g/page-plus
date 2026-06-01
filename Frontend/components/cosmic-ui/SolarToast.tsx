"use client";

import { useEffect } from 'react';
import { Toast } from '@/lib/cosmicTypes';
import { CheckCircle, AlertCircle, Sparkles, X } from 'lucide-react';

interface SolarToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

export default function SolarToast({ toast, onRemove }: SolarToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    cosmic: <Sparkles className="w-5 h-5 text-blood-moon" />,
  };

  const glowColors = {
    success: 'shadow-[0_0_20px_rgba(74,222,128,0.2)]',
    error: 'shadow-[0_0_20px_rgba(248,113,113,0.2)]',
    cosmic: 'shadow-[0_0_20px_rgba(255,61,0,0.3)]',
  };

  const borderColors = {
    success: 'border-green-500/30',
    error: 'border-red-500/30',
    cosmic: 'border-blood-moon/30',
  };

  return (
    <div 
      className={`relative bg-obsidian-card/95 backdrop-blur-xl border ${borderColors[toast.type]} ${glowColors[toast.type]} rounded-lg p-4 min-w-[320px] max-w-md toast-enter overflow-hidden`}
    >
      {/* Top accent glow */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${
        toast.type === 'success' ? 'bg-green-500' : 
        toast.type === 'error' ? 'bg-red-500' : 'bg-blood-moon'
      } opacity-60 animate-pulse`} />

      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <p className="text-starlight font-crimson text-sm flex-1">{toast.message}</p>
        <button 
          onClick={() => onRemove(toast.id)}
          className="text-void-silver hover:text-starlight transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <SolarToast toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}
