import { api, unwrap } from './axios';
import type { MedicalService } from '../types/common';

export const servicesApi = {
  getAll: async () => unwrap<MedicalService[]>(await api.get('/services')),

  getById: async (id: number) =>
    unwrap<MedicalService>(await api.get(`/services/${id}`)),

  create: async (payload: Partial<MedicalService>) =>
    unwrap<MedicalService>(await api.post('/services', payload)),

  update: async (id: number, payload: Partial<MedicalService>) =>
    unwrap<MedicalService>(await api.patch(`/services/${id}`, payload)),

  remove: async (id: number) => unwrap<{ id: number }>(await api.delete(`/services/${id}`)),

  getBySpecialization: async (specializationId: number) =>
    unwrap<MedicalService[]>(
      await api.get(`/services/by-specialization/${specializationId}`),
    ),
};
