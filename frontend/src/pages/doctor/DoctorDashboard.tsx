import { CalendarDays, Clock3 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { appointmentsApi } from '../../api/appointmentsApi';
import { doctorsApi } from '../../api/doctorsApi';
import { getApiErrorMessage } from '../../api/axios';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { useAuthStore } from '../../store/authStore';
import type { Appointment } from '../../types/appointment';
import type { DoctorSchedule } from '../../types/common';
import { dayName, formatDate, formatDateTime, getDayOfWeekFromDate, getToday } from '../../utils/date';

export function DoctorDashboard() {
  const doctorId = useAuthStore((state) => state.user?.doctor?.id);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorSchedules, setDoctorSchedules] = useState<DoctorSchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState(getToday());

  useEffect(() => {
    if (!doctorId) return;

    Promise.all([appointmentsApi.getByDoctor(doctorId), doctorsApi.getSchedule(doctorId)])
      .then(([appointmentsData, schedulesData]) => {
        setAppointments(appointmentsData);
        setDoctorSchedules(schedulesData);
      })
      .catch((error) => toast.error(getApiErrorMessage(error)));
  }, [doctorId]);

  const selectedDateAppointments = useMemo(
    () => appointments.filter((item) => item.date === selectedDate),
    [appointments, selectedDate],
  );

  const selectedDateSchedules = useMemo(
    () =>
      doctorSchedules.filter(
        (item) =>
          item.dayOfWeek === getDayOfWeekFromDate(selectedDate) && item.isActive,
      ),
    [doctorSchedules, selectedDate],
  );

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="section-heading">Расписание врача</h2>
            <p className="mt-2 text-sm text-slate-500">
              Выберите дату, чтобы посмотреть рабочие интервалы и список записей на этот день.
            </p>
          </div>
          <div className="w-full lg:w-[280px]">
            <Input
              label="Дата просмотра"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-[2rem]">
          <div className="text-sm text-slate-500">Приёмов на выбранную дату</div>
          <div className="mt-3 font-sans text-3xl font-semibold text-slate-900">
            {selectedDateAppointments.length}
          </div>
        </Card>
        <Card className="rounded-[2rem]">
          <div className="text-sm text-slate-500">Рабочих интервалов</div>
          <div className="mt-3 font-sans text-3xl font-semibold text-slate-900">
            {selectedDateSchedules.length}
          </div>
        </Card>
        <Card className="rounded-[2rem]">
          <div className="text-sm text-slate-500">Завершённые приёмы</div>
          <div className="mt-3 font-sans text-3xl font-semibold text-slate-900">
            {appointments.filter((item) => item.status === 'COMPLETED').length}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card className="rounded-[2rem]">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays size={18} className="text-brand-600" />
            <h2 className="section-heading text-xl">Рабочие часы</h2>
          </div>
          <div className="mb-4 text-sm text-slate-500">
            {formatDate(selectedDate)}, {dayName(getDayOfWeekFromDate(selectedDate))}
          </div>

          <div className="space-y-3">
            {selectedDateSchedules.length > 0 ? (
              selectedDateSchedules.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <Clock3 size={16} className="text-brand-600" />
                    <span>
                      {item.startTime} - {item.endTime}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-slate-500">
                    Кабинет {item.cabinetNumber ?? 'не указан'}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                На выбранную дату рабочие интервалы не настроены.
              </div>
            )}
          </div>
        </Card>

        <Card className="rounded-[2rem]">
          <h2 className="section-heading mb-4">Записи на выбранную дату</h2>
          <Table
            data={selectedDateAppointments}
            columns={[
              { title: 'Пациент', render: (item) => item.patient?.fullName ?? '—' },
              { title: 'Услуга', render: (item) => item.service?.name ?? '—' },
              { title: 'Время', render: (item) => formatDateTime(item.date, item.startTime) },
              { title: 'Статус', render: (item) => item.status },
            ]}
            emptyText="На выбранную дату записей нет"
          />
        </Card>
      </div>
    </div>
  );
}
