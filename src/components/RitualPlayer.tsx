import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check } from 'lucide-react';
import type { Ritual } from '@/data/rituals';
import type { Mood } from '@/stores/appStore';
import MoodSelector from '@/components/MoodSelector';

interface Props {
  ritual: Ritual;
  onComplete: (moodAfter: Mood) => void;
  onClose: () => void;
}

export default function RitualPlayer({ ritual, onComplete, onClose }: Props) {
  const [phase, setPhase] = useState<'mood-before' | 'playing' | 'mood-after' | 'celebration'>('mood-before');
  const [moodBefore, setMoodBefore] = useState<Mood | null>(null);
  const [moodAfter, setMoodAfter] = useState<Mood | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const step = ritual.steps[currentStep];
  const progress = ((currentStep) / ritual.steps.length) * 100;

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimer(t => {
        if (t >= step.duration) {
          setIsTimerRunning(false);
          return step.duration;
        }
        return t + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, step.duration]);

  const nextStep = useCallback(() => {
    if (currentStep < ritual.steps.length - 1) {
      setCurrentStep(s => s + 1);
      setTimer(0);
      setIsTimerRunning(true);
    } else {
      setPhase('mood-after');
    }
  }, [currentStep, ritual.steps.length]);

  const startPlaying = () => {
    setPhase('playing');
    setTimer(0);
    setIsTimerRunning(true);
  };

  const handleFinish = () => {
    if (moodAfter) {
      setPhase('celebration');
      setTimeout(() => onComplete(moodAfter), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
        <span className="font-body text-sm text-muted-foreground">{ritual.title}</span>
        <div className="w-9" />
      </div>

      {/* Progress bar */}
      {phase === 'playing' && (
        <div className="px-5 mb-4">
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-gradient-ritual rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <AnimatePresence mode="wait">
          {phase === 'mood-before' && (
            <motion.div
              key="mood-before"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm text-center"
            >
              <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
                ¿Cómo te sientes ahora?
              </h2>
              <p className="text-sm font-body text-muted-foreground mb-8">
                Sin juicio. Solo observa.
              </p>
              <MoodSelector selected={moodBefore} onSelect={setMoodBefore} />
              {moodBefore && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={startPlaying}
                  className="mt-8 w-full py-4 rounded-2xl bg-gradient-ritual font-body font-semibold text-primary-foreground shadow-soft"
                >
                  Comenzar ritual
                </motion.button>
              )}
            </motion.div>
          )}

          {phase === 'playing' && step && (
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-sm text-center"
            >
              <motion.div
                className="text-5xl mb-6"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {step.icon}
              </motion.div>

              <p className="text-xs font-body text-muted-foreground mb-2 uppercase tracking-wider">
                Paso {currentStep + 1} de {ritual.steps.length}
              </p>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed mb-8">
                {step.description}
              </p>

              {/* Circular timer */}
              <div className="relative w-24 h-24 mx-auto mb-8">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                  <circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - timer / step.duration)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-body text-lg font-semibold text-foreground">
                  {Math.max(0, step.duration - timer)}s
                </span>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={nextStep}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-ritual font-body font-semibold text-primary-foreground shadow-soft"
              >
                {currentStep < ritual.steps.length - 1 ? (
                  <>Siguiente <ChevronRight className="w-4 h-4" /></>
                ) : (
                  <>Completar <Check className="w-4 h-4" /></>
                )}
              </motion.button>
            </motion.div>
          )}

          {phase === 'mood-after' && (
            <motion.div
              key="mood-after"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm text-center"
            >
              <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
                ¿Y ahora cómo te sientes?
              </h2>
              <p className="text-sm font-body text-muted-foreground mb-8">
                Observa si algo cambió ✨
              </p>
              <MoodSelector selected={moodAfter} onSelect={setMoodAfter} />
              {moodAfter && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleFinish}
                  className="mt-8 w-full py-4 rounded-2xl bg-gradient-sage font-body font-semibold text-accent-foreground shadow-soft"
                >
                  Finalizar ritual 🌿
                </motion.button>
              )}
            </motion.div>
          )}

          {phase === 'celebration' && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="text-7xl mb-6"
              >
                ✨
              </motion.div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                ¡Hermoso!
              </h2>
              <p className="font-body text-muted-foreground">
                Tu ritual de hoy está completo
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
