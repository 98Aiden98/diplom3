import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { appointmentsApi } from '../../api/appointmentsApi';
import { getApiErrorMessage } from '../../api/axios';
import { reportsApi } from '../../api/reportsApi';
import { DoctorLink } from '../../components/doctors/DoctorLink';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import type { Appointment } from '../../types/appointment';
import { formatDateTime } from '../../utils/date';
import { appointmentStatusClass, appointmentStatusLabel, formatCurrency } from '../../utils/format';

export function AdminDashboard() {
  const [summary, setSummary] = useState<{
    patientsCount: number;
    doctorsCount: number;
    appointmentsTodayCount: number;
    completedAppointmentsCount: number;
    revenue: number;
  } | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    Promise.all([reportsApi.getSummary(), appointmentsApi.getAll()])
      .then(([summaryData, appointmentsData]) => {
        setSummary(summaryData);
        setAppointments(appointmentsData.slice(0, 8));
      })
      .catch((error) => toast.error(getApiErrorMessage(error)));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          ['Пациенты', summary?.patientsCount ?? 0],
          ['Врачи', summary?.doctorsCount ?? 0],
          ['Записи на сегодня', summary?.appointmentsTodayCount ?? 0],
          ['Завершённые приёмы', summary?.completedAppointmentsCount ?? 0],
          ['Выручка', formatCurrency(summary?.revenue ?? 0)],
        ].map(([label, value]) => (
          <Card key={label} className="rounded-[2rem]">
            <div className="text-sm text-slate-500">{label}</div>
            <div className="mt-3 font-sans text-3xl font-semibold text-slate-900">{value}</div>
          </Card>
        ))}
      </div>

      <Card className="rounded-[2rem]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="section-heading">Последние записи</h2>
            <p className="mt-1 text-sm text-slate-500">
              Краткий операционный срез по приёмам в системе ИнфоМед.
            </p>
          </div>
        </div>
        <Table
          data={appointments}
          columns={[
            { title: 'Пациент', render: (item) => item.patient?.fullName ?? '—' },
            {
              title: 'Врач',
              render: (item) => (
                <DoctorLink doctorId={item.doctor?.id} fullName={item.doctor?.fullName} />
              ),
            },
            { title: 'Услуга', render: (item) => item.service?.name ?? '—' },
            {
              title: 'Дата и время',
              render: (item) => formatDateTime(item.date, item.startTime),
            },
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
