import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TransactionModal } from '@/components/transactions/TransactionModal';
import { AddTransactionForm } from '@/components/transactions/AddTransactionForm';
import { Transaction, mockTransactions, TransactionCategory } from '@/lib/mockData';
import { CategoryIcon } from '@/components/ui/category-icon';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Plus, 
  Minus,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Transactions = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    'tracker-transactions',
    mockTransactions
  );
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  // Separate income and expenses
  const { incomeTransactions, expenseTransactions, pendingTransactions } = useMemo(() => {
    const filtered = transactions.filter(t =>
      t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return {
      incomeTransactions: filtered.filter(t => t.type === 'income'),
      expenseTransactions: filtered.filter(t => t.type === 'expense'),
      pendingTransactions: filtered.filter(t => t.status === 'pending'),
    };
  }, [transactions, searchQuery]);

  // Calculate totals
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const netFlow = totalIncome - totalExpenses;

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedTransaction(null), 300);
  };

  const handleAddTransaction = (data: {
    amount: number;
    merchant: string;
    category: TransactionCategory;
    date: string;
    type: 'income' | 'expense';
  }) => {
    const newTransaction: Transaction = {
      id: `t-${Date.now()}`,
      ...data,
      status: 'confirmed',
      source: 'manual',
    };
    setTransactions([newTransaction, ...transactions]);
  };

  // Group transactions by date
  const groupByDate = (txns: Transaction[]) => {
    const groups: Record<string, Transaction[]> = {};
    txns.forEach(t => {
      const date = t.date;
      if (!groups[date]) groups[date] = [];
      groups[date].push(t);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  };

  const TransactionList = ({ items, emptyMessage }: { items: Transaction[]; emptyMessage: string }) => {
    const grouped = groupByDate(items);
    
    if (items.length === 0) {
      return (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {grouped.map(([date, txns]) => (
          <div key={date}>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
            <div className="space-y-1">
              {txns.map((transaction) => (
                <button
                  key={transaction.id}
                  onClick={() => handleTransactionClick(transaction)}
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <CategoryIcon category={transaction.category} />
                    <div>
                      <p className="text-sm font-medium">{transaction.merchant}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {transaction.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-sm font-semibold tabular-nums",
                      transaction.type === 'income' ? "text-success" : "text-foreground"
                    )}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </span>
                    {transaction.status === 'pending' && <StatusBadge status="pending" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            Track your income and expenses
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-3 sm:grid-cols-3">
          <button 
            onClick={() => setShowIncomeForm(true)}
            className="group rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-success/50 hover:bg-success/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                  <ArrowUpRight className="h-4 w-4 text-success" />
                </div>
                <span className="text-sm text-muted-foreground">Income</span>
              </div>
              <Plus className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-2 text-xl font-semibold tabular-nums text-success">
              +${totalIncome.toLocaleString()}
            </p>
          </button>
          
          <button
            onClick={() => setShowExpenseForm(true)}
            className="group rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-destructive/50 hover:bg-destructive/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                </div>
                <span className="text-sm text-muted-foreground">Expenses</span>
              </div>
              <Minus className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-2 text-xl font-semibold tabular-nums text-destructive">
              -${totalExpenses.toLocaleString()}
            </p>
          </button>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full",
                netFlow >= 0 ? "bg-success/10" : "bg-destructive/10"
              )}>
                {netFlow >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </div>
              <span className="text-sm text-muted-foreground">Net Flow</span>
            </div>
            <p className={cn(
              "mt-2 text-xl font-semibold tabular-nums",
              netFlow >= 0 ? "text-success" : "text-destructive"
            )}>
              {netFlow >= 0 ? '+' : ''}${netFlow.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all" className="flex-1 sm:flex-none">
              All
            </TabsTrigger>
            <TabsTrigger value="income" className="flex-1 sm:flex-none">
              <ArrowUpRight className="mr-1 h-3 w-3 text-success" />
              Income
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex-1 sm:flex-none">
              <ArrowDownRight className="mr-1 h-3 w-3 text-destructive" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex-1 sm:flex-none">
              Pending
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <TransactionList 
              items={[...incomeTransactions, ...expenseTransactions].sort((a, b) => 
                b.date.localeCompare(a.date)
              )} 
              emptyMessage="No transactions yet"
            />
          </TabsContent>

          <TabsContent value="income" className="mt-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {incomeTransactions.length} income transactions
              </p>
              <Button size="sm" variant="outline" onClick={() => setShowIncomeForm(true)}>
                <Plus className="mr-1 h-4 w-4" />
                Add Income
              </Button>
            </div>
            <TransactionList 
              items={incomeTransactions} 
              emptyMessage="No income recorded yet"
            />
          </TabsContent>

          <TabsContent value="expenses" className="mt-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {expenseTransactions.length} expense transactions
              </p>
              <Button size="sm" variant="outline" onClick={() => setShowExpenseForm(true)}>
                <Minus className="mr-1 h-4 w-4" />
                Add Expense
              </Button>
            </div>
            <TransactionList 
              items={expenseTransactions} 
              emptyMessage="No expenses recorded yet"
            />
          </TabsContent>

          <TabsContent value="pending" className="mt-4">
            <TransactionList 
              items={pendingTransactions} 
              emptyMessage="No pending transactions"
            />
          </TabsContent>
        </Tabs>
      </div>

      <TransactionModal
        transaction={selectedTransaction}
        open={modalOpen}
        onClose={handleCloseModal}
      />

      <AddTransactionForm
        open={showIncomeForm}
        onClose={() => setShowIncomeForm(false)}
        type="income"
        onAdd={handleAddTransaction}
      />

      <AddTransactionForm
        open={showExpenseForm}
        onClose={() => setShowExpenseForm(false)}
        type="expense"
        onAdd={handleAddTransaction}
      />
    </AppLayout>
  );
};

export default Transactions;
