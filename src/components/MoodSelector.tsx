import { motion } from 'framer-motion';
import type { Mood } from '@/stores/appStore';

const moods: { value: Mood; emoji: string; label: string }[] = [
  { value: 'radiante', emoji: '✨', label: 'Radiante' },
  { value: 'tranquila', emoji: '🌿', label: 'Tranquila' },
  { value: 'cansada', emoji: '🌙', label: 'Cansada' },
  { value: 'ansiosa', emoji: '🌊', label: 'Ansiosa' },
  { value: 'triste', emoji: '🌧', label: 'Triste' },
];

interface Props {
  selected: Mood | null;
  onSelect: (mood: Mood) => void;
  label?: string;
}

export default function MoodSelector({ selected, onSelect, label }: Props) {
  return (
    <div>
      {label && (
        <p className="font-display text-lg font-medium text-foreground mb-4">{label}</p>
      )}
      <div className="flex gap-3 justify-center flex-wrap">
        {moods.map(({ value, emoji, label: moodLabel }) => (
          <motion.button
            key={value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(value)}
            className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${
              selected === value
                ? 'border-primary bg-primary/10 shadow-soft'
                : 'border-border bg-petal hover:border-primary/30'
            }`}
          >
            <span className="text-2xl">{emoji}</span>
            <span className="text-xs font-body font-medium text-foreground">{moodLabel}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
