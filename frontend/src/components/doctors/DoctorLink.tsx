import clsx from 'clsx';
import { Link } from 'react-router-dom';

interface DoctorLinkProps {
  doctorId?: number | null;
  fullName?: string | null;
  className?: string;
}

export function DoctorLink({ doctorId, fullName, className }: DoctorLinkProps) {
  if (!doctorId || !fullName) {
    return <span>—</span>;
  }

  return (
    <Link
      to={`/doctors/${doctorId}`}
      className={clsx(
        'font-semibold text-brand-700 transition hover:text-brand-800 hover:underline',
        className,
      )}
    >
      {fullName}
    </Link>
  );
}
