import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiJoinGame } from '../api/games';

export function PlayPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiJoinGame(code, pin);
      navigate(`/play/${code}/${pin}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="play-page">
      <div className="auth-back-wrapper">
        <button className="back-btn" onClick={() => navigate('/')}>← Назад</button>
      </div>
      <div className="auth-card">
        <h2 className="auth-title">Войти в игру</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Код игры</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder="0000"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              required
              autoFocus
              className="play-code-input"
            />
          </div>
          <div className="auth-field">
            <label>PIN</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder="0000"
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
              required
              className="play-code-input"
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button
            type="submit"
            className="answer-btn start-btn"
            disabled={loading || code.length !== 4 || pin.length !== 4}
          >
            {loading ? 'Поиск...' : 'Войти в игру'}
          </button>
        </form>
      </div>
    </div>
  );
}
