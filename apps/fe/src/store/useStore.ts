import { create } from 'zustand';
import type { AppState, Card, Stack } from '../types';
import { api } from '../services/api';

export const useStore = create<AppState>((set, get) => ({
	  stacks: [],
	  cards: [],
	  activeStackId: null,
	  isLoading: false,
	  error: null,

	  loadInitialData: async () => {
	    set({ isLoading: true, error: null });
	    try {
	      const { stacks, cards } = await api.fetchInitialData();
	      set({
	        stacks,
	        cards,
	        activeStackId: null,
	        isLoading: false,
	      });
	    } catch (error) {
	      set({
	        isLoading: false,
	        error: error instanceof Error ? error.message : 'Failed to load data',
	      });
	    }
	  },

	  // Stack actions
  createStack: async (name: string, cover: string) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticStack: Stack = {
      id: tempId,
      name,
      cover,
      cardCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Optimistic update
    set((state) => ({
      stacks: [...state.stacks, optimisticStack],
    }));

    try {
      const newStack = await api.createStack(name, cover);
      set((state) => ({
        stacks: state.stacks.map((s) => (s.id === tempId ? newStack : s)),
      }));
    } catch (error) {
      // Rollback on error
      set((state) => ({
        stacks: state.stacks.filter((s) => s.id !== tempId),
        error: error instanceof Error ? error.message : 'Failed to create stack',
      }));
      throw error;
    }
  },

  updateStack: async (id: string, updates: Partial<Stack>) => {
    const previousStacks = get().stacks;

    // Optimistic update
    set((state) => ({
      stacks: state.stacks.map((s) =>
        s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s
      ),
    }));

    try {
      await api.updateStack(id, updates);
    } catch (error) {
      // Rollback on error
      set({ stacks: previousStacks, error: error instanceof Error ? error.message : 'Failed to update stack' });
      throw error;
    }
  },

  deleteStack: async (id: string) => {
    const previousStacks = get().stacks;
    const previousCards = get().cards;

    // Optimistic update
    set((state) => ({
      stacks: state.stacks.filter((s) => s.id !== id),
      cards: state.cards.filter((c) => c.stackId !== id),
      activeStackId: state.activeStackId === id ? state.stacks[0]?.id || null : state.activeStackId,
    }));

    try {
      await api.deleteStack(id);
    } catch (error) {
      // Rollback on error
      set({ stacks: previousStacks, cards: previousCards, error: error instanceof Error ? error.message : 'Failed to delete stack' });
      throw error;
    }
  },

  setActiveStack: (id: string | null) => {
    set({ activeStackId: id });
  },

  // Card actions
  createCard: async (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticCard: Card = {
      ...card,
      id: tempId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Optimistic update
    set((state) => ({
      cards: [...state.cards, optimisticCard],
      stacks: state.stacks.map((s) =>
        s.id === card.stackId ? { ...s, cardCount: s.cardCount + 1 } : s
      ),
    }));

    try {
      const newCard = await api.createCard(card);
      set((state) => ({
        cards: state.cards.map((c) => (c.id === tempId ? newCard : c)),
      }));
    } catch (error) {
      // Rollback on error
      set((state) => ({
        cards: state.cards.filter((c) => c.id !== tempId),
        stacks: state.stacks.map((s) =>
          s.id === card.stackId ? { ...s, cardCount: s.cardCount - 1 } : s
        ),
        error: error instanceof Error ? error.message : 'Failed to create card',
      }));
      throw error;
    }
  },

  updateCard: async (id: string, updates: Partial<Card>) => {
    const previousCards = get().cards;

    // Optimistic update
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c
      ),
    }));

    try {
      await api.updateCard(id, updates);
    } catch (error) {
      // Rollback on error
      set({ cards: previousCards, error: error instanceof Error ? error.message : 'Failed to update card' });
      throw error;
    }
  },

  deleteCard: async (id: string) => {
    const previousCards = get().cards;
    const previousStacks = get().stacks;
    const card = get().cards.find((c) => c.id === id);

    // Optimistic update
    set((state) => ({
      cards: state.cards.filter((c) => c.id !== id),
      stacks: state.stacks.map((s) =>
        s.id === card?.stackId ? { ...s, cardCount: s.cardCount - 1 } : s
      ),
    }));

    try {
      await api.deleteCard(id);
    } catch (error) {
      // Rollback on error
      set({ cards: previousCards, stacks: previousStacks, error: error instanceof Error ? error.message : 'Failed to delete card' });
      throw error;
    }
  },

  moveCard: async (cardId: string, targetStackId: string) => {
    const previousCards = get().cards;
    const previousStacks = get().stacks;
    const card = get().cards.find((c) => c.id === cardId);

    if (!card) return;

    // Optimistic update
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === cardId ? { ...c, stackId: targetStackId, updatedAt: Date.now() } : c
      ),
      stacks: state.stacks.map((s) => {
        if (s.id === card.stackId) return { ...s, cardCount: s.cardCount - 1 };
        if (s.id === targetStackId) return { ...s, cardCount: s.cardCount + 1 };
        return s;
      }),
    }));

    try {
      await api.moveCard(cardId, targetStackId);
    } catch (error) {
      // Rollback on error
      set({ cards: previousCards, stacks: previousStacks, error: error instanceof Error ? error.message : 'Failed to move card' });
      throw error;
    }
  },

  // Utility
  getActiveCards: () => {
    const { cards, activeStackId } = get();
    return cards.filter((c) => c.stackId === activeStackId);
  },

  getStackById: (id: string) => {
    return get().stacks.find((s) => s.id === id);
  },
}));

