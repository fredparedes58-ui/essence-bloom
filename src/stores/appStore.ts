import { useState, useCallback } from 'react';

export type Archetype = 'guerrera' | 'sabia' | 'creadora' | 'cuidadora' | null;
export type Mood = 'radiante' | 'tranquila' | 'cansada' | 'ansiosa' | 'triste';

export interface RitualStep {
  id: string;
  title: string;
  description: string;
  duration: number; // seconds
  icon: string;
}

export interface UserState {
  archetype: Archetype;
  name: string;
  currentStreak: number;
  longestStreak: number;
  ritualsCompleted: number;
  todayMoodBefore: Mood | null;
  todayMoodAfter: Mood | null;
  todayRitualDone: boolean;
  onboardingComplete: boolean;
}

const defaultState: UserState = {
  archetype: null,
  name: '',
  currentStreak: 0,
  longestStreak: 0,
  ritualsCompleted: 0,
  todayMoodBefore: null,
  todayMoodAfter: null,
  todayRitualDone: false,
  onboardingComplete: false,
};

function loadState(): UserState {
  try {
    const saved = localStorage.getItem('celixir-user');
    return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
  } catch {
    return defaultState;
  }
}

function saveState(state: UserState) {
  localStorage.setItem('celixir-user', JSON.stringify(state));
}

export function useAppStore() {
  const [user, setUser] = useState<UserState>(loadState);

  const updateUser = useCallback((updates: Partial<UserState>) => {
    setUser(prev => {
      const next = { ...prev, ...updates };
      saveState(next);
      return next;
    });
  }, []);

  const completeRitual = useCallback((moodAfter: Mood) => {
    setUser(prev => {
      const newStreak = prev.currentStreak + 1;
      const next: UserState = {
        ...prev,
        todayRitualDone: true,
        todayMoodAfter: moodAfter,
        ritualsCompleted: prev.ritualsCompleted + 1,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, prev.longestStreak),
      };
      saveState(next);
      return next;
    });
  }, []);

  const resetDaily = useCallback(() => {
    updateUser({ todayMoodBefore: null, todayMoodAfter: null, todayRitualDone: false });
  }, [updateUser]);

  return { user, updateUser, completeRitual, resetDaily };
}
