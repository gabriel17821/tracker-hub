import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatusBadge } from '@/components/ui/status-badge';
import { CategoryIcon, getCategoryLabel } from '@/components/ui/category-icon';
import { TransactionModal } from '@/components/transactions/TransactionModal';
import { Transaction, mockTransactions, TransactionCategory } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Filter,
  Download,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Transactions = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getCategoryLabel(t.category).toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'income') return matchesSearch && t.type === 'income';
    if (activeTab === 'expenses') return matchesSearch && t.type === 'expense';
    if (activeTab === 'pending') return matchesSearch && t.status === 'pending';
    return matchesSearch;
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

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Transactions</h1>
            <p className="text-sm text-muted-foreground">
              Track and manage your expenses
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Income</span>
            </div>
            <p className="mt-1 text-xl font-semibold text-success tabular-nums">
              +{formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <ArrowDownLeft className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Expenses</span>
            </div>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              -{formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Net</span>
            </div>
            <p className={cn(
              'mt-1 text-xl font-semibold tabular-nums',
              totalIncome - totalExpenses >= 0 ? 'text-success' : 'text-destructive'
            )}>
              {totalIncome - totalExpenses >= 0 ? '+' : ''}{formatCurrency(totalIncome - totalExpenses)}
            </p>
          </div>
        </div>

        {/* Tabs & Filters */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="w-full justify-start sm:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9"
                />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-4">
            {/* Transaction List by Date */}
            <div className="space-y-4">
              {Object.entries(groupedTransactions)
                .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                .map(([date, dayTransactions]) => (
                  <div key={date}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {formatDate(date)}
                      </span>
                      <div className="h-px flex-1 bg-border" />
                    </div>

                    <div className="space-y-1">
                      {dayTransactions.map((transaction) => (
                        <button
                          key={transaction.id}
                          onClick={() => handleTransactionClick(transaction)}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors',
                            'hover:bg-secondary'
                          )}
                        >
                          <CategoryIcon category={transaction.category} size="sm" />

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-sm font-medium">
                                {transaction.merchant}
                              </span>
                              {transaction.status === 'pending' && (
                                <StatusBadge status={transaction.status} />
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {getCategoryLabel(transaction.category)}
                            </span>
                          </div>

                          <span className={cn(
                            'text-sm font-medium tabular-nums',
                            transaction.type === 'income' ? 'text-success' : ''
                          )}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            {filteredTransactions.length === 0 && (
              <div className="rounded-lg border border-border bg-card p-12 text-center">
                <p className="text-sm text-muted-foreground">No transactions found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <TransactionModal
        transaction={selectedTransaction}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </AppLayout>
  );
};

export default Transactions;
