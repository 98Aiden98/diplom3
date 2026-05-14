import clsx from 'clsx';
import { HeartPulse } from 'lucide-react';
import { resolveApiFileUrl } from '../../api/axios';

interface DoctorAvatarProps {
  fullName: string;
  photoUrl?: string | null;
  className?: string;
}

const getInitials = (fullName: string) =>
  fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export function DoctorAvatar({ fullName, photoUrl, className }: DoctorAvatarProps) {
  const imageUrl = resolveApiFileUrl(photoUrl);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={fullName}
        className={clsx(
          'h-20 w-20 rounded-[1.5rem] border border-white/80 object-cover shadow-lg shadow-sky-100',
          className,
        )}
      />
    );
  }

  return (
    <div
      className={clsx(
        'flex h-20 w-20 flex-col items-center justify-center rounded-[1.5rem] border border-sky-100 bg-gradient-to-br from-sky-100 via-white to-cyan-100 text-brand-700 shadow-lg shadow-sky-100/70',
        className,
      )}
    >
      <HeartPulse size={20} className="mb-1 text-brand-500" />
      <span className="text-sm font-semibold">{getInitials(fullName)}</span>
    </div>
  );
}
