import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// تعريف الأنواع
export interface Calculator {
  id: string;
  name: string;
  route: string;
  group?: string;
}

// واجهة الحالة
export interface FavoritesState {
  toggle(testItem: { key: string; title: string; route: string; group: string; }): unknown;
  favorites: Calculator[];
  toggleFavorite: (calculator: Calculator) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
}

const STORAGE_KEY = 'favorites-storage';

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      toggleFavorite: (calculator) =>
        set((state) => {
          const isCurrentlyFavorite = state.favorites.some(
            (fav) => fav.id === calculator.id
          );
          if (isCurrentlyFavorite) {
            return {
              favorites: state.favorites.filter(
                (fav) => fav.id !== calculator.id
              ),
            };
          } else {
            return { favorites: [...state.favorites, calculator] };
          }
        }),
      
      isFavorite: (id) => get().favorites.some((fav) => fav.id === id),

      clearFavorites: () => {
        set({ favorites: [] });
        AsyncStorage.removeItem(STORAGE_KEY);
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);