import { GlassCard } from '@/components/ui/glass-card';
import { Trade } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface TradeHistoryProps {
  trades: Trade[];
}

export function TradeHistory({ trades }: TradeHistoryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <GlassCard className="overflow-hidden">
      {/* Header */}
      <div className="border-b border-border/50 p-4">
        <h3 className="font-semibold">Recent Trades</h3>
      </div>

      {/* Trade List */}
      <div className="divide-y divide-border/30">
        {trades.map((trade, index) => (
          <motion.div
            key={trade.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-4"
          >
            {/* Icon */}
            <div
              className={cn(
                'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl',
                trade.type === 'buy'
                  ? 'bg-success/10 text-success'
                  : 'bg-destructive/10 text-destructive'
              )}
            >
              {trade.type === 'buy' ? (
                <ArrowDownLeft className="h-5 w-5" />
              ) : (
                <ArrowUpRight className="h-5 w-5" />
              )}
            </div>

            {/* Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{trade.symbol}</span>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium uppercase',
                    trade.type === 'buy'
                      ? 'bg-success/10 text-success'
                      : 'bg-destructive/10 text-destructive'
                  )}
                >
                  {trade.type}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {trade.quantity} @ {formatCurrency(trade.price)}
              </p>
            </div>

            {/* Amount & Date */}
            <div className="text-right">
              <p className="font-medium tabular-nums">
                {trade.type === 'buy' ? '-' : '+'}{formatCurrency(trade.total)}
              </p>
              <p className="text-xs text-muted-foreground">{formatDate(trade.date)}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {trades.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No trades yet
        </div>
      )}
    </GlassCard>
  );
}
