import { useState } from 'react';
import { X, Plus, Minus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TransactionCategory } from '@/lib/mockData';

interface AddTransactionFormProps {
  open: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
  onAdd: (transaction: {
    amount: number;
    merchant: string;
    category: TransactionCategory;
    date: string;
    type: 'income' | 'expense';
  }) => void;
}

const expenseCategories: { value: TransactionCategory; label: string }[] = [
  { value: 'shopping', label: 'Shopping' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'subscriptions', label: 'Subscriptions' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'housing', label: 'Housing' },
  { value: 'food', label: 'Food & Dining' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'health', label: 'Health' },
  { value: 'travel', label: 'Travel' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' },
];

const incomeCategories: { value: TransactionCategory; label: string }[] = [
  { value: 'income', label: 'Salary' },
  { value: 'other', label: 'Freelance' },
  { value: 'other', label: 'Investment' },
  { value: 'other', label: 'Gift' },
  { value: 'other', label: 'Other' },
];

export function AddTransactionForm({ open, onClose, type, onAdd }: AddTransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState<TransactionCategory | ''>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = type === 'income' ? incomeCategories : expenseCategories;
  const isIncome = type === 'income';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !merchant || !category) return;

    onAdd({
      amount: parseFloat(amount),
      merchant,
      category: category as TransactionCategory,
      date,
      type,
    });

    // Reset form
    setAmount('');
    setMerchant('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full ${
              isIncome ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
            }`}>
              {isIncome ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
            </span>
            Add {isIncome ? 'Income' : 'Expense'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7 text-lg tabular-nums"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="merchant">{isIncome ? 'Source' : 'Merchant'}</Label>
            <Input
              id="merchant"
              type="text"
              placeholder={isIncome ? 'e.g., Salary, Freelance' : 'e.g., Amazon, Starbucks'}
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as TransactionCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat, idx) => (
                  <SelectItem key={`${cat.value}-${idx}`} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <div className="relative">
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className={`flex-1 ${isIncome ? 'bg-success hover:bg-success/90' : ''}`}
            >
              Add {isIncome ? 'Income' : 'Expense'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
