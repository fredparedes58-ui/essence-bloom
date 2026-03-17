import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

type Ritual = Database['public']['Tables']['rituals']['Row'];
type RitualStep = Database['public']['Tables']['ritual_steps']['Row'];
type UserRitual = Database['public']['Tables']['user_rituals']['Row'];
type UserStreak = Database['public']['Tables']['user_streaks']['Row'];
type CommunityPost = Database['public']['Tables']['community_posts']['Row'];
type Challenge = Database['public']['Tables']['challenges']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type AppArchetype = Database['public']['Enums']['app_archetype'];
type AppMood = Database['public']['Enums']['app_mood'];

// Rituals
export function useRituals(archetype?: AppArchetype | null) {
  return useQuery({
    queryKey: ['rituals', archetype],
    queryFn: async () => {
      let q = supabase.from('rituals').select('*').eq('is_active', true).order('sort_order');
      const { data, error } = await q;
      if (error) throw error;
      if (!archetype) return data.filter(r => !r.archetype);
      return data.filter(r => !r.archetype || r.archetype === archetype);
    },
  });
}

export function useAllRituals() {
  return useQuery({
    queryKey: ['rituals', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase.from('rituals').select('*').order('sort_order');
      if (error) throw error;
      return data;
    },
  });
}

export function useRitualSteps(ritualId: string) {
  return useQuery({
    queryKey: ['ritual_steps', ritualId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ritual_steps')
        .select('*')
        .eq('ritual_id', ritualId)
        .order('step_number');
      if (error) throw error;
      return data;
    },
    enabled: !!ritualId,
  });
}

// User Rituals
export function useCompleteRitual() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ritualId, moodBefore, moodAfter }: { ritualId: string; moodBefore: AppMood; moodAfter: AppMood }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Insert completion
      const { error } = await supabase.from('user_rituals').insert({
        user_id: user.id,
        ritual_id: ritualId,
        mood_before: moodBefore,
        mood_after: moodAfter,
      });
      if (error) throw error;

      // Update streak
      const today = new Date().toISOString().split('T')[0];
      const { data: streak } = await supabase.from('user_streaks').select('*').eq('user_id', user.id).single();

      if (streak) {
        const lastDate = streak.last_completed_at;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = 1;
        if (lastDate === yesterdayStr) {
          newStreak = streak.current_streak + 1;
        } else if (lastDate === today) {
          newStreak = streak.current_streak; // Already completed today
        }

        await supabase.from('user_streaks').update({
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, streak.longest_streak),
          last_completed_at: today,
        }).eq('user_id', user.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_streak'] });
      queryClient.invalidateQueries({ queryKey: ['user_rituals'] });
    },
  });
}

export function useUserStreak() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['user_streak', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase.from('user_streaks').select('*').eq('user_id', user.id).single();
      if (error) throw error;
      return data as UserStreak;
    },
    enabled: !!user,
  });
}

export function useUserRituals() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['user_rituals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase.from('user_rituals').select('*').eq('user_id', user.id).order('completed_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useTodayRitualDone() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['today_ritual', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('user_rituals')
        .select('id')
        .eq('user_id', user.id)
        .gte('completed_at', today + 'T00:00:00')
        .limit(1);
      if (error) throw error;
      return (data?.length ?? 0) > 0;
    },
    enabled: !!user,
  });
}

// Community
export function useCommunityPosts() {
  return useQuery({
    queryKey: ['community_posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*, profiles(name, archetype)')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('community_posts').insert({ user_id: user.id, content });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['community_posts'] }),
  });
}

// Challenges
export function useChallenges() {
  return useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const { data, error } = await supabase.from('challenges').select('*').eq('is_active', true).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// Profile update
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { refreshProfile } = useAuth();
  return useMutation({
    mutationFn: async (updates: { name?: string; archetype?: AppArchetype }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      refreshProfile();
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// Admin CRUD
export function useAdminCreateRitual() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ritual: Database['public']['Tables']['rituals']['Insert']) => {
      const { data, error } = await supabase.from('rituals').insert(ritual).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rituals'] }),
  });
}

export function useAdminUpdateRitual() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Database['public']['Tables']['rituals']['Update']) => {
      const { error } = await supabase.from('rituals').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rituals'] }),
  });
}

export function useAdminDeleteRitual() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rituals').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rituals'] }),
  });
}

export function useAdminCreateStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (step: Database['public']['Tables']['ritual_steps']['Insert']) => {
      const { error } = await supabase.from('ritual_steps').insert(step);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ritual_steps'] }),
  });
}

export function useAdminUpdateStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Database['public']['Tables']['ritual_steps']['Update']) => {
      const { error } = await supabase.from('ritual_steps').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ritual_steps'] }),
  });
}

export function useAdminDeleteStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('ritual_steps').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ritual_steps'] }),
  });
}

// Admin challenges
export function useAdminCreateChallenge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (c: Database['public']['Tables']['challenges']['Insert']) => {
      const { error } = await supabase.from('challenges').insert(c);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['challenges'] }),
  });
}

export function useAdminUpdateChallenge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Database['public']['Tables']['challenges']['Update']) => {
      const { error } = await supabase.from('challenges').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['challenges'] }),
  });
}

export function useAdminDeleteChallenge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('challenges').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['challenges'] }),
  });
}

// Admin community posts
export function useAdminDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('community_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['community_posts'] }),
  });
}

// Admin profiles
export function useAdminProfiles() {
  return useQuery({
    queryKey: ['admin_profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*, user_roles(role)').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}
