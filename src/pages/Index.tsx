import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/appStore';
import type { Archetype, Mood } from '@/stores/appStore';
import type { Ritual } from '@/data/rituals';
import OnboardingQuiz from '@/components/OnboardingQuiz';
import RitualPlayer from '@/components/RitualPlayer';
import BottomNav from '@/components/BottomNav';
import HomePage from '@/pages/HomePage';
import RitualPage from '@/pages/RitualPage';
import ComunidadPage from '@/pages/ComunidadPage';
import PerfilPage from '@/pages/PerfilPage';
import { useLocation } from 'react-router-dom';

export default function Index() {
  const { user, updateUser, completeRitual } = useAppStore();
  const [activeRitual, setActiveRitual] = useState<Ritual | null>(null);
  const location = useLocation();

  const handleOnboardingComplete = useCallback((archetype: Archetype, name: string) => {
    updateUser({ archetype, name, onboardingComplete: true });
  }, [updateUser]);

  const handleRitualComplete = useCallback((moodAfter: Mood) => {
    completeRitual(moodAfter);
    setTimeout(() => setActiveRitual(null), 2200);
  }, [completeRitual]);

  const handleReset = useCallback(() => {
    localStorage.removeItem('celixir-user');
    window.location.reload();
  }, []);

  // Show onboarding if not complete
  if (!user.onboardingComplete) {
    return <OnboardingQuiz onComplete={handleOnboardingComplete} />;
  }

  const path = location.pathname;

  return (
    <div className="max-w-lg mx-auto relative">
      {path === '/' && <HomePage user={user} onStartRitual={setActiveRitual} />}
      {path === '/ritual' && <RitualPage user={user} onStartRitual={setActiveRitual} />}
      {path === '/comunidad' && <ComunidadPage />}
      {path === '/perfil' && <PerfilPage user={user} onReset={handleReset} />}

      <BottomNav />

      <AnimatePresence>
        {activeRitual && (
          <RitualPlayer
            ritual={activeRitual}
            onComplete={handleRitualComplete}
            onClose={() => setActiveRitual(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
