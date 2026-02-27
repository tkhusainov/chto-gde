import { BASE_URL } from './config';
import { UserRole } from '../enums';
import { UserItem } from '../types';

export type { UserItem };

export async function apiGetUsers(token: string): Promise<UserItem[]> {
  const res = await fetch(`${BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Ошибка загрузки пользователей');
  return data;
}

export async function apiUpdateUser(
  token: string,
  id: string,
  data: { name?: string; email?: string; role?: UserRole },
): Promise<UserItem> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Ошибка обновления');
  return result;
}

export async function apiDeleteUser(token: string, id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Ошибка удаления');
  }
}
