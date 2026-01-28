import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { calculateNetWorth, portfolioHistory } from '@/lib/mockData';
import { PortfolioChart } from '@/components/charts/PortfolioChart';
import { TrendingUp } from 'lucide-react';

export function NetWorthHero() {
  const netWorth = calculateNetWorth();
  const { formattedValue } = useAnimatedNumber(netWorth, {
    prefix: '$',
    decimals: 2,
    duration: 2000,
  });

  const firstValue = portfolioHistory[0].value;
  const growth = ((netWorth - firstValue) / firstValue) * 100;

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Net Worth</span>
        <div className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
          <TrendingUp className="h-3 w-3" />
          +{growth.toFixed(1)}%
        </div>
      </div>

      <h1 className="mb-4 text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
        {formattedValue}
      </h1>

      <PortfolioChart data={portfolioHistory} />
    </div>
  );
}
