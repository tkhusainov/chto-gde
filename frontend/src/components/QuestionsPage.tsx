import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadSession } from '../api/auth';
import { apiGetQuestions, apiCreateQuestion, apiDeleteQuestion } from '../api/questions';
import { apiGetGame } from '../api/games';
import { Question } from '../types';
import { QuestionType } from '../enums';

const QUESTION_TYPE_LABELS: Record<string, string> = {
  text: 'Текст',
  image: 'Изображение',
  video: 'Видео',
  'black-box': 'Чёрный ящик',
  blitz: 'Блиц',
};

type FormState = {
  type: QuestionType;
  header: string;
  description: string;
  image: string;
  answerDescription: string;
};

const emptyForm = (): FormState => ({
  type: QuestionType.Text,
  header: '',
  description: '',
  image: '',
  answerDescription: '',
});

export function QuestionsPage() {
  const { id: gameId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = loadSession()?.token ?? '';

  const [gameName, setGameName] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [addingOpen, setAddingOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) return;
    Promise.all([apiGetGame(token, gameId), apiGetQuestions(token, gameId)])
      .then(([game, qs]) => { setGameName(game.name); setQuestions(qs); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [gameId, token]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleCreate() {
    if (!gameId) return;
    setSaving(true);
    try {
      const created = await apiCreateQuestion(token, gameId, {
        number: String(questions.length + 1),
        type: form.type,
        header: form.header || undefined,
        description: form.description || undefined,
        image: form.image || undefined,
        answer: form.answerDescription ? { type: 'text', description: form.answerDescription } : undefined,
      });
      setQuestions(prev => [...prev, created]);
      setAddingOpen(false);
      setForm(emptyForm());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Удалить вопрос?')) return;
    setDeletingId(id);
    try {
      await apiDeleteQuestion(token, id);
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="page-content">
      <div className="questions-header">
        <h2 className="page-title">Вопросы{gameName ? ` — ${gameName}` : ''}</h2>
        <button className="back-btn questions-back" onClick={() => navigate('/games')}>← Назад</button>
      </div>

      {error && <p className="users-error">{error}</p>}

      <button
        className="users-btn users-btn-save questions-add-btn"
        onClick={() => { setAddingOpen(true); setForm(emptyForm()); }}
        disabled={addingOpen}
      >
        + Добавить вопрос
      </button>

      {addingOpen && (
        <div className="question-form-panel">
          <h3 className="question-form-title">Новый вопрос #{questions.length + 1}</h3>
          <div className="question-form-grid">
            <div className="auth-field question-form-full">
              <label>Тип</label>
              <select className="users-select" value={form.type} onChange={e => setField('type', e.target.value as QuestionType)}>
                {Object.values(QuestionType).map(t => (
                  <option key={t} value={t}>{QUESTION_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <div className="auth-field question-form-full">
              <label>Заголовок</label>
              <input className="users-input" value={form.header} onChange={e => setField('header', e.target.value)} autoFocus />
            </div>
            {form.type === QuestionType.Image && <div className="auth-field question-form-full">
              <label>Фото вопроса</label>
              <input
                type="file"
                accept="image/*"
                className="users-input"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setField('image', reader.result as string);
                  reader.readAsDataURL(file);
                }}
              />
              {form.image && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <img src={form.image} alt="Фото вопроса" style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 4 }} />
                  <button type="button" className="users-btn users-btn-cancel" onClick={() => setField('image', '')}>
                    Удалить
                  </button>
                </div>
              )}
            </div>}
            <div className="auth-field question-form-full">
              <label>Вопрос</label>
              <textarea className="users-input question-textarea" value={form.description} onChange={e => setField('description', e.target.value)} rows={3} />
            </div>
            <div className="auth-field question-form-full">
              <label>Ответ</label>
              <textarea className="users-input question-textarea" value={form.answerDescription} onChange={e => setField('answerDescription', e.target.value)} rows={2} />
            </div>
          </div>
          <div className="users-actions question-form-actions">
            <button className="users-btn users-btn-save" onClick={handleCreate} disabled={saving}>
              {saving ? 'Сохранение...' : 'Добавить'}
            </button>
            <button className="users-btn users-btn-cancel" onClick={() => setAddingOpen(false)}>Отмена</button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="page-placeholder">Загрузка...</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Тип</th>
              <th>Автор</th>
              <th>Заголовок</th>
              <th>Вопрос</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, idx) => (
              <tr key={q.id}>
                <td>{idx + 1}</td>
                <td>{QUESTION_TYPE_LABELS[q.type] ?? q.type}</td>
                <td className="question-cell-truncate">{q.author?.name ?? '—'}</td>
                <td>{q.header ?? '—'}</td>
                <td className="question-cell-truncate">{q.description ?? '—'}</td>
                <td className="users-actions">
                  <button
                    className="users-btn users-btn-edit"
                    onClick={() => navigate(`/games/${gameId}/questions/${q.id}`)}
                  >
                    Изменить
                  </button>
                  <button
                    className="users-btn users-btn-delete"
                    onClick={() => handleDelete(q.id)}
                    disabled={deletingId === q.id}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
            {questions.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                  Вопросы не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
