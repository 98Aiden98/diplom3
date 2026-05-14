import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { MedicalRecord } from '../../types/medicalRecord';

type MedicalRecordValues = Partial<MedicalRecord> & {
  complaints: string;
  diagnosis: string;
  treatment: string;
  recommendations: string;
};

interface MedicalRecordFormProps {
  initialValues?: Partial<MedicalRecord>;
  loading?: boolean;
  onSubmit: (values: MedicalRecordValues) => void;
}

export function MedicalRecordForm({
  initialValues,
  loading,
  onSubmit,
}: MedicalRecordFormProps) {
  const [values, setValues] = useState<MedicalRecordValues>({
    complaints: '',
    diagnosis: '',
    treatment: '',
    recommendations: '',
    prescriptions: '',
  });

  useEffect(() => {
    setValues({
      complaints: initialValues?.complaints ?? '',
      diagnosis: initialValues?.diagnosis ?? '',
      treatment: initialValues?.treatment ?? '',
      recommendations: initialValues?.recommendations ?? '',
      prescriptions: initialValues?.prescriptions ?? '',
    });
  }, [initialValues]);

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(values);
      }}
    >
      <Input
        label="Жалобы"
        value={values.complaints}
        onChange={(event) => setValues({ ...values, complaints: event.target.value })}
        required
      />
      <Input
        label="Диагноз"
        value={values.diagnosis}
        onChange={(event) => setValues({ ...values, diagnosis: event.target.value })}
        required
      />
      <Input
        label="Лечение"
        value={values.treatment}
        onChange={(event) => setValues({ ...values, treatment: event.target.value })}
        required
      />
      <Input
        label="Рекомендации"
        value={values.recommendations}
        onChange={(event) =>
          setValues({ ...values, recommendations: event.target.value })
        }
        required
      />
      <Input
        label="Назначения"
        value={values.prescriptions ?? ''}
        onChange={(event) =>
          setValues({ ...values, prescriptions: event.target.value })
        }
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? 'Сохранение...' : 'Сохранить запись'}
        </Button>
      </div>
    </form>
  );
}
