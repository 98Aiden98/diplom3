import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { appointmentsApi } from '../../api/appointmentsApi';
import { getApiErrorMessage } from '../../api/axios';
import { DoctorLink } from '../../components/doctors/DoctorLink';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import type { Appointment } from '../../types/appointment';
import { formatDateTime, getToday } from '../../utils/date';
import { appointmentStatusClass, appointmentStatusLabel } from '../../utils/format';

export function RegistrarDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    appointmentsApi
      .getAll()
      .then((data) => setAppointments(data))
      .catch((error) => toast.error(getApiErrorMessage(error)));
  }, []);

  const upcoming = appointments
    .filter((item) => item.status === 'PLANNED' && item.date >= getToday())
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-[2rem]">
          <div className="text-sm text-slate-500">Предстоящие приёмы</div>
          <div className="mt-3 font-sans text-3xl font-semibold text-slate-900">{upcoming.length}</div>
        </Card>
        <Card className="rounded-[2rem]">
          <div className="text-sm text-slate-500">Записи на сегодня</div>
          <div className="mt-3 font-sans text-3xl font-semibold text-slate-900">
            {appointments.filter((item) => item.date === getToday()).length}
          </div>
        </Card>
        <Card className="rounded-[2rem]">
          <div className="text-sm text-slate-500">Отменённые записи</div>
          <div className="mt-3 font-sans text-3xl font-semibold text-slate-900">
            {appointments.filter((item) => item.status === 'CANCELLED').length}
          </div>
        </Card>
      </div>

      <Card className="rounded-[2rem]">
        <h2 className="section-heading mb-4">Ближайшие приёмы</h2>
        <Table
          data={upcoming}
          columns={[
            { title: 'Пациент', render: (item) => item.patient?.fullName ?? '—' },
            {
              title: 'Врач',
              render: (item) => (
                <DoctorLink doctorId={item.doctor?.id} fullName={item.doctor?.fullName} />
              ),
            },
            { title: 'Время', render: (item) => formatDateTime(item.date, item.startTime) },
            {
              title: 'Статус',
              render: (item) => (
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${appointmentStatusClass[item.status]}`}
                >
                  {appointmentStatusLabel[item.status]}
                </span>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
