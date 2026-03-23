# Что? Где? Когда?

Веб-приложение для проведения игр в формате «Что? Где? Когда?».

- **Frontend**: React (Create React App), задеплоен на Netlify
- **Backend**: NestJS + MongoDB, задеплоен на Render

---

## Локальный запуск

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Запустится на `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm install
npm start
```

Запустится на `http://localhost:3000`.

---

## Деплой

### Backend — Render

Backend задеплоен как **Web Service** на [Render](https://render.com).

#### Настройка сервиса

| Поле | Значение |
|------|----------|
| Build Command | `npm install && npm run build` |
| Start Command | `node dist/main` |
| Root Directory | `backend` |

#### Переменные окружения

| Переменная | Описание |
|------------|----------|
| `PORT` | Порт (Render подставляет автоматически) |
| `MONGODB_URI` | URI подключения к MongoDB (например, MongoDB Atlas) |
| `JWT_SECRET` | Секрет для подписи JWT токенов |
| `JWT_EXPIRES_IN` | Срок действия токена, например `7d` |
| `CORS_ORIGIN` | URL фронтенда, например `https://your-app.netlify.app` |

> **Важно:** на бесплатном тарифе Render сервер засыпает после 15 минут бездействия.
> При открытии главной страницы автоматически отправляется запрос на `/health`,
> который будит сервер. Пробуждение занимает до 50 секунд — в это время
> на странице отображается статус «Запуск сервера...».

---

### Frontend — Netlify

Frontend задеплоен на [Netlify](https://netlify.com).

#### Настройка сборки

| Поле | Значение |
|------|----------|
| Build Command | `npm run build` |
| Publish Directory | `build` |
| Base Directory | `frontend` |

#### Переменные окружения

| Переменная | Описание |
|------------|----------|
| `REACT_APP_API_URL` | URL бэкенда, например `https://your-backend.onrender.com` |
