import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { NavBar } from './components/NavBar';
import { UsersPage } from './components/UsersPage';
import { GamesPage } from './components/GamesPage';
import { GameView } from './components/GameView';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { clearSession, loadSession } from './api/auth';
import { AuthUser } from './types';

type AuthMode = 'login' | 'register';

function App() {
  const [user, setUser] = useState<AuthUser | null>(() => loadSession()?.user ?? null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  function handleLogin(loggedUser: AuthUser) {
    setUser(loggedUser);
  }

  function handleLogout() {
    clearSession();
    setUser(null);
    setAuthMode('login');
  }

  function handleRegistered() {
    setAuthMode('login');
  }

  if (!user) {
    return (
      <div className="App">
        <div className="App-header">
          {authMode === 'login' ? (
            <LoginForm onLogin={handleLogin} onGoRegister={() => setAuthMode('register')} />
          ) : (
            <RegisterForm onRegistered={handleRegistered} onGoLogin={() => setAuthMode('login')} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <NavBar user={user} onLogout={handleLogout} />

      <main className="main-content">
        <Routes>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:id" element={<GameView />} />
          <Route path="*" element={<Navigate to="/games" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
