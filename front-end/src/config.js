const config = {
    backendURL: process.env.NODE_ENV === 'production'
      ? 'https://your-production-backend-url.com'
      : 'http://localhost:3000'
  };
  
  export default config;