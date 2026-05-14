import type { Doctor } from './doctor';
import type { Patient } from './patient';
import type { MedicalService } from './common';

export interface MedicalRecord {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentId: number;
  complaints: string;
  diagnosis: string;
  treatment: string;
  recommendations: string;
  prescriptions?: string | null;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  doctor?: Doctor;
  appointment?: {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    service?: MedicalService;
  };
}
