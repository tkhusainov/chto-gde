import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkHealth } from '../api/config';

export function HomePage() {
  const navigate = useNavigate();
  const [healthStatus, setHealthStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    checkHealth(
      (n) => setAttempt(n),
    ).then(ok => setHealthStatus(ok ? 'ok' : 'error'));
  }, []);

  return (
    <div className="home-page">
      <h1 className="home-title">Что? Где? Когда?</h1>
      <div className="home-buttons">
        <button className="home-btn home-btn-play" onClick={() => navigate('/play')}>Играть</button>
        <button className="home-btn home-btn-login" onClick={() => navigate('/login')}>Войти</button>
      </div>
      <div className={`health-status health-status--${healthStatus}`}>
        {healthStatus === 'loading' && (attempt > 1 ? `Запуск сервера... (${attempt})` : 'Проверка сервера...')}
        {healthStatus === 'ok' && 'Сервер доступен'}
        {healthStatus === 'error' && 'Сервер недоступен'}
      </div>
    </div>
  );
}
