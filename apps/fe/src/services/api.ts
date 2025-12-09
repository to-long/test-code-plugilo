import type { Card, Stack } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulate random failures (10% chance)
const shouldFail = () => Math.random() < 0.1;

// Generate random ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Mock API service
export const api = {
  // Stack operations
  async createStack(name: string, cover: string): Promise<Stack> {
    await delay(300);
    if (shouldFail()) throw new Error('Failed to create stack');
    
    return {
      id: generateId(),
      name,
      cover,
      cardCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  },

  async updateStack(id: string, updates: Partial<Stack>): Promise<Stack> {
    await delay(300);
    if (shouldFail()) throw new Error('Failed to update stack');
    
    return {
      id,
      ...updates,
      updatedAt: Date.now(),
    } as Stack;
  },

  async deleteStack(id: string): Promise<void> {
    await delay(300);
    if (shouldFail()) throw new Error('Failed to delete stack');
  },

  // Card operations
  async createCard(card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>): Promise<Card> {
    await delay(300);
    if (shouldFail()) throw new Error('Failed to create card');
    
    return {
      ...card,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  },

  async updateCard(id: string, updates: Partial<Card>): Promise<Card> {
    await delay(300);
    if (shouldFail()) throw new Error('Failed to update card');
    
    return {
      id,
      ...updates,
      updatedAt: Date.now(),
    } as Card;
  },

  async deleteCard(id: string): Promise<void> {
    await delay(300);
    if (shouldFail()) throw new Error('Failed to delete card');
  },

  async moveCard(cardId: string, targetStackId: string): Promise<void> {
    await delay(300);
    if (shouldFail()) throw new Error('Failed to move card');
  },
};

// Helper to generate random colors
export const getRandomColor = () => {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Helper to get placeholder image
export const getPlaceholderImage = (text: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(text)}&size=400&background=random`;
};

