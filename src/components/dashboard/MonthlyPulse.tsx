import { calculateMonthlyChange } from '@/lib/mockData';
import { TrendingDown, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MonthlyPulse() {
  const { amount, percentage } = calculateMonthlyChange();
  const isPositive = amount >= 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Monthly Cash Flow</span>
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
          {isPositive ? '+' : ''}{percentage.toFixed(1)}%
        </div>
      </div>

      <div className="flex items-baseline gap-1">
        {isPositive ? (
          <ArrowUpRight className="h-5 w-5 text-success" />
        ) : (
          <ArrowDownLeft className="h-5 w-5 text-destructive" />
        )}
        <p className={cn(
          'text-2xl font-semibold tabular-nums',
          isPositive ? 'text-success' : 'text-destructive'
        )}>
          {isPositive ? '+' : '-'}{formatCurrency(amount)}
        </p>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Net savings this month
      </p>
    </div>
  );
}
