# Что? Где? Когда?

Веб-приложение для проведения игр в формате «Что? Где? Когда?».

- **Frontend**: React (Create React App), задеплоен на Vercel
- **Backend**: NestJS + MongoDB, задеплоен на Render
- **База данных**: MongoDB Atlas (cloud.mongodb.com)

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
| `MONGODB_URI` | URI подключения к MongoDB Atlas (берётся в [cloud.mongodb.com](https://cloud.mongodb.com) → Connect → Drivers) |
| `JWT_SECRET` | Секрет для подписи JWT токенов |
| `JWT_EXPIRES_IN` | Срок действия токена, например `7d` |
| `CORS_ORIGIN` | URL фронтенда, например `https://your-app.vercel.app` |
| `ADMIN_EMAIL` | Email администратора (по умолчанию `admin@test.com`) |
| `ADMIN_NAME` | Имя администратора (по умолчанию `Admin`) |
| `ADMIN_PASSWORD` | **Обязательно.** Пароль администратора — создаётся при первом запуске |

> **Важно:** на бесплатном тарифе Render сервер засыпает после 15 минут бездействия.
> При открытии главной страницы автоматически отправляется запрос на `/health`,
> который будит сервер. Пробуждение занимает до 50 секунд — в это время
> на странице отображается статус «Запуск сервера...».

---

### Frontend — Vercel

Frontend задеплоен на [Vercel](https://vercel.com).

#### Настройка сборки

| Поле | Значение |
|------|----------|
| Framework Preset | Create React App |
| Build Command | `npm run build` |
| Output Directory | `build` |
| Root Directory | `frontend` |

#### Переменные окружения

| Переменная | Описание |
|------------|----------|
| `REACT_APP_API_URL` | URL бэкенда, например `https://your-backend.onrender.com` |

---

### База данных — MongoDB Atlas

1. Зайти на [cloud.mongodb.com](https://cloud.mongodb.com) и создать кластер
2. В разделе **Database Access** создать пользователя с паролем
3. В разделе **Network Access** добавить `0.0.0.0/0` (разрешить все IP) или IP Render
4. Нажать **Connect → Drivers**, скопировать URI вида:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/chto-gde
   ```
5. Вставить этот URI в переменную `MONGODB_URI` на Render
