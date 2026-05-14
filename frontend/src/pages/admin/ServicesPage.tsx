import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getApiErrorMessage } from '../../api/axios';
import { servicesApi } from '../../api/servicesApi';
import { specializationsApi } from '../../api/specializationsApi';
import { ServiceForm } from '../../components/forms/ServiceForm';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Table } from '../../components/ui/Table';
import type { MedicalService, Specialization } from '../../types/common';
import { formatCurrency } from '../../utils/format';

export function ServicesPage() {
  const [services, setServices] = useState<MedicalService[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MedicalService | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [servicesData, specializationsData] = await Promise.all([
        servicesApi.getAll(),
        specializationsApi.getAll(),
      ]);
      setServices(servicesData);
      setSpecializations(specializationsData);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async (payload: Partial<MedicalService>) => {
    setLoading(true);
    try {
      if (selectedItem) {
        await servicesApi.update(selectedItem.id, payload);
      } else {
        await servicesApi.create(payload);
      }

      toast.success(selectedItem ? 'Услуга обновлена' : 'Услуга добавлена');
      setModalOpen(false);
      setSelectedItem(null);
      loadData();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          className="w-full sm:w-auto"
          onClick={() => {
            setSelectedItem(null);
            setModalOpen(true);
          }}
        >
          Добавить услугу
        </Button>
      </div>

      <Table
        data={services}
        columns={[
          { title: 'Услуга', render: (item) => item.name },
          { title: 'Специальность', render: (item) => item.specialization?.name ?? '—' },
          { title: 'Цена', render: (item) => formatCurrency(item.price) },
          { title: 'Длительность', render: (item) => `${item.durationMinutes} мин.` },
          {
            title: 'Действия',
            render: (item) => (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedItem(item);
                    setModalOpen(true);
                  }}
                >
                  Редактировать
                </Button>
                <Button
                  variant="danger"
                  onClick={async () => {
                    try {
                      await servicesApi.remove(item.id);
                      toast.success('Услуга удалена');
                      loadData();
                    } catch (error) {
                      toast.error(getApiErrorMessage(error));
                    }
                  }}
                >
                  Удалить
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Modal
        open={modalOpen}
        title={selectedItem ? 'Редактировать услугу' : 'Новая услуга'}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
        }}
      >
        <ServiceForm
          specializations={specializations}
          initialValues={selectedItem ?? undefined}
          loading={loading}
          onSubmit={submit}
        />
      </Modal>
    </div>
  );
}
