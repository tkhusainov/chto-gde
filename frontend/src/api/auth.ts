import { BASE_URL } from './config';
import { AuthUser } from '../types';

export type { AuthUser };
export { UserRole } from '../enums';

export async function apiRegister(name: string, email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Ошибка регистрации');
  return data;
}

export async function apiLogin(email: string, password: string): Promise<{ access_token: string; user: AuthUser }> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Неверный email или пароль');
  return data;
}

export function saveSession(token: string, user: AuthUser) {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
}

export function loadSession(): { token: string; user: AuthUser } | null {
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('auth_user');
  if (!token || !userStr) return null;
  try {
    return { token, user: JSON.parse(userStr) };
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}
