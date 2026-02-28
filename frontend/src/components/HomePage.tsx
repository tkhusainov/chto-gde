import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <h1 className="home-title">Что? Где? Когда?</h1>
      <div className="home-buttons">
        <button className="home-btn home-btn-play" onClick={() => navigate('/play')}>Играть</button>
        <button className="home-btn home-btn-login" onClick={() => navigate('/login')}>Войти</button>
      </div>
    </div>
  );
}
