import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { specializationsApi } from '../../api/specializationsApi';
import { getApiErrorMessage } from '../../api/axios';
import { SpecializationForm } from '../../components/forms/SpecializationForm';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Table } from '../../components/ui/Table';
import type { Specialization } from '../../types/common';

export function SpecializationsPage() {
  const [items, setItems] = useState<Specialization[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Specialization | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setItems(await specializationsApi.getAll());
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async (payload: Partial<Specialization>) => {
    setLoading(true);
    try {
      if (selectedItem) {
        await specializationsApi.update(selectedItem.id, payload);
      } else {
        await specializationsApi.create(payload);
      }

      toast.success(selectedItem ? 'Специальность обновлена' : 'Специальность добавлена');
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
          Добавить специальность
        </Button>
      </div>

      <Table
        data={items}
        columns={[
          { title: 'Название', render: (item) => item.name },
          { title: 'Описание', render: (item) => item.description ?? '—' },
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
                      await specializationsApi.remove(item.id);
                      toast.success('Специальность удалена');
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
        title={selectedItem ? 'Редактировать специальность' : 'Новая специальность'}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
        }}
      >
        <SpecializationForm
          initialValues={selectedItem ?? undefined}
          loading={loading}
          onSubmit={submit}
        />
      </Modal>
    </div>
  );
}
