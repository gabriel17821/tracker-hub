import { cn } from '@/lib/utils';
import { Clock, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: 'pending' | 'confirmed';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        status === 'pending' && 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
        status === 'confirmed' && 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400',
        className
      )}
    >
      {status === 'pending' ? (
        <Clock className="h-3 w-3" />
      ) : (
        <CheckCircle2 className="h-3 w-3" />
      )}
      {status === 'pending' ? 'Pending' : 'Confirmed'}
    </span>
  );
}
