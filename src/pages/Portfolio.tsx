import { AppLayout } from '@/components/layout/AppLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { HoldingsTable } from '@/components/portfolio/HoldingsTable';
import { TradeHistory } from '@/components/portfolio/TradeHistory';
import { AssetTreemap } from '@/components/portfolio/AssetTreemap';
import { mockHoldings, mockTrades, calculateNetWorth } from '@/lib/mockData';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, BarChart3 } from 'lucide-react';

const Portfolio = () => {
  const totalValue = calculateNetWorth();
  const { formattedValue } = useAnimatedNumber(totalValue, {
    prefix: '$',
    decimals: 2,
    duration: 1500,
  });

  // Calculate total gain/loss
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
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Portfolio
          </h1>
          <p className="text-sm text-muted-foreground">
            Your investment holdings and performance
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid gap-4 sm:grid-cols-3">
          <GlassCard className="p-4" glowEffect>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-xl font-bold tabular-nums">{formattedValue}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isPositive ? 'bg-success/10' : 'bg-destructive/10'
                }`}
              >
                <TrendingUp
                  className={`h-5 w-5 ${isPositive ? 'text-success' : 'text-destructive'}`}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
                <p
                  className={`text-xl font-bold tabular-nums ${
                    isPositive ? 'text-success' : 'text-destructive'
                  }`}
                >
                  {isPositive ? '+' : ''}{formatCurrency(totalGainLoss)}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-glow-blue/10">
                <BarChart3 className="h-5 w-5 text-glow-blue" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Return</p>
                <p
                  className={`text-xl font-bold tabular-nums ${
                    isPositive ? 'text-success' : 'text-destructive'
                  }`}
                >
                  {isPositive ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Holdings Table */}
        <HoldingsTable holdings={mockHoldings} />

        {/* Grid: Trade History + Treemap */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TradeHistory trades={mockTrades} />
          <AssetTreemap holdings={mockHoldings} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Portfolio;
