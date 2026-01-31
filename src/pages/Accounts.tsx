import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
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
import { 
  Plus, 
  Building2, 
  CreditCard, 
  PiggyBank, 
  Wallet,
  TrendingUp,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Account, mockAccounts, accountTypeLabels } from '@/lib/mockData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

const accountIcons: Record<string, React.ElementType> = {
  checking: Building2,
  savings: PiggyBank,
  credit: CreditCard,
  investment: TrendingUp,
  cash: Wallet,
};

const Accounts = () => {
  const [accounts, setAccounts] = useLocalStorage<Account[]>('tracker-accounts', mockAccounts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'checking' as Account['type'],
    balance: '',
    institution: '',
    accountNumber: '',
  });

  const totalAssets = accounts
    .filter(a => a.balance > 0)
    .reduce((sum, a) => sum + a.balance, 0);
  
  const totalLiabilities = accounts
    .filter(a => a.balance < 0)
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);
  
  const netWorth = totalAssets - totalLiabilities;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAccount: Account = {
      id: editingAccount?.id || `acc-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance),
      institution: formData.institution,
      lastUpdated: new Date().toISOString().split('T')[0],
      accountNumber: formData.accountNumber ? `****${formData.accountNumber.slice(-4)}` : undefined,
    };

    if (editingAccount) {
      setAccounts(accounts.map(a => a.id === editingAccount.id ? newAccount : a));
    } else {
      setAccounts([...accounts, newAccount]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'checking',
      balance: '',
      institution: '',
      accountNumber: '',
    });
    setShowAddModal(false);
    setEditingAccount(null);
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      institution: account.institution,
      accountNumber: '',
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    setAccounts(accounts.filter(a => a.id !== id));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Accounts</h1>
            <p className="text-sm text-muted-foreground">
              Track your real balances
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Add Account
          </Button>
        </div>

        {/* Net Worth Summary */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Assets</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-success">
              ${totalAssets.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Liabilities</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-destructive">
              ${totalLiabilities.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Net Worth</p>
            <p className={cn(
              "mt-1 text-2xl font-semibold tabular-nums",
              netWorth >= 0 ? "text-foreground" : "text-destructive"
            )}>
              ${netWorth.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Accounts List */}
        <div className="space-y-2">
          {accounts.map((account) => {
            const Icon = accountIcons[account.type] || Wallet;
            const isNegative = account.balance < 0;
            
            return (
              <div
                key={account.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    isNegative ? "bg-destructive/10" : "bg-secondary"
                  )}>
                    <Icon className={cn(
                      "h-5 w-5",
                      isNegative ? "text-destructive" : "text-muted-foreground"
                    )} />
                  </div>
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {account.institution} {account.accountNumber && `• ${account.accountNumber}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={cn(
                      "font-semibold tabular-nums",
                      isNegative ? "text-destructive" : "text-foreground"
                    )}>
                      {isNegative ? '-' : ''}${Math.abs(account.balance).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {accountTypeLabels[account.type]}
                    </p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(account)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(account.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}

          {accounts.length === 0 && (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <Wallet className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No accounts yet. Add your first account to start tracking.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Account Modal */}
      <Dialog open={showAddModal} onOpenChange={resetForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAccount ? 'Edit Account' : 'Add Account'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Account Name</Label>
              <Input
                id="name"
                placeholder="e.g., Main Checking"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Account Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(v) => setFormData({ ...formData, type: v as Account['type'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="balance">
                {formData.type === 'credit' ? 'Balance (enter negative for debt)' : 'Balance'}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  className="pl-7 tabular-nums"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                placeholder="e.g., Chase, Fidelity"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number (optional)</Label>
              <Input
                id="accountNumber"
                placeholder="Last 4 digits shown"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {editingAccount ? 'Save' : 'Add Account'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Accounts;
