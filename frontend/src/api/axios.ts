import axios from 'axios';
import type { ApiResponse } from '../types/common';
import { TOKEN_STORAGE_KEY } from '../store/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const unwrap = <T>(response: { data: ApiResponse<T> }) => response.data.data;

const axiosMessageMap: Record<string, string> = {
  'Network Error': 'Не удалось связаться с сервером. Проверьте, что backend запущен.',
  'Request aborted': 'Запрос был прерван.',
};

export const resolveApiFileUrl = (value?: string | null) => {
  if (!value) {
    return undefined;
  }

  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('blob:')) {
    return value;
  }

  const baseUrl = (api.defaults.baseURL ?? '').replace(/\/$/, '');
  const normalizedPath = value.startsWith('/') ? value : `/${value}`;
  return `${baseUrl}${normalizedPath}`;
};

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const responseMessage = (error.response?.data as { message?: string | string[] } | undefined)?.message;

    return (
      (Array.isArray(responseMessage) ? responseMessage[0] : responseMessage) ||
      axiosMessageMap[error.message] ||
      (error.message ? `Ошибка запроса: ${error.message}` : undefined) ||
      'Произошла ошибка при обращении к серверу'
    );
  }

  return 'Произошла непредвиденная ошибка';
};
