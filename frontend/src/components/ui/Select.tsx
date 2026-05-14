import type { SelectHTMLAttributes } from 'react';
import clsx from 'clsx';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export function Select({ label, error, className, children, ...props }: SelectProps) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      {label ? <span className="font-medium text-slate-700">{label}</span> : null}
      <select
        className={clsx(
          'rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100',
          error && 'border-rose-300 focus:border-rose-400 focus:ring-rose-100',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}
