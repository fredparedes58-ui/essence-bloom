import { useMemo } from 'react';
import RitualCard from '@/components/RitualCard';
import { getRitualsForArchetype, type Ritual } from '@/data/rituals';
import type { UserState } from '@/stores/appStore';

interface Props {
  user: UserState;
  onStartRitual: (ritual: Ritual) => void;
}

export default function RitualPage({ user, onStartRitual }: Props) {
  const rituals = useMemo(() => getRitualsForArchetype(user.archetype), [user.archetype]);

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      <div className="px-5 pt-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Mi Ritual</h1>
        <p className="text-sm font-body text-muted-foreground mb-6">
          Elige tu ritual para hoy ✨
        </p>

        {user.todayRitualDone && (
          <div className="mb-6 p-4 rounded-2xl bg-success/10 border border-success/20">
            <p className="font-body text-sm text-success font-medium">
              🌿 Ya completaste tu ritual de hoy. ¡Vuelve mañana!
            </p>
          </div>
        )}

        <div className="space-y-3">
          {rituals.map((ritual, i) => (
            <RitualCard key={ritual.id} ritual={ritual} onStart={onStartRitual} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
