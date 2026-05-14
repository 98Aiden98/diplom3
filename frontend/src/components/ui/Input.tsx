import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      {label ? <span className="font-medium text-slate-700">{label}</span> : null}
      <input
        className={clsx(
          'rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100',
          error && 'border-rose-300 focus:border-rose-400 focus:ring-rose-100',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}
