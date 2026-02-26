export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/chto-gde',
  JWT_SECRET: process.env.JWT_SECRET || 'change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
});
