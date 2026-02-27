import { useNavigate, useLocation } from 'react-router-dom';
import { AuthUser } from '../types';
import { UserRole } from '../enums';

interface Props {
  user: AuthUser;
  onLogout: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Администратор',
  editor: 'Редактор',
  viewer: 'Зритель',
};

export function NavBar({ user, onLogout }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="sidebar">
      <div className="sidebar-user">
        <div className="sidebar-avatar">{user.name.charAt(0).toUpperCase()}</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user.name}</div>
          <div className="sidebar-user-role">{ROLE_LABELS[user.role] ?? user.role}</div>
        </div>
      </div>

      <div className="sidebar-menu">
        <button
          className={`sidebar-item${location.pathname === '/games' ? ' active' : ''}`}
          onClick={() => navigate('/games')}
        >
          Игры
        </button>
        {user.role === UserRole.Admin && (
          <button
            className={`sidebar-item${location.pathname === '/users' ? ' active' : ''}`}
            onClick={() => navigate('/users')}
          >
            Пользователи
          </button>
        )}
      </div>

      <div className="sidebar-footer">
        <button className="logout-btn sidebar-logout" onClick={onLogout}>Выйти</button>
      </div>
    </nav>
  );
}
