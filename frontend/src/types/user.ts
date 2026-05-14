import type { Role, Specialization } from './common';

export interface AuthProfileRef {
  id: number;
  fullName: string;
}

export interface DoctorProfileRef extends AuthProfileRef {
  specialization?: Specialization | null;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  role: Role;
  patient?: AuthProfileRef | null;
  doctor?: DoctorProfileRef | null;
}
