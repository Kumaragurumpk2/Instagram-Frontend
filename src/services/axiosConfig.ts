import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants/apiEndpoints';

const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
  });

  // REQUEST INTERCEPTOR — attach JWT
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // RESPONSE INTERCEPTOR — handle 401 with refresh
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (refreshToken) {
          try {
            const res = await axios.post(
              `${import.meta.env.VITE_AUTH_SERVICE_URL}/auth/refresh`,
              { refresh_token: refreshToken }
            );
            const newToken: string = res.data.access_token;
            localStorage.setItem(TOKEN_KEY, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          } catch {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            window.location.href = '/login';
          }
        } else {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const authAxios = createAxiosInstance(
  import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:8081/api'
);
export const postAxios = createAxiosInstance(
  import.meta.env.VITE_POST_SERVICE_URL || 'http://localhost:8082/api'
);
export const followAxios = createAxiosInstance(
  import.meta.env.VITE_FOLLOW_SERVICE_URL || 'http://localhost:8083/api'
);
export const trendingAxios = createAxiosInstance(
  import.meta.env.VITE_TRENDING_SERVICE_URL || 'http://localhost:8084/api'
);
