import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { Gender } from '../../types/common';
import type { Patient } from '../../types/patient';

type PatientValues = Partial<Patient> & {
  fullName: string;
  birthDate: string;
  gender: Gender;
  phone: string;
};

interface PatientFormProps {
  initialValues?: Partial<Patient>;
  loading?: boolean;
  onSubmit: (values: PatientValues) => void;
}

export function PatientForm({ initialValues, loading, onSubmit }: PatientFormProps) {
  const [values, setValues] = useState<PatientValues>({
    fullName: '',
    birthDate: '',
    gender: 'MALE',
    phone: '',
    email: '',
    address: '',
    passportNumber: '',
    policyNumber: '',
  });

  useEffect(() => {
    setValues({
      fullName: initialValues?.fullName ?? '',
      birthDate: initialValues?.birthDate ?? '',
      gender: initialValues?.gender ?? 'MALE',
      phone: initialValues?.phone ?? '',
      email: initialValues?.email ?? '',
      address: initialValues?.address ?? '',
      passportNumber: initialValues?.passportNumber ?? '',
      policyNumber: initialValues?.policyNumber ?? '',
      userId: initialValues?.userId,
    });
  }, [initialValues]);

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(values);
      }}
    >
      <Input
        label="ФИО"
        value={values.fullName}
        onChange={(event) => setValues({ ...values, fullName: event.target.value })}
        required
      />
      <Input
        label="Дата рождения"
        type="date"
        value={values.birthDate}
        onChange={(event) => setValues({ ...values, birthDate: event.target.value })}
        required
      />
      <Select
        label="Пол"
        value={values.gender}
        onChange={(event) =>
          setValues({ ...values, gender: event.target.value as Gender })
        }
      >
        <option value="MALE">Мужской</option>
        <option value="FEMALE">Женский</option>
        <option value="OTHER">Другой</option>
      </Select>
      <Input
        label="Телефон"
        value={values.phone}
        onChange={(event) => setValues({ ...values, phone: event.target.value })}
        required
      />
        <Input
          label="Email"
          type="email"
          value={values.email ?? ''}
          onChange={(event) => setValues({ ...values, email: event.target.value })}
        />
        <Input
          label="Полис"
          value={values.policyNumber ?? ''}
          onChange={(event) => setValues({ ...values, policyNumber: event.target.value })}
        />
      <div className="md:col-span-2">
        <Input
          label="Адрес"
          value={values.address ?? ''}
          onChange={(event) => setValues({ ...values, address: event.target.value })}
        />
      </div>
      <div className="md:col-span-2">
        <Input
          label="Паспорт"
          value={values.passportNumber ?? ''}
          onChange={(event) =>
            setValues({ ...values, passportNumber: event.target.value })
          }
        />
      </div>
      <div className="md:col-span-2 flex justify-end">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
}
