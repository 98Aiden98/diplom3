import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { medicalRecordsApi } from '../../api/medicalRecordsApi';
import { getApiErrorMessage } from '../../api/axios';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { useAuthStore } from '../../store/authStore';
import type { MedicalRecord } from '../../types/medicalRecord';
import { formatDateTime } from '../../utils/date';

export function PatientRecordsPage() {
  const patientId = useAuthStore((state) => state.user?.patient?.id);
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  useEffect(() => {
    if (!patientId) return;
    medicalRecordsApi
      .getByPatient(patientId)
      .then(setRecords)
      .catch((error) => toast.error(getApiErrorMessage(error)));
  }, [patientId]);

  return (
    <Card className="rounded-[2rem]">
      <h2 className="section-heading mb-4">История посещений и рекомендации</h2>
      <Table
        data={records}
        columns={[
          { title: 'Дата', render: (item) => formatDateTime(item.appointment?.date, item.appointment?.startTime) },
          { title: 'Диагноз', render: (item) => item.diagnosis },
          { title: 'Лечение', render: (item) => item.treatment },
          { title: 'Рекомендации', render: (item) => item.recommendations },
        ]}
      />
    </Card>
  );
}
