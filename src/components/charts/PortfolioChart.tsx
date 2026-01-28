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
      <div className="mb-3 flex items-center justify-end gap-1">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={cn(
              'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              timeRange === range
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-40 w-full sm:h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity={0.1} />
                <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              dy={10}
            />
            <YAxis
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              width={45}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-md border border-border bg-card px-3 py-2 shadow-sm">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(label)}
                      </p>
                      <p className="text-sm font-medium">
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
              stroke="hsl(var(--foreground))"
              strokeWidth={1.5}
              fill="url(#portfolioGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
