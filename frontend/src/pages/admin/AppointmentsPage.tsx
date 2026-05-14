import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { appointmentsApi } from '../../api/appointmentsApi';
import { getApiErrorMessage } from '../../api/axios';
import { DoctorLink } from '../../components/doctors/DoctorLink';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table } from '../../components/ui/Table';
import type { Appointment } from '../../types/appointment';
import type { AppointmentStatus } from '../../types/common';
import { formatDateTime } from '../../utils/date';
import { appointmentStatusClass, appointmentStatusLabel } from '../../utils/format';

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [date, setDate] = useState('');
  const [status, setStatus] = useState<AppointmentStatus | ''>('');

  const loadAppointments = async () => {
    try {
      setAppointments(
        await appointmentsApi.getAll({
          ...(date ? { date } : {}),
          ...(status ? { status } : {}),
        }),
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem]">
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Дата" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <Select
            label="Статус"
            value={status}
            onChange={(event) => setStatus(event.target.value as AppointmentStatus | '')}
          >
            <option value="">Все статусы</option>
            {(['PLANNED', 'COMPLETED', 'CANCELLED', 'MISSED'] as AppointmentStatus[]).map((item) => (
              <option key={item} value={item}>
                {appointmentStatusLabel[item]}
              </option>
            ))}
          </Select>
          <div className="flex items-end">
            <Button variant="secondary" onClick={loadAppointments} className="w-full sm:w-auto">
              Применить фильтры
            </Button>
          </div>
        </div>
      </Card>

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
          { title: 'Дата и время', render: (item) => formatDateTime(item.date, item.startTime) },
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
          {
            title: 'Действия',
            render: (item) => (
              <div className="flex flex-wrap gap-2">
                {item.status === 'PLANNED' ? (
                  <>
                    <Button
                      variant="secondary"
                      onClick={async () => {
                        try {
                          await appointmentsApi.complete(item.id);
                          toast.success('Приём завершён');
                          loadAppointments();
                        } catch (error) {
                          toast.error(getApiErrorMessage(error));
                        }
                      }}
                    >
                      Завершить
                    </Button>
                    <Button
                      variant="danger"
                      onClick={async () => {
                        try {
                          await appointmentsApi.cancel(item.id);
                          toast.success('Запись отменена');
                          loadAppointments();
                        } catch (error) {
                          toast.error(getApiErrorMessage(error));
                        }
                      }}
                    >
                      Отменить
                    </Button>
                  </>
                ) : (
                  '—'
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
