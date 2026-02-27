import { useEffect, useState } from 'react';
import { loadSession } from '../api/auth';
import { UserRole } from '../enums';
import { UserItem } from '../types';
import { apiGetUsers, apiUpdateUser, apiDeleteUser } from '../api/users';

const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.Admin]: 'Администратор',
  [UserRole.Editor]: 'Редактор',
  [UserRole.Viewer]: 'Зритель',
};

const ALL_ROLES = Object.values(UserRole);

interface EditState {
  name: string;
  email: string;
  role: UserRole;
}

export function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({ name: '', email: '', role: UserRole.Viewer });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const token = loadSession()?.token ?? '';

  useEffect(() => {
    apiGetUsers(token)
      .then(setUsers)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  function startEdit(user: UserItem) {
    setEditingId(user.id);
    setEditState({ name: user.name, email: user.email, role: user.role });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: string) {
    setSaving(true);
    try {
      const updated = await apiUpdateUser(token, id, editState);
      setUsers(prev => prev.map(u => (u.id === id ? updated : u)));
      setEditingId(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteUser(id: string) {
    if (!window.confirm('Удалить пользователя?')) return;
    setDeletingId(id);
    try {
      await apiDeleteUser(token, id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="page-content">
      <h2 className="page-title">Пользователи</h2>

      {error && <p className="users-error">{error}</p>}

      {loading ? (
        <p className="page-placeholder">Загрузка...</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                {editingId === user.id ? (
                  <>
                    <td>
                      <input
                        className="users-input"
                        value={editState.name}
                        onChange={e => setEditState(s => ({ ...s, name: e.target.value }))}
                      />
                    </td>
                    <td>
                      <input
                        className="users-input"
                        value={editState.email}
                        onChange={e => setEditState(s => ({ ...s, email: e.target.value }))}
                      />
                    </td>
                    <td>
                      <select
                        className="users-select"
                        value={editState.role}
                        onChange={e => setEditState(s => ({ ...s, role: e.target.value as UserRole }))}
                      >
                        {ALL_ROLES.map(r => (
                          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="users-actions">
                      <button
                        className="users-btn users-btn-save"
                        onClick={() => saveEdit(user.id)}
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
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`users-role users-role-${user.role}`}>
                        {ROLE_LABELS[user.role] ?? user.role}
                      </span>
                    </td>
                    <td className="users-actions">
                      <button
                        className="users-btn users-btn-edit"
                        onClick={() => startEdit(user)}
                      >
                        Изменить
                      </button>
                      <button
                        className="users-btn users-btn-delete"
                        onClick={() => deleteUser(user.id)}
                        disabled={deletingId === user.id}
                      >
                        Удалить
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
