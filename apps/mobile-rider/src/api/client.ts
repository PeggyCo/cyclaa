/**
 * Shared Axios instance with auth header injection.
 * NOTE: the backend only has the waitlist routes implemented so far
 * (see apps/api/src/index.ts). Auth/bookings/mechanics endpoints below
 * will 404 until those routes are built — this client is wired ahead of
 * time so screens don't need to change once they land.
 */
import axios from 'axios';
import { API_BASE_URL } from '@constants/index';
import { getItem, removeItem } from '@utils/storage';
import { useAuthStore } from '@store/authStore';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getItem('cyclaa_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeItem('cyclaa_token');
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
