import type { DoctorSchedule, Specialization } from './common';

export interface Doctor {
  id: number;
  userId: number;
  fullName: string;
  specializationId: number;
  phone: string;
  email: string;
  photoUrl?: string | null;
  cabinetNumber: string;
  experienceYears: number;
  description?: string | null;
  specialization?: Specialization;
  schedules?: DoctorSchedule[];
}
