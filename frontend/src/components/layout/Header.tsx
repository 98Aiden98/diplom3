import { Bell, LogOut, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { appointmentsApi } from '../../api/appointmentsApi';
import { getApiErrorMessage } from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import type { Appointment } from '../../types/appointment';
import { formatDateTime, getToday } from '../../utils/date';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { getRouteTitle, navByRole } from './navigation';

const VIEWED_NOTIFICATIONS_STORAGE_KEY = 'infomed_viewed_notifications';

const getNotificationKey = (item: Appointment) =>
  `${item.id}:${item.date}:${item.startTime}:${item.status}`;

const readViewedNotifications = (userId: number) => {
  try {
    const raw = localStorage.getItem(VIEWED_NOTIFICATIONS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
    return parsed[String(userId)] ?? [];
  } catch {
    return [];
  }
};

const writeViewedNotifications = (userId: number, notificationKeys: string[]) => {
  try {
    const raw = localStorage.getItem(VIEWED_NOTIFICATIONS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
    parsed[String(userId)] = notificationKeys;
    localStorage.setItem(VIEWED_NOTIFICATIONS_STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    return;
  }
};

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Appointment[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState<string | null>(null);
  const [viewedNotificationKeys, setViewedNotificationKeys] = useState<string[]>([]);

  const title = getRouteTitle(location.pathname);
  const searchItems = user ? navByRole[user.role] : [];

  const filteredSearchItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return searchItems;
    }

    return searchItems.filter((item) =>
      [item.label, item.description, ...(item.keywords ?? [])]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [searchItems, searchQuery]);

  useEffect(() => {
    if (!user) {
      setViewedNotificationKeys([]);
      return;
    }

    setViewedNotificationKeys(readViewedNotifications(user.id));
  }, [user]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    let cancelled = false;

    const loadNotifications = async () => {
      setNotificationsLoading(true);
      setNotificationsError(null);

      try {
        let upcomingAppointments: Appointment[] = [];

        if (user.role === 'ADMIN' || user.role === 'REGISTRAR') {
          upcomingAppointments = await appointmentsApi.getAll({ status: 'PLANNED' });
        } else if (user.role === 'DOCTOR' && user.doctor?.id) {
          upcomingAppointments = await appointmentsApi.getByDoctor(user.doctor.id);
        } else if (user.role === 'PATIENT' && user.patient?.id) {
          upcomingAppointments = await appointmentsApi.getByPatient(user.patient.id);
        }

        if (cancelled) {
          return;
        }

        setNotifications(
          upcomingAppointments
            .filter((item) => item.status === 'PLANNED' && item.date >= getToday())
            .slice(0, 6),
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        setNotifications([]);
        setNotificationsError(getApiErrorMessage(error));
      } finally {
        if (!cancelled) {
          setNotificationsLoading(false);
        }
      }
    };

    loadNotifications();
    const intervalId = window.setInterval(loadNotifications, 60000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [notificationsOpen, user]);

  const unseenNotifications = useMemo(
    () => notifications.filter((item) => !viewedNotificationKeys.includes(getNotificationKey(item))),
    [notifications, viewedNotificationKeys],
  );

  const appointmentsRoute =
    user?.role === 'ADMIN'
      ? '/admin/appointments'
      : user?.role === 'REGISTRAR'
        ? '/registrar'
        : user?.role === 'DOCTOR'
          ? '/doctor/appointments'
          : '/patient/appointments';

  const markNotificationsViewed = () => {
    if (!user || notifications.length === 0) {
      return;
    }

    const nextKeys = Array.from(new Set([...viewedNotificationKeys, ...notifications.map(getNotificationKey)]));
    setViewedNotificationKeys(nextKeys);
    writeViewedNotifications(user.id, nextKeys);
  };

  return (
    <>
      <header className="surface-card mb-5 flex flex-col gap-4 rounded-[1.75rem] px-4 py-4 sm:mb-6 sm:px-5 lg:sticky lg:top-4 lg:z-20 lg:flex-row lg:items-center lg:justify-between lg:rounded-[2rem]">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-brand-600 sm:text-xs sm:tracking-[0.3em]">
            <span className="inline-flex h-2 w-2 rounded-full bg-brand-500" />
            ИнфоМед
          </div>
          <h1 className="font-sans text-xl font-semibold text-slate-900 sm:text-2xl">{title}</h1>
        </div>

        <div className="flex w-full items-stretch gap-3 lg:w-auto lg:min-w-[420px] lg:justify-end">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-left text-sm text-slate-500 transition hover:border-brand-200 hover:bg-white sm:px-4 lg:min-w-[280px] lg:flex-initial lg:py-2.5"
          >
            <Search size={16} className="shrink-0" />
            <span className="truncate">Поиск по разделам системы</span>
          </button>

          <button
            type="button"
            onClick={() => setNotificationsOpen(true)}
            className="relative shrink-0 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-500 transition hover:bg-slate-50"
          >
            <Bell size={18} />
            {unseenNotifications.length > 0 ? (
              <span className="absolute right-2 top-2 inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
            ) : null}
          </button>

          <div className="hidden items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-white lg:flex">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{user?.fullName}</div>
              <div className="truncate text-xs text-slate-300">{user?.email}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="shrink-0 rounded-xl bg-white/10 p-2 transition hover:bg-white/20"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <Modal
        open={searchOpen}
        title="Поиск по разделам"
        description="Выберите нужный раздел, чтобы перейти к нему сразу."
        maxWidthClassName="max-w-2xl"
        onClose={() => setSearchOpen(false)}
      >
        <div className="space-y-4">
          <input
            autoFocus
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Например: пациенты, отчёты, услуги"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
          />

          <div className="space-y-3">
            {filteredSearchItems.length > 0 ? (
              filteredSearchItems.map((item) => (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => {
                    navigate(item.to);
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="flex w-full items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-brand-200 hover:bg-brand-50/40"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900">{item.label}</div>
                    <div className="mt-1 text-sm text-slate-500">{item.description}</div>
                  </div>
                  <item.icon size={18} className="mt-1 shrink-0 text-brand-600" />
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                Подходящих разделов не найдено.
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        open={notificationsOpen}
        title="Уведомления"
        description="Ближайшие события и записи, требующие внимания."
        maxWidthClassName="max-w-2xl"
        onClose={() => setNotificationsOpen(false)}
      >
        <div className="space-y-4">
          {notificationsLoading ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              Загружаем ближайшие уведомления...
            </div>
          ) : notificationsError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
              {notificationsError}
            </div>
          ) : notifications.length > 0 ? (
            <>
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-600">
                  Непросмотренные уведомления:{' '}
                  <span className="font-semibold text-slate-900">{unseenNotifications.length}</span>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={markNotificationsViewed}
                  disabled={unseenNotifications.length === 0}
                  className="w-full sm:w-auto"
                >
                  Просмотрено
                </Button>
              </div>

              <div className="space-y-3">
                {notifications.map((item) => {
                  const isUnseen = !viewedNotificationKeys.includes(getNotificationKey(item));

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border px-4 py-4 ${
                        isUnseen ? 'border-rose-200 bg-rose-50/60' : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div className="font-semibold text-slate-900">
                          {item.patient?.fullName ?? 'Пациент'} - {item.doctor?.fullName ?? 'Врач'}
                        </div>
                        {isUnseen ? (
                          <span className="inline-flex w-fit rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                            Новое
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">{formatDateTime(item.date, item.startTime)}</div>
                      <div className="mt-2 text-sm text-slate-600">
                        {item.service?.name ?? 'Медицинская услуга'}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigate(appointmentsRoute);
                    setNotificationsOpen(false);
                  }}
                  className="w-full sm:w-auto"
                >
                  Перейти к списку
                </Button>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              Ближайших уведомлений нет.
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
