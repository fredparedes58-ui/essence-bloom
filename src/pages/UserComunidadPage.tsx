import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunityPosts, useCreatePost } from '@/hooks/useSupabase';
import { Heart, MessageCircle, Sparkles, Send } from 'lucide-react';
import { useChallenges } from '@/hooks/useSupabase';

const archetypeEmoji: Record<string, string> = {
  guerrera: '🔥', sabia: '🌙', creadora: '🎨', cuidadora: '🌿',
};

export default function UserComunidadPage() {
  const { data: posts = [], isLoading } = useCommunityPosts();
  const { data: challenges = [] } = useChallenges();
  const createPost = useCreatePost();
  const [newPost, setNewPost] = useState('');

  const handlePost = () => {
    if (!newPost.trim()) return;
    createPost.mutate(newPost.trim());
    setNewPost('');
  };

  const activeChallenge = challenges[0];

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      <div className="px-5 pt-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Comunidad</h1>
        <p className="text-sm font-body text-muted-foreground mb-6">Un espacio seguro. Sin filtros, sin juicio.</p>

        {activeChallenge && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-5 rounded-2xl bg-gradient-amethyst shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-accent-foreground" />
              <span className="text-xs font-body font-semibold text-accent-foreground uppercase tracking-wider">Reto activo</span>
            </div>
            <h3 className="font-display text-lg font-semibold text-accent-foreground mb-1">{activeChallenge.title}</h3>
            <p className="text-sm font-body text-accent-foreground/80">{activeChallenge.description}</p>
          </motion.div>
        )}

        {/* New post */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="Comparte cómo fue tu ritual hoy..."
            className="flex-1 px-4 py-3 rounded-2xl bg-petal border-2 border-border font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            onKeyDown={e => e.key === 'Enter' && handlePost()}
          />
          <motion.button whileTap={{ scale: 0.9 }} onClick={handlePost} disabled={!newPost.trim() || createPost.isPending} className="w-11 h-11 rounded-2xl bg-gradient-ritual flex items-center justify-center shadow-soft disabled:opacity-40">
            <Send className="w-4 h-4 text-primary-foreground" />
          </motion.button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-sm font-body text-muted-foreground">Cargando...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post: any, i: number) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 rounded-2xl bg-petal border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-lg">
                    {archetypeEmoji[post.profiles?.archetype] || '✨'}
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">{post.profiles?.name || 'Celixir'}</p>
                    <p className="text-[10px] font-body text-muted-foreground">
                      {post.profiles?.archetype ? `${post.profiles.archetype.charAt(0).toUpperCase() + post.profiles.archetype.slice(1)}` : ''} · {new Date(post.created_at).toLocaleDateString('es')}
                    </p>
                  </div>
                </div>
                <p className="font-body text-sm text-foreground leading-relaxed mb-3">{post.content}</p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs font-body">{post.likes_count}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs font-body">Responder</span>
                  </button>
                </div>
              </motion.div>
            ))}
            {posts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-2xl mb-2">🌿</p>
                <p className="font-body text-sm text-muted-foreground">Sé la primera en compartir tu ritual</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
