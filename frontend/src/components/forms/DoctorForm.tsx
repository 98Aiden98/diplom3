import { useEffect, useState } from 'react';
import type { Specialization } from '../../types/common';
import type { Doctor } from '../../types/doctor';
import { DoctorAvatar } from '../doctors/DoctorAvatar';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export interface DoctorFormValues extends Partial<Doctor> {
  password?: string;
  photo?: File | null;
}

interface DoctorFormProps {
  specializations: Specialization[];
  initialValues?: DoctorFormValues;
  loading?: boolean;
  onSubmit: (values: DoctorFormValues) => void;
}

export function DoctorForm({
  specializations,
  initialValues,
  loading,
  onSubmit,
}: DoctorFormProps) {
  const [values, setValues] = useState<DoctorFormValues>({
    fullName: '',
    specializationId: specializations[0]?.id,
    phone: '',
    email: '',
    cabinetNumber: '',
    experienceYears: 1,
    description: '',
    password: '',
    photo: null,
    photoUrl: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setValues({
      fullName: initialValues?.fullName ?? '',
      specializationId: initialValues?.specializationId ?? specializations[0]?.id,
      phone: initialValues?.phone ?? '',
      email: initialValues?.email ?? '',
      cabinetNumber: initialValues?.cabinetNumber ?? '',
      experienceYears: initialValues?.experienceYears ?? 1,
      description: initialValues?.description ?? '',
      password: '',
      photo: null,
      photoUrl: initialValues?.photoUrl ?? null,
    });
    setPreviewUrl(initialValues?.photoUrl ?? null);
  }, [initialValues, specializations]);

  useEffect(
    () => () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    },
    [previewUrl],
  );

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();

        onSubmit({
          fullName: values.fullName?.trim(),
          specializationId: values.specializationId,
          phone: values.phone?.trim(),
          email: values.email?.trim(),
          cabinetNumber: values.cabinetNumber?.trim(),
          experienceYears: Number(values.experienceYears ?? 0),
          description: values.description?.trim() || undefined,
          password: values.password?.trim() || undefined,
          photo: values.photo ?? undefined,
          photoUrl: values.photoUrl,
        });
      }}
    >
      <div className="md:col-span-2 flex items-center gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
        <DoctorAvatar fullName={values.fullName || 'Врач'} photoUrl={previewUrl} />
        <div>
          <div className="font-semibold text-slate-900">Фотография врача</div>
          <div className="mt-1 text-sm text-slate-500">
            Загрузите квадратное или вертикальное изображение в формате JPG, PNG или WEBP.
          </div>
        </div>
      </div>

      <Input
        label="ФИО врача"
        value={values.fullName}
        onChange={(event) => setValues({ ...values, fullName: event.target.value })}
        required
      />
      <Select
        label="Специальность"
        value={values.specializationId}
        onChange={(event) => setValues({ ...values, specializationId: Number(event.target.value) })}
      >
        {specializations.map((specialization) => (
          <option key={specialization.id} value={specialization.id}>
            {specialization.name}
          </option>
        ))}
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
        value={values.email}
        onChange={(event) => setValues({ ...values, email: event.target.value })}
        required
      />
      <Input
        label="Кабинет"
        value={values.cabinetNumber}
        onChange={(event) => setValues({ ...values, cabinetNumber: event.target.value })}
        required
      />
      <Input
        label="Стаж (лет)"
        type="number"
        min={0}
        value={values.experienceYears}
        onChange={(event) => setValues({ ...values, experienceYears: Number(event.target.value) })}
        required
      />
      <div className="md:col-span-2">
        <Input
          label="Описание"
          value={values.description ?? ''}
          onChange={(event) => setValues({ ...values, description: event.target.value })}
        />
      </div>
      <div className="md:col-span-2">
        <Input
          label="Файл фотографии"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => {
            const nextFile = event.target.files?.[0] ?? null;

            setValues({ ...values, photo: nextFile });
            setPreviewUrl((current) => {
              if (current?.startsWith('blob:')) {
                URL.revokeObjectURL(current);
              }

              return nextFile ? URL.createObjectURL(nextFile) : initialValues?.photoUrl ?? null;
            });
          }}
        />
      </div>
      <div className="md:col-span-2">
        <Input
          label="Пароль для входа"
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
