import { useMemo } from 'react';
import { motion } from 'framer-motion';
import DailyIntentCard from '@/components/DailyIntentCard';
import StreakBadge from '@/components/StreakBadge';
import RitualCard from '@/components/RitualCard';
import { getRitualsForArchetype, type Ritual } from '@/data/rituals';
import type { UserState } from '@/stores/appStore';
import celixirLogo from '@/assets/celixir-logo.png';

interface Props {
  user: UserState;
  onStartRitual: (ritual: Ritual) => void;
}

const tips = [
  '💡 Tu piel cambia con las estaciones. Escúchala.',
  '💡 3 minutos de ritual son mejores que 0 minutos.',
  '💡 El maquillaje no te cambia. Te devuelve a ti misma.',
  '💡 No necesitas 10 productos. Necesitas intención.',
  '💡 Tu rostro es un lienzo. Tú decides qué pintar hoy.',
];

export default function HomePage({ user, onStartRitual }: Props) {
  const rituals = useMemo(() => getRitualsForArchetype(user.archetype), [user.archetype]);
  const tip = useMemo(() => tips[Math.floor(Math.random() * tips.length)], []);

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <img src={celixirLogo} alt="Celixir" className="w-8 h-8 object-contain" />
        <StreakBadge streak={user.currentStreak} longest={user.longestStreak} />
      </div>

      <div className="px-5 space-y-6">
        {/* Daily Intent */}
        <DailyIntentCard
          name={user.name}
          streak={user.currentStreak}
          ritualDone={user.todayRitualDone}
        />

        {/* Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="px-4 py-3 rounded-2xl bg-petal border border-border"
        >
          <p className="text-sm font-body text-muted-foreground">{tip}</p>
        </motion.div>

        {/* Rituals */}
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">
            Tus rituales
          </h3>
          <div className="space-y-3">
            {rituals.map((ritual, i) => (
              <RitualCard key={ritual.id} ritual={ritual} onStart={onStartRitual} index={i} />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Rituales', value: user.ritualsCompleted, icon: '🪷' },
            { label: 'Racha', value: `${user.currentStreak}d`, icon: '🔥' },
            { label: 'Mejor', value: `${user.longestStreak}d`, icon: '⭐' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="rounded-2xl bg-petal border border-border p-4 text-center"
            >
              <span className="text-xl">{stat.icon}</span>
              <p className="font-body text-lg font-bold text-foreground mt-1">{stat.value}</p>
              <p className="text-[10px] font-body text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
