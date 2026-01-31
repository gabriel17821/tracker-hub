import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Target,
  Shield,
  Plane,
  Car,
  Home,
  GraduationCap,
  Gift,
  MoreHorizontal,
  Pencil,
  Trash2,
  Sparkles,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Goal, mockGoals } from '@/lib/mockData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

const goalIcons: Record<string, React.ElementType> = {
  shield: Shield,
  plane: Plane,
  car: Car,
  home: Home,
  education: GraduationCap,
  gift: Gift,
  target: Target,
};

const iconOptions = [
  { value: 'shield', label: 'Shield', Icon: Shield },
  { value: 'plane', label: 'Plane', Icon: Plane },
  { value: 'car', label: 'Car', Icon: Car },
  { value: 'home', label: 'Home', Icon: Home },
  { value: 'education', label: 'Education', Icon: GraduationCap },
  { value: 'gift', label: 'Gift', Icon: Gift },
  { value: 'target', label: 'Target', Icon: Target },
];

const Goals = () => {
  const [goals, setGoals] = useLocalStorage<Goal[]>('tracker-goals', mockGoals);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    icon: 'target',
  });

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGoal: Goal = {
      id: editingGoal?.id || `g-${Date.now()}`,
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      deadline: formData.deadline,
      icon: formData.icon,
      color: 'emerald',
    };

    if (editingGoal) {
      setGoals(goals.map(g => g.id === editingGoal.id ? newGoal : g));
    } else {
      setGoals([...goals, newGoal]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      icon: 'target',
    });
    setShowAddModal(false);
    setEditingGoal(null);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline,
      icon: goal.icon,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleAddFunds = (goalId: string, amount: number) => {
    setGoals(goals.map(g => 
      g.id === goalId 
        ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) }
        : g
    ));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Goals</h1>
            <p className="text-sm text-muted-foreground">
              Track your savings goals
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Add Goal
          </Button>
        </div>

        {/* Overall Progress */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">
                ${totalSaved.toLocaleString()} <span className="text-base font-normal text-muted-foreground">/ ${totalTarget.toLocaleString()}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-success">{overallProgress.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">complete</p>
            </div>
          </div>
          <Progress value={overallProgress} className="mt-3 h-2" />
        </div>

        {/* Goals List */}
        <div className="grid gap-4 sm:grid-cols-2">
          {goals.map((goal) => {
            const Icon = goalIcons[goal.icon] || Target;
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const remaining = goal.targetAmount - goal.currentAmount;
            const daysLeft = Math.ceil(
              (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );
            const isComplete = progress >= 100;
            
            return (
              <div
                key={goal.id}
                className={cn(
                  "rounded-lg border bg-card p-4 transition-all",
                  isComplete ? "border-success/50 bg-success/5" : "border-border"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      isComplete ? "bg-success/10" : "bg-secondary"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5",
                        isComplete ? "text-success" : "text-muted-foreground"
                      )} />
                    </div>
                    <div>
                      <p className="font-medium">{goal.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {isComplete ? (
                          <span className="text-success flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Complete!
                          </span>
                        ) : (
                          `${daysLeft} days left`
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAddFunds(goal.id, 100)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add $100
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(goal)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(goal.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-semibold tabular-nums">
                      ${goal.currentAmount.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      ${goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={progress} 
                    className={cn("mt-2 h-2", isComplete && "[&>div]:bg-success")} 
                  />
                  {!isComplete && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      ${remaining.toLocaleString()} to go
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {goals.length === 0 && (
            <div className="col-span-full rounded-lg border border-dashed border-border p-8 text-center">
              <Target className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No goals yet. Create your first savings goal.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Goal Modal */}
      <Dialog open={showAddModal} onOpenChange={resetForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingGoal ? 'Edit Goal' : 'Add Goal'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                placeholder="e.g., Emergency Fund"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="flex flex-wrap gap-2">
                {iconOptions.map(({ value, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: value })}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                      formData.icon === value 
                        ? "border-foreground bg-foreground text-background" 
                        : "border-border hover:bg-secondary"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="targetAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    className="pl-7 tabular-nums"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentAmount">Current Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="currentAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    className="pl-7 tabular-nums"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Target Date</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {editingGoal ? 'Save' : 'Add Goal'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Goals;
