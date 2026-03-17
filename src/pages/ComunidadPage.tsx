import { motion } from 'framer-motion';
import { Heart, MessageCircle, Sparkles } from 'lucide-react';

const posts = [
  {
    id: '1',
    user: 'María G.',
    archetype: 'Guerrera',
    content: '7 días seguidos de ritual matutino. Nunca pensé que 5 minutos pudieran cambiar tanto cómo empiezo el día 🔥',
    likes: 24,
    time: 'Hace 2h',
    emoji: '🔥',
  },
  {
    id: '2',
    user: 'Carmen R.',
    archetype: 'Sabia',
    content: 'Hoy descubrí que el paso de "intención" es mi favorito. Mirarme al espejo y sonreír… 🥹',
    likes: 18,
    time: 'Hace 4h',
    emoji: '🌙',
  },
  {
    id: '3',
    user: 'Ana L.',
    archetype: 'Creadora',
    content: '¡Probé un labial morado por primera vez en mi vida! El ritual de la Creadora me inspiró a atreverme 🎨',
    likes: 31,
    time: 'Hace 6h',
    emoji: '🎨',
  },
  {
    id: '4',
    user: 'Laura M.',
    archetype: 'Cuidadora',
    content: 'Mi hija de 8 años quiso hacer el ritual conmigo. Fue el momento más bonito del día 🌿',
    likes: 42,
    time: 'Hace 8h',
    emoji: '🌿',
  },
];

export default function ComunidadPage() {
  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      <div className="px-5 pt-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Comunidad</h1>
        <p className="text-sm font-body text-muted-foreground mb-6">
          Un espacio seguro. Sin filtros, sin juicio.
        </p>

        {/* Challenge banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-5 rounded-2xl bg-gradient-amethyst shadow-soft"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent-foreground" />
            <span className="text-xs font-body font-semibold text-accent-foreground uppercase tracking-wider">
              Reto semanal
            </span>
          </div>
          <h3 className="font-display text-lg font-semibold text-accent-foreground mb-1">
            7 días de intención
          </h3>
          <p className="text-sm font-body text-accent-foreground/80">
            Completa tu ritual 7 días seguidos y desbloquea una afirmación exclusiva ✨
          </p>
        </motion.div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-2xl bg-petal border border-border"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-lg">
                  {post.emoji}
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{post.user}</p>
                  <p className="text-[10px] font-body text-muted-foreground">{post.archetype} · {post.time}</p>
                </div>
              </div>
              <p className="font-body text-sm text-foreground leading-relaxed mb-3">{post.content}</p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs font-body">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs font-body">Responder</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
