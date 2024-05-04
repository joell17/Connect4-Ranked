const config = {
  backendURL: process.env.NODE_ENV === 'production'
    ? 'https://your-production-backend-url.com'
    : 'https://localhost:3000',
  websocketURL: process.env.NODE_ENV === 'production'
    ? 'wss://your-production-backend-url.com'
    : 'wss://localhost:3000'
};

export default config;
