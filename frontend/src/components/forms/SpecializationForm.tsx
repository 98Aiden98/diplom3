import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Specialization } from '../../types/common';

interface SpecializationFormProps {
  initialValues?: Partial<Specialization>;
  loading?: boolean;
  onSubmit: (values: Partial<Specialization>) => void;
}

export function SpecializationForm({
  initialValues,
  loading,
  onSubmit,
}: SpecializationFormProps) {
  const [values, setValues] = useState<Partial<Specialization>>({
    name: '',
    description: '',
  });

  useEffect(() => {
    setValues({
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
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
        label="Название"
        value={values.name}
        onChange={(event) => setValues({ ...values, name: event.target.value })}
        required
      />
      <Input
        label="Описание"
        value={values.description ?? ''}
        onChange={(event) =>
          setValues({ ...values, description: event.target.value })
        }
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
}
