import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { NetWorthHero } from '@/components/dashboard/NetWorthHero';
import { MonthlyPulse } from '@/components/dashboard/MonthlyPulse';
import { InboxFeed } from '@/components/dashboard/InboxFeed';
import { TransactionModal } from '@/components/transactions/TransactionModal';
import { Transaction, mockTransactions, mockHoldings } from '@/lib/mockData';
import { Wallet, TrendingUp, PiggyBank, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedTransaction(null), 300);
  };

  const totalExpenses = mockTransactions
    .filter(t => t.type === 'expense' && t.date.startsWith('2025-01'))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalHoldings = mockHoldings.length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Your financial overview
          </p>
        </div>

        {/* Net Worth Hero */}
        <NetWorthHero />

        {/* Quick Stats */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">This Month</span>
            </div>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              ${totalExpenses.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">spent</p>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Holdings</span>
            </div>
            <p className="mt-1 text-lg font-semibold">{totalHoldings}</p>
            <p className="text-xs text-muted-foreground">assets</p>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Savings Rate</span>
            </div>
            <p className="mt-1 text-lg font-semibold text-success">24%</p>
            <p className="text-xs text-muted-foreground">of income</p>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Budget</span>
            </div>
            <p className="mt-1 text-lg font-semibold">78%</p>
            <p className="text-xs text-muted-foreground">used</p>
          </div>
        </div>

        {/* Grid: Monthly Pulse + Inbox Feed */}
        <div className="grid gap-4 lg:grid-cols-2">
          <MonthlyPulse />
          <Link 
            to="/portfolio" 
            className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Portfolio Performance</p>
                <p className="mt-1 text-2xl font-semibold text-success">+22.06%</p>
                <p className="text-xs text-muted-foreground">All-time return</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success/50" />
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <InboxFeed onTransactionClick={handleTransactionClick} />
      </div>

      <TransactionModal
        transaction={selectedTransaction}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </AppLayout>
  );
};

export default Dashboard;
