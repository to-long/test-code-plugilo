import { create } from 'zustand';
import { cardApi } from '@/features/cards/api';
import { stackApi } from '@/features/stacks/api';
import { useStackStore } from '@/features/stacks/store';
import { useCardStore } from '@/features/cards/store';

export interface AppState {
  isLoading: boolean;
  error: string | null;

  // Data loading
  loadInitialData: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  error: null,

  loadInitialData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [stacks, cards] = await Promise.all([
        stackApi.fetchAll(),
        cardApi.fetchAll(),
      ]);

      // Update feature stores
      useStackStore.getState().setStacks(stacks);
      useCardStore.getState().setCards(cards);

      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load data',
      });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));

// Re-export feature stores for convenience
export { useStackStore } from '@/features/stacks/store';
export { useCardStore } from '@/features/cards/store';
