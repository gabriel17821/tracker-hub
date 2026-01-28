import { TransactionCategory } from '@/lib/mockData';
import {
  ShoppingBag,
  ShoppingCart,
  Tv,
  Car,
  Home,
  UtensilsCrossed,
  Gamepad2,
  Zap,
  Heart,
  Plane,
  GraduationCap,
  Wallet,
  MoreHorizontal,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryConfig: Record<TransactionCategory, { icon: LucideIcon; color: string; bg: string }> = {
  shopping: { icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950' },
  groceries: { icon: ShoppingCart, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950' },
  subscriptions: { icon: Tv, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950' },
  transportation: { icon: Car, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950' },
  housing: { icon: Home, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950' },
  food: { icon: UtensilsCrossed, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950' },
  entertainment: { icon: Gamepad2, color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-950' },
  utilities: { icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-950' },
  health: { icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950' },
  travel: { icon: Plane, color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-950' },
  education: { icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950' },
  income: { icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950' },
  other: { icon: MoreHorizontal, color: 'text-gray-600', bg: 'bg-gray-50 dark:bg-gray-900' },
};

interface CategoryIconProps {
  category: TransactionCategory;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CategoryIcon({ category, size = 'md', className }: CategoryIconProps) {
  const config = categoryConfig[category] || categoryConfig.other;
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };
  
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg',
        sizeClasses[size],
        config.bg,
        className
      )}
    >
      <Icon className={cn(iconSizes[size], config.color)} />
    </div>
  );
}

export function getCategoryLabel(category: TransactionCategory): string {
  const labels: Record<TransactionCategory, string> = {
    shopping: 'Shopping',
    groceries: 'Groceries',
    subscriptions: 'Subscriptions',
    transportation: 'Transportation',
    housing: 'Housing',
    food: 'Food & Dining',
    entertainment: 'Entertainment',
    utilities: 'Utilities',
    health: 'Health',
    travel: 'Travel',
    education: 'Education',
    income: 'Income',
    other: 'Other',
  };
  return labels[category] || 'Other';
}
