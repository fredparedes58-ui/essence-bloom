import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface Props {
  streak: number;
  longest: number;
}

export default function StreakBadge({ streak, longest }: Props) {
  const isNewRecord = streak > 0 && streak >= longest;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-body ${
        streak > 0 ? 'bg-gradient-ritual shadow-glow' : 'bg-muted'
      }`}
    >
      <Flame
        className={`w-5 h-5 ${streak > 0 ? 'text-primary-foreground' : 'text-muted-foreground'}`}
      />
      <div>
        <p className={`text-lg font-bold leading-none ${streak > 0 ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
          {streak}
        </p>
        <p className={`text-[10px] ${streak > 0 ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
          {streak === 1 ? 'día' : 'días'}
        </p>
      </div>
      {isNewRecord && streak > 1 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 text-xs bg-amethyst text-accent-foreground px-2 py-0.5 rounded-full font-semibold"
        >
          ¡Récord!
        </motion.span>
      )}
    </motion.div>
  );
}
