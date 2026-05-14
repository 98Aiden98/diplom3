import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen overflow-x-hidden lg:h-screen">
      <Sidebar role={user.role} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="min-w-0 px-3 py-3 sm:px-4 sm:py-4 lg:ml-[300px] lg:h-screen lg:overflow-y-auto lg:px-8 lg:py-6">
        {!mobileOpen ? (
          <div className="sticky top-0 z-[120] -mx-3 mb-4 bg-slate-50 px-3 pb-3 pt-3 sm:-mx-4 sm:px-4 sm:pt-4 lg:hidden">
            <Button
              variant="primary"
              onClick={() => setMobileOpen(true)}
              className="w-full gap-2 bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800 sm:w-auto"
            >
              <Menu size={18} />
              Меню
            </Button>
          </div>
        ) : null}

        <Header />
        <Outlet />
      </main>
    </div>
  );
}
