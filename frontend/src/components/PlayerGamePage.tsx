import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiJoinGame } from '../api/games';
import { apiGetPlayerQuestions } from '../api/questions';
import { Question } from '../types';
import { Game } from './Game';

export function PlayerGamePage() {
  const { code, pin } = useParams<{ code: string; pin: string }>();

  const [gameName, setGameName] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [startBannerOpen, setStartBannerOpen] = useState(true);
  const [winBannerOpen, setWinBannerOpen] = useState(false);
  const [loseBannerOpen, setLoseBannerOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!code || !pin) return;
    apiJoinGame(code, pin)
      .then(game => {
        setGameName(game.name);
        return apiGetPlayerQuestions(game.id, pin);
      })
      .then(setQuestions)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [code, pin]);

  if (loading) {
    return (
      <header className="App-header">
        <p className="page-placeholder">Загрузка...</p>
      </header>
    );
  }

  return (
    <header className="App-header">
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

      {!error && !loading && !questions.length &&
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
