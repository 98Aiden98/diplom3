import type { AppointmentStatus, Role } from '../types/common';

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);

export const roleLabel: Record<Role, string> = {
  ADMIN: 'Администратор',
  REGISTRAR: 'Регистратор',
  DOCTOR: 'Врач',
  PATIENT: 'Пациент',
};

export const appointmentStatusLabel: Record<AppointmentStatus, string> = {
  PLANNED: 'Запланирован',
  COMPLETED: 'Завершён',
  CANCELLED: 'Отменён',
  MISSED: 'Пропущен',
};

export const appointmentStatusClass: Record<AppointmentStatus, string> = {
  PLANNED: 'bg-sky-100 text-sky-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-rose-100 text-rose-700',
  MISSED: 'bg-amber-100 text-amber-700',
};
