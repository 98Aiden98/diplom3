import { api, unwrap } from './axios';
import type { Appointment } from '../types/appointment';
import type { TimeSlot } from '../types/common';

export const appointmentsApi = {
  getAll: async (params?: Record<string, unknown>) =>
    unwrap<Appointment[]>(await api.get('/appointments', { params })),

  getById: async (id: number) => unwrap<Appointment>(await api.get(`/appointments/${id}`)),

  getByPatient: async (patientId: number) =>
    unwrap<Appointment[]>(await api.get(`/appointments/patient/${patientId}`)),

  getByDoctor: async (doctorId: number) =>
    unwrap<Appointment[]>(await api.get(`/appointments/doctor/${doctorId}`)),

  create: async (payload: object) =>
    unwrap<Appointment>(await api.post('/appointments', payload)),

  update: async (id: number, payload: object) =>
    unwrap<Appointment>(await api.patch(`/appointments/${id}`, payload)),

  cancel: async (id: number) =>
    unwrap<Appointment>(await api.patch(`/appointments/${id}/cancel`)),

  complete: async (id: number) =>
    unwrap<Appointment>(await api.patch(`/appointments/${id}/complete`)),

  remove: async (id: number) => unwrap<{ id: number }>(await api.delete(`/appointments/${id}`)),

  getAvailableSlots: async (doctorId: number, date: string, serviceId?: number) =>
    unwrap<TimeSlot[]>(
      await api.get('/appointments/available-slots', {
        params: { doctorId, date, serviceId },
      }),
    ),
};
