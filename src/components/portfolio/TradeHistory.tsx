import { Trade } from '@/lib/mockData';
import { cn } from '@/lib/utils';
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
    });
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-4">
        <h3 className="text-sm font-medium">Recent Trades</h3>
      </div>

      <div className="divide-y divide-border">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="flex items-center gap-3 p-3"
          >
            <div
              className={cn(
                'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md',
                trade.type === 'buy'
                  ? 'bg-success/10 text-success'
                  : 'bg-destructive/10 text-destructive'
              )}
            >
              {trade.type === 'buy' ? (
                <ArrowDownLeft className="h-4 w-4" />
              ) : (
                <ArrowUpRight className="h-4 w-4" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{trade.symbol}</span>
                <span
                  className={cn(
                    'rounded px-1.5 py-0.5 text-[10px] font-medium uppercase',
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

            <div className="text-right">
              <p className="text-sm font-medium tabular-nums">
                {trade.type === 'buy' ? '-' : '+'}{formatCurrency(trade.total)}
              </p>
              <p className="text-xs text-muted-foreground">{formatDate(trade.date)}</p>
            </div>
          </div>
        ))}
      </div>

      {trades.length === 0 && (
        <div className="p-8 text-center text-sm text-muted-foreground">
          No trades yet
        </div>
      )}
    </div>
  );
}
