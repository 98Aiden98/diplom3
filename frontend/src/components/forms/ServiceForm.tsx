import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { MedicalService, Specialization } from '../../types/common';

interface ServiceFormProps {
  specializations: Specialization[];
  initialValues?: Partial<MedicalService>;
  loading?: boolean;
  onSubmit: (values: Partial<MedicalService>) => void;
}

export function ServiceForm({
  specializations,
  initialValues,
  loading,
  onSubmit,
}: ServiceFormProps) {
  const [values, setValues] = useState<Partial<MedicalService>>({
    name: '',
    description: '',
    price: 0,
    durationMinutes: 30,
    specializationId: specializations[0]?.id,
  });

  useEffect(() => {
    setValues({
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
      price: initialValues?.price ?? 0,
      durationMinutes: initialValues?.durationMinutes ?? 30,
      specializationId: initialValues?.specializationId ?? specializations[0]?.id,
    });
  }, [initialValues, specializations]);

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(values);
      }}
    >
      <Input
        label="Название услуги"
        value={values.name}
        onChange={(event) => setValues({ ...values, name: event.target.value })}
        required
      />
      <Select
        label="Специальность"
        value={values.specializationId}
        onChange={(event) =>
          setValues({ ...values, specializationId: Number(event.target.value) })
        }
      >
        {specializations.map((specialization) => (
          <option key={specialization.id} value={specialization.id}>
            {specialization.name}
          </option>
        ))}
      </Select>
      <Input
        label="Цена"
        type="number"
        min={0}
        value={values.price}
        onChange={(event) => setValues({ ...values, price: Number(event.target.value) })}
        required
      />
      <Input
        label="Длительность (мин.)"
        type="number"
        min={5}
        value={values.durationMinutes}
        onChange={(event) =>
          setValues({ ...values, durationMinutes: Number(event.target.value) })
        }
        required
      />
      <div className="md:col-span-2">
        <Input
          label="Описание"
          value={values.description ?? ''}
          onChange={(event) =>
            setValues({ ...values, description: event.target.value })
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
