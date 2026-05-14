import { Mail, MapPin, Phone, Stethoscope } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { doctorsApi } from '../../api/doctorsApi';
import { getApiErrorMessage } from '../../api/axios';
import { servicesApi } from '../../api/servicesApi';
import { DoctorAvatar } from '../../components/doctors/DoctorAvatar';
import { Card } from '../../components/ui/Card';
import type { DoctorSchedule, MedicalService } from '../../types/common';
import type { Doctor } from '../../types/doctor';
import { dayName } from '../../utils/date';
import { formatCurrency } from '../../utils/format';

export function DoctorProfilePage() {
  const { doctorId } = useParams();
  const numericDoctorId = Number(doctorId);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [schedule, setSchedule] = useState<DoctorSchedule[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!numericDoctorId) {
      return;
    }

    let cancelled = false;

    const loadData = async () => {
      setLoading(true);

      try {
        const [doctorData, scheduleData] = await Promise.all([
          doctorsApi.getById(numericDoctorId),
          doctorsApi.getSchedule(numericDoctorId),
        ]);

        const servicesData = await servicesApi.getBySpecialization(doctorData.specializationId);

        if (cancelled) {
          return;
        }

        setDoctor(doctorData);
        setSchedule(scheduleData);
        setServices(servicesData);
      } catch (error) {
        if (!cancelled) {
          toast.error(getApiErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [numericDoctorId]);

  if (!numericDoctorId) {
    return (
      <Card className="rounded-[2rem]">
        <div className="text-sm text-rose-600">Некорректный идентификатор врача.</div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="rounded-[2rem]">
        <div className="text-sm text-slate-500">Загружаем профиль врача...</div>
      </Card>
    );
  }

  if (!doctor) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] overflow-hidden">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <div className="rounded-[1.75rem] bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-5">
            <DoctorAvatar fullName={doctor.fullName} photoUrl={doctor.photoUrl} className="h-48 w-full rounded-[1.75rem] sm:h-56" />
          </div>

          <div className="space-y-5">
            <div>
              <div className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">
                {doctor.specialization?.name ?? 'Специалист'}
              </div>
              <h2 className="mt-4 font-sans text-3xl font-semibold text-slate-900">{doctor.fullName}</h2>
              <p className="mt-3 max-w-3xl text-slate-600">
                {doctor.description ?? 'Подробное описание врача пока не заполнено.'}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Stethoscope size={16} />
                  Стаж
                </div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{doctor.experienceYears} лет</div>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <MapPin size={16} />
                  Кабинет
                </div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{doctor.cabinetNumber}</div>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Phone size={16} />
                  Телефон
                </div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{doctor.phone}</div>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Mail size={16} />
                  Email
                </div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{doctor.email}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-[2rem]">
          <h3 className="section-heading mb-4">Услуги по специальности</h3>
          <div className="space-y-3">
            {services.length > 0 ? (
              services.map((service) => (
                <div key={service.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{service.name}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        {service.description ?? 'Описание услуги не заполнено.'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">{formatCurrency(service.price)}</div>
                      <div className="mt-1 text-sm text-slate-500">{service.durationMinutes} минут</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                Для врача пока не добавлены услуги.
              </div>
            )}
          </div>
        </Card>

        <Card className="rounded-[2rem]">
          <h3 className="section-heading mb-4">Расписание врача</h3>
          <div className="space-y-3">
            {schedule.length > 0 ? (
              schedule.map((item) => (
                <div key={item.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="font-semibold text-slate-900">{dayName(item.dayOfWeek)}</div>
                    <div className="text-sm text-slate-600">
                      {item.startTime} - {item.endTime}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-slate-500">
                    Кабинет {item.cabinetNumber ?? doctor.cabinetNumber}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                Расписание для врача пока не заполнено.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
