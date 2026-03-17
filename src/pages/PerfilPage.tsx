import { motion } from 'framer-motion';
import { Settings, ChevronRight, LogOut } from 'lucide-react';
import StreakBadge from '@/components/StreakBadge';
import type { UserState } from '@/stores/appStore';

const archetypeNames: Record<string, { title: string; emoji: string }> = {
  guerrera: { title: 'La Guerrera', emoji: '🔥' },
  sabia: { title: 'La Sabia', emoji: '🌙' },
  creadora: { title: 'La Creadora', emoji: '🎨' },
  cuidadora: { title: 'La Cuidadora', emoji: '🌿' },
};

interface Props {
  user: UserState;
  onReset: () => void;
}

export default function PerfilPage({ user, onReset }: Props) {
  const archData = user.archetype ? archetypeNames[user.archetype] : null;

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Mi Perfil</h1>
          <Settings className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-petal border border-border text-center mb-6"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-ritual mx-auto flex items-center justify-center text-3xl mb-3">
            {archData?.emoji || '✨'}
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">{user.name || 'Celixir'}</h2>
          {archData && (
            <p className="text-sm font-body text-primary font-medium mt-1">{archData.title}</p>
          )}
          <div className="mt-4 flex justify-center">
            <StreakBadge streak={user.currentStreak} longest={user.longestStreak} />
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-petal border border-border text-center">
            <p className="font-body text-2xl font-bold text-foreground">{user.ritualsCompleted}</p>
            <p className="text-xs font-body text-muted-foreground">Rituales completados</p>
          </div>
          <div className="p-4 rounded-2xl bg-petal border border-border text-center">
            <p className="font-body text-2xl font-bold text-foreground">{user.longestStreak}</p>
            <p className="text-xs font-body text-muted-foreground">Mejor racha (días)</p>
          </div>
        </div>

        {/* Menu items */}
        <div className="space-y-2">
          {['Mi arquetipo', 'Historial de rituales', 'Notificaciones', 'Celixir Plus ✨'].map((item) => (
            <button
              key={item}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-petal border border-border hover:border-primary/30 transition-colors"
            >
              <span className="font-body text-sm text-foreground">{item}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <button
          onClick={onReset}
          className="mt-8 flex items-center gap-2 mx-auto text-sm font-body text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Reiniciar app
        </button>
      </div>
    </div>
  );
}
