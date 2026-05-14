import type { HTMLAttributes, PropsWithChildren } from 'react';
import clsx from 'clsx';

export function Card({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={clsx('surface-card p-6', className)} {...props}>
      {children}
    </div>
  );
}
