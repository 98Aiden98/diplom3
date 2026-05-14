export type Role = 'ADMIN' | 'REGISTRAR' | 'DOCTOR' | 'PATIENT';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type AppointmentStatus = 'PLANNED' | 'COMPLETED' | 'CANCELLED' | 'MISSED';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  path?: string;
  timestamp?: string;
  errors?: unknown;
}

export interface Specialization {
  id: number;
  name: string;
  description?: string | null;
}

export interface MedicalService {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  durationMinutes: number;
  specializationId: number;
  specialization?: Specialization;
}

export interface DoctorSchedule {
  id: number;
  doctorId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  cabinetNumber?: string | null;
  isActive: boolean;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}
