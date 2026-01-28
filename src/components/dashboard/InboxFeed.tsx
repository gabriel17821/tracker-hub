import { StatusBadge } from '@/components/ui/status-badge';
import { CategoryIcon, getCategoryLabel } from '@/components/ui/category-icon';
import { Transaction, mockTransactions } from '@/lib/mockData';
import { MessageSquare, ChevronRight, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface InboxFeedProps {
  onTransactionClick: (transaction: Transaction) => void;
}

export function InboxFeed({ onTransactionClick }: InboxFeedProps) {
  const recentTransactions = mockTransactions.slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const pendingCount = recentTransactions.filter(t => t.status === 'pending').length;

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Inbox className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Recent Activity</span>
        </div>
        {pendingCount > 0 && (
          <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
            {pendingCount} pending
          </span>
        )}
      </div>

      {/* Transaction List */}
      <div className="divide-y divide-border">
        {recentTransactions.map((transaction) => (
          <button
            key={transaction.id}
            onClick={() => onTransactionClick(transaction)}
            className={cn(
              'flex w-full items-center gap-3 p-3 text-left transition-colors',
              'hover:bg-secondary'
            )}
          >
            <CategoryIcon category={transaction.category} size="sm" />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {transaction.merchant}
                </span>
                {transaction.source === 'whatsapp' && (
                  <MessageSquare className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {getCategoryLabel(transaction.category)}
                </span>
                {transaction.status === 'pending' && (
                  <StatusBadge status={transaction.status} />
                )}
              </div>
            </div>

            <span className={cn(
              'text-sm font-medium tabular-nums',
              transaction.type === 'income' ? 'text-success' : ''
            )}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </span>

            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* View All Link */}
      <div className="border-t border-border p-3">
        <Link 
          to="/transactions"
          className="block text-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          View all transactions →
        </Link>
      </div>
    </div>
  );
}
