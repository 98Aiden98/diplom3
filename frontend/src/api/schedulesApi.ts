import { api, unwrap } from './axios';
import type { DoctorSchedule } from '../types/common';

export const schedulesApi = {
  getAll: async () => unwrap<DoctorSchedule[]>(await api.get('/schedules')),

  getByDoctor: async (doctorId: number) =>
    unwrap<DoctorSchedule[]>(await api.get(`/schedules/doctor/${doctorId}`)),

  create: async (payload: Partial<DoctorSchedule>) =>
    unwrap<DoctorSchedule>(await api.post('/schedules', payload)),

  update: async (id: number, payload: Partial<DoctorSchedule>) =>
    unwrap<DoctorSchedule>(await api.patch(`/schedules/${id}`, payload)),

  remove: async (id: number) =>
    unwrap<{ id: number }>(await api.delete(`/schedules/${id}`)),
};
