import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'pending' | 'confirmed';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        status === 'pending' && 'bg-muted text-muted-foreground pulse-pending',
        status === 'confirmed' && 'bg-success/10 text-success',
        className
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'pending' && 'bg-muted-foreground',
          status === 'confirmed' && 'bg-success'
        )}
      />
      {status === 'pending' ? 'Pending' : 'Confirmed'}
    </span>
  );
}
