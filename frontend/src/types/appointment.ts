import type { AppointmentStatus, MedicalService } from './common';
import type { Doctor } from './doctor';
import type { Patient } from './patient';
import type { MedicalRecord } from './medicalRecord';

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  serviceId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  reason?: string | null;
  comment?: string | null;
  createdAt?: string;
  updatedAt?: string;
  patient?: Patient;
  doctor?: Doctor;
  service?: MedicalService;
  medicalRecord?: MedicalRecord | null;
}
