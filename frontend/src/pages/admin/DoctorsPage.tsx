import { CalendarClock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { doctorsApi } from '../../api/doctorsApi';
import { getApiErrorMessage } from '../../api/axios';
import { schedulesApi } from '../../api/schedulesApi';
import { specializationsApi } from '../../api/specializationsApi';
import { DoctorAvatar } from '../../components/doctors/DoctorAvatar';
import { DoctorLink } from '../../components/doctors/DoctorLink';
import { DoctorForm, type DoctorFormValues } from '../../components/forms/DoctorForm';
import { ScheduleForm, type ScheduleFormValues } from '../../components/forms/ScheduleForm';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Table } from '../../components/ui/Table';
import type { DoctorSchedule, Specialization } from '../../types/common';
import type { Doctor } from '../../types/doctor';
import { dayName } from '../../utils/date';

export function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleDoctor, setScheduleDoctor] = useState<Doctor | null>(null);
  const [scheduleItems, setScheduleItems] = useState<DoctorSchedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<DoctorSchedule | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const loadData = async () => {
    try {
      const [doctorsData, specializationsData] = await Promise.all([
        doctorsApi.getAll(),
        specializationsApi.getAll(),
      ]);
      setDoctors(doctorsData);
      setSpecializations(specializationsData);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const loadDoctorSchedules = async (doctorId: number) => {
    try {
      setScheduleItems(await schedulesApi.getByDoctor(doctorId));
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async (payload: DoctorFormValues) => {
    setLoading(true);

    try {
      if (selectedDoctor) {
        await doctorsApi.update(selectedDoctor.id, payload);
      } else {
        await doctorsApi.create(payload);
      }

      toast.success(selectedDoctor ? 'Профиль врача обновлён' : 'Врач добавлен');
      setModalOpen(false);
      setSelectedDoctor(null);
      loadData();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSubmit = async (values: ScheduleFormValues) => {
    if (!scheduleDoctor) {
      return;
    }

    setScheduleLoading(true);

    try {
      if (selectedSchedule) {
        await schedulesApi.update(selectedSchedule.id, {
          doctorId: scheduleDoctor.id,
          ...values,
        });
        toast.success('Расписание обновлено');
      } else {
        await schedulesApi.create({
          doctorId: scheduleDoctor.id,
          ...values,
        });
        toast.success('Интервал расписания добавлен');
      }

      setSelectedSchedule(null);
      await Promise.all([loadDoctorSchedules(scheduleDoctor.id), loadData()]);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setScheduleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          className="w-full sm:w-auto"
          onClick={() => {
            setSelectedDoctor(null);
            setModalOpen(true);
          }}
        >
          Добавить врача
        </Button>
      </div>

      <Table
        data={doctors}
        columns={[
          {
            title: 'Врач',
            render: (item) => (
              <div className="flex min-w-0 items-center gap-3">
                <DoctorAvatar
                  fullName={item.fullName}
                  photoUrl={item.photoUrl}
                  className="h-14 w-14 rounded-[1.25rem]"
                />
                <div className="min-w-0">
                  <DoctorLink doctorId={item.id} fullName={item.fullName} className="text-slate-900" />
                  <div className="mt-1 text-xs text-slate-500">
                    {item.specialization?.name ?? 'Без специальности'}
                  </div>
                </div>
              </div>
            ),
          },
          { title: 'Кабинет', render: (item) => item.cabinetNumber },
          { title: 'Стаж', render: (item) => `${item.experienceYears} лет` },
          { title: 'Контакты', render: (item) => `${item.phone} / ${item.email}` },
          {
            title: 'Расписание',
            render: (item) =>
              item.schedules?.length ? (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CalendarClock size={15} className="text-brand-600" />
                  <span>{item.schedules.length} интервал(ов)</span>
                </div>
              ) : (
                <span className="text-sm text-slate-400">Не заполнено</span>
              ),
          },
          {
            title: 'Действия',
            render: (item) => (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={async () => {
                    setScheduleDoctor(item);
                    setSelectedSchedule(null);
                    setScheduleModalOpen(true);
                    await loadDoctorSchedules(item.id);
                  }}
                >
                  Расписание
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedDoctor(item);
                    setModalOpen(true);
                  }}
                >
                  Редактировать
                </Button>
                <Button
                  variant="danger"
                  onClick={async () => {
                    try {
                      await doctorsApi.remove(item.id);
                      toast.success('Врач удалён');
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
        title={selectedDoctor ? 'Редактировать врача' : 'Новый врач'}
        onClose={() => {
          setModalOpen(false);
          setSelectedDoctor(null);
        }}
      >
        <DoctorForm
          specializations={specializations}
          initialValues={selectedDoctor ?? undefined}
          loading={loading}
          onSubmit={submit}
        />
      </Modal>

      <Modal
        open={scheduleModalOpen}
        title={
          scheduleDoctor
            ? `Расписание врача: ${scheduleDoctor.fullName}`
            : 'Расписание врача'
        }
        maxWidthClassName="max-w-5xl"
        onClose={() => {
          setScheduleModalOpen(false);
          setScheduleDoctor(null);
          setScheduleItems([]);
          setSelectedSchedule(null);
        }}
      >
        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-4 font-sans text-xl font-semibold text-slate-900">
              {selectedSchedule ? 'Изменение интервала' : 'Новый интервал'}
            </h3>
            <ScheduleForm
              initialValues={selectedSchedule ?? undefined}
              defaultCabinetNumber={scheduleDoctor?.cabinetNumber}
              loading={scheduleLoading}
              onSubmit={handleScheduleSubmit}
              onCancelEdit={() => setSelectedSchedule(null)}
            />
          </div>

          <div className="min-w-0 overflow-hidden">
            {scheduleItems.length > 0 ? (
              <Table
                data={scheduleItems}
                columns={[
                  { title: 'День', render: (item) => dayName(item.dayOfWeek) },
                  { title: 'Начало', render: (item) => item.startTime },
                  { title: 'Окончание', render: (item) => item.endTime },
                  { title: 'Кабинет', render: (item) => item.cabinetNumber ?? '—' },
                  { title: 'Статус', render: (item) => (item.isActive ? 'Активно' : 'Неактивно') },
                  {
                    title: 'Действия',
                    render: (item) => (
                      <div className="flex flex-wrap gap-2">
                        <Button variant="ghost" onClick={() => setSelectedSchedule(item)}>
                          Изменить
                        </Button>
                        <Button
                          variant="danger"
                          onClick={async () => {
                            try {
                              await schedulesApi.remove(item.id);
                              toast.success('Интервал расписания удалён');
                              if (scheduleDoctor) {
                                await Promise.all([
                                  loadDoctorSchedules(scheduleDoctor.id),
                                  loadData(),
                                ]);
                              }
                              if (selectedSchedule?.id === item.id) {
                                setSelectedSchedule(null);
                              }
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
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                Для врача пока не настроено расписание. Добавьте первый рабочий интервал слева.
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
