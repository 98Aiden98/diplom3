import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { appointmentsApi } from '../../api/appointmentsApi';
import { doctorsApi } from '../../api/doctorsApi';
import { getApiErrorMessage } from '../../api/axios';
import { patientsApi } from '../../api/patientsApi';
import { servicesApi } from '../../api/servicesApi';
import { specializationsApi } from '../../api/specializationsApi';
import { AppointmentBookingForm } from '../../components/forms/AppointmentBookingForm';
import { Card } from '../../components/ui/Card';
import type { Doctor } from '../../types/doctor';
import type { Patient } from '../../types/patient';
import type { MedicalService, Specialization, TimeSlot } from '../../types/common';

export function CreateAppointmentPage() {
  const [searchParams] = useSearchParams();
  const initialPatientId = useMemo(() => {
    const raw = searchParams.get('patientId');
    return raw ? Number(raw) : undefined;
  }, [searchParams]);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([patientsApi.getAll(), specializationsApi.getAll()])
      .then(([patientsData, specializationsData]) => {
        setPatients(patientsData);
        setSpecializations(specializationsData);
      })
      .catch((error) => toast.error(getApiErrorMessage(error)));
  }, []);

  return (
    <Card className="rounded-[2rem]">
      <div className="mb-6">
        <h2 className="section-heading">Запись пациента на приём</h2>
        <p className="mt-2 text-sm text-slate-500">
          Выберите специальность, врача, услугу и свободное время из расписания.
        </p>
      </div>

      <AppointmentBookingForm
        mode="registrar"
        patients={patients}
        initialPatientId={initialPatientId}
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
            toast.success('Пациент успешно записан на приём');
            setSlots([]);
          } catch (error) {
            toast.error(getApiErrorMessage(error));
          } finally {
            setLoading(false);
          }
        }}
      />
    </Card>
  );
}
