// Environment configuration
const config = {
  development: {
    API_URL: 'http://localhost:5000/api',
    AI_SERVICE_URL: 'http://localhost:5174'
  },
  production: {
    API_URL: import.meta.env.VITE_API_URL || 'https://your-backend-domain.railway.app/api',
    AI_SERVICE_URL: import.meta.env.VITE_AI_SERVICE_URL || 'https://your-ai-service.railway.app'
  }
};

const environment = import.meta.env.NODE_ENV || 'development';

export default config[environment as keyof typeof config];