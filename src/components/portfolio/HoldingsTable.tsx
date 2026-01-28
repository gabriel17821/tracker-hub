import { GlassCard } from '@/components/ui/glass-card';
import { Sparkline } from '@/components/charts/Sparkline';
import { Holding } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface HoldingsTableProps {
  holdings: Holding[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <GlassCard className="overflow-hidden">
      {/* Header */}
      <div className="border-b border-border/50 p-4">
        <h3 className="font-semibold">Holdings</h3>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 text-left text-xs text-muted-foreground">
              <th className="p-4 font-medium">Asset</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">24h</th>
              <th className="p-4 font-medium">Trend</th>
              <th className="p-4 font-medium text-right">Holdings</th>
              <th className="p-4 font-medium text-right">Value</th>
              <th className="p-4 font-medium text-right">Gain/Loss</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding, index) => {
              const value = holding.quantity * holding.currentPrice;
              const costBasisTotal = holding.quantity * holding.costBasis;
              const gainLoss = value - costBasisTotal;
              const gainLossPercent = ((gainLoss / costBasisTotal) * 100);
              const isPositive = holding.change24h >= 0;
              const isGainPositive = gainLoss >= 0;

              return (
                <motion.tr
                  key={holding.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border/30 transition-colors hover:bg-accent/30"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                        {holding.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{holding.symbol}</p>
                        <p className="text-xs text-muted-foreground">
                          {holding.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 tabular-nums">
                    {formatCurrency(holding.currentPrice)}
                  </td>
                  <td className="p-4">
                    <div
                      className={cn(
                        'flex items-center gap-1 text-sm',
                        isPositive ? 'text-success' : 'text-destructive'
                      )}
                    >
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {formatPercentage(holding.change24h)}
                    </div>
                  </td>
                  <td className="p-4">
                    <Sparkline
                      data={holding.sparklineData}
                      positive={isPositive}
                      className="h-8 w-24"
                    />
                  </td>
                  <td className="p-4 text-right tabular-nums">
                    {holding.quantity.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-medium tabular-nums">
                    {formatCurrency(value)}
                  </td>
                  <td className="p-4 text-right">
                    <div
                      className={cn(
                        'text-sm tabular-nums',
                        isGainPositive ? 'text-success' : 'text-destructive'
                      )}
                    >
                      {isGainPositive ? '+' : ''}{formatCurrency(gainLoss)}
                      <span className="ml-1 text-xs">
                        ({formatPercentage(gainLossPercent)})
                      </span>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="divide-y divide-border/30 md:hidden">
        {holdings.map((holding, index) => {
          const value = holding.quantity * holding.currentPrice;
          const costBasisTotal = holding.quantity * holding.costBasis;
          const gainLoss = value - costBasisTotal;
          const gainLossPercent = ((gainLoss / costBasisTotal) * 100);
          const isPositive = holding.change24h >= 0;
          const isGainPositive = gainLoss >= 0;

          return (
            <motion.div
              key={holding.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                    {holding.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium">{holding.symbol}</p>
                    <p className="text-xs text-muted-foreground">
                      {holding.name}
                    </p>
                  </div>
                </div>
                <Sparkline
                  data={holding.sparklineData}
                  positive={isPositive}
                  className="h-8 w-16"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Value</p>
                  <p className="font-medium tabular-nums">{formatCurrency(value)}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Gain/Loss</p>
                  <p
                    className={cn(
                      'font-medium tabular-nums',
                      isGainPositive ? 'text-success' : 'text-destructive'
                    )}
                  >
                    {isGainPositive ? '+' : ''}{formatCurrency(gainLoss)}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
