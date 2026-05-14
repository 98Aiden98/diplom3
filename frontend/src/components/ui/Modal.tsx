import type { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: string;
  description?: string | null;
  maxWidthClassName?: string;
  onClose: () => void;
}

export function Modal({
  open,
  title,
  description,
  maxWidthClassName,
  onClose,
  children,
}: PropsWithChildren<ModalProps>) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />

      <div className="relative flex min-h-dvh w-full items-end justify-center overflow-y-auto p-3 sm:items-start sm:p-4 md:p-8">
        <div
          className={clsx(
            'surface-card my-auto max-h-[calc(100dvh-1.5rem)] w-full overflow-y-auto rounded-[1.75rem] p-4 sm:max-h-[calc(100dvh-2rem)] sm:rounded-[2rem] sm:p-6',
            maxWidthClassName ?? 'max-w-3xl',
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-5 flex items-start justify-between gap-4 sm:mb-6">
            <div className="min-w-0">
              <h3 className="font-sans text-lg font-semibold text-slate-900 sm:text-xl">{title}</h3>
              {description === null ? null : (
                <p className="mt-1 text-sm text-slate-500">
                  {description ?? 'Заполните необходимые поля и сохраните изменения.'}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
            >
              <X size={18} />
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
