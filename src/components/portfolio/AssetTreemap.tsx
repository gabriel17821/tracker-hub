import { useMemo } from 'react';
import { Holding, assetTypeLabels } from '@/lib/mockData';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

interface AssetTreemapProps {
  holdings: Holding[];
}

interface TreemapNode {
  name: string;
  value: number;
  color: string;
  label: string;
}

const assetTypeColors: Record<string, string> = {
  'stock': '#3b82f6',
  'crypto': '#f59e0b',
  'etf': '#22c55e',
  'cash': '#6b7280',
};

export function AssetTreemap({ holdings }: AssetTreemapProps) {
  const data = useMemo(() => {
    const grouped = holdings.reduce(
      (acc, holding) => {
        const type = holding.assetType;
        const value = holding.quantity * holding.currentPrice;
        if (!acc[type]) {
          acc[type] = 0;
        }
        acc[type] += value;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(grouped).map(([type, value]) => ({
      name: type,
      value,
      color: assetTypeColors[type] || '#6b7280',
      label: assetTypeLabels[type] || type,
    }));
  }, [holdings]);

  const totalValue = data.reduce((sum, d) => sum + d.value, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const CustomContent = (props: any) => {
    const { x, y, width, height, color, label } = props;
    
    if (width < 50 || height < 40) return null;
    
    const percentage = ((props.value / totalValue) * 100).toFixed(1);
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={4}
          ry={4}
          style={{
            fill: color,
            stroke: 'hsl(var(--background))',
            strokeWidth: 2,
          }}
        />
        <text
          x={x + width / 2}
          y={y + height / 2 - 6}
          textAnchor="middle"
          fill="white"
          fontSize={12}
          fontWeight={500}
        >
          {label}
        </text>
        <text
          x={x + width / 2}
          y={y + height / 2 + 10}
          textAnchor="middle"
          fill="rgba(255,255,255,0.8)"
          fontSize={11}
        >
          {percentage}%
        </text>
      </g>
    );
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3">
        <h3 className="text-sm font-medium">Asset Distribution</h3>
        <p className="text-xs text-muted-foreground">
          Total: {formatCurrency(totalValue)}
        </p>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={data}
            dataKey="value"
            aspectRatio={4 / 3}
            stroke="transparent"
            content={<CustomContent />}
          >
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as TreemapNode;
                  const percentage = ((item.value / totalValue) * 100).toFixed(1);
                  return (
                    <div className="rounded-md border border-border bg-card px-3 py-2 shadow-sm">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(item.value)} ({percentage}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap gap-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
