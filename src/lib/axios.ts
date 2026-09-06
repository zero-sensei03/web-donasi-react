import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { authRefreshToken } from '@/services/auth/http';

const publicRoutes = [
  '/',
  '/about-us',
  '/gallery',
  '/proposal',
  '/donation-support',
  '/auth/sign-in',
];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const auth = useAuthStore.getState();
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data: getRefreshToken } = await authRefreshToken(
          auth.token?.refreshToken || ''
        );
        const accessToken = getRefreshToken.accessToken;
        const refreshToken = getRefreshToken.refreshToken;
        const user = getRefreshToken.user;

        if (!user) {
          throw new Error('User is null during token refresh.');
        }

        auth.setAuth({
          token: {
            accessToken,
            refreshToken,
          },
          user: user,
        });

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        auth.logout();

        const currentPath = window.location.pathname;
        if (!publicRoutes.includes(currentPath)) {
          auth.logout();
          window.location.href = '/auth/sign-in';
        }

        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401) {
      auth.logout();
      redirectIfNotPublic();
    }

    return Promise.reject(error);
  }
);

const redirectIfNotPublic = () => {
  const auth = useAuthStore.getState();
  const currentPath = window.location.pathname;
  if (!publicRoutes.includes(currentPath)) {
    auth.logout();
    window.location.href = '/auth/sign-in';
  }
};

export default api;
