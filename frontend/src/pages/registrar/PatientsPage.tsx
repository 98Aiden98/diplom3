import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { patientsApi } from '../../api/patientsApi';
import { getApiErrorMessage } from '../../api/axios';
import { PatientForm } from '../../components/forms/PatientForm';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Table } from '../../components/ui/Table';
import type { Patient } from '../../types/patient';
import { formatDate } from '../../utils/date';

export function PatientsPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);

  const loadPatients = async (search = query) => {
    try {
      setPatients(search ? await patientsApi.search(search) : await patientsApi.getAll());
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const submit = async (payload: Partial<Patient>) => {
    setLoading(true);
    try {
      if (selectedPatient) {
        await patientsApi.update(selectedPatient.id, payload);
      } else {
        await patientsApi.create(payload);
      }

      toast.success(selectedPatient ? 'Пациент обновлён' : 'Пациент добавлен');
      setModalOpen(false);
      setSelectedPatient(null);
      loadPatients();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <Input
            label="Поиск пациента"
            placeholder="ФИО, телефон или номер полиса"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="secondary" onClick={() => loadPatients()} className="w-full sm:w-auto">
              Найти
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                setSelectedPatient(null);
                setModalOpen(true);
              }}
            >
              Добавить пациента
            </Button>
          </div>
        </div>
      </Card>

      <Table
        data={patients}
        columns={[
          { title: 'ФИО', render: (item) => item.fullName },
          { title: 'Дата рождения', render: (item) => formatDate(item.birthDate) },
          { title: 'Телефон', render: (item) => item.phone },
          { title: 'Полис', render: (item) => item.policyNumber ?? '—' },
          {
            title: 'Действия',
            render: (item) => (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedPatient(item);
                    setModalOpen(true);
                  }}
                >
                  Редактировать
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    navigate(`/registrar/appointments/new?patientId=${item.id}`)
                  }
                >
                  Записать
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Modal
        open={modalOpen}
        title={selectedPatient ? 'Редактировать пациента' : 'Новый пациент'}
        onClose={() => {
          setModalOpen(false);
          setSelectedPatient(null);
        }}
      >
        <PatientForm
          initialValues={selectedPatient ?? undefined}
          loading={loading}
          onSubmit={submit}
        />
      </Modal>
    </div>
  );
}
