import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { appointmentsApi } from '../../api/appointmentsApi';
import { doctorsApi } from '../../api/doctorsApi';
import { getApiErrorMessage } from '../../api/axios';
import { servicesApi } from '../../api/servicesApi';
import { specializationsApi } from '../../api/specializationsApi';
import { AppointmentBookingForm } from '../../components/forms/AppointmentBookingForm';
import { DoctorLink } from '../../components/doctors/DoctorLink';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { useAuthStore } from '../../store/authStore';
import type { Appointment } from '../../types/appointment';
import type { MedicalService, Specialization, TimeSlot } from '../../types/common';
import type { Doctor } from '../../types/doctor';
import { formatDateTime } from '../../utils/date';
import { appointmentStatusClass, appointmentStatusLabel } from '../../utils/format';

export function PatientAppointmentsPage() {
  const patientId = useAuthStore((state) => state.user?.patient?.id);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAppointments = async () => {
    if (!patientId) return;

    try {
      setAppointments(await appointmentsApi.getByPatient(patientId));
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [patientId]);

  useEffect(() => {
    specializationsApi
      .getAll()
      .then(setSpecializations)
      .catch((error) => toast.error(getApiErrorMessage(error)));
  }, []);

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem]">
        <div className="mb-6">
          <h2 className="section-heading">Запись на приём</h2>
          <p className="mt-2 text-sm text-slate-500">
            Подберите врача, услугу и свободное время в личном кабинете ИнфоМед.
          </p>
        </div>
        <AppointmentBookingForm
          mode="patient"
          specializations={specializations}
          doctors={doctors}
          services={services}
          slots={slots}
          loading={loading}
          onSpecializationChange={async (specializationId) => {
            try {
              const [doctorsData, servicesData] = await Promise.all([
                doctorsApi.getBySpecialization(specializationId),
                servicesApi.getBySpecialization(specializationId),
              ]);
              setDoctors(doctorsData);
              setServices(servicesData);
              setSlots([]);
            } catch (error) {
              toast.error(getApiErrorMessage(error));
            }
          }}
          onDoctorDateChange={async (doctorId, date, serviceId) => {
            try {
              setSlots(await appointmentsApi.getAvailableSlots(doctorId, date, serviceId));
            } catch (error) {
              toast.error(getApiErrorMessage(error));
            }
          }}
          onSubmit={async (payload) => {
            setLoading(true);
            try {
              await appointmentsApi.create(payload);
              toast.success('Вы успешно записаны на приём');
              loadAppointments();
            } catch (error) {
              toast.error(getApiErrorMessage(error));
            } finally {
              setLoading(false);
            }
          }}
        />
      </Card>

      <Card className="rounded-[2rem]">
        <h2 className="section-heading mb-4">Мои записи</h2>
        <Table
          data={appointments}
          columns={[
            {
              title: 'Врач',
              render: (item) => (
                <DoctorLink doctorId={item.doctor?.id} fullName={item.doctor?.fullName} />
              ),
            },
            { title: 'Услуга', render: (item) => item.service?.name ?? '—' },
            { title: 'Дата и время', render: (item) => formatDateTime(item.date, item.startTime) },
            {
              title: 'Статус',
              render: (item) => (
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${appointmentStatusClass[item.status]}`}
                >
                  {appointmentStatusLabel[item.status]}
                </span>
              ),
            },
            {
              title: 'Действия',
              render: (item) =>
                item.status === 'PLANNED' ? (
                  <Button
                    variant="danger"
                    onClick={async () => {
                      try {
                        await appointmentsApi.cancel(item.id);
                        toast.success('Запись отменена');
                        loadAppointments();
                      } catch (error) {
                        toast.error(getApiErrorMessage(error));
                      }
                    }}
                  >
                    Отменить
                  </Button>
                ) : (
                  '—'
                ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
