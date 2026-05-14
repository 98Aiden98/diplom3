import { api, unwrap } from './axios';
import type { MedicalRecord } from '../types/medicalRecord';

export const medicalRecordsApi = {
  getAll: async () => unwrap<MedicalRecord[]>(await api.get('/medical-records')),

  getById: async (id: number) =>
    unwrap<MedicalRecord>(await api.get(`/medical-records/${id}`)),

  getByPatient: async (patientId: number) =>
    unwrap<MedicalRecord[]>(await api.get(`/medical-records/patient/${patientId}`)),

  getByAppointment: async (appointmentId: number) =>
    unwrap<MedicalRecord>(await api.get(`/medical-records/appointment/${appointmentId}`)),

  create: async (payload: Record<string, unknown>) =>
    unwrap<MedicalRecord>(await api.post('/medical-records', payload)),

  update: async (id: number, payload: Record<string, unknown>) =>
    unwrap<MedicalRecord>(await api.patch(`/medical-records/${id}`, payload)),
};
