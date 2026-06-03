import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AuthProvider, useAuth, API_URL } from '@/lib/AuthContext';

const mockRouter = {
  push: vi.fn(),
};
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

function TestComponent() {
  const { user, token, isLoading, isAuthenticated, isAdmin, login, register, logout } = useAuth();
  return (
    <div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <div data-testid="authenticated">{isAuthenticated.toString()}</div>
      <div data-testid="admin">{isAdmin.toString()}</div>
      <div data-testid="user">{user ? user.email : 'null'}</div>
      <div data-testid="token">{token ? 'has-token' : 'no-token'}</div>
      <button onClick={() => login('test@test.com', 'password123')}>Login</button>
      <button onClick={() => register('Test', 'test@test.com', 'password123', 'user')}>Register</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should finish loading and show unauthenticated', async () => {
    renderWithProvider();
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  it('should login successfully', async () => {
    const user = userEvent.setup();
    const mockSuccessResponse = {
      success: true,
      token: 'test-token-123',
      user: { id: '1', name: 'Test', email: 'test@test.com', role: 'user' },
    };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSuccessResponse),
    });

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    await user.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true');
    });
    expect(screen.getByTestId('user').textContent).toBe('test@test.com');
    expect(screen.getByTestId('token').textContent).toBe('has-token');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('cosmic_token', 'test-token-123');
  });

  it('should handle login failure', async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ success: false, error: 'Invalid credentials' }),
    });

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    await user.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('false');
    });
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  it('should register successfully', async () => {
    const user = userEvent.setup();
    const mockSuccessResponse = {
      success: true,
      token: 'reg-token-456',
      user: { id: '2', name: 'NewUser', email: 'new@test.com', role: 'admin' },
    };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSuccessResponse),
    });

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    await user.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true');
    });
    expect(screen.getByTestId('admin').textContent).toBe('true');
  });

  it('should logout and clear state', async () => {
    const user = userEvent.setup();
    localStorageMock.setItem('cosmic_token', 'existing-token');
    localStorageMock.setItem('cosmic_user', JSON.stringify({ id: '1', name: 'Test', email: 't@t.com', role: 'admin' }));

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true');
    });

    await user.click(screen.getByText('Logout'));

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(screen.getByTestId('token').textContent).toBe('no-token');
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('should restore session from localStorage', async () => {
    localStorageMock.setItem('cosmic_token', 'saved-token');
    localStorageMock.setItem('cosmic_user', JSON.stringify({ id: '3', name: 'Saved', email: 'saved@test.com', role: 'user' }));

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true');
    });
    expect(screen.getByTestId('user').textContent).toBe('saved@test.com');
    expect(screen.getByTestId('token').textContent).toBe('has-token');
  });

  it('should handle corrupt localStorage and remove items', async () => {
    localStorageMock.setItem('cosmic_token', 'some-token');
    localStorageMock.setItem('cosmic_user', 'not-json');

    renderWithProvider();

    await waitFor(() => {
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('cosmic_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('cosmic_user');
    });
  });

  it('should call the correct API endpoint on login', async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, token: 'x', user: { id: '1', name: 'T', email: 'a@b.com', role: 'user' } }),
    });

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    await user.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/auth/login`, expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@test.com', password: 'password123' }),
      }));
    });
  });
});
