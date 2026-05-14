import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { usersApi } from '../../api/usersApi';
import { getApiErrorMessage } from '../../api/axios';
import { UserForm, type UserFormValues } from '../../components/forms/UserForm';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Table } from '../../components/ui/Table';
import type { User } from '../../types/user';
import { roleLabel } from '../../utils/format';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const loadUsers = async (value = query) => {
    try {
      setUsers(await usersApi.getAll(value ? { query: value } : undefined));
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (payload: UserFormValues) => {
    setLoading(true);

    try {
      if (selectedUser) {
        await usersApi.update(selectedUser.id, payload);
      } else {
        await usersApi.create(payload);
      }

      toast.success(selectedUser ? 'Пользователь обновлён' : 'Пользователь создан');
      setModalOpen(false);
      setSelectedUser(null);
      loadUsers();
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
          <div className="w-full lg:max-w-2xl">
            <Input
              label="Поиск по пользователям"
              placeholder="ФИО, email или телефон"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="secondary" onClick={() => loadUsers()} className="w-full sm:w-auto">
              Найти
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                setSelectedUser(null);
                setModalOpen(true);
              }}
            >
              Добавить пользователя
            </Button>
          </div>
        </div>
      </Card>

      <Table
        data={users}
        columns={[
          { title: 'ФИО', render: (item) => item.fullName },
          { title: 'Email', render: (item) => item.email },
          { title: 'Телефон', render: (item) => item.phone ?? '—' },
          { title: 'Роль', render: (item) => roleLabel[item.role] },
          {
            title: 'Действия',
            render: (item) => (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedUser(item);
                    setModalOpen(true);
                  }}
                >
                  Редактировать
                </Button>
                <Button
                  variant="danger"
                  onClick={async () => {
                    try {
                      await usersApi.remove(item.id);
                      toast.success('Пользователь удалён');
                      loadUsers();
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
        title={selectedUser ? 'Редактировать пользователя' : 'Новый пользователь'}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
      >
        <UserForm
          initialValues={
            selectedUser
              ? {
                  fullName: selectedUser.fullName,
                  email: selectedUser.email,
                  role: selectedUser.role,
                  phone: selectedUser.phone ?? '',
                }
              : undefined
          }
          loading={loading}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}
