import { useMemo } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Holding, assetTypeColors, assetTypeLabels } from '@/lib/mockData';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface AssetTreemapProps {
  holdings: Holding[];
}

interface TreemapNode {
  name: string;
  value: number;
  color: string;
  label: string;
}

export function AssetTreemap({ holdings }: AssetTreemapProps) {
  const data = useMemo(() => {
    // Group by asset type
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

    // Convert to treemap format
    return Object.entries(grouped).map(([type, value]) => ({
      name: type,
      value,
      color: assetTypeColors[type] || 'hsl(215 20% 65%)',
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
    const { x, y, width, height, name, value, color, label } = props;
    
    if (width < 50 || height < 40) return null;
    
    const percentage = ((value / totalValue) * 100).toFixed(1);
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={8}
          ry={8}
          style={{
            fill: color,
            stroke: 'hsl(222 47% 6%)',
            strokeWidth: 2,
          }}
        />
        <text
          x={x + width / 2}
          y={y + height / 2 - 8}
          textAnchor="middle"
          fill="white"
          fontSize={width > 80 ? 14 : 12}
          fontWeight={600}
        >
          {label}
        </text>
        <text
          x={x + width / 2}
          y={y + height / 2 + 10}
          textAnchor="middle"
          fill="rgba(255,255,255,0.8)"
          fontSize={width > 80 ? 12 : 10}
        >
          {percentage}%
        </text>
      </g>
    );
  };

  return (
    <GlassCard className="p-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-semibold">Asset Distribution</h3>
        <p className="text-sm text-muted-foreground">
          Total: {formatCurrency(totalValue)}
        </p>
      </div>

      {/* Treemap */}
      <div className="h-64 w-full">
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
                    <div className="glass-card border border-border/50 px-3 py-2">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">
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

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 flex flex-wrap gap-3"
      >
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </motion.div>
    </GlassCard>
  );
}
