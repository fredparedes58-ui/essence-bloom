import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import celixirLogo from '@/assets/celixir-logo.png';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery event from auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });

    // Also check hash params for type=recovery
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setIsRecovery(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    setError('');
    setMessage('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setMessage('¡Contraseña actualizada! Redirigiendo...');
      setTimeout(() => navigate('/'), 2000);
    }
    setLoading(false);
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen bg-gradient-warm flex flex-col items-center justify-center px-6">
        <img src={celixirLogo} alt="Celixir" className="w-16 h-16 mb-6 object-contain" />
        <p className="font-body text-muted-foreground text-center">Verificando enlace de recuperación...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm flex flex-col items-center justify-center px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <img src={celixirLogo} alt="Celixir" className="w-16 h-16 mx-auto mb-6 object-contain" />
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2 text-center">Nueva contraseña</h2>
        <p className="text-sm font-body text-muted-foreground mb-6 text-center">Ingresa tu nueva contraseña</p>

        {error && <p className="text-sm font-body text-destructive mb-4 p-3 rounded-xl bg-destructive/10">{error}</p>}
        {message && <p className="text-sm font-body text-primary mb-4 p-3 rounded-xl bg-primary/10">{message}</p>}

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Nueva contraseña (mín. 6 caracteres)"
          className="w-full px-5 py-4 rounded-2xl bg-petal border-2 border-border font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mb-3"
        />
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Confirmar contraseña"
          className="w-full px-5 py-4 rounded-2xl bg-petal border-2 border-border font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mb-6"
        />
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleReset}
          disabled={loading || !password || !confirm}
          className="w-full py-4 rounded-2xl bg-gradient-ritual font-body font-semibold text-primary-foreground shadow-soft disabled:opacity-40"
        >
          {loading ? 'Actualizando...' : 'Guardar contraseña'}
        </motion.button>
      </motion.div>
    </div>
  );
}
