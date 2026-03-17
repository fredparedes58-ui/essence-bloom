import { motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';
import type { Ritual } from '@/data/rituals';

interface Props {
  ritual: Ritual;
  onStart: (ritual: Ritual) => void;
  index: number;
}

const archetypeColors: Record<string, string> = {
  all: 'bg-gradient-ritual',
  guerrera: 'bg-gradient-ritual',
  sabia: 'bg-gradient-amethyst',
  creadora: 'bg-gradient-sage',
  cuidadora: 'bg-gradient-ritual',
};

export default function RitualCard({ ritual, onStart, index }: Props) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onStart(ritual)}
      className="w-full text-left rounded-2xl overflow-hidden shadow-card bg-petal border border-border group"
    >
      <div className={`h-2 ${archetypeColors[ritual.archetype || 'all']}`} />
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-display text-lg font-semibold text-foreground mb-1">
              {ritual.title}
            </h3>
            <p className="text-sm font-body text-muted-foreground mb-3">
              {ritual.subtitle}
            </p>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-body">{ritual.duration} min · {ritual.steps.length} pasos</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}
