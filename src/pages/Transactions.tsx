import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { TransactionModal } from '@/components/transactions/TransactionModal';
import { Transaction, mockTransactions, categoryColors } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Plus, ChevronRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Transactions = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const categories = ['all', ...new Set(transactions.map((t) => t.category))];

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce(
    (groups, transaction) => {
      const date = transaction.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    },
    {} as Record<string, Transaction[]>
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedTransaction(null), 300);
  };

  const categoryEmoji: Record<string, string> = {
    Shopping: '🛍️',
    Groceries: '🥬',
    Subscriptions: '📺',
    Transportation: '⛽',
    Housing: '🏠',
    'Food & Dining': '🍕',
  };

  // Calculate total
  const totalSpent = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Transactions
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and track your expenses
            </p>
          </div>
          <Button className="gap-2 rounded-xl">
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
        </motion.div>

        {/* Summary Card */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Spending</p>
              <p className="text-2xl font-bold tabular-nums">
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-2xl font-bold">{filteredTransactions.length}</p>
            </div>
          </div>
        </GlassCard>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full rounded-xl sm:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transaction List by Date */}
        <div className="space-y-6">
          {Object.entries(groupedTransactions)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, transactions]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {formatDate(date)}
                  </span>
                </div>

                {/* Transactions */}
                <GlassCard className="divide-y divide-border/50">
                  {transactions.map((transaction, index) => (
                    <motion.button
                      key={transaction.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleTransactionClick(transaction)}
                      className={cn(
                        'flex w-full items-center gap-3 p-4 text-left transition-all duration-200',
                        'hover:bg-accent/30 active:bg-accent/50'
                      )}
                    >
                      {/* Category Icon */}
                      <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg"
                        style={{
                          backgroundColor: `${categoryColors[transaction.category]}20`,
                        }}
                      >
                        {categoryEmoji[transaction.category] || '📄'}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium">
                            {transaction.merchant}
                          </span>
                          <StatusBadge status={transaction.status} />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {transaction.category}
                        </span>
                      </div>

                      {/* Amount */}
                      <span className="flex-shrink-0 font-semibold tabular-nums">
                        -{formatCurrency(transaction.amount)}
                      </span>

                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    </motion.button>
                  ))}
                </GlassCard>
              </div>
            ))}
        </div>

        {/* Empty State */}
        {filteredTransactions.length === 0 && (
          <GlassCard className="p-12 text-center">
            <p className="text-muted-foreground">No transactions found</p>
          </GlassCard>
        )}
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        transaction={selectedTransaction}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </AppLayout>
  );
};

export default Transactions;
