import { useEffect, useState } from 'react';
import type { Role } from '../../types/common';
import { roleLabel } from '../../utils/format';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export interface UserFormValues {
  fullName: string;
  email: string;
  password?: string;
  role: Role;
  phone?: string;
}

interface UserFormProps {
  initialValues?: Partial<UserFormValues>;
  loading?: boolean;
  onSubmit: (values: UserFormValues) => void;
}

export function UserForm({ initialValues, loading, onSubmit }: UserFormProps) {
  const [values, setValues] = useState<UserFormValues>({
    fullName: '',
    email: '',
    password: '',
    role: 'REGISTRAR',
    phone: '',
  });

  useEffect(() => {
    setValues({
      fullName: initialValues?.fullName ?? '',
      email: initialValues?.email ?? '',
      password: '',
      role: initialValues?.role ?? 'REGISTRAR',
      phone: initialValues?.phone ?? '',
    });
  }, [initialValues]);

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();

        onSubmit({
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          role: values.role,
          phone: values.phone?.trim() || undefined,
          password: values.password?.trim() || undefined,
        });
      }}
    >
      <Input
        label="ФИО"
        value={values.fullName}
        onChange={(event) => setValues({ ...values, fullName: event.target.value })}
        required
      />
      <Input
        label="Email"
        type="email"
        value={values.email}
        onChange={(event) => setValues({ ...values, email: event.target.value })}
        required
      />
      <Select
        label="Роль"
        value={values.role}
        onChange={(event) => setValues({ ...values, role: event.target.value as Role })}
      >
        {(['ADMIN', 'REGISTRAR', 'DOCTOR', 'PATIENT'] as Role[]).map((role) => (
          <option key={role} value={role}>
            {roleLabel[role]}
          </option>
        ))}
      </Select>
      <Input
        label="Телефон"
        value={values.phone}
        onChange={(event) => setValues({ ...values, phone: event.target.value })}
      />
      <div className="md:col-span-2">
        <Input
          label="Пароль"
          type="password"
          placeholder={initialValues?.email ? 'Оставьте пустым, чтобы не менять' : 'Минимум 6 символов'}
          value={values.password}
          onChange={(event) => setValues({ ...values, password: event.target.value })}
          required={!initialValues?.email}
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
