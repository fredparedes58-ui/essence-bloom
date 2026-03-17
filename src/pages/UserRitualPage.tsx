import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRituals, useRitualSteps, useCompleteRitual } from '@/hooks/useSupabase';
import RitualCard from '@/components/RitualCard';
import RitualPlayer from '@/components/RitualPlayer';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { Database } from '@/integrations/supabase/types';
import { useTodayRitualDone } from '@/hooks/useSupabase';

type DbRitual = Database['public']['Tables']['rituals']['Row'];

export default function UserRitualPage() {
  const { profile } = useAuth();
  const { data: rituals = [] } = useRituals(profile?.archetype);
  const { data: todayDone = false } = useTodayRitualDone();
  const completeRitual = useCompleteRitual();
  const [activeRitual, setActiveRitual] = useState<DbRitual | null>(null);
  const { data: activeSteps = [] } = useRitualSteps(activeRitual?.id ?? '');

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      <div className="px-5 pt-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Mi Ritual</h1>
        <p className="text-sm font-body text-muted-foreground mb-6">Elige tu ritual para hoy ✨</p>

        {todayDone && (
          <div className="mb-6 p-4 rounded-2xl bg-success/10 border border-success/20">
            <p className="font-body text-sm text-success font-medium">🌿 Ya completaste tu ritual de hoy. ¡Vuelve mañana!</p>
          </div>
        )}

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
              onStart={() => setActiveRitual(ritual)}
              index={i}
            />
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
              completeRitual.mutate({ ritualId: activeRitual.id, moodBefore: 'tranquila', moodAfter: moodAfter as any });
              setTimeout(() => setActiveRitual(null), 2200);
            }}
            onClose={() => setActiveRitual(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
