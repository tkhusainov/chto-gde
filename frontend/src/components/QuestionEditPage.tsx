import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadSession } from '../api/auth';
import { apiGetQuestions, apiUpdateQuestion } from '../api/questions';
import { QuestionType, AnswerType } from '../enums';
import { SelectedQuestion } from './SelectedQuestion';

const IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const VIDEO_MAX_BYTES = 7 * 1024 * 1024; // 7 MB

const ANSWER_TYPE_LABELS: Record<string, string> = {
  text: 'Текст',
  image: 'Изображение',
  video: 'Видео',
};

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
  video: string;
  answerType: AnswerType;
  answerImage: string;
  answerVideo: string;
  answerDescription: string;
  authorName: string;
  authorPhoto: string;
};

export function QuestionEditPage() {
  const { id: gameId, questionId } = useParams<{ id: string; questionId: string }>();
  const navigate = useNavigate();
  const token = loadSession()?.token ?? '';

  const [rowNumber, setRowNumber] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>({
    type: QuestionType.Text,
    header: '',
    description: '',
    image: '',
    video: '',
    answerType: AnswerType.Text,
    answerImage: '',
    answerVideo: '',
    answerDescription: '',
    authorName: '',
    authorPhoto: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const previewQuestion = useMemo(() => ({
    id: questionId ?? '',
    number: String(rowNumber ?? 1),
    type: form.type,
    header: form.header || undefined,
    description: form.description || undefined,
    image: form.image || undefined,
    video: form.video || undefined,
    answer: (form.answerDescription || form.answerImage || form.answerVideo)
      ? { type: form.answerType, description: form.answerDescription || undefined, image: form.answerImage || undefined, video: form.answerVideo || undefined }
      : undefined,
    author: form.authorName
      ? { name: form.authorName, photo: form.authorPhoto }
      : undefined,
  }), [questionId, rowNumber, form]);

  useEffect(() => {
    if (!gameId || !questionId) return;
    apiGetQuestions(token, gameId)
      .then(questions => {
        const idx = questions.findIndex(q => q.id === questionId);
        if (idx === -1) { setError('Вопрос не найден'); return; }
        const q = questions[idx];
        setRowNumber(idx + 1);
        setForm({
          type: q.type,
          header: q.header ?? '',
          description: q.description ?? '',
          image: q.image ?? '',
          video: q.video ?? '',
          answerType: q.answer?.type ?? AnswerType.Text,
          answerImage: q.answer?.image ?? '',
          answerVideo: q.answer?.video ?? '',
          answerDescription: q.answer?.description ?? '',
          authorName: q.author?.name ?? '',
          authorPhoto: q.author?.photo ?? '',
        });
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [gameId, questionId, token]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!questionId) return;
    setSaving(true);
    try {
      const author = form.authorName
        ? { name: form.authorName, photo: form.authorPhoto || undefined }
        : undefined;
      await apiUpdateQuestion(token, questionId, {
        type: form.type,
        header: form.header || undefined,
        description: form.description || undefined,
        image: form.image || undefined,
        video: form.video || undefined,
        answer: form.answerDescription || form.answerImage || form.answerVideo
          ? { type: form.answerType, description: form.answerDescription || undefined, image: form.answerImage || undefined, video: form.answerVideo || undefined }
          : undefined,
        author,
      });
      navigate(`/games/${gameId}/questions`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="page-content"><p className="page-placeholder">Загрузка...</p></div>;
  }

  return (
    <div className="page-content">
      <div className="questions-header">
        <h2 className="page-title">Редактирование вопроса #{rowNumber}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="users-btn users-btn-save" onClick={() => setPreviewOpen(true)}>
            Предпросмотр
          </button>
          <button className="back-btn questions-back" onClick={() => navigate(`/games/${gameId}/questions`)}>
            ← Назад
          </button>
        </div>
      </div>

      {previewOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', overflow: 'auto' }}>
          <SelectedQuestion
            question={previewQuestion}
            index={(rowNumber ?? 1) - 1}
            onAnswer={() => setPreviewOpen(false)}
          />
        </div>
      )}

      {error && <p className="users-error">{error}</p>}

      <div className="question-form-panel">
        <div className="question-form-grid">
          <div className="auth-field">
            <label>Тип</label>
            <select className="users-select" value={form.type} onChange={e => setField('type', e.target.value as QuestionType)}>
              {Object.values(QuestionType).map(t => (
                <option key={t} value={t}>{QUESTION_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
          <div className="question-form-full" style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="auth-field">
                <label>Имя автора</label>
                <input className="users-input" value={form.authorName} onChange={e => setField('authorName', e.target.value)} placeholder="Иван Иванов" />
              </div>
              <div className="auth-field">
                <label>Фото автора</label>
                <input
                  type="file"
                  accept="image/*"
                  className="users-input"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > IMAGE_MAX_BYTES) { setError('Фото автора не должно превышать 5 МБ'); e.target.value = ''; return; }
                    const reader = new FileReader();
                    reader.onload = () => setField('authorPhoto', reader.result as string);
                    reader.readAsDataURL(file);
                  }}
                />
              </div>
            </div>
            {form.authorPhoto && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <img src={form.authorPhoto} alt="Фото автора" style={{ width: 160, maxHeight: 160, objectFit: 'contain', borderRadius: 4 }} />
                <button type="button" className="users-btn users-btn-cancel" onClick={() => setField('authorPhoto', '')}>
                  Удалить фото
                </button>
              </div>
            )}
          </div>
          <div className="auth-field question-form-full">
            <label>Заголовок</label>
            <input className="users-input" value={form.header} onChange={e => setField('header', e.target.value)} />
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
                if (file.size > IMAGE_MAX_BYTES) { setError('Фото вопроса не должно превышать 5 МБ'); e.target.value = ''; return; }
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
          {form.type === QuestionType.Video && <div className="auth-field question-form-full">
            <label>Видео вопроса</label>
            <input
              type="file"
              accept="video/*"
              className="users-input"
              onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > VIDEO_MAX_BYTES) { setError('Видео не должно превышать 7 МБ'); e.target.value = ''; return; }
                const reader = new FileReader();
                reader.onload = () => setField('video', reader.result as string);
                reader.readAsDataURL(file);
              }}
            />
            {form.video && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <video src={form.video} controls style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 4 }} />
                <button type="button" className="users-btn users-btn-cancel" onClick={() => setField('video', '')}>
                  Удалить
                </button>
              </div>
            )}
          </div>}
          <div className="auth-field question-form-full">
            <label>Вопрос</label>
            <textarea className="users-input question-textarea" value={form.description} onChange={e => setField('description', e.target.value)} rows={4} />
          </div>
          <div className="auth-field">
            <label>Тип ответа</label>
            <select className="users-select" value={form.answerType} onChange={e => setField('answerType', e.target.value as AnswerType)}>
              {Object.values(AnswerType).map(t => (
                <option key={t} value={t}>{ANSWER_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
          <div className="auth-field question-form-full">
            <label>Ответ</label>
            <textarea className="users-input question-textarea" value={form.answerDescription} onChange={e => setField('answerDescription', e.target.value)} rows={2} />
          </div>
          {form.answerType === AnswerType.Image && (
            <div className="auth-field question-form-full">
              <label>Фото ответа</label>
              <input
                type="file"
                accept="image/*"
                className="users-input"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > IMAGE_MAX_BYTES) { setError('Фото ответа не должно превышать 5 МБ'); e.target.value = ''; return; }
                  const reader = new FileReader();
                  reader.onload = () => setField('answerImage', reader.result as string);
                  reader.readAsDataURL(file);
                }}
              />
              {form.answerImage && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <img src={form.answerImage} alt="Фото ответа" style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 4 }} />
                  <button type="button" className="users-btn users-btn-cancel" onClick={() => setField('answerImage', '')}>
                    Удалить
                  </button>
                </div>
              )}
            </div>
          )}
          {form.answerType === AnswerType.Video && (
            <div className="auth-field question-form-full">
              <label>Видео ответа</label>
              <input
                type="file"
                accept="video/*"
                className="users-input"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > VIDEO_MAX_BYTES) { setError('Видео ответа не должно превышать 7 МБ'); e.target.value = ''; return; }
                  const reader = new FileReader();
                  reader.onload = () => setField('answerVideo', reader.result as string);
                  reader.readAsDataURL(file);
                }}
              />
              {form.answerVideo && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <video src={form.answerVideo} controls style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 4 }} />
                  <button type="button" className="users-btn users-btn-cancel" onClick={() => setField('answerVideo', '')}>
                    Удалить
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="users-actions question-form-actions">
          <button className="users-btn users-btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button className="users-btn users-btn-cancel" onClick={() => navigate(`/games/${gameId}/questions`)}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
