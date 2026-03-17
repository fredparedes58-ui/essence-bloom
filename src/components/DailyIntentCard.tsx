import { motion } from 'framer-motion';
import { Sparkles, Sun, Moon, Sunset } from 'lucide-react';

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

const timeConfig = {
  morning: {
    greeting: 'Buenos días',
    message: 'Hoy es un nuevo lienzo. ¿Lista para pintarlo?',
    icon: Sun,
    accent: 'bg-gradient-ritual',
  },
  afternoon: {
    greeting: 'Buenas tardes',
    message: 'Un momento para reconectar contigo misma.',
    icon: Sunset,
    accent: 'bg-gradient-ritual',
  },
  evening: {
    greeting: 'Buenas noches',
    message: 'Cierra el día con un ritual de gratitud.',
    icon: Moon,
    accent: 'bg-gradient-amethyst',
  },
};

interface Props {
  name: string;
  streak: number;
  ritualDone: boolean;
}

export default function DailyIntentCard({ name, streak, ritualDone }: Props) {
  const time = getTimeOfDay();
  const config = timeConfig[time];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-2xl p-6 ${config.accent} shadow-soft`}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-5 h-5 text-primary-foreground/80" />
          <span className="text-sm font-body font-medium text-primary-foreground/80">
            {config.greeting}{name ? `, ${name}` : ''}
          </span>
        </div>

        <h2 className="font-display text-2xl font-semibold text-primary-foreground leading-tight mb-4">
          {ritualDone ? '✨ Ritual completado hoy' : config.message}
        </h2>

        {streak > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-primary-foreground/20 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
              <span className="text-xs font-body font-semibold text-primary-foreground">
                {streak} día{streak > 1 ? 's' : ''} seguidos
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary-foreground/10" />
      <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-primary-foreground/5" />
    </motion.div>
  );
}
