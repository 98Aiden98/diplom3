import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { doctorsApi } from '../../api/doctorsApi';
import { schedulesApi } from '../../api/schedulesApi';
import { getApiErrorMessage } from '../../api/axios';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { Table } from '../../components/ui/Table';
import type { Doctor } from '../../types/doctor';
import type { DoctorSchedule } from '../../types/common';
import { dayName } from '../../utils/date';

export function SchedulePage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorId, setDoctorId] = useState<number | ''>('');
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);

  useEffect(() => {
    doctorsApi
      .getAll()
      .then(setDoctors)
      .catch((error) => toast.error(getApiErrorMessage(error)));
  }, []);

  useEffect(() => {
    if (!doctorId) {
      setSchedules([]);
      return;
    }

    schedulesApi
      .getByDoctor(Number(doctorId))
      .then(setSchedules)
      .catch((error) => toast.error(getApiErrorMessage(error)));
  }, [doctorId]);

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem]">
        <Select
          label="Выберите врача"
          value={doctorId}
          onChange={(event) => setDoctorId(Number(event.target.value))}
        >
          <option value="">Выберите врача</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.fullName} ({doctor.specialization?.name ?? 'без специальности'})
            </option>
          ))}
        </Select>
      </Card>

      <Table
        data={schedules}
        columns={[
          { title: 'День', render: (item) => dayName(item.dayOfWeek) },
          { title: 'Начало', render: (item) => item.startTime },
          { title: 'Окончание', render: (item) => item.endTime },
          { title: 'Кабинет', render: (item) => item.cabinetNumber ?? '—' },
          { title: 'Статус', render: (item) => (item.isActive ? 'Активно' : 'Неактивно') },
        ]}
      />
    </div>
  );
}
