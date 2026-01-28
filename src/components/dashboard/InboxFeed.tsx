import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Transaction, mockTransactions } from '@/lib/mockData';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InboxFeedProps {
  onTransactionClick: (transaction: Transaction) => void;
}

export function InboxFeed({ onTransactionClick }: InboxFeedProps) {
  // Show only WhatsApp and recent transactions
  const recentTransactions = mockTransactions.slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const categoryEmoji: Record<string, string> = {
    'Shopping': '🛍️',
    'Groceries': '🥬',
    'Subscriptions': '📺',
    'Transportation': '⛽',
    'Housing': '🏠',
    'Food & Dining': '🍕',
  };

  return (
    <GlassCard className="p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
            <MessageSquare className="h-4 w-4 text-success" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">WhatsApp Inbox</h3>
            <p className="text-xs text-muted-foreground">
              Recent invoices & receipts
            </p>
          </div>
        </div>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {recentTransactions.filter(t => t.status === 'pending').length} pending
        </span>
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {recentTransactions.map((transaction, index) => (
          <motion.button
            key={transaction.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onTransactionClick(transaction)}
            className={cn(
              'flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all duration-200',
              'hover:bg-accent/50 active:scale-[0.98]'
            )}
          >
            {/* Thumbnail or Emoji */}
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
              {transaction.imageUrl ? (
                <img
                  src={transaction.imageUrl}
                  alt={transaction.merchant}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg">
                  {categoryEmoji[transaction.category] || '📄'}
                </div>
              )}
              {transaction.source === 'whatsapp' && (
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-success text-[10px] text-white">
                  <MessageSquare className="h-3 w-3" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">
                  {transaction.merchant}
                </span>
                <span className="flex-shrink-0 text-sm font-semibold tabular-nums">
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  {transaction.category}
                </span>
                <StatusBadge status={transaction.status} />
              </div>
            </div>

            {/* Arrow */}
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          </motion.button>
        ))}
      </div>

      {/* View All Link */}
      <button className="mt-4 w-full rounded-xl py-2 text-center text-sm font-medium text-primary transition-colors hover:bg-primary/5">
        View all transactions →
      </button>
    </GlassCard>
  );
}
