import React, { useState } from 'react';
import { apiLogin, saveSession } from '../../api/auth';
import { AuthUser } from '../../types';

interface Props {
  onLogin: (user: AuthUser) => void;
  onGoRegister: () => void;
}

export function LoginForm({ onLogin, onGoRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { access_token, user } = await apiLogin(email, password);
      saveSession(access_token, user);
      onLogin(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <h2 className="auth-title">Вход</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="auth-field">
          <label>Пароль</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="answer-btn start-btn" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
      <p className="auth-footer">
        Нет аккаунта?{' '}
        <button type="button" className="auth-link" onClick={onGoRegister}>
          Зарегистрироваться
        </button>
      </p>
    </div>
  );
}
