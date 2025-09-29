import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CalcRecord = {
  id: string; // uuid
  group: 'hydraulics' | 'electrical' | 'ro' | 'dosing' | 'indices' | 'conversions' | 'monitoring';
  name: string;
  tags: string[];
  input: Record<string, any>;
  output: Record<string, any>;
  createdAt: number;
  favorite?: boolean;
};

type State = {
  history: CalcRecord[];
  addRecord: (r: Omit<CalcRecord,'id'|'createdAt'>) => void;
  toggleFav: (id: string) => void;
  search: string;
  setSearch: (q: string) => void;
};

export const useAppStore = create<State>()(
  persist(
    (set, get) => ({
      history: [],
      addRecord: (r) => set(state => ({
        history: [{ ...r, id: crypto.randomUUID(), createdAt: Date.now() }, ...state.history].slice(0,200)
      })),
      toggleFav: (id) => set(state => ({
        history: state.history.map(h => h.id===id ? { ...h, favorite: !h.favorite } : h)
      })),
      search: '',
      setSearch: (q) => set({ search: q })
    }),
    { name: 'hakoolab-store', storage: createJSONStorage(() => AsyncStorage) }
  )
);
