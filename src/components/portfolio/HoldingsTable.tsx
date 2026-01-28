import { Sparkline } from '@/components/charts/Sparkline';
import { Holding } from '@/lib/mockData';
import { cn } from '@/lib/utils';
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
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-4">
        <h3 className="text-sm font-medium">Holdings</h3>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="p-3 font-medium">Asset</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">24h</th>
              <th className="p-3 font-medium">Trend</th>
              <th className="p-3 font-medium text-right">Holdings</th>
              <th className="p-3 font-medium text-right">Value</th>
              <th className="p-3 font-medium text-right">Gain/Loss</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => {
              const value = holding.quantity * holding.currentPrice;
              const costBasisTotal = holding.quantity * holding.costBasis;
              const gainLoss = value - costBasisTotal;
              const gainLossPercent = ((gainLoss / costBasisTotal) * 100);
              const isPositive = holding.change24h >= 0;
              const isGainPositive = gainLoss >= 0;

              return (
                <tr
                  key={holding.id}
                  className="border-b border-border transition-colors hover:bg-secondary"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-xs font-semibold">
                        {holding.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{holding.symbol}</p>
                        <p className="text-xs text-muted-foreground">
                          {holding.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-sm tabular-nums">
                    {formatCurrency(holding.currentPrice)}
                  </td>
                  <td className="p-3">
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
                  <td className="p-3">
                    <Sparkline
                      data={holding.sparklineData}
                      positive={isPositive}
                      className="h-6 w-16"
                    />
                  </td>
                  <td className="p-3 text-right text-sm tabular-nums">
                    {holding.quantity.toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-sm font-medium tabular-nums">
                    {formatCurrency(value)}
                  </td>
                  <td className="p-3 text-right">
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="divide-y divide-border md:hidden">
        {holdings.map((holding) => {
          const value = holding.quantity * holding.currentPrice;
          const costBasisTotal = holding.quantity * holding.costBasis;
          const gainLoss = value - costBasisTotal;
          const isPositive = holding.change24h >= 0;
          const isGainPositive = gainLoss >= 0;

          return (
            <div key={holding.id} className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-xs font-semibold">
                    {holding.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{holding.symbol}</p>
                    <p className="text-xs text-muted-foreground">
                      {holding.name}
                    </p>
                  </div>
                </div>
                <Sparkline
                  data={holding.sparklineData}
                  positive={isPositive}
                  className="h-6 w-12"
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
