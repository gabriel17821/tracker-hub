import { Transaction } from '@/lib/mockData';
import { StatusBadge } from '@/components/ui/status-badge';
import { CategoryIcon, getCategoryLabel } from '@/components/ui/category-icon';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Check, Edit, Trash2, Sparkles, Calendar, Tag, MessageSquare, FileText } from 'lucide-react';
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

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader className="text-left">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base">Transaction Details</SheetTitle>
            <StatusBadge status={transaction.status} />
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Invoice Image */}
          {transaction.imageUrl && (
            <div className="overflow-hidden rounded-lg border border-border">
              <img
                src={transaction.imageUrl}
                alt="Invoice"
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Amount & Merchant */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CategoryIcon category={transaction.category} size="lg" />
              <div>
                <h3 className="font-medium">{transaction.merchant}</h3>
                <p className="text-sm text-muted-foreground">
                  {getCategoryLabel(transaction.category)}
                </p>
              </div>
            </div>
            <p className={cn(
              'text-2xl font-semibold tabular-nums',
              transaction.type === 'income' ? 'text-success' : ''
            )}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </p>
          </div>

          {/* Meta Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 rounded-md bg-secondary p-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{formatDate(transaction.date)}</span>
            </div>
            <div className="flex items-center gap-3 rounded-md bg-secondary p-3">
              {transaction.source === 'whatsapp' ? (
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              ) : (
                <FileText className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm">
                {transaction.source === 'whatsapp' ? 'Via WhatsApp' : 'Manual Entry'}
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-md bg-secondary p-3">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{getCategoryLabel(transaction.category)}</span>
            </div>
          </div>

          {/* AI Insight */}
          {transaction.aiInsight && (
            <div className="rounded-lg border border-border bg-secondary/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  AI Insight
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                {transaction.aiInsight}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            {transaction.status === 'pending' && onConfirm && (
              <Button
                onClick={() => onConfirm(transaction.id)}
                className="flex-1 gap-2"
                variant="default"
              >
                <Check className="h-4 w-4" />
                Confirm
              </Button>
            )}
            <Button
              variant="outline"
              className="flex-1 gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            {onDelete && (
              <Button
                variant="outline"
                onClick={() => onDelete(transaction.id)}
                className="gap-2"
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
