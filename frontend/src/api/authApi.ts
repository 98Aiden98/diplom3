import { api, unwrap } from './axios';
import type { User } from '../types/user';

interface AuthPayload {
  accessToken: string;
  user: User;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  policyNumber?: string;
  passportNumber?: string;
}

export const authApi = {
  login: async (email: string, password: string) =>
    unwrap<AuthPayload>(await api.post('/auth/login', { email, password })),

  register: async (payload: RegisterPayload) =>
    unwrap<AuthPayload>(await api.post('/auth/register', payload)),

  getMe: async () => unwrap<User>(await api.get('/auth/me')),
};
