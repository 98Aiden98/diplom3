import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { appointmentsApi } from '../../api/appointmentsApi';
import { medicalRecordsApi } from '../../api/medicalRecordsApi';
import { getApiErrorMessage } from '../../api/axios';
import { DoctorLink } from '../../components/doctors/DoctorLink';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { useAuthStore } from '../../store/authStore';
import type { Appointment } from '../../types/appointment';
import type { MedicalRecord } from '../../types/medicalRecord';
import { formatDateTime, getToday } from '../../utils/date';

export function PatientDashboard() {
  const patientId = useAuthStore((state) => state.user?.patient?.id);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  useEffect(() => {
    if (!patientId) return;

    Promise.all([appointmentsApi.getByPatient(patientId), medicalRecordsApi.getByPatient(patientId)])
      .then(([appointmentsData, recordsData]) => {
        setAppointments(appointmentsData);
        setRecords(recordsData);
      })
      .catch((error) => toast.error(getApiErrorMessage(error)));
  }, [patientId]);

  const upcoming = useMemo(
    () => appointments.filter((item) => item.status === 'PLANNED' && item.date >= getToday()),
    [appointments],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-[2rem]">
          <div className="text-sm text-slate-500">Предстоящие записи</div>
          <div className="mt-3 font-sans text-3xl font-semibold text-slate-900">{upcoming.length}</div>
        </Card>
        <Card className="rounded-[2rem]">
          <div className="text-sm text-slate-500">Завершённые визиты</div>
          <div className="mt-3 font-sans text-3xl font-semibold text-slate-900">{records.length}</div>
        </Card>
        <Card className="rounded-[2rem]">
          <div className="text-sm text-slate-500">Рекомендации врача</div>
          <div className="mt-3 text-sm text-slate-700">
            {records[0]?.recommendations ?? 'Последние рекомендации появятся после приёма.'}
          </div>
        </Card>
      </div>

      <Card className="rounded-[2rem]">
        <h2 className="section-heading mb-4">Ближайшие записи</h2>
        <Table
          data={upcoming.slice(0, 5)}
          columns={[
            {
              title: 'Врач',
              render: (item) => (
                <DoctorLink doctorId={item.doctor?.id} fullName={item.doctor?.fullName} />
              ),
            },
            { title: 'Услуга', render: (item) => item.service?.name ?? '—' },
            { title: 'Дата и время', render: (item) => formatDateTime(item.date, item.startTime) },
          ]}
        />
      </Card>
    </div>
  );
}
