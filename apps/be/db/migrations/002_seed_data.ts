import type { Database } from 'sql.js';

export const name = '002_seed_data';

export function up(db: Database): void {
  const stacks = [
    {
      name: 'Work Tasks',
      cover_type: 'gradient',
      cover_value: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      created_at: '2024-01-15T10:00:00Z',
    },
    {
      name: 'Personal Notes',
      cover_type: 'color',
      cover_value: '#22c55e',
      created_at: '2024-01-16T14:30:00Z',
    },
    {
      name: 'Ideas',
      cover_type: 'image',
      cover_value: 'https://picsum.photos/seed/ideas/400/200',
      created_at: '2024-01-17T09:15:00Z',
    },
  ];

  for (const stack of stacks) {
    db.run('INSERT INTO stacks (name, cover_type, cover_value, created_at) VALUES (?, ?, ?, ?)', [
      stack.name,
      stack.cover_type,
      stack.cover_value,
      stack.created_at,
    ]);
  }

  const cards = [
    {
      stack_id: 1,
      name: 'Review PR',
      cover: 'https://picsum.photos/seed/card1/300/200',
      description: 'Review the latest pull request',
      created_at: '2024-01-15T11:00:00Z',
    },
    {
      stack_id: 1,
      name: 'Team meeting',
      cover: 'https://picsum.photos/seed/card2/300/200',
      description: 'Weekly sync at 3pm',
      created_at: '2024-01-15T12:00:00Z',
    },
    {
      stack_id: 2,
      name: 'Shopping list',
      cover: 'https://picsum.photos/seed/card3/300/200',
      description: 'Milk, eggs, bread',
      created_at: '2024-01-16T15:00:00Z',
    },
    {
      stack_id: 3,
      name: 'App idea',
      cover: 'https://picsum.photos/seed/card4/300/200',
      description: 'Build a habit tracker',
      created_at: '2024-01-17T10:00:00Z',
    },
    {
      stack_id: 3,
      name: 'Blog post',
      cover: 'https://picsum.photos/seed/card5/300/200',
      description: 'Write about TypeScript tips',
      created_at: '2024-01-17T11:00:00Z',
    },
  ];

  for (const card of cards) {
    db.run('INSERT INTO cards (stack_id, name, cover, description, created_at) VALUES (?, ?, ?, ?, ?)', [
      card.stack_id,
      card.name,
      card.cover,
      card.description,
      card.created_at,
    ]);
  }
}

