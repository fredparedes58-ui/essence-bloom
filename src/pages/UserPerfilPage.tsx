import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, ChevronRight, LogOut, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStreak, useUpdateProfile } from '@/hooks/useSupabase';
import StreakBadge from '@/components/StreakBadge';
import type { Database } from '@/integrations/supabase/types';

type Archetype = Database['public']['Enums']['app_archetype'];

const archetypeData: { value: Archetype; title: string; emoji: string }[] = [
  { value: 'guerrera', title: 'La Guerrera', emoji: '🔥' },
  { value: 'sabia', title: 'La Sabia', emoji: '🌙' },
  { value: 'creadora', title: 'La Creadora', emoji: '🎨' },
  { value: 'cuidadora', title: 'La Cuidadora', emoji: '🌿' },
];

export default function UserPerfilPage() {
  const { profile, signOut } = useAuth();
  const { data: streak } = useUserStreak();
  const updateProfile = useUpdateProfile();
  const [showArchetypes, setShowArchetypes] = useState(false);

  const currentArch = archetypeData.find(a => a.value === profile?.archetype);

  const handleChangeArchetype = (arch: Archetype) => {
    updateProfile.mutate({ archetype: arch });
    setShowArchetypes(false);
  };

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Mi Perfil</h1>
          <Settings className="w-5 h-5 text-muted-foreground" />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-petal border border-border text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-ritual mx-auto flex items-center justify-center text-3xl mb-3">
            {currentArch?.emoji || '✨'}
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">{profile?.name || 'Celixir'}</h2>
          {currentArch && <p className="text-sm font-body text-primary font-medium mt-1">{currentArch.title}</p>}
          <div className="mt-4 flex justify-center">
            <StreakBadge streak={streak?.current_streak ?? 0} longest={streak?.longest_streak ?? 0} />
          </div>
        </motion.div>

        {/* Change archetype */}
        <button
          onClick={() => setShowArchetypes(!showArchetypes)}
          className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-petal border border-border hover:border-primary/30 transition-colors mb-2"
        >
          <span className="font-body text-sm text-foreground">Cambiar arquetipo</span>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${showArchetypes ? 'rotate-90' : ''}`} />
        </button>

        {showArchetypes && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4 space-y-2">
            {archetypeData.map(arch => (
              <motion.button
                key={arch.value}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChangeArchetype(arch.value)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all ${
                  profile?.archetype === arch.value ? 'border-primary bg-primary/10' : 'border-border bg-petal hover:border-primary/30'
                }`}
              >
                <span className="text-xl">{arch.emoji}</span>
                <span className="font-body text-sm text-foreground flex-1 text-left">{arch.title}</span>
                {profile?.archetype === arch.value && <Check className="w-4 h-4 text-primary" />}
              </motion.button>
            ))}
          </motion.div>
        )}

        {['Historial de rituales', 'Notificaciones', 'Celixir Plus ✨'].map(item => (
          <button key={item} className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-petal border border-border hover:border-primary/30 transition-colors mb-2">
            <span className="font-body text-sm text-foreground">{item}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}

        <button onClick={signOut} className="mt-8 flex items-center gap-2 mx-auto text-sm font-body text-muted-foreground hover:text-destructive transition-colors">
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
