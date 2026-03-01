import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadSession } from '../api/auth';
import { apiGetGame } from '../api/games';
import { apiGetQuestions } from '../api/questions';
import { Question } from '../types';
import { Game } from './Game';

export function GameView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = loadSession()?.token ?? '';

  const [gameName, setGameName] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [startBannerOpen, setStartBannerOpen] = useState(true);
  const [winBannerOpen, setWinBannerOpen] = useState(false);
  const [loseBannerOpen, setLoseBannerOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([apiGetGame(token, id), apiGetQuestions(token, id)])
      .then(([game, qs]) => {
        setGameName(game.name);
        setQuestions(qs);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  function handleClose() {
    navigate('/games');
  }

  if (loading) {
    return (
      <header className="App-header">
        <p className="page-placeholder">Загрузка...</p>
      </header>
    );
  }

  return (
    <header className="App-header">
      <button className="game-close-btn" onClick={handleClose}>← Назад</button>

      {startBannerOpen &&
        <div className='banner start-banner flex-center'>
          <div>
            {gameName && <h2>{gameName}</h2>}
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

      {error &&
        <div className='banner error-banner flex-center'>
          <div>
            <h1>{'Ошибка'}</h1>
            <p>{error}</p>
          </div>
        </div>}

      {!error && !questions.length &&
        <div className='banner error-banner flex-center'>
          <div>
            <h1>{'Ошибка'}</h1>
            <p>{'Вопросы не найдены'}</p>
          </div>
        </div>}

      {!!questions.length &&
        <Game
          questions={questions}
          onWin={() => setWinBannerOpen(true)}
          onPause={() => setIsPaused(true)}
          onLose={() => setLoseBannerOpen(true)}
        />}
    </header>
  );
}
