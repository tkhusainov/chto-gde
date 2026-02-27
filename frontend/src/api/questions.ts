import { BASE_URL } from './config';
import { Question } from '../types';

export async function apiGetQuestions(token: string, gameId: string): Promise<Question[]> {
  const res = await fetch(`${BASE_URL}/questions?gameId=${gameId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Ошибка загрузки вопросов');
  return data;
}
