import { api, unwrap } from './axios';
import type { User } from '../types/user';

export const usersApi = {
  getAll: async (params?: Record<string, unknown>) =>
    unwrap<User[]>(await api.get('/users', { params })),

  create: async (payload: object) =>
    unwrap<User>(await api.post('/users', payload)),

  update: async (id: number, payload: object) =>
    unwrap<User>(await api.patch(`/users/${id}`, payload)),

  remove: async (id: number) => unwrap<{ id: number }>(await api.delete(`/users/${id}`)),
};
