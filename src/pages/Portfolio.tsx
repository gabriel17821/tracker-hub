import { AppLayout } from '@/components/layout/AppLayout';
import { HoldingsTable } from '@/components/portfolio/HoldingsTable';
import { TradeHistory } from '@/components/portfolio/TradeHistory';
import { AssetTreemap } from '@/components/portfolio/AssetTreemap';
import { mockHoldings, mockTrades, calculateNetWorth } from '@/lib/mockData';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { Wallet, TrendingUp, BarChart3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Portfolio = () => {
  const totalValue = calculateNetWorth();
  const { formattedValue } = useAnimatedNumber(totalValue, {
    prefix: '$',
    decimals: 2,
    duration: 1500,
  });

  const totalCostBasis = mockHoldings.reduce(
    (sum, h) => sum + h.quantity * h.costBasis,
    0
  );
  const totalGainLoss = totalValue - totalCostBasis;
  const totalGainLossPercent = ((totalGainLoss / totalCostBasis) * 100);
  const isPositive = totalGainLoss >= 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Portfolio</h1>
            <p className="text-sm text-muted-foreground">
              Your investment holdings
            </p>
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Trade
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Value</span>
            </div>
            <p className="mt-1 text-xl font-semibold tabular-nums">{formattedValue}</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Gain/Loss</span>
            </div>
            <p
              className={cn(
                'mt-1 text-xl font-semibold tabular-nums',
                isPositive ? 'text-success' : 'text-destructive'
              )}
            >
              {isPositive ? '+' : ''}{formatCurrency(totalGainLoss)}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Return</span>
            </div>
            <p
              className={cn(
                'mt-1 text-xl font-semibold tabular-nums',
                isPositive ? 'text-success' : 'text-destructive'
              )}
            >
              {isPositive ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Holdings Table */}
        <HoldingsTable holdings={mockHoldings} />

        {/* Grid: Trade History + Treemap */}
        <div className="grid gap-4 lg:grid-cols-2">
          <TradeHistory trades={mockTrades} />
          <AssetTreemap holdings={mockHoldings} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Portfolio;
