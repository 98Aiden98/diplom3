import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../../api/authApi';
import { getApiErrorMessage } from '../../api/axios';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useAuthStore } from '../../store/authStore';

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    birthDate: '',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
    address: '',
    policyNumber: '',
    passportNumber: '',
  });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.register(form);
      setAuth(response.accessToken, response.user);
      navigate('/patient', { replace: true });
      toast.success('Регистрация завершена');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-3 sm:p-6">
      <Card className="w-full max-w-4xl rounded-[2rem] p-5 sm:p-8 lg:rounded-[2.5rem] lg:p-10">
        <div className="mb-6 flex flex-col gap-3 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-600 sm:text-sm sm:tracking-[0.35em]">
              Регистрация
            </div>
            <h1 className="font-sans text-2xl font-semibold text-slate-900 sm:text-3xl">Новый пациент</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              После регистрации вы получите доступ к личному кабинету и записи на приём.
            </p>
          </div>
          <Link to="/login" className="text-sm font-semibold text-brand-600">
            Уже есть аккаунт? Войти
          </Link>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <Input
            label="ФИО"
            value={form.fullName}
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
            required
          />
          <Input
            label="Дата рождения"
            type="date"
            value={form.birthDate}
            onChange={(event) => setForm({ ...form, birthDate: event.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <Input
            label="Телефон"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            required
          />
          <Input
            label="Пароль"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          <Select
            label="Пол"
            value={form.gender}
            onChange={(event) => setForm({ ...form, gender: event.target.value as typeof form.gender })}
          >
            <option value="MALE">Мужской</option>
            <option value="FEMALE">Женский</option>
            <option value="OTHER">Другой</option>
          </Select>
          <div className="md:col-span-2">
            <Input
              label="Адрес"
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
            />
          </div>
          <Input
            label="Номер полиса"
            value={form.policyNumber}
            onChange={(event) => setForm({ ...form, policyNumber: event.target.value })}
          />
          <Input
            label="Паспорт"
            value={form.passportNumber}
            onChange={(event) => setForm({ ...form, passportNumber: event.target.value })}
          />
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
