import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { NetWorthHero } from '@/components/dashboard/NetWorthHero';
import { MonthlyPulse } from '@/components/dashboard/MonthlyPulse';
import { InboxFeed } from '@/components/dashboard/InboxFeed';
import { TransactionModal } from '@/components/transactions/TransactionModal';
import { Transaction } from '@/lib/mockData';
import { motion } from 'framer-motion';

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

  const handleConfirm = (id: string) => {
    console.log('Confirming transaction:', id);
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    console.log('Deleting transaction:', id);
    handleCloseModal();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2"
        >
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Your financial overview at a glance
          </p>
        </motion.div>

        {/* Net Worth Hero */}
        <NetWorthHero />

        {/* Grid: Monthly Pulse + Inbox Feed */}
        <div className="grid gap-6 lg:grid-cols-2">
          <MonthlyPulse />
          <InboxFeed onTransactionClick={handleTransactionClick} />
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        transaction={selectedTransaction}
        open={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        onDelete={handleDelete}
      />
    </AppLayout>
  );
};

export default Dashboard;
