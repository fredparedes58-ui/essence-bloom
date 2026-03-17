import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Archetype } from '@/stores/appStore';
import celixirLogo from '@/assets/celixir-logo.png';

interface ArchetypeOption {
  value: Archetype;
  emoji: string;
  title: string;
  description: string;
}

const archetypes: ArchetypeOption[] = [
  { value: 'guerrera', emoji: '🔥', title: 'La Guerrera', description: 'Determinada, líder natural. Tu maquillaje es tu armadura.' },
  { value: 'sabia', emoji: '🌙', title: 'La Sabia', description: 'Reflexiva, serena. Menos es más. Tu belleza está en la calma.' },
  { value: 'creadora', emoji: '🎨', title: 'La Creadora', description: 'Expresiva, libre. El maquillaje es tu arte y tu lienzo eres tú.' },
  { value: 'cuidadora', emoji: '🌿', title: 'La Cuidadora', description: 'Empática, nutricia. Tu ritual es un acto de amor propio.' },
];

interface QuizQuestion {
  question: string;
  options: { text: string; archetype: Archetype }[];
}

const questions: QuizQuestion[] = [
  {
    question: '¿Qué te motiva al empezar el día?',
    options: [
      { text: 'Conquistar mis metas', archetype: 'guerrera' },
      { text: 'Un momento de paz interior', archetype: 'sabia' },
      { text: 'Crear algo que me inspire', archetype: 'creadora' },
      { text: 'Cuidar de mí y los míos', archetype: 'cuidadora' },
    ],
  },
  {
    question: 'Cuando te miras al espejo, ¿qué buscas?',
    options: [
      { text: 'Fuerza y seguridad', archetype: 'guerrera' },
      { text: 'Autenticidad y calma', archetype: 'sabia' },
      { text: 'Inspiración y color', archetype: 'creadora' },
      { text: 'Cariño y aceptación', archetype: 'cuidadora' },
    ],
  },
  {
    question: '¿Cuánto tiempo dedicas a tu rutina de maquillaje?',
    options: [
      { text: '5 min precisos y efectivos', archetype: 'guerrera' },
      { text: '3 min con lo esencial', archetype: 'sabia' },
      { text: '¡El que haga falta para experimentar!', archetype: 'creadora' },
      { text: 'Lo que mi piel necesite hoy', archetype: 'cuidadora' },
    ],
  },
];

interface Props {
  onComplete: (archetype: Archetype, name: string) => void;
}

export default function OnboardingQuiz({ onComplete }: Props) {
  const [step, setStep] = useState<'welcome' | 'name' | 'quiz' | 'result'>('welcome');
  const [name, setName] = useState('');
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({ guerrera: 0, sabia: 0, creadora: 0, cuidadora: 0 });
  const [result, setResult] = useState<Archetype>(null);

  const handleAnswer = (archetype: Archetype) => {
    const newScores = { ...scores, [archetype!]: (scores[archetype!] || 0) + 1 };
    setScores(newScores);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const winner = Object.entries(newScores).sort(([, a], [, b]) => b - a)[0][0] as Archetype;
      setResult(winner);
      setStep('result');
    }
  };

  const resultData = archetypes.find(a => a.value === result);

  return (
    <div className="min-h-screen bg-gradient-warm flex flex-col items-center justify-center px-6 py-12">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-sm"
          >
            <img src={celixirLogo} alt="Celixir" className="w-20 h-20 mx-auto mb-6 object-contain" />
            <h1 className="font-display text-4xl font-bold text-foreground mb-3">
              Celixir
            </h1>
            <p className="font-display text-lg text-muted-foreground italic mb-2">
              "El maquillaje no te cambia la cara.
            </p>
            <p className="font-display text-lg text-muted-foreground italic mb-8">
              Te devuelve a ti misma."
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep('name')}
              className="w-full py-4 rounded-2xl bg-gradient-ritual font-body font-semibold text-primary-foreground shadow-soft text-base"
            >
              Descubre tu arquetipo
            </motion.button>
          </motion.div>
        )}

        {step === 'name' && (
          <motion.div
            key="name"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-sm w-full"
          >
            <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
              ¿Cómo te llamas?
            </h2>
            <p className="text-sm font-body text-muted-foreground mb-6">
              Para personalizar tu experiencia ✨
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full px-5 py-4 rounded-2xl bg-petal border-2 border-border text-center font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-lg"
              autoFocus
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep('quiz')}
              disabled={!name.trim()}
              className="w-full mt-6 py-4 rounded-2xl bg-gradient-ritual font-body font-semibold text-primary-foreground shadow-soft disabled:opacity-40 text-base"
            >
              Continuar
            </motion.button>
          </motion.div>
        )}

        {step === 'quiz' && (
          <motion.div
            key={`q-${currentQ}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm"
          >
            {/* Progress */}
            <div className="flex gap-2 mb-8">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    i <= currentQ ? 'bg-gradient-ritual' : 'bg-border'
                  }`}
                />
              ))}
            </div>

            <h2 className="font-display text-xl font-semibold text-foreground mb-6 leading-snug">
              {questions[currentQ].question}
            </h2>

            <div className="space-y-3">
              {questions[currentQ].options.map((opt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(opt.archetype)}
                  className="w-full text-left px-5 py-4 rounded-2xl bg-petal border-2 border-border hover:border-primary/40 transition-all font-body text-sm text-foreground"
                >
                  {opt.text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'result' && resultData && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="text-6xl mb-4"
            >
              {resultData.emoji}
            </motion.div>
            <p className="text-sm font-body text-muted-foreground mb-2">Tu arquetipo es</p>
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              {resultData.title}
            </h2>
            <p className="font-body text-muted-foreground mb-8 leading-relaxed">
              {resultData.description}
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onComplete(result, name.trim())}
              className="w-full py-4 rounded-2xl bg-gradient-ritual font-body font-semibold text-primary-foreground shadow-soft text-base"
            >
              Comenzar mi ritual ✨
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
