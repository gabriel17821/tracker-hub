import { Transaction } from '@/lib/mockData';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Check, Edit, Trash2, X, Sparkles, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TransactionModalProps {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
  onConfirm?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TransactionModal({
  transaction,
  open,
  onClose,
  onConfirm,
  onDelete,
}: TransactionModalProps) {
  if (!transaction) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="text-left">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg">Transaction Details</SheetTitle>
            <StatusBadge status={transaction.status} />
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Invoice Image */}
          {transaction.imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="overflow-hidden rounded-2xl border border-border"
            >
              <img
                src={transaction.imageUrl}
                alt="Invoice"
                className="w-full object-cover"
              />
            </motion.div>
          )}

          {/* Amount & Merchant */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl">
                {categoryEmoji[transaction.category] || '📄'}
              </span>
              <div>
                <h3 className="text-xl font-semibold">{transaction.merchant}</h3>
                <p className="text-sm text-muted-foreground">
                  {transaction.category}
                </p>
              </div>
            </div>
            <p className="text-3xl font-bold tabular-nums">
              {formatCurrency(transaction.amount)}
            </p>
          </div>

          {/* Meta Info */}
          <div className="grid gap-3">
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{formatDate(transaction.date)}</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Source: {transaction.source === 'whatsapp' ? 'WhatsApp' : 'Manual Entry'}
              </span>
            </div>
          </div>

          {/* AI Insight */}
          {transaction.aiInsight && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={cn(
                'relative overflow-hidden rounded-2xl p-4',
                'bg-gradient-to-br from-primary/5 via-glow-blue/5 to-primary/5',
                'border border-primary/10'
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-xs font-medium text-primary">
                  AI Insight
                </span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">
                {transaction.aiInsight}
              </p>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {transaction.status === 'pending' && onConfirm && (
              <Button
                onClick={() => onConfirm(transaction.id)}
                className="flex-1 gap-2 rounded-xl bg-success hover:bg-success/90"
              >
                <Check className="h-4 w-4" />
                Confirm
              </Button>
            )}
            <Button
              variant="outline"
              className="flex-1 gap-2 rounded-xl"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            {onDelete && (
              <Button
                variant="outline"
                onClick={() => onDelete(transaction.id)}
                className="gap-2 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
