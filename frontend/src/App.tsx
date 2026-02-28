import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

import { NavBar } from './components/NavBar';
import { HomePage } from './components/HomePage';
import { UsersPage } from './components/UsersPage';
import { GamesPage } from './components/GamesPage';
import { GameView } from './components/GameView';
import { QuestionsPage } from './components/QuestionsPage';
import { QuestionEditPage } from './components/QuestionEditPage';
import { PlayPage } from './components/PlayPage';
import { PlayerGamePage } from './components/PlayerGamePage';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { clearSession, loadSession } from './api/auth';
import { AuthUser } from './types';

function App() {
  const [user, setUser] = useState<AuthUser | null>(() => loadSession()?.user ?? null);
  const navigate = useNavigate();
  const location = useLocation();
  const isGameActive = /^\/games\/[^/]+$/.test(location.pathname);

  function handleLogin(loggedUser: AuthUser) {
    setUser(loggedUser);
    navigate('/games');
  }

  function handleLogout() {
    clearSession();
    setUser(null);
    navigate('/');
  }

  if (!user) {
    return (
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/play/:code/:pin" element={<PlayerGamePage />} />
          <Route path="/login" element={
            <div className="App-header">
              <div className="auth-back-wrapper">
                <button className="back-btn" onClick={() => navigate('/')}>← Назад</button>
              </div>
              <LoginForm onLogin={handleLogin} onGoRegister={() => navigate('/register')} />
            </div>
          } />
          <Route path="/register" element={
            <div className="App-header">
              <div className="auth-back-wrapper">
                <button className="back-btn" onClick={() => navigate('/')}>← Назад</button>
              </div>
              <RegisterForm onRegistered={() => navigate('/login')} onGoLogin={() => navigate('/login')} />
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="App">
      {!isGameActive && <NavBar user={user} onLogout={handleLogout} />}

      <main className={isGameActive ? undefined : 'main-content'}>
        <Routes>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:id" element={<GameView />} />
          <Route path="/games/:id/questions" element={<QuestionsPage />} />
          <Route path="/games/:id/questions/:questionId" element={<QuestionEditPage />} />
          <Route path="*" element={<Navigate to="/games" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
