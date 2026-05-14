import {
  CalendarClock,
  ClipboardList,
  FileBarChart2,
  HeartPulse,
  LayoutDashboard,
  Stethoscope,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Role } from '../../types/common';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  description: string;
  keywords?: string[];
}

export const navByRole: Record<Role, NavItem[]> = {
  ADMIN: [
    {
      label: 'Показатели',
      to: '/admin',
      icon: LayoutDashboard,
      description: 'Статистика центра и оперативные метрики',
      keywords: ['аналитика', 'сводка', 'dashboard'],
    },
    {
      label: 'Пользователи',
      to: '/admin/users',
      icon: Users,
      description: 'Управление аккаунтами и ролями',
      keywords: ['учетные записи', 'роли'],
    },
    {
      label: 'Врачи',
      to: '/admin/doctors',
      icon: Stethoscope,
      description: 'Список врачей и их профили',
      keywords: ['доктора', 'специалисты'],
    },
    {
      label: 'Специальности',
      to: '/admin/specializations',
      icon: HeartPulse,
      description: 'Медицинские направления центра',
      keywords: ['направления'],
    },
    {
      label: 'Услуги',
      to: '/admin/services',
      icon: ClipboardList,
      description: 'Каталог медицинских услуг',
      keywords: ['цены', 'процедуры'],
    },
    {
      label: 'Записи',
      to: '/admin/appointments',
      icon: CalendarClock,
      description: 'Все записи на приём',
      keywords: ['приемы', 'слоты'],
    },
    {
      label: 'Отчёты',
      to: '/admin/reports',
      icon: FileBarChart2,
      description: 'Выручка, загрузка и популярные услуги',
      keywords: ['аналитика', 'выручка'],
    },
  ],
  REGISTRAR: [
    {
      label: 'Показатели',
      to: '/registrar',
      icon: LayoutDashboard,
      description: 'Ближайшие приёмы и рабочая сводка',
      keywords: ['расписание', 'сводка'],
    },
    {
      label: 'Пациенты',
      to: '/registrar/patients',
      icon: Users,
      description: 'Карточки пациентов и поиск',
      keywords: ['карты', 'полис'],
    },
    {
      label: 'Запись на приём',
      to: '/registrar/appointments/new',
      icon: CalendarClock,
      description: 'Создание новой записи пациенту',
      keywords: ['прием', 'слот'],
    },
    {
      label: 'Расписание',
      to: '/registrar/schedule',
      icon: ClipboardList,
      description: 'Графики работы врачей',
      keywords: ['график', 'кабинеты'],
    },
  ],
  DOCTOR: [
    {
      label: 'Показатели',
      to: '/doctor',
      icon: LayoutDashboard,
      description: 'Сегодняшние приёмы и загрузка',
      keywords: ['расписание', 'сводка'],
    },
    {
      label: 'Мои приёмы',
      to: '/doctor/appointments',
      icon: CalendarClock,
      description: 'Список ближайших пациентов',
      keywords: ['пациенты', 'визиты'],
    },
  ],
  PATIENT: [
    {
      label: 'Показатели',
      to: '/patient',
      icon: LayoutDashboard,
      description: 'Личный кабинет и рекомендации',
      keywords: ['кабинет', 'сводка'],
    },
    {
      label: 'Мои записи',
      to: '/patient/appointments',
      icon: CalendarClock,
      description: 'Предстоящие и прошедшие визиты',
      keywords: ['приемы', 'запись'],
    },
    {
      label: 'История посещений',
      to: '/patient/records',
      icon: ClipboardList,
      description: 'Медицинские записи и рекомендации',
      keywords: ['карта', 'рекомендации'],
    },
  ],
};

const titleMap: Record<string, string> = {
  '/admin': 'Показатели администратора',
  '/admin/users': 'Управление пользователями',
  '/admin/doctors': 'Управление врачами',
  '/admin/specializations': 'Специальности',
  '/admin/services': 'Медицинские услуги',
  '/admin/appointments': 'Все записи на приём',
  '/admin/reports': 'Отчёты и аналитика',
  '/registrar': 'Показатели регистратора',
  '/registrar/patients': 'Пациенты',
  '/registrar/appointments/new': 'Запись на приём',
  '/registrar/schedule': 'Расписание врачей',
  '/doctor': 'Показатели врача',
  '/doctor/appointments': 'Мои приёмы',
  '/patient': 'Личный кабинет пациента',
  '/patient/appointments': 'Мои записи',
  '/patient/records': 'История посещений',
};

export const getRouteTitle = (pathname: string) => {
  if (titleMap[pathname]) {
    return titleMap[pathname];
  }

  if (pathname.startsWith('/doctor/patients/')) {
    return 'Медицинская карта пациента';
  }

  if (pathname.startsWith('/doctors/')) {
    return 'Страница врача';
  }

  return 'ИнфоМед';
};
