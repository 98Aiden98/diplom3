import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="surface-card max-w-xl rounded-[2.5rem] p-10 text-center">
        <div className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-brand-600">
          404
        </div>
        <h1 className="mb-3 font-sans text-4xl font-semibold text-slate-900">
          Страница не найдена
        </h1>
        <p className="mb-8 text-slate-500">
          Указанный раздел отсутствует или был перемещён. Вернитесь в основную навигацию системы.
        </p>
        <Link to="/">
          <Button>Вернуться в систему</Button>
        </Link>
      </div>
    </div>
  );
}
