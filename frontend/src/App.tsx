import React, { useMemo, useState } from 'react';
import './App.css';

import { Game } from './components/Game';
import { questionService } from './questions.service';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { AuthUser, clearSession, loadSession } from './api/auth';

// Game is a folder name in public folder
// Also question list in const also depends on GAME -- see questionService
const GAME = 2;

type AuthMode = 'login' | 'register';

function App() {
  const [user, setUser] = useState<AuthUser | null>(() => loadSession()?.user ?? null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const [startBannerOpen, setStartBannerOpen] = useState(true);
  const [winBannerOpen, setWinBannerOpen] = useState(false);
  const [loseBannerOpen, setLoseBannerOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const questions = useMemo(() => questionService.getQuestions(GAME), []);

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
      <header className="App-header">
        <button className="logout-btn" onClick={handleLogout}>Выйти</button>

        {startBannerOpen &&
          <div className='banner start-banner flex-center'>
            <div>
              <audio controls>
                <source src="/meeting.mp3" type="audio/mp3"></source>
              </audio>
              <div>
                <button className='answer-btn start-btn' onClick={() => setStartBannerOpen(false)}>Начать</button>
              </div>
            </div>
          </div>}

          {isPaused &&
            <div className='banner pause-banner flex-center'>
                <div className='content flex-center'>
                    <h1>{'Музыкальная пауза'}</h1>
                    <button className="answer-btn" onClick={() => setIsPaused(false)}>{'Продолжить'}</button>

                    <audio controls autoPlay={true}>
                        <source src="/pause4.mp3" type="audio/mp3"></source>
                    </audio>
                </div>
            </div>}

          {winBannerOpen &&
            <div className='banner win-banner flex-center'>
              <div>
                <h1>{'Знатоки победили!!!'}</h1>
                <audio autoPlay={true}>
                  <source src="/chgk2_end.mp3" type="audio/mp3"></source>
                </audio>
              </div>
            </div>}

          {loseBannerOpen &&
            <div className='banner lose-banner flex-center'>
              <div>
                <h1>{'Знатоки проиграли!!!'}</h1>
                <audio autoPlay={true}>
                  <source src="/chgk2_no1.mp3" type="audio/mp3"></source>
                </audio>
              </div>
            </div>}

        {!questions.length &&
          <div className='banner error-banner flex-center'>
            <div>
              <h1>{'Ошибка'}</h1>
              <p>{'Вопросы не найдены'}</p>
            </div>
          </div>}

        {!!questions.length &&
          <Game questions={questions} onWin={() => setWinBannerOpen(true)} onPause={() => setIsPaused(true)} onLose={() => setLoseBannerOpen(true)} />}
      </header>
    </div>
  );
}

export default App;
