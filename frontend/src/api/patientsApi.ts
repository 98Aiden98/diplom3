import { api, unwrap } from './axios';
import type { Patient } from '../types/patient';
import type { Appointment } from '../types/appointment';
import type { MedicalRecord } from '../types/medicalRecord';

export const patientsApi = {
  getAll: async (query = '') =>
    unwrap<Patient[]>(await api.get('/patients', { params: query ? { query } : {} })),

  search: async (query = '') =>
    unwrap<Patient[]>(await api.get('/patients/search', { params: { query } })),

  getById: async (id: number) => unwrap<Patient>(await api.get(`/patients/${id}`)),

  create: async (payload: Partial<Patient>) =>
    unwrap<Patient>(await api.post('/patients', payload)),

  update: async (id: number, payload: Partial<Patient>) =>
    unwrap<Patient>(await api.patch(`/patients/${id}`, payload)),

  remove: async (id: number) => unwrap<{ id: number }>(await api.delete(`/patients/${id}`)),

  getHistory: async (id: number) =>
    unwrap<Appointment[]>(await api.get(`/patients/${id}/history`)),

  getRecords: async (id: number) =>
    unwrap<MedicalRecord[]>(await api.get(`/patients/${id}/records`)),
};
