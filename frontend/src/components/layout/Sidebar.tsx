import clsx from 'clsx';
import { LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { Role } from '../../types/common';
import { BrandMark } from '../branding/BrandMark';
import { Button } from '../ui/Button';
import { navByRole } from './navigation';

interface SidebarProps {
  role: Role;
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ role, mobileOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const items = navByRole[role];

  return (
    <>
      <div
        className={clsx(
          'fixed inset-0 z-30 bg-slate-950/35 transition lg:hidden',
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />

      <aside
        className={clsx(
          'fixed left-0 top-0 z-40 flex h-screen w-[min(300px,88vw)] flex-col gap-6 overflow-y-auto border-r border-white/10 bg-slate-950 px-4 py-6 text-white transition sm:px-6 sm:py-8 lg:w-[300px] lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
          <div className="flex flex-col gap-4 text-center">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <BrandMark className="h-14 w-14 shrink-0 sm:h-16 sm:w-16" iconClassName="h-6 w-6 sm:h-7 sm:w-7" />
              <div className="font-sans text-xl font-semibold leading-none text-white sm:text-2xl">ИнфоМед</div>
            </div>
            <p className="text-sm leading-6 text-slate-300">Информационная система медицинского центра.</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 pb-2">
          {items.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={clsx(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                  active
                    ? 'bg-white text-slate-900 shadow-lg shadow-sky-500/10'
                    : 'text-slate-300 hover:bg-white/8 hover:text-white',
                )}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 lg:hidden">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 px-4 py-4">
            <div className="truncate text-sm font-semibold text-white">{user?.fullName}</div>
            <div className="mt-1 truncate text-xs text-slate-300">{user?.email}</div>
          </div>

          <Button
            variant="secondary"
            className="w-full justify-center gap-2 bg-white/90 text-slate-900 hover:bg-white"
            onClick={() => {
              onClose();
              logout();
              navigate('/login');
            }}
          >
            <LogOut size={16} />
            Выйти
          </Button>
        </div>
      </aside>
    </>
  );
}
