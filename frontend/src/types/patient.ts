import type { Gender } from './common';

export interface Patient {
  id: number;
  userId?: number | null;
  fullName: string;
  birthDate: string;
  gender: Gender;
  phone: string;
  email?: string | null;
  address?: string | null;
  passportNumber?: string | null;
  policyNumber?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
