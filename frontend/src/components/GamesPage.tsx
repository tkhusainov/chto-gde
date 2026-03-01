import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadSession } from '../api/auth';
import { GameItem, UserItem } from '../types';
import { apiGetGames, apiCreateGame, apiUpdateGame, apiDeleteGame } from '../api/games';
import { apiGetUsers } from '../api/users';
import { UserRole } from '../enums';

export function GamesPage() {
  const navigate = useNavigate();
  const [games, setGames] = useState<GameItem[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const session = loadSession();
  const token = session?.token ?? '';
  const currentUser = session?.user;

  useEffect(() => {
    Promise.all([apiGetGames(token), apiGetUsers(token)])
      .then(([gamesData, usersData]) => {
        setGames(gamesData);
        setUsersMap(Object.fromEntries(usersData.map((u: UserItem) => [u.id, u.name])));
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  function startEdit(game: GameItem) {
    setEditingId(game.id);
    setEditName(game.name);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: string) {
    setSaving(true);
    try {
      const updated = await apiUpdateGame(token, id, editName);
      setGames(prev => prev.map(g => (g.id === id ? updated : g)));
      setEditingId(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteGame(id: string) {
    if (!window.confirm('Удалить игру?')) return;
    setDeletingId(id);
    try {
      await apiDeleteGame(token, id);
      setGames(prev => prev.filter(g => g.id !== id));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  async function createGame() {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const created = await apiCreateGame(token, newName.trim());
      setGames(prev => [...prev, created]);
      setNewName('');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="page-content">
      <h2 className="page-title">Игры</h2>

      {error && <p className="users-error">{error}</p>}

      <div className="games-create-row">
        <input
          className="users-input games-create-input"
          placeholder="Название новой игры"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && createGame()}
        />
        <button
          className="users-btn users-btn-save"
          onClick={createGame}
          disabled={creating || !newName.trim()}
        >
          Добавить
        </button>
      </div>

      {loading ? (
        <p className="page-placeholder">Загрузка...</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Владелец</th>
              <th>Code</th>
              <th>Pin</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {games.map(game => {
              const canEdit = currentUser?.role === UserRole.Admin || game.userId === currentUser?.id;
              return (
              <tr key={game.id}>
                {editingId === game.id ? (
                  <>
                    <td>
                      <input
                        className="users-input"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                      />
                    </td>
                    <td>{game.userId ? usersMap[game.userId] ?? '—' : '—'}</td>
                    <td>{game.code}</td>
                    <td>{game.pin}</td>
                    <td className="users-actions">
                      <button
                        className="users-btn users-btn-save"
                        onClick={() => saveEdit(game.id)}
                        disabled={saving}
                      >
                        Сохранить
                      </button>
                      <button className="users-btn users-btn-cancel" onClick={cancelEdit}>
                        Отмена
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{game.name}</td>
                    <td>{game.userId ? usersMap[game.userId] ?? '—' : '—'}</td>
                    <td>{game.code}</td>
                    <td>{game.pin}</td>
                    <td className="users-actions">
                      <button
                        className="users-btn users-btn-launch"
                        onClick={() => navigate(`/games/${game.id}`)}
                      >
                        Запустить
                      </button>
                      {canEdit && (
                        <>
                          <button
                            className="users-btn users-btn-edit"
                            onClick={() => navigate(`/games/${game.id}/questions`)}
                          >
                            Вопросы
                          </button>
                          <button
                            className="users-btn users-btn-edit"
                            onClick={() => startEdit(game)}
                          >
                            Изменить
                          </button>
                          <button
                            className="users-btn users-btn-delete"
                            onClick={() => deleteGame(game.id)}
                            disabled={deletingId === game.id}
                          >
                            Удалить
                          </button>
                        </>
                      )}
                    </td>
                  </>
                )}
              </tr>
              );
            })}
            {games.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                  Игры не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
