import type { Card } from '@/features/cards/types';
import type { Stack } from '@/features/stacks/types';
import { client } from '../open-api';
import type { components } from '../open-api/generated/api';

type ApiCard = components['schemas']['Card'];
type ApiStack = components['schemas']['Stack'];
type ApiCover = components['schemas']['Cover'];

function toNumberId(id: string): number {
  const num = Number(id);
  if (Number.isNaN(num)) {
    throw new Error(`Invalid numeric id: ${id}`);
  }
  return num;
}

function mapCover(cover?: ApiCover): string {
  if (!cover) return getRandomColor();
  return cover.value ?? getRandomColor();
}

function mapStack(stack: ApiStack): Stack {
  const createdAt = stack.createdAt ? Date.parse(stack.createdAt) : Date.now();
  return {
    id: stack.id !== undefined ? String(stack.id) : '',
    name: stack.name ?? 'Untitled stack',
    cover: mapCover(stack.cover),
    cardCount: stack.cardCount ?? 0,
    createdAt,
    // Backend doesn't expose updatedAt; approximate with createdAt
    updatedAt: createdAt,
  };
}

function mapCard(card: ApiCard): Card {
  const now = Date.now();
  const createdAt = card.createdAt ? Date.parse(card.createdAt) : now;
  return {
    id: card.id !== undefined ? String(card.id) : '',
    name: card.name ?? 'Untitled card',
    description: card.description ?? undefined,
    cover: card.cover ?? getPlaceholderImage(card.name ?? 'Card'),
    stackId: card.stackId !== undefined ? String(card.stackId) : '',
    createdAt,
    updatedAt: now,
  };
}

export const api = {
  async fetchInitialData(): Promise<{ stacks: Stack[]; cards: Card[] }> {
    const [stacksRes, cardsRes] = await Promise.all([
      client['/api/stacks'].GET(),
      client['/api/cards'].GET(),
    ]);

    if (!stacksRes.response.ok || !stacksRes.data) {
      throw new Error('Failed to load stacks');
    }
    if (!cardsRes.response.ok || !cardsRes.data) {
      throw new Error('Failed to load cards');
    }

    return {
      stacks: stacksRes.data.map(mapStack),
      cards: cardsRes.data.map(mapCard),
    };
  },

  // Stack operations
  async createStack(name: string, cover: string): Promise<Stack> {
    const res = await client['/api/stacks'].POST({
      body: {
        name,
        cover: {
          type: 'gradient',
          value: cover,
        },
      },
    });

    if (!res.response.ok || !res.data) {
      throw new Error('Failed to create stack');
    }

    return mapStack(res.data);
  },

  async updateStack(id: string, updates: Partial<Stack>): Promise<Stack> {
    const body: { name?: string; cover?: ApiCover } = {};
    if (updates.name !== undefined) body.name = updates.name;
    if (updates.cover !== undefined) {
      body.cover = {
        type: 'gradient',
        value: updates.cover,
      };
    }

    const res = await client['/api/stacks/{id}'].PUT({
      params: { path: { id: toNumberId(id) } },
      body,
    });

    if (!res.response.ok || !res.data) {
      throw new Error('Failed to update stack');
    }

    return mapStack(res.data);
  },

  async deleteStack(id: string): Promise<void> {
    const res = await client['/api/stacks/{id}'].DELETE({
      params: { path: { id: toNumberId(id) } },
    });

    if (!res.response.ok) {
      throw new Error('Failed to delete stack');
    }
  },

  // Card operations
  async createCard(card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>): Promise<Card> {
    const res = await client['/api/stacks/{stackId}/cards'].POST({
      params: { path: { stackId: toNumberId(card.stackId) } },
      body: {
        name: card.name,
        cover: card.cover,
        description: card.description || undefined,
      },
    });

    if (!res.response.ok || !res.data) {
      throw new Error('Failed to create card');
    }

    return mapCard(res.data);
  },

  async updateCard(id: string, updates: Partial<Card>): Promise<Card> {
    const res = await client['/api/cards/{id}'].PUT({
      params: { path: { id: toNumberId(id) } },
      body: {
        name: updates.name,
        cover: updates.cover,
        description: updates.description,
        stackId: updates.stackId ? toNumberId(updates.stackId) : undefined,
      },
    });

    if (!res.response.ok || !res.data) {
      throw new Error('Failed to update card');
    }

    return mapCard(res.data);
  },

  async deleteCard(id: string): Promise<void> {
    const res = await client['/api/cards/{id}'].DELETE({
      params: { path: { id: toNumberId(id) } },
    });

    if (!res.response.ok) {
      throw new Error('Failed to delete card');
    }
  },

  async moveCard(cardId: string, targetStackId: string): Promise<void> {
    const res = await client['/api/cards/{id}/move'].PATCH({
      params: { path: { id: toNumberId(cardId) } },
      body: { stackId: toNumberId(targetStackId) },
    });

    if (!res.response.ok) {
      throw new Error('Failed to move card');
    }
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
