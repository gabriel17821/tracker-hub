import { GlassCard } from '@/components/ui/glass-card';
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

  // Calculate growth from portfolio history
  const firstValue = portfolioHistory[0].value;
  const growth = ((netWorth - firstValue) / firstValue) * 100;

  return (
    <GlassCard
      className="relative overflow-hidden p-6 sm:p-8"
      gradientBorder
      glowEffect
    >
      {/* Background gradient decoration */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-primary/20 to-glow-blue/20 blur-3xl" />
      
      <div className="relative z-10">
        {/* Label */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Net Worth
          </span>
          <div className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
            <TrendingUp className="h-3 w-3" />
            +{growth.toFixed(1)}%
          </div>
        </div>

        {/* Animated Balance */}
        <h1 className="mb-6 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl lg:text-6xl">
          {formattedValue}
        </h1>

        {/* Portfolio Chart */}
        <PortfolioChart data={portfolioHistory} />
      </div>
    </GlassCard>
  );
}
