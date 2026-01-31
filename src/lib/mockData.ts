// Mock data for TRACKER - Personal Finance Command Center

export interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  category: TransactionCategory;
  date: string;
  status: 'pending' | 'confirmed';
  imageUrl?: string;
  aiInsight?: string;
  source: 'whatsapp' | 'manual' | 'import';
  type: 'expense' | 'income';
}

export type TransactionCategory = 
  | 'shopping'
  | 'groceries'
  | 'subscriptions'
  | 'transportation'
  | 'housing'
  | 'food'
  | 'entertainment'
  | 'utilities'
  | 'health'
  | 'travel'
  | 'education'
  | 'income'
  | 'other';

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  currentPrice: number;
  costBasis: number;
  change24h: number;
  sparklineData: number[];
  assetType: 'stock' | 'crypto' | 'etf' | 'cash';
}

export interface Trade {
  id: string;
  holdingId: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  date: string;
  total: number;
}

export interface PortfolioSnapshot {
  date: string;
  value: number;
}

// Generate sparkline data
const generateSparkline = (base: number, volatility: number = 0.05): number[] => {
  const points = 20;
  const data: number[] = [];
  let current = base * (1 - volatility);
  
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * 2 * volatility * base;
    current = Math.max(current + change, base * 0.8);
    data.push(current);
  }
  data[data.length - 1] = base;
  return data;
};

// Portfolio history for the area chart
export const portfolioHistory: PortfolioSnapshot[] = [
  { date: '2024-07-01', value: 45000 },
  { date: '2024-08-01', value: 47500 },
  { date: '2024-09-01', value: 46200 },
  { date: '2024-10-01', value: 51800 },
  { date: '2024-11-01', value: 54300 },
  { date: '2024-12-01', value: 58900 },
  { date: '2025-01-01', value: 62450 },
  { date: '2025-01-15', value: 64200 },
  { date: '2025-01-28', value: 67842 },
];

// Recent transactions/invoices
export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    amount: 156.78,
    merchant: 'Amazon',
    category: 'shopping',
    date: '2025-01-28',
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop',
    aiInsight: 'This purchase is 23% higher than your average Amazon order. Consider reviewing if all items were necessary.',
    source: 'whatsapp',
    type: 'expense',
  },
  {
    id: 't2',
    amount: 89.50,
    merchant: 'Whole Foods',
    category: 'groceries',
    date: '2025-01-27',
    status: 'confirmed',
    imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=200&fit=crop',
    aiInsight: 'Your grocery spending is on track this month. You\'re 12% under your monthly grocery budget.',
    source: 'whatsapp',
    type: 'expense',
  },
  {
    id: 't3',
    amount: 45.00,
    merchant: 'Netflix + Spotify',
    category: 'subscriptions',
    date: '2025-01-26',
    status: 'confirmed',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop',
    aiInsight: 'You have 3 active streaming subscriptions totaling $45/month. Consider bundling options to save.',
    source: 'manual',
    type: 'expense',
  },
  {
    id: 't4',
    amount: 234.56,
    merchant: 'Shell Gas Station',
    category: 'transportation',
    date: '2025-01-25',
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1545262810-77515befe149?w=200&h=200&fit=crop',
    aiInsight: 'Fuel costs are up 15% this month. Your driving patterns suggest a potential savings of $40/month with route optimization.',
    source: 'whatsapp',
    type: 'expense',
  },
  {
    id: 't5',
    amount: 1250.00,
    merchant: 'Rent Payment',
    category: 'housing',
    date: '2025-01-01',
    status: 'confirmed',
    aiInsight: 'Housing costs represent 28% of your monthly income, which is within the recommended 30% threshold.',
    source: 'manual',
    type: 'expense',
  },
  {
    id: 't6',
    amount: 67.89,
    merchant: 'Uber Eats',
    category: 'food',
    date: '2025-01-24',
    status: 'confirmed',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
    aiInsight: 'Food delivery spending has increased 45% this month. Cooking at home could save you approximately $200/month.',
    source: 'whatsapp',
    type: 'expense',
  },
  {
    id: 't7',
    amount: 3500.00,
    merchant: 'Salary Deposit',
    category: 'income',
    date: '2025-01-15',
    status: 'confirmed',
    aiInsight: 'Your monthly salary has been deposited. You\'re on track to meet your savings goals.',
    source: 'manual',
    type: 'income',
  },
  {
    id: 't8',
    amount: 120.00,
    merchant: 'Electric Company',
    category: 'utilities',
    date: '2025-01-20',
    status: 'confirmed',
    aiInsight: 'Your electricity bill is 8% lower than last month. Great job on energy conservation!',
    source: 'manual',
    type: 'expense',
  },
];

// Investment holdings
export const mockHoldings: Holding[] = [
  {
    id: 'h1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    quantity: 50,
    currentPrice: 185.92,
    costBasis: 145.00,
    change24h: 2.34,
    sparklineData: generateSparkline(185.92),
    assetType: 'stock',
  },
  {
    id: 'h2',
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    quantity: 25,
    currentPrice: 378.91,
    costBasis: 280.00,
    change24h: -0.87,
    sparklineData: generateSparkline(378.91),
    assetType: 'stock',
  },
  {
    id: 'h3',
    symbol: 'BTC',
    name: 'Bitcoin',
    quantity: 0.5,
    currentPrice: 43250.00,
    costBasis: 35000.00,
    change24h: 3.45,
    sparklineData: generateSparkline(43250, 0.08),
    assetType: 'crypto',
  },
  {
    id: 'h4',
    symbol: 'ETH',
    name: 'Ethereum',
    quantity: 5,
    currentPrice: 2280.00,
    costBasis: 1800.00,
    change24h: 1.23,
    sparklineData: generateSparkline(2280, 0.07),
    assetType: 'crypto',
  },
  {
    id: 'h5',
    symbol: 'VOO',
    name: 'Vanguard S&P 500',
    quantity: 30,
    currentPrice: 432.15,
    costBasis: 380.00,
    change24h: 0.45,
    sparklineData: generateSparkline(432.15, 0.03),
    assetType: 'etf',
  },
  {
    id: 'h6',
    symbol: 'CASH',
    name: 'Cash Reserve',
    quantity: 1,
    currentPrice: 5000.00,
    costBasis: 5000.00,
    change24h: 0,
    sparklineData: Array(20).fill(5000),
    assetType: 'cash',
  },
];

// Trade history
export const mockTrades: Trade[] = [
  { id: 'tr1', holdingId: 'h1', symbol: 'AAPL', type: 'buy', quantity: 10, price: 142.50, date: '2025-01-15', total: 1425.00 },
  { id: 'tr2', holdingId: 'h3', symbol: 'BTC', type: 'buy', quantity: 0.1, price: 41000.00, date: '2025-01-10', total: 4100.00 },
  { id: 'tr3', holdingId: 'h2', symbol: 'MSFT', type: 'sell', quantity: 5, price: 375.00, date: '2025-01-08', total: 1875.00 },
  { id: 'tr4', holdingId: 'h5', symbol: 'VOO', type: 'buy', quantity: 5, price: 428.00, date: '2025-01-05', total: 2140.00 },
  { id: 'tr5', holdingId: 'h4', symbol: 'ETH', type: 'buy', quantity: 2, price: 2150.00, date: '2024-12-28', total: 4300.00 },
];

// Calculate totals
export const calculateNetWorth = (): number => {
  return mockHoldings.reduce((sum, h) => sum + (h.quantity * h.currentPrice), 0);
};

export const calculateMonthlyChange = (): { amount: number; percentage: number } => {
  const expenses = mockTransactions
    .filter(t => t.date.startsWith('2025-01') && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const income = mockTransactions
    .filter(t => t.date.startsWith('2025-01') && t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netFlow = income - expenses;
  const percentage = income > 0 ? ((netFlow / income) * 100) : 0;
  
  return { amount: netFlow, percentage };
};

// Asset type labels
export const assetTypeLabels: Record<string, string> = {
  'stock': 'Stocks',
  'crypto': 'Crypto',
  'etf': 'ETFs',
  'cash': 'Cash',
};

// Account types
export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash';
  balance: number;
  institution: string;
  lastUpdated: string;
  accountNumber?: string;
}

export const mockAccounts: Account[] = [
  {
    id: 'acc1',
    name: 'Main Checking',
    type: 'checking',
    balance: 4250.00,
    institution: 'Chase',
    lastUpdated: '2025-01-28',
    accountNumber: '****4521',
  },
  {
    id: 'acc2',
    name: 'Emergency Fund',
    type: 'savings',
    balance: 12500.00,
    institution: 'Marcus',
    lastUpdated: '2025-01-28',
    accountNumber: '****8832',
  },
  {
    id: 'acc3',
    name: 'Credit Card',
    type: 'credit',
    balance: -1850.00,
    institution: 'Amex',
    lastUpdated: '2025-01-27',
    accountNumber: '****2234',
  },
  {
    id: 'acc4',
    name: 'Brokerage',
    type: 'investment',
    balance: 45000.00,
    institution: 'Fidelity',
    lastUpdated: '2025-01-28',
    accountNumber: '****9912',
  },
];

// Goals
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
}

export const mockGoals: Goal[] = [
  {
    id: 'g1',
    name: 'Emergency Fund',
    targetAmount: 15000,
    currentAmount: 12500,
    deadline: '2025-06-01',
    icon: 'shield',
    color: 'emerald',
  },
  {
    id: 'g2',
    name: 'Vacation',
    targetAmount: 5000,
    currentAmount: 2100,
    deadline: '2025-08-01',
    icon: 'plane',
    color: 'blue',
  },
  {
    id: 'g3',
    name: 'New Car',
    targetAmount: 25000,
    currentAmount: 8500,
    deadline: '2026-01-01',
    icon: 'car',
    color: 'violet',
  },
  {
    id: 'g4',
    name: 'Home Down Payment',
    targetAmount: 60000,
    currentAmount: 18000,
    deadline: '2027-01-01',
    icon: 'home',
    color: 'amber',
  },
];

export const accountTypeLabels: Record<string, string> = {
  'checking': 'Checking',
  'savings': 'Savings',
  'credit': 'Credit Card',
  'investment': 'Investment',
  'cash': 'Cash',
};
