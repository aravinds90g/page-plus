import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import PulsarLoader from '@/components/cosmic-ui/PulsarLoader';
import SolarToast, { ToastContainer } from '@/components/cosmic-ui/SolarToast';
import type { Toast } from '@/lib/cosmicTypes';

describe('PulsarLoader', () => {
  it('should render 6 skeleton cards', () => {
    const { container } = render(<PulsarLoader />);
    const skeletonCards = container.querySelectorAll('.skeleton-card');
    expect(skeletonCards).toHaveLength(6);
  });

  it('should have the correct grid layout', () => {
    const { container } = render(<PulsarLoader />);
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain('grid-cols-1');
    expect(grid.className).toContain('md:grid-cols-2');
    expect(grid.className).toContain('lg:grid-cols-3');
  });
});

describe('SolarToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const baseToast: Toast = {
    id: 'toast-1',
    message: 'Test toast message',
    type: 'cosmic',
    duration: 3000,
  };

  it('should render the toast message', () => {
    const onRemove = vi.fn();
    render(<SolarToast toast={baseToast} onRemove={onRemove} />);
    expect(screen.getByText('Test toast message')).toBeInTheDocument();
  });

  it('should render success icon with green color', () => {
    const onRemove = vi.fn();
    const toast: Toast = { ...baseToast, type: 'success' };
    const { container } = render(<SolarToast toast={toast} onRemove={onRemove} />);
    const svg = container.querySelector('.lucide-check-circle');
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute('class')).toContain('text-green-400');
  });

  it('should render error icon with red color', () => {
    const onRemove = vi.fn();
    const toast: Toast = { ...baseToast, type: 'error' };
    const { container } = render(<SolarToast toast={toast} onRemove={onRemove} />);
    const svg = container.querySelector('.lucide-alert-circle');
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute('class')).toContain('text-red-400');
  });

  it('should render cosmic icon with blood-moon color', () => {
    const onRemove = vi.fn();
    const toast: Toast = { ...baseToast, type: 'cosmic' };
    const { container } = render(<SolarToast toast={toast} onRemove={onRemove} />);
    const svg = container.querySelector('.lucide-sparkles');
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute('class')).toContain('text-blood-moon');
  });

  it('should call onRemove after duration expires', () => {
    const onRemove = vi.fn();
    render(<SolarToast toast={baseToast} onRemove={onRemove} />);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(onRemove).toHaveBeenCalledWith('toast-1');
  });

  it('should call onRemove when close button is clicked', async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<SolarToast toast={baseToast} onRemove={onRemove} />);

    const closeButton = screen.getByRole('button');
    await user.click(closeButton);

    expect(onRemove).toHaveBeenCalledWith('toast-1');
  });
});

describe('ToastContainer', () => {
  it('should render multiple toasts', () => {
    const toasts: Toast[] = [
      { id: '1', message: 'First toast', type: 'success' },
      { id: '2', message: 'Second toast', type: 'error' },
      { id: '3', message: 'Third toast', type: 'cosmic' },
    ];
    const onRemove = vi.fn();
    render(<ToastContainer toasts={toasts} onRemove={onRemove} />);

    expect(screen.getByText('First toast')).toBeInTheDocument();
    expect(screen.getByText('Second toast')).toBeInTheDocument();
    expect(screen.getByText('Third toast')).toBeInTheDocument();
  });

  it('should render nothing when toasts array is empty', () => {
    const { container } = render(<ToastContainer toasts={[]} onRemove={vi.fn()} />);
    const fixedDiv = container.querySelector('[class*="fixed"]');
    expect(fixedDiv?.childElementCount).toBe(0);
  });
});
