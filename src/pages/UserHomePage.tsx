import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRituals, useUserStreak, useTodayRitualDone, useRitualSteps, useCompleteRitual } from '@/hooks/useSupabase';
import DailyIntentCard from '@/components/DailyIntentCard';
import StreakBadge from '@/components/StreakBadge';
import RitualCard from '@/components/RitualCard';
import RitualPlayer from '@/components/RitualPlayer';
import { AnimatePresence } from 'framer-motion';
import celixirLogo from '@/assets/celixir-logo.png';
import type { Database } from '@/integrations/supabase/types';

type DbRitual = Database['public']['Tables']['rituals']['Row'];

const tips = [
  '💡 Tu piel cambia con las estaciones. Escúchala.',
  '💡 3 minutos de ritual son mejores que 0.',
  '💡 El maquillaje no te cambia. Te devuelve a ti misma.',
  '💡 No necesitas 10 productos. Necesitas intención.',
];

export default function UserHomePage() {
  const { profile } = useAuth();
  const { data: rituals = [] } = useRituals(profile?.archetype);
  const { data: streak } = useUserStreak();
  const { data: todayDone = false } = useTodayRitualDone();
  const completeRitual = useCompleteRitual();
  const [activeRitual, setActiveRitual] = useState<DbRitual | null>(null);
  const { data: activeSteps = [] } = useRitualSteps(activeRitual?.id ?? '');

  const tip = tips[Math.floor(Math.random() * tips.length)];

  const handleStartRitual = (ritual: any) => {
    // Map from RitualCard format to DbRitual
    setActiveRitual(ritual);
  };

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <img src={celixirLogo} alt="Celixir" className="w-8 h-8 object-contain" />
        <StreakBadge streak={streak?.current_streak ?? 0} longest={streak?.longest_streak ?? 0} />
      </div>

      <div className="px-5 space-y-6">
        <DailyIntentCard
          name={profile?.name ?? ''}
          streak={streak?.current_streak ?? 0}
          ritualDone={todayDone}
        />

        <div className="px-4 py-3 rounded-2xl bg-petal border border-border">
          <p className="text-sm font-body text-muted-foreground">{tip}</p>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Tus rituales</h3>
          <div className="space-y-3">
            {rituals.map((ritual, i) => (
              <RitualCard
                key={ritual.id}
                ritual={{
                  id: ritual.id,
                  title: ritual.title,
                  subtitle: ritual.subtitle || '',
                  duration: ritual.duration_minutes,
                  archetype: ritual.archetype || 'all',
                  steps: [],
                }}
                onStart={() => handleStartRitual(ritual)}
                index={i}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Rituales', value: streak?.current_streak ?? 0, icon: '🪷' },
            { label: 'Racha', value: `${streak?.current_streak ?? 0}d`, icon: '🔥' },
            { label: 'Mejor', value: `${streak?.longest_streak ?? 0}d`, icon: '⭐' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="rounded-2xl bg-petal border border-border p-4 text-center">
              <span className="text-xl">{stat.icon}</span>
              <p className="font-body text-lg font-bold text-foreground mt-1">{stat.value}</p>
              <p className="text-[10px] font-body text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeRitual && activeSteps.length > 0 && (
          <RitualPlayer
            ritual={{
              id: activeRitual.id,
              title: activeRitual.title,
              subtitle: activeRitual.subtitle || '',
              duration: activeRitual.duration_minutes,
              archetype: activeRitual.archetype || 'all',
              steps: activeSteps.map(s => ({
                id: s.id,
                title: s.title,
                description: s.description,
                duration: s.duration_seconds,
                icon: s.icon,
              })),
            }}
            onComplete={(moodAfter) => {
              completeRitual.mutate({
                ritualId: activeRitual.id,
                moodBefore: 'tranquila', // TODO: capture from player
                moodAfter: moodAfter as any,
              });
              setTimeout(() => setActiveRitual(null), 2200);
            }}
            onClose={() => setActiveRitual(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
