import { useEffect, useState } from 'react';
import type { DoctorSchedule } from '../../types/common';
import { dayName } from '../../utils/date';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export interface ScheduleFormValues {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  cabinetNumber?: string;
  isActive: boolean;
}

interface ScheduleFormProps {
  initialValues?: Partial<DoctorSchedule>;
  defaultCabinetNumber?: string;
  loading?: boolean;
  onSubmit: (values: ScheduleFormValues) => void;
  onCancelEdit?: () => void;
}

const dayOptions = [1, 2, 3, 4, 5, 6, 7];

export function ScheduleForm({
  initialValues,
  defaultCabinetNumber,
  loading,
  onSubmit,
  onCancelEdit,
}: ScheduleFormProps) {
  const [values, setValues] = useState<ScheduleFormValues>({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '18:00',
    cabinetNumber: defaultCabinetNumber ?? '',
    isActive: true,
  });

  useEffect(() => {
    setValues({
      dayOfWeek: initialValues?.dayOfWeek ?? 1,
      startTime: initialValues?.startTime ?? '09:00',
      endTime: initialValues?.endTime ?? '18:00',
      cabinetNumber: initialValues?.cabinetNumber ?? defaultCabinetNumber ?? '',
      isActive: initialValues?.isActive ?? true,
    });
  }, [defaultCabinetNumber, initialValues]);

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          dayOfWeek: values.dayOfWeek,
          startTime: values.startTime,
          endTime: values.endTime,
          cabinetNumber: values.cabinetNumber?.trim() || undefined,
          isActive: values.isActive,
        });
      }}
    >
      <Select
        label="День недели"
        value={values.dayOfWeek}
        onChange={(event) => setValues({ ...values, dayOfWeek: Number(event.target.value) })}
      >
        {dayOptions.map((day) => (
          <option key={day} value={day}>
            {dayName(day)}
          </option>
        ))}
      </Select>

      <Select
        label="Статус"
        value={values.isActive ? 'active' : 'inactive'}
        onChange={(event) =>
          setValues({ ...values, isActive: event.target.value === 'active' })
        }
      >
        <option value="active">Активно</option>
        <option value="inactive">Неактивно</option>
      </Select>

      <Input
        label="Время начала"
        type="time"
        value={values.startTime}
        onChange={(event) => setValues({ ...values, startTime: event.target.value })}
        required
      />

      <Input
        label="Время окончания"
        type="time"
        value={values.endTime}
        onChange={(event) => setValues({ ...values, endTime: event.target.value })}
        required
      />

      <div className="md:col-span-2">
        <Input
          label="Кабинет"
          value={values.cabinetNumber}
          onChange={(event) => setValues({ ...values, cabinetNumber: event.target.value })}
        />
      </div>

      <div className="md:col-span-2 flex flex-col-reverse justify-end gap-3 sm:flex-row">
        {initialValues?.id && onCancelEdit ? (
          <Button type="button" variant="ghost" onClick={onCancelEdit} className="w-full sm:w-auto">
            Отмена
          </Button>
        ) : null}
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? 'Сохранение...' : initialValues?.id ? 'Обновить расписание' : 'Добавить интервал'}
        </Button>
      </div>
    </form>
  );
}
