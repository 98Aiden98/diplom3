import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { appointmentsApi } from '../../api/appointmentsApi';
import { getApiErrorMessage } from '../../api/axios';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { useAuthStore } from '../../store/authStore';
import type { Appointment } from '../../types/appointment';
import { formatDateTime } from '../../utils/date';
import { appointmentStatusLabel } from '../../utils/format';

export function DoctorAppointmentsPage() {
  const navigate = useNavigate();
  const doctorId = useAuthStore((state) => state.user?.doctor?.id);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const loadAppointments = async () => {
    if (!doctorId) return;
    try {
      setAppointments(await appointmentsApi.getByDoctor(doctorId));
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [doctorId]);

  return (
    <Table
      data={appointments}
      columns={[
        { title: 'Пациент', render: (item) => item.patient?.fullName ?? '—' },
        { title: 'Услуга', render: (item) => item.service?.name ?? '—' },
        { title: 'Дата и время', render: (item) => formatDateTime(item.date, item.startTime) },
        { title: 'Статус', render: (item) => appointmentStatusLabel[item.status] },
        {
          title: 'Действия',
          render: (item) => (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                onClick={() =>
                  navigate(`/doctor/patients/${item.patientId}?appointmentId=${item.id}`)
                }
              >
                Открыть карту
              </Button>
              {item.status === 'PLANNED' ? (
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
              ) : null}
            </div>
          ),
        },
      ]}
    />
  );
}
