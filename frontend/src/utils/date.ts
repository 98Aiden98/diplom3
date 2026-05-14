import { format, getISODay, parseISO } from 'date-fns';

export const getToday = () => new Date().toISOString().slice(0, 10);

export const formatDate = (value?: string | null) => {
  if (!value) return '—';
  return format(parseISO(`${value}T00:00:00`), 'dd.MM.yyyy');
};

export const formatDateTime = (date?: string | null, time?: string | null) => {
  if (!date || !time) return '—';
  return `${formatDate(date)} ${time}`;
};

export const isFutureOrToday = (date: string) => date >= getToday();

export const getDayOfWeekFromDate = (date: string) => getISODay(parseISO(`${date}T00:00:00`));

export const dayName = (dayOfWeek: number) =>
  ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][dayOfWeek - 1] ?? '—';
