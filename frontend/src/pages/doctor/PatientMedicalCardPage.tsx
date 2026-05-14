import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { medicalRecordsApi } from '../../api/medicalRecordsApi';
import { patientsApi } from '../../api/patientsApi';
import { getApiErrorMessage } from '../../api/axios';
import { MedicalRecordForm } from '../../components/forms/MedicalRecordForm';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import type { Patient } from '../../types/patient';
import type { Appointment } from '../../types/appointment';
import type { MedicalRecord } from '../../types/medicalRecord';
import { formatDateTime } from '../../utils/date';

export function PatientMedicalCardPage() {
  const { patientId } = useParams();
  const [searchParams] = useSearchParams();
  const appointmentId = useMemo(() => Number(searchParams.get('appointmentId') ?? 0), [searchParams]);
  const numericPatientId = Number(patientId);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [history, setHistory] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [patientData, historyData, recordsData] = await Promise.all([
        patientsApi.getById(numericPatientId),
        patientsApi.getHistory(numericPatientId),
        patientsApi.getRecords(numericPatientId),
      ]);
      setPatient(patientData);
      setHistory(historyData);
      setRecords(recordsData);

      if (appointmentId) {
        try {
          setCurrentRecord(await medicalRecordsApi.getByAppointment(appointmentId));
        } catch {
          setCurrentRecord(null);
        }
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  useEffect(() => {
    if (!numericPatientId) return;
    loadData();
  }, [numericPatientId, appointmentId]);

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <div className="text-sm text-slate-500">Пациент</div>
            <div className="mt-2 font-sans text-xl font-semibold text-slate-900">
              {patient?.fullName}
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Дата рождения</div>
            <div className="mt-2 font-semibold text-slate-900">{patient?.birthDate}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Телефон</div>
            <div className="mt-2 font-semibold text-slate-900">{patient?.phone}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Полис</div>
            <div className="mt-2 font-semibold text-slate-900">{patient?.policyNumber ?? '—'}</div>
          </div>
        </div>
      </Card>

      <Card className="rounded-[2rem]">
        <div className="mb-5">
          <h2 className="section-heading">
            {currentRecord ? 'Редактирование медицинской записи' : 'Новая медицинская запись'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {appointmentId
              ? `Для приёма #${appointmentId}`
              : 'Откройте карту из списка приёмов, чтобы привязать запись к конкретному визиту.'}
          </p>
        </div>
        {appointmentId ? (
          <MedicalRecordForm
            initialValues={currentRecord ?? undefined}
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                if (currentRecord) {
                  await medicalRecordsApi.update(currentRecord.id, values);
                  toast.success('Медицинская запись обновлена');
                } else {
                  await medicalRecordsApi.create({ ...values, appointmentId });
                  toast.success('Медицинская запись создана');
                }
                loadData();
              } catch (error) {
                toast.error(getApiErrorMessage(error));
              } finally {
                setLoading(false);
              }
            }}
          />
        ) : (
          <p className="text-sm text-slate-500">
            Выберите пациента через список приёмов, чтобы открыть форму назначения и завершения визита.
          </p>
        )}
      </Card>

      <Card className="rounded-[2rem]">
        <h2 className="section-heading mb-4">История посещений</h2>
        <Table
          data={history}
          columns={[
            { title: 'Дата и время', render: (item) => formatDateTime(item.date, item.startTime) },
            { title: 'Услуга', render: (item) => item.service?.name ?? '—' },
            { title: 'Статус', render: (item) => item.status },
          ]}
        />
      </Card>

      <Card className="rounded-[2rem]">
        <h2 className="section-heading mb-4">Медицинские записи</h2>
        <Table
          data={records}
          columns={[
            { title: 'Дата', render: (item) => formatDateTime(item.appointment?.date, item.appointment?.startTime) },
            { title: 'Диагноз', render: (item) => item.diagnosis },
            { title: 'Рекомендации', render: (item) => item.recommendations },
          ]}
        />
      </Card>
    </div>
  );
}
