import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import celixirLogo from '@/assets/celixir-logo.png';
import type { Database } from '@/integrations/supabase/types';

type Archetype = Database['public']['Enums']['app_archetype'];

const archetypes: { value: Archetype; emoji: string; title: string; desc: string }[] = [
  { value: 'guerrera', emoji: '🔥', title: 'La Guerrera', desc: 'Determinada, líder. Tu maquillaje es tu armadura.' },
  { value: 'sabia', emoji: '🌙', title: 'La Sabia', desc: 'Reflexiva, serena. Menos es más.' },
  { value: 'creadora', emoji: '🎨', title: 'La Creadora', desc: 'Expresiva, libre. El maquillaje es tu arte.' },
  { value: 'cuidadora', emoji: '🌿', title: 'La Cuidadora', desc: 'Empática, nutricia. Un acto de amor propio.' },
];

interface QuizQ {
  q: string;
  opts: { text: string; arch: Archetype }[];
}

const questions: QuizQ[] = [
  {
    q: '¿Qué te motiva al empezar el día?',
    opts: [
      { text: 'Conquistar mis metas', arch: 'guerrera' },
      { text: 'Un momento de paz interior', arch: 'sabia' },
      { text: 'Crear algo que me inspire', arch: 'creadora' },
      { text: 'Cuidar de mí y los míos', arch: 'cuidadora' },
    ],
  },
  {
    q: 'Cuando te miras al espejo, ¿qué buscas?',
    opts: [
      { text: 'Fuerza y seguridad', arch: 'guerrera' },
      { text: 'Autenticidad y calma', arch: 'sabia' },
      { text: 'Inspiración y color', arch: 'creadora' },
      { text: 'Cariño y aceptación', arch: 'cuidadora' },
    ],
  },
  {
    q: '¿Cuánto tiempo dedicas a tu rutina?',
    opts: [
      { text: '5 min precisos y efectivos', arch: 'guerrera' },
      { text: '3 min con lo esencial', arch: 'sabia' },
      { text: '¡El que haga falta!', arch: 'creadora' },
      { text: 'Lo que mi piel necesite', arch: 'cuidadora' },
    ],
  },
];

export default function AuthPage() {
  const { signUp, signIn } = useAuth();
  const [mode, setMode] = useState<'welcome' | 'login' | 'register-info' | 'register-quiz' | 'register-result' | 'forgot'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // Quiz state
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({ guerrera: 0, sabia: 0, creadora: 0, cuidadora: 0 });
  const [resultArchetype, setResultArchetype] = useState<Archetype>('guerrera');

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    setError('');
    setLoading(true);
    const { error } = await (await import('@/integrations/supabase/client')).supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setError(error.message);
    else setForgotSent(true);
    setLoading(false);
  };

  const handleQuizAnswer = (arch: Archetype) => {
    const newScores = { ...scores, [arch]: (scores[arch] || 0) + 1 };
    setScores(newScores);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const winner = Object.entries(newScores).sort(([, a], [, b]) => b - a)[0][0] as Archetype;
      setResultArchetype(winner);
      setMode('register-result');
    }
  };

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    const { error } = await signUp(email, password, name, resultArchetype);
    if (error) setError(error.message);
    setLoading(false);
  };

  const resultData = archetypes.find(a => a.value === resultArchetype);

  return (
    <div className="min-h-screen bg-gradient-warm flex flex-col items-center justify-center px-6 py-12">
      <AnimatePresence mode="wait">
        {mode === 'welcome' && (
          <motion.div key="welcome" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="text-center max-w-sm w-full">
            <img src={celixirLogo} alt="Celixir" className="w-20 h-20 mx-auto mb-6 object-contain" />
            <h1 className="font-display text-4xl font-bold text-foreground mb-3">Celixir</h1>
            <p className="font-display text-lg text-muted-foreground italic mb-8">"El maquillaje no te cambia la cara. Te devuelve a ti misma."</p>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => setMode('register-info')} className="w-full py-4 rounded-2xl bg-gradient-ritual font-body font-semibold text-primary-foreground shadow-soft text-base mb-3">
              Crear cuenta
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => setMode('login')} className="w-full py-4 rounded-2xl bg-petal border-2 border-border font-body font-medium text-foreground text-base">
              Ya tengo cuenta
            </motion.button>
          </motion.div>
        )}

        {mode === 'login' && (
          <motion.div key="login" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="w-full max-w-sm">
            <button onClick={() => setMode('welcome')} className="text-sm font-body text-muted-foreground mb-6">← Volver</button>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Bienvenida de vuelta ✨</h2>
            {error && <p className="text-sm font-body text-destructive mb-4 p-3 rounded-xl bg-destructive/10">{error}</p>}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full px-5 py-4 rounded-2xl bg-petal border-2 border-border font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mb-3" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" className="w-full px-5 py-4 rounded-2xl bg-petal border-2 border-border font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mb-6" />
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleLogin} disabled={loading || !email || !password} className="w-full py-4 rounded-2xl bg-gradient-ritual font-body font-semibold text-primary-foreground shadow-soft disabled:opacity-40">
              {loading ? 'Entrando...' : 'Entrar'}
            </motion.button>
          </motion.div>
        )}

        {mode === 'register-info' && (
          <motion.div key="reg-info" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="w-full max-w-sm">
            <button onClick={() => setMode('welcome')} className="text-sm font-body text-muted-foreground mb-6">← Volver</button>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-2">Crea tu cuenta</h2>
            <p className="text-sm font-body text-muted-foreground mb-6">Primero, cuéntanos un poco de ti</p>
            {error && <p className="text-sm font-body text-destructive mb-4 p-3 rounded-xl bg-destructive/10">{error}</p>}
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" className="w-full px-5 py-4 rounded-2xl bg-petal border-2 border-border font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mb-3" autoFocus />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full px-5 py-4 rounded-2xl bg-petal border-2 border-border font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mb-3" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña (mín. 6 caracteres)" className="w-full px-5 py-4 rounded-2xl bg-petal border-2 border-border font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mb-6" />
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setError(''); setMode('register-quiz'); }} disabled={!name.trim() || !email || password.length < 6} className="w-full py-4 rounded-2xl bg-gradient-ritual font-body font-semibold text-primary-foreground shadow-soft disabled:opacity-40">
              Descubre tu arquetipo →
            </motion.button>
          </motion.div>
        )}

        {mode === 'register-quiz' && (
          <motion.div key={`quiz-${currentQ}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="w-full max-w-sm">
            <div className="flex gap-2 mb-8">
              {questions.map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= currentQ ? 'bg-gradient-ritual' : 'bg-border'}`} />
              ))}
            </div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-6">{questions[currentQ].q}</h2>
            <div className="space-y-3">
              {questions[currentQ].opts.map((opt, i) => (
                <motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileTap={{ scale: 0.98 }} onClick={() => handleQuizAnswer(opt.arch)} className="w-full text-left px-5 py-4 rounded-2xl bg-petal border-2 border-border hover:border-primary/40 transition-all font-body text-sm text-foreground">
                  {opt.text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {mode === 'register-result' && resultData && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm w-full">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }} className="text-6xl mb-4">
              {resultData.emoji}
            </motion.div>
            <p className="text-sm font-body text-muted-foreground mb-2">Tu arquetipo es</p>
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">{resultData.title}</h2>
            <p className="font-body text-muted-foreground mb-8">{resultData.desc}</p>
            {error && <p className="text-sm font-body text-destructive mb-4 p-3 rounded-xl bg-destructive/10">{error}</p>}
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleRegister} disabled={loading} className="w-full py-4 rounded-2xl bg-gradient-ritual font-body font-semibold text-primary-foreground shadow-soft disabled:opacity-40">
              {loading ? 'Creando cuenta...' : 'Comenzar mi ritual ✨'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
