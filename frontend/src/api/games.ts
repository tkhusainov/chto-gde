import { GameItem } from '../types';

import { BASE_URL } from './config';

export async function apiGetGames(token: string): Promise<GameItem[]> {
  const res = await fetch(`${BASE_URL}/games`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Ошибка загрузки игр');
  return data;
}

export async function apiCreateGame(token: string, name: string): Promise<GameItem> {
  const res = await fetch(`${BASE_URL}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Ошибка создания игры');
  return data;
}

export async function apiUpdateGame(token: string, id: string, name: string): Promise<GameItem> {
  const res = await fetch(`${BASE_URL}/games/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Ошибка обновления игры');
  return data;
}

export async function apiDeleteGame(token: string, id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/games/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Ошибка удаления игры');
  }
}
