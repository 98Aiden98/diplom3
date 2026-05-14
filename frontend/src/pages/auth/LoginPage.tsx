import { useMemo, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../../api/authApi';
import { getApiErrorMessage } from '../../api/axios';
import clinicHero from '../../assets/clinic-hero.svg';
import { BrandMark } from '../../components/branding/BrandMark';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import type { Role } from '../../types/common';

const roleRoute: Record<Role, string> = {
  ADMIN: '/admin',
  REGISTRAR: '/registrar',
  DOCTOR: '/doctor',
  PATIENT: '/patient',
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('admin@infomed.local');
  const [password, setPassword] = useState('Admin123!');
  const [loading, setLoading] = useState(false);

  const redirectTo = useMemo(() => {
    const from = location.state as { from?: { pathname?: string } } | null;
    return from?.from?.pathname;
  }, [location.state]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.login(email, password);
      setAuth(response.accessToken, response.user);
      navigate(redirectTo || roleRoute[response.user.role], { replace: true });
      toast.success('Вход выполнен');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-3 sm:p-6">
      <div className="grid w-full max-w-6xl gap-4 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div className="surface-card relative order-2 overflow-hidden rounded-[2rem] p-5 sm:p-6 lg:order-1 lg:rounded-[2.5rem] lg:p-12">
          <img src={clinicHero} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/18 via-white/10 to-sky-200/20" />

          <div className="relative flex min-h-[220px] items-center justify-center sm:min-h-[260px] lg:min-h-[520px]">
            <div className="flex w-full max-w-xl flex-col items-center justify-center gap-4 rounded-[1.75rem] bg-white/95 px-5 py-6 text-center text-slate-950 shadow-[0_30px_70px_-35px_rgba(15,23,42,0.45)] backdrop-blur-md sm:flex-row sm:gap-5 sm:px-8 sm:py-8 sm:text-left">
              <BrandMark className="h-16 w-16 border-white/30 sm:h-20 sm:w-20" iconClassName="h-7 w-7 sm:h-8 sm:w-8" />
              <div>
                <div className="font-sans text-2xl font-semibold text-slate-950 sm:text-3xl">ИнфоМед</div>
                <div className="mt-2 text-sm font-medium text-slate-700 sm:text-base">Цифровой контур клиники</div>
              </div>
            </div>
          </div>
        </div>

        <Card className="order-1 rounded-[2rem] p-5 sm:p-8 lg:order-2 lg:rounded-[2.5rem] lg:p-10">
          <div className="mb-6 sm:mb-8">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-600 sm:text-sm sm:tracking-[0.35em]">
              Авторизация
            </div>
            <h2 className="font-sans text-2xl font-semibold text-slate-900 sm:text-3xl">Вход в систему</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Используйте тестовую учётную запись ИнфоМед или зарегистрируйте пациента.
            </p>
          </div>

          <form className="space-y-4" onSubmit={submit}>
            <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <Input
              label="Пароль"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <Button fullWidth type="submit" disabled={loading}>
              {loading ? 'Выполняется вход...' : 'Войти'}
            </Button>
          </form>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
            Нет аккаунта пациента?{' '}
            <Link to="/register" className="font-semibold text-brand-600">
              Перейти к регистрации
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
