import { GlassCard } from '@/components/ui/glass-card';
import { calculateMonthlyChange } from '@/lib/mockData';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function MonthlyPulse() {
  const { amount, percentage } = calculateMonthlyChange();
  const isPositive = percentage >= 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  return (
    <GlassCard className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Monthly Pulse
        </span>
        <div
          className={cn(
            'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
            isPositive
              ? 'bg-success/10 text-success'
              : 'bg-destructive/10 text-destructive'
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {isPositive ? '+' : '-'}{Math.abs(percentage).toFixed(1)}%
        </div>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-semibold tabular-nums">
          {isPositive ? '+' : '-'}{formatCurrency(amount)}
        </p>
        <p className="text-xs text-muted-foreground">
          vs. last month
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Math.abs(percentage) * 2, 100)}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
          className={cn(
            'absolute left-0 top-0 h-full rounded-full',
            isPositive
              ? 'bg-gradient-to-r from-success to-success/70'
              : 'bg-gradient-to-r from-destructive to-destructive/70'
          )}
        />
      </div>
    </GlassCard>
  );
}
