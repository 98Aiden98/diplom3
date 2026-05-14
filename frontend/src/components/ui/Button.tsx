import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white shadow-lg shadow-brand-500/20 hover:bg-brand-700 focus-visible:ring-brand-200',
  secondary:
    'bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-200',
  ghost:
    'border border-slate-200 bg-white/80 text-slate-700 hover:bg-white focus-visible:ring-slate-200',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-200',
};

export function Button({
  children,
  className,
  variant = 'primary',
  fullWidth,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60',
        variantStyles[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
