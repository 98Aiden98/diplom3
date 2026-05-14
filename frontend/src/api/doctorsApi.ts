import { api, unwrap } from './axios';
import type { Appointment } from '../types/appointment';
import type { Doctor } from '../types/doctor';
import type { DoctorSchedule } from '../types/common';

export interface DoctorMutationPayload extends Partial<Doctor> {
  password?: string;
  photo?: File | null;
}

const buildDoctorFormData = (payload: DoctorMutationPayload) => {
  const formData = new FormData();

  if (payload.fullName !== undefined) formData.append('fullName', payload.fullName);
  if (payload.specializationId !== undefined) formData.append('specializationId', String(payload.specializationId));
  if (payload.phone !== undefined) formData.append('phone', payload.phone);
  if (payload.email !== undefined) formData.append('email', payload.email);
  if (payload.cabinetNumber !== undefined) formData.append('cabinetNumber', payload.cabinetNumber);
  if (payload.experienceYears !== undefined) formData.append('experienceYears', String(payload.experienceYears));
  if (payload.description !== undefined) formData.append('description', payload.description ?? '');
  if (payload.password) formData.append('password', payload.password);
  if (payload.photo) formData.append('photo', payload.photo);

  return formData;
};

export const doctorsApi = {
  getAll: async (params?: Record<string, unknown>) =>
    unwrap<Doctor[]>(await api.get('/doctors', { params })),

  getById: async (id: number) => unwrap<Doctor>(await api.get(`/doctors/${id}`)),

  create: async (payload: DoctorMutationPayload) =>
    unwrap<Doctor>(
      await api.post('/doctors', buildDoctorFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    ),

  update: async (id: number, payload: DoctorMutationPayload) =>
    unwrap<Doctor>(
      await api.patch(`/doctors/${id}`, buildDoctorFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    ),

  remove: async (id: number) => unwrap<{ id: number }>(await api.delete(`/doctors/${id}`)),

  getBySpecialization: async (specializationId: number) =>
    unwrap<Doctor[]>(await api.get(`/doctors/by-specialization/${specializationId}`)),

  getSchedule: async (id: number) =>
    unwrap<DoctorSchedule[]>(await api.get(`/doctors/${id}/schedule`)),

  getAppointments: async (id: number) =>
    unwrap<Appointment[]>(await api.get(`/doctors/${id}/appointments`)),
};
