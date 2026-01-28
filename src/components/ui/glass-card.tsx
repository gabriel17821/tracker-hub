import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowEffect?: boolean;
  gradientBorder?: boolean;
}

export function GlassCard({
  children,
  className,
  glowEffect = false,
  gradientBorder = false,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'glass-card',
        glowEffect && 'glow-effect',
        gradientBorder && 'gradient-border',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
