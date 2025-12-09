export interface Card {
  id: string;
  name: string;
  description?: string;
  cover: string;
  stackId: string;
  createdAt: number;
  updatedAt: number;
}

export interface Stack {
  id: string;
  name: string;
  cover: string;
  cardCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface AppState {
  stacks: Stack[];
  cards: Card[];
  activeStackId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Stack actions
  createStack: (name: string, cover: string) => Promise<void>;
  updateStack: (id: string, updates: Partial<Stack>) => Promise<void>;
  deleteStack: (id: string) => Promise<void>;
  setActiveStack: (id: string) => void;
  
  // Card actions
  createCard: (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCard: (id: string, updates: Partial<Card>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  moveCard: (cardId: string, targetStackId: string) => Promise<void>;
  
  // Utility
  getActiveCards: () => Card[];
  getStackById: (id: string) => Stack | undefined;
}

export interface CreateCardForm {
  name: string;
  description: string;
  cover: string;
  stackId: string;
}

export interface CreateStackForm {
  name: string;
  cover: string;
}

export type ModalType = 'create-card' | 'edit-card' | 'create-stack' | 'edit-stack' | null;

