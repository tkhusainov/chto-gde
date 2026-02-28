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

export async function apiCreateQuestion(token: string, gameId: string, data: Record<string, any>): Promise<Question> {
  const res = await fetch(`${BASE_URL}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ...data, gameId }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Ошибка создания вопроса');
  return json;
}

export async function apiUpdateQuestion(token: string, mongoId: string, data: Record<string, any>): Promise<Question> {
  const res = await fetch(`${BASE_URL}/questions/${mongoId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Ошибка обновления вопроса');
  return json;
}

export async function apiDeleteQuestion(token: string, mongoId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/questions/${mongoId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.message || 'Ошибка удаления вопроса');
  }
}

export async function apiGetPlayerQuestions(gameId: string, pin: string): Promise<Question[]> {
  const res = await fetch(`${BASE_URL}/questions/public?gameId=${gameId}&pin=${pin}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Ошибка загрузки вопросов');
  return data;
}
