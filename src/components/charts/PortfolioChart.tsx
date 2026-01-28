import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PortfolioSnapshot } from '@/lib/mockData';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PortfolioChartProps {
  data: PortfolioSnapshot[];
}

type TimeRange = '1W' | '1M' | '3M' | '1Y' | 'ALL';

export function PortfolioChart({ data }: PortfolioChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('ALL');

  const timeRanges: TimeRange[] = ['1W', '1M', '3M', '1Y', 'ALL'];

  // Filter data based on time range (mock - in reality would filter by date)
  const getFilteredData = () => {
    switch (timeRange) {
      case '1W':
        return data.slice(-2);
      case '1M':
        return data.slice(-3);
      case '3M':
        return data.slice(-4);
      case '1Y':
        return data.slice(-6);
      default:
        return data;
    }
  };

  const filteredData = getFilteredData();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full">
      {/* Time Range Toggles */}
      <div className="mb-4 flex items-center justify-end gap-1">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200',
              timeRange === range
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-48 w-full sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(252 87% 64%)" stopOpacity={0.4} />
                <stop offset="50%" stopColor="hsl(217 91% 60%)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }}
              dy={10}
            />
            <YAxis
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215 20% 65%)', fontSize: 11 }}
              width={50}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass-card border border-border/50 px-3 py-2">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(label)}
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(payload[0].value as number)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="url(#portfolioStroke)"
              strokeWidth={2}
              fill="url(#portfolioGradient)"
            />
            <defs>
              <linearGradient id="portfolioStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(252 87% 64%)" />
                <stop offset="100%" stopColor="hsl(217 91% 60%)" />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
