import { Line, LineChart, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: number[];
  positive?: boolean;
  className?: string;
}

export function Sparkline({ data, positive = true, className }: SparklineProps) {
  const chartData = data.map((value, index) => ({ value, index }));
  const strokeColor = positive ? 'hsl(142 76% 36%)' : 'hsl(0 84% 60%)';

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
