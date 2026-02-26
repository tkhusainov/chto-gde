import React, { useState } from 'react';
import { apiRegister } from '../../api/auth';

interface Props {
  onRegistered: () => void;
  onGoLogin: () => void;
}

export function RegisterForm({ onRegistered, onGoLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);
    try {
      await apiRegister(email, password);
      onRegistered();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <h2 className="auth-title">Регистрация</h2>
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
        <div className="auth-field">
          <label>Повторите пароль</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="answer-btn start-btn" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
      <p className="auth-footer">
        Уже есть аккаунт?{' '}
        <button type="button" className="auth-link" onClick={onGoLogin}>
          Войти
        </button>
      </p>
    </div>
  );
}
