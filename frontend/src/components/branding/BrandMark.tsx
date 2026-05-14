import clsx from 'clsx';
import { HeartPulse, Plus } from 'lucide-react';

interface BrandMarkProps {
  className?: string;
  iconClassName?: string;
}

export function BrandMark({ className, iconClassName }: BrandMarkProps) {
  return (
    <div
      className={clsx(
        'relative flex aspect-square h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[1.55rem] border border-white/25 bg-gradient-to-br from-brand-500 via-sky-500 to-cyan-400 shadow-[0_20px_45px_-25px_rgba(14,165,233,0.9)]',
        className,
      )}
    >
      <div className="absolute inset-[6px] rounded-[1.2rem] border border-white/20" />
      <HeartPulse className={clsx('relative text-white', iconClassName)} size={28} strokeWidth={2.2} />
      <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white/95 text-brand-600 shadow-md">
        <Plus size={12} strokeWidth={3} />
      </div>
    </div>
  );
}
