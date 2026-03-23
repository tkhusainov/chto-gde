export const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@test.com';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ||
  Math.random().toString(36).slice(2, 10);

export const MAX_QUESTIONS_PER_GAME = 13;
export const MAX_GAMES_PER_USER = 10;
export const MAX_USERS = 5;
