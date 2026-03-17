import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  useAllRituals, useRitualSteps, useAdminCreateRitual, useAdminUpdateRitual, useAdminDeleteRitual,
  useAdminCreateStep, useAdminUpdateStep, useAdminDeleteStep,
  useChallenges, useAdminCreateChallenge, useAdminUpdateChallenge, useAdminDeleteChallenge,
  useCommunityPosts, useAdminDeletePost, useAdminProfiles,
} from '@/hooks/useSupabase';
import { Plus, Trash2, Edit2, Save, X, ChevronDown, Users, Sparkles, MessageCircle, Trophy, LogOut } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Tab = 'rituals' | 'challenges' | 'community' | 'users';

export default function AdminDashboard() {
  const { signOut, profile } = useAuth();
  const [tab, setTab] = useState<Tab>('rituals');

  const tabs: { value: Tab; label: string; icon: any }[] = [
    { value: 'rituals', label: 'Rituales', icon: Sparkles },
    { value: 'challenges', label: 'Retos', icon: Trophy },
    { value: 'community', label: 'Comunidad', icon: MessageCircle },
    { value: 'users', label: 'Usuarios', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <div className="bg-petal border-b border-border px-5 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Panel Admin</h1>
            <p className="text-xs font-body text-muted-foreground">Hola, {profile?.name || 'Admin'}</p>
          </div>
          <button onClick={signOut} className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-petal border-b border-border px-5">
        <div className="max-w-4xl mx-auto flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-body border-b-2 transition-colors whitespace-nowrap ${
                tab === t.value ? 'border-primary text-primary font-semibold' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-6">
        {tab === 'rituals' && <AdminRituals />}
        {tab === 'challenges' && <AdminChallenges />}
        {tab === 'community' && <AdminCommunity />}
        {tab === 'users' && <AdminUsers />}
      </div>
    </div>
  );
}

function AdminRituals() {
  const { data: rituals = [] } = useAllRituals();
  const createRitual = useAdminCreateRitual();
  const updateRitual = useAdminUpdateRitual();
  const deleteRitual = useAdminDeleteRitual();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', subtitle: '', archetype: '' as string, duration_minutes: 5 });
  const [showNew, setShowNew] = useState(false);
  const [expandedRitual, setExpandedRitual] = useState<string | null>(null);

  const handleCreate = () => {
    createRitual.mutate({
      title: form.title,
      subtitle: form.subtitle,
      archetype: (form.archetype || null) as any,
      duration_minutes: form.duration_minutes,
    });
    setForm({ title: '', subtitle: '', archetype: '', duration_minutes: 5 });
    setShowNew(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-semibold text-foreground">Rituales ({rituals.length})</h2>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowNew(!showNew)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-ritual font-body text-sm font-medium text-primary-foreground shadow-soft">
          <Plus className="w-4 h-4" /> Nuevo
        </motion.button>
      </div>

      {showNew && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-petal border border-border mb-4 space-y-3">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Título del ritual" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border font-body text-sm focus:outline-none focus:border-primary" />
          <input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} placeholder="Subtítulo" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border font-body text-sm focus:outline-none focus:border-primary" />
          <div className="flex gap-3">
            <select value={form.archetype} onChange={e => setForm({ ...form, archetype: e.target.value })} className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border font-body text-sm focus:outline-none focus:border-primary">
              <option value="">Universal (sin arquetipo)</option>
              <option value="guerrera">🔥 Guerrera</option>
              <option value="sabia">🌙 Sabia</option>
              <option value="creadora">🎨 Creadora</option>
              <option value="cuidadora">🌿 Cuidadora</option>
            </select>
            <input type="number" value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: +e.target.value })} min={1} max={30} className="w-20 px-3 py-2.5 rounded-xl bg-background border border-border font-body text-sm focus:outline-none focus:border-primary" />
            <span className="self-center text-xs font-body text-muted-foreground">min</span>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={!form.title} className="px-4 py-2 rounded-xl bg-gradient-ritual font-body text-sm font-medium text-primary-foreground disabled:opacity-40"><Save className="w-3.5 h-3.5 inline mr-1" />Guardar</button>
            <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-xl bg-muted font-body text-sm text-muted-foreground"><X className="w-3.5 h-3.5 inline mr-1" />Cancelar</button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {rituals.map(ritual => (
          <div key={ritual.id} className="rounded-2xl bg-petal border border-border overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-body text-sm font-semibold text-foreground">{ritual.title}</h3>
                  {ritual.archetype && <span className="text-xs font-body px-2 py-0.5 rounded-full bg-primary/10 text-primary">{ritual.archetype}</span>}
                  {!ritual.is_active && <span className="text-xs font-body px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">Inactivo</span>}
                </div>
                <p className="text-xs font-body text-muted-foreground mt-0.5">{ritual.subtitle} · {ritual.duration_minutes} min</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => updateRitual.mutate({ id: ritual.id, is_active: !ritual.is_active })} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-xs font-body">
                  {ritual.is_active ? 'Desactivar' : 'Activar'}
                </button>
                <button onClick={() => setExpandedRitual(expandedRitual === ritual.id ? null : ritual.id)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedRitual === ritual.id ? 'rotate-180' : ''}`} />
                </button>
                <button onClick={() => { if (confirm('¿Eliminar este ritual?')) deleteRitual.mutate(ritual.id); }} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {expandedRitual === ritual.id && <RitualStepsEditor ritualId={ritual.id} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function RitualStepsEditor({ ritualId }: { ritualId: string }) {
  const { data: steps = [] } = useRitualSteps(ritualId);
  const createStep = useAdminCreateStep();
  const updateStep = useAdminUpdateStep();
  const deleteStep = useAdminDeleteStep();
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', duration_seconds: 30, icon: '✨' });

  const handleCreate = () => {
    createStep.mutate({
      ritual_id: ritualId,
      step_number: steps.length + 1,
      title: form.title,
      description: form.description,
      duration_seconds: form.duration_seconds,
      icon: form.icon,
    });
    setForm({ title: '', description: '', duration_seconds: 30, icon: '✨' });
    setShowNew(false);
  };

  return (
    <div className="border-t border-border p-4 bg-background/50">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">Pasos ({steps.length})</span>
        <button onClick={() => setShowNew(!showNew)} className="text-xs font-body text-primary font-medium flex items-center gap-1">
          <Plus className="w-3 h-3" /> Añadir paso
        </button>
      </div>

      {showNew && (
        <div className="mb-3 p-3 rounded-xl bg-petal border border-border space-y-2">
          <div className="flex gap-2">
            <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="w-12 px-2 py-2 rounded-lg bg-background border border-border text-center text-sm" placeholder="✨" />
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Título del paso" className="flex-1 px-3 py-2 rounded-lg bg-background border border-border font-body text-sm focus:outline-none focus:border-primary" />
            <input type="number" value={form.duration_seconds} onChange={e => setForm({ ...form, duration_seconds: +e.target.value })} className="w-16 px-2 py-2 rounded-lg bg-background border border-border text-sm text-center" />
            <span className="self-center text-xs text-muted-foreground">seg</span>
          </div>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descripción" rows={2} className="w-full px-3 py-2 rounded-lg bg-background border border-border font-body text-sm focus:outline-none focus:border-primary resize-none" />
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={!form.title || !form.description} className="px-3 py-1.5 rounded-lg bg-primary font-body text-xs font-medium text-primary-foreground disabled:opacity-40">Guardar</button>
            <button onClick={() => setShowNew(false)} className="px-3 py-1.5 rounded-lg bg-muted font-body text-xs text-muted-foreground">Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-start gap-3 p-3 rounded-xl bg-petal border border-border">
            <span className="text-lg">{step.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm font-medium text-foreground">{step.step_number}. {step.title}</p>
              <p className="font-body text-xs text-muted-foreground mt-0.5 line-clamp-2">{step.description}</p>
              <p className="font-body text-[10px] text-warm-gray mt-1">{step.duration_seconds}s</p>
            </div>
            <button onClick={() => { if (confirm('¿Eliminar este paso?')) deleteStep.mutate(step.id); }} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminChallenges() {
  const { data: challenges = [] } = useChallenges();
  const createChallenge = useAdminCreateChallenge();
  const deleteChallenge = useAdminDeleteChallenge();
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', duration_days: 7 });

  const handleCreate = () => {
    createChallenge.mutate(form);
    setForm({ title: '', description: '', duration_days: 7 });
    setShowNew(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-semibold text-foreground">Retos ({challenges.length})</h2>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowNew(!showNew)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-amethyst font-body text-sm font-medium text-accent-foreground shadow-soft">
          <Plus className="w-4 h-4" /> Nuevo
        </motion.button>
      </div>

      {showNew && (
        <div className="p-4 rounded-2xl bg-petal border border-border mb-4 space-y-3">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Título del reto" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border font-body text-sm focus:outline-none focus:border-primary" />
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descripción" rows={2} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border font-body text-sm focus:outline-none focus:border-primary resize-none" />
          <div className="flex items-center gap-2">
            <input type="number" value={form.duration_days} onChange={e => setForm({ ...form, duration_days: +e.target.value })} min={1} className="w-20 px-3 py-2.5 rounded-xl bg-background border border-border font-body text-sm" />
            <span className="text-xs font-body text-muted-foreground">días</span>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={!form.title || !form.description} className="px-4 py-2 rounded-xl bg-gradient-amethyst font-body text-sm font-medium text-accent-foreground disabled:opacity-40">Guardar</button>
            <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-xl bg-muted font-body text-sm text-muted-foreground">Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {challenges.map(c => (
          <div key={c.id} className="flex items-center justify-between p-4 rounded-2xl bg-petal border border-border">
            <div>
              <h3 className="font-body text-sm font-semibold text-foreground">{c.title}</h3>
              <p className="text-xs font-body text-muted-foreground mt-0.5">{c.description}</p>
              <p className="text-[10px] font-body text-warm-gray mt-1">{c.duration_days} días</p>
            </div>
            <button onClick={() => { if (confirm('¿Eliminar?')) deleteChallenge.mutate(c.id); }} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminCommunity() {
  const { data: posts = [] } = useCommunityPosts();
  const deletePost = useAdminDeletePost();

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-foreground mb-4">Posts de la comunidad ({posts.length})</h2>
      <div className="space-y-3">
        {posts.map((post: any) => (
          <div key={post.id} className="flex items-start justify-between p-4 rounded-2xl bg-petal border border-border">
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm font-semibold text-foreground">{post.profiles?.name || 'Anónimo'}</p>
              <p className="font-body text-sm text-foreground mt-1">{post.content}</p>
              <p className="text-[10px] font-body text-warm-gray mt-2">{new Date(post.created_at).toLocaleDateString('es')} · ❤️ {post.likes_count}</p>
            </div>
            <button onClick={() => { if (confirm('¿Eliminar este post?')) deletePost.mutate(post.id); }} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {posts.length === 0 && <p className="text-center text-sm font-body text-muted-foreground py-8">No hay posts aún</p>}
      </div>
    </div>
  );
}

function AdminUsers() {
  const { data: profiles = [] } = useAdminProfiles();

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-foreground mb-4">Usuarios ({profiles.length})</h2>
      <div className="space-y-3">
        {profiles.map((p: any) => (
          <div key={p.id} className="flex items-center gap-3 p-4 rounded-2xl bg-petal border border-border">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
              {{ guerrera: '🔥', sabia: '🌙', creadora: '🎨', cuidadora: '🌿' }[p.archetype as string] || '✨'}
            </div>
            <div className="flex-1">
              <p className="font-body text-sm font-semibold text-foreground">{p.name || 'Sin nombre'}</p>
              <p className="text-xs font-body text-muted-foreground">
                {p.archetype || 'Sin arquetipo'} · {p.user_roles?.[0]?.role || 'user'}
              </p>
            </div>
            <p className="text-[10px] font-body text-warm-gray">{new Date(p.created_at).toLocaleDateString('es')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
