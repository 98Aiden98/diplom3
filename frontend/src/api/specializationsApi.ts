import { api, unwrap } from './axios';
import type { Specialization } from '../types/common';

export const specializationsApi = {
  getAll: async () => unwrap<Specialization[]>(await api.get('/specializations')),

  create: async (payload: Partial<Specialization>) =>
    unwrap<Specialization>(await api.post('/specializations', payload)),

  update: async (id: number, payload: Partial<Specialization>) =>
    unwrap<Specialization>(await api.patch(`/specializations/${id}`, payload)),

  remove: async (id: number) =>
    unwrap<{ id: number }>(await api.delete(`/specializations/${id}`)),
};
