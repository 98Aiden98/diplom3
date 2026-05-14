import clsx from 'clsx';
import { CalendarClock, MapPin, Stethoscope } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { Doctor } from '../../types/doctor';
import type { Patient } from '../../types/patient';
import type { MedicalService, Specialization, TimeSlot } from '../../types/common';
import { DoctorAvatar } from '../doctors/DoctorAvatar';
import { DoctorLink } from '../doctors/DoctorLink';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface BookingPayload {
  patientId?: number;
  doctorId: number;
  serviceId: number;
  date: string;
  startTime: string;
  reason?: string;
  comment?: string;
}

interface AppointmentBookingFormProps {
  mode: 'patient' | 'registrar';
  specializations: Specialization[];
  doctors: Doctor[];
  services: MedicalService[];
  slots: TimeSlot[];
  patients?: Patient[];
  initialPatientId?: number;
  loading?: boolean;
  onSpecializationChange?: (specializationId: number) => void;
  onDoctorDateChange?: (doctorId: number, date: string, serviceId?: number) => void;
  onSubmit: (payload: BookingPayload) => void;
}

export function AppointmentBookingForm({
  mode,
  patients = [],
  specializations,
  doctors,
  services,
  slots,
  initialPatientId,
  loading,
  onSpecializationChange,
  onDoctorDateChange,
  onSubmit,
}: AppointmentBookingFormProps) {
  const [patientId, setPatientId] = useState<number | undefined>(initialPatientId);
  const [specializationId, setSpecializationId] = useState<number | undefined>();
  const [doctorId, setDoctorId] = useState<number | undefined>();
  const [serviceId, setServiceId] = useState<number | undefined>();
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');

  const selectedDoctor = useMemo(
    () => doctors.find((item) => item.id === doctorId),
    [doctorId, doctors],
  );

  useEffect(() => {
    setPatientId(initialPatientId);
  }, [initialPatientId]);

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();

        if (!doctorId || !serviceId || !date || !startTime || (mode === 'registrar' && !patientId)) {
          return;
        }

        onSubmit({
          patientId,
          doctorId,
          serviceId,
          date,
          startTime,
          reason: reason.trim() || undefined,
          comment: comment.trim() || undefined,
        });
      }}
    >
      {mode === 'registrar' ? (
        <Select
          label="Пациент"
          value={patientId}
          onChange={(event) => setPatientId(Number(event.target.value))}
        >
          <option value="">Выберите пациента</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.fullName}
            </option>
          ))}
        </Select>
      ) : null}

      <Select
        label="Специальность"
        value={specializationId}
        onChange={(event) => {
          const nextValue = Number(event.target.value);
          setSpecializationId(nextValue);
          setDoctorId(undefined);
          setServiceId(undefined);
          setStartTime('');
          onSpecializationChange?.(nextValue);
        }}
      >
        <option value="">Выберите специальность</option>
        {specializations.map((specialization) => (
          <option key={specialization.id} value={specialization.id}>
            {specialization.name}
          </option>
        ))}
      </Select>

      <div className="md:col-span-2">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-medium text-slate-700">Врач</div>
            <div className="text-sm text-slate-500">
              Нажмите на карточку врача, чтобы выбрать его для записи.
            </div>
          </div>
          {selectedDoctor ? (
            <div className="self-start rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              Выбран: {selectedDoctor.fullName}
            </div>
          ) : null}
        </div>

        {doctors.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {doctors.map((doctor) => {
              const isSelected = doctor.id === doctorId;

              return (
                <div
                  key={doctor.id}
                  className={clsx(
                    'rounded-[1.75rem] border bg-white p-4 transition',
                    isSelected
                      ? 'border-brand-300 shadow-[0_20px_45px_-30px_rgba(14,165,233,0.75)] ring-2 ring-brand-100'
                      : 'border-slate-200 hover:border-sky-200 hover:shadow-[0_18px_35px_-28px_rgba(14,165,233,0.55)]',
                  )}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <DoctorAvatar fullName={doctor.fullName} photoUrl={doctor.photoUrl} />
                    <div className="min-w-0 flex-1">
                      <DoctorLink doctorId={doctor.id} fullName={doctor.fullName} className="text-slate-900" />
                      <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <Stethoscope size={14} />
                        <span>{doctor.specialization?.name ?? 'Специалист'}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <MapPin size={14} />
                        <span>Кабинет {doctor.cabinetNumber}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <CalendarClock size={14} />
                        <span>Стаж {doctor.experienceYears} лет</span>
                      </div>
                      <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                        {doctor.description ?? 'Подробная информация доступна на странице врача.'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Button
                      type="button"
                      variant={isSelected ? 'primary' : 'secondary'}
                      className="w-full sm:w-auto"
                      onClick={() => {
                        setDoctorId(doctor.id);
                        setStartTime('');

                        if (date) {
                          onDoctorDateChange?.(doctor.id, date, serviceId);
                        }
                      }}
                    >
                      {isSelected ? 'Врач выбран' : 'Выбрать врача'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            Сначала выберите специальность, чтобы увидеть подходящих врачей.
          </div>
        )}
      </div>

      <Select
        label="Услуга"
        value={serviceId}
        onChange={(event) => {
          const nextService = Number(event.target.value);
          setServiceId(nextService);
          setStartTime('');

          if (doctorId && date) {
            onDoctorDateChange?.(doctorId, date, nextService);
          }
        }}
      >
        <option value="">Выберите услугу</option>
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name}
          </option>
        ))}
      </Select>

      <Input
        label="Дата"
        type="date"
        value={date}
        onChange={(event) => {
          const nextDate = event.target.value;
          setDate(nextDate);
          setStartTime('');

          if (doctorId && nextDate) {
            onDoctorDateChange?.(doctorId, nextDate, serviceId);
          }
        }}
        required
      />

      <Select label="Время" value={startTime} onChange={(event) => setStartTime(event.target.value)}>
        <option value="">Выберите слот</option>
        {slots.map((slot) => (
          <option key={slot.startTime} value={slot.startTime}>
            {slot.startTime} - {slot.endTime}
          </option>
        ))}
      </Select>

      <div className="rounded-[1.75rem] border border-sky-100 bg-sky-50/70 p-4 text-sm text-slate-600">
        {selectedDoctor ? (
          <>
            <div className="font-semibold text-slate-900">Выбранный врач</div>
            <div className="mt-2">{selectedDoctor.fullName}</div>
            <div className="mt-1 text-slate-500">
              {selectedDoctor.specialization?.name ?? 'Специалист'}, кабинет {selectedDoctor.cabinetNumber}
            </div>
          </>
        ) : (
          'Выберите врача, чтобы продолжить запись.'
        )}
      </div>

      <div className="md:col-span-2">
        <Input
          label="Причина обращения"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </div>
      <div className="md:col-span-2">
        <Input
          label="Комментарий"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </div>
      <div className="md:col-span-2 flex justify-end">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? 'Сохранение...' : 'Записать на приём'}
        </Button>
      </div>
    </form>
  );
}
