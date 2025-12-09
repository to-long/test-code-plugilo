import { type Card, type Stack, generateRandomCover, getDb, saveDb } from '../../db/index.js';

// Re-export types and helpers
export type { Card, Stack };
export { generateRandomCover };

// Helper to convert query results to objects
function rowToObject<T>(columns: string[], values: unknown[]): T {
  const obj: Record<string, unknown> = {};
  for (let i = 0; i < columns.length; i++) {
    obj[columns[i]] = values[i];
  }
  return obj as T;
}

function queryAll<T>(sql: string, params: unknown[] = []): T[] {
  const db = getDb();
  const result = db.exec(sql, params);
  if (result.length === 0) return [];

  const { columns, values } = result[0];
  return values.map((row) => rowToObject<T>(columns, row));
}

function queryOne<T>(sql: string, params: unknown[] = []): T | undefined {
  const results = queryAll<T>(sql, params);
  return results[0];
}

function run(sql: string, params: unknown[] = []): number {
  const db = getDb();
  db.run(sql, params);
  saveDb();
  return db.getRowsModified();
}

function insert(sql: string, params: unknown[] = []): number {
  const db = getDb();
  db.run(sql, params);
  const result = db.exec('SELECT last_insert_rowid() as id');
  saveDb();
  return result[0].values[0][0] as number;
}

// ============ Stack Repository ============

export const stackRepo = {
  findAll(): (Stack & { cardCount: number })[] {
    return queryAll<Stack & { cardCount: number }>(`
      SELECT s.*, COUNT(c.id) as cardCount 
      FROM stacks s 
      LEFT JOIN cards c ON c.stack_id = s.id 
      GROUP BY s.id 
      ORDER BY s.created_at DESC
    `);
  },

  findById(id: number): Stack | undefined {
    return queryOne<Stack>('SELECT * FROM stacks WHERE id = ?', [id]);
  },

  findByIdWithCards(id: number): (Stack & { cards: Card[] }) | undefined {
    const stack = this.findById(id);
    if (!stack) return undefined;

    const cards = queryAll<Card>(
      'SELECT * FROM cards WHERE stack_id = ? ORDER BY created_at DESC',
      [id],
    );
    return { ...stack, cards };
  },

  create(data: { name: string; cover?: { type: Stack['cover_type']; value: string } }): Stack {
    const cover = data.cover || generateRandomCover();
    const id = insert(
      'INSERT INTO stacks (name, cover_type, cover_value, created_at) VALUES (?, ?, ?, ?)',
      [data.name, cover.type, cover.value, new Date().toISOString()],
    );

    return this.findById(id)!;
  },

  update(
    id: number,
    data: { name?: string; cover?: { type: Stack['cover_type']; value: string } },
  ): Stack | undefined {
    const stack = this.findById(id);
    if (!stack) return undefined;

    const name = data.name ?? stack.name;
    const coverType = data.cover?.type ?? stack.cover_type;
    const coverValue = data.cover?.value ?? stack.cover_value;

    run('UPDATE stacks SET name = ?, cover_type = ?, cover_value = ? WHERE id = ?', [
      name,
      coverType,
      coverValue,
      id,
    ]);

    return this.findById(id);
  },

  delete(id: number): boolean {
    // First delete cards (sql.js doesn't support ON DELETE CASCADE well)
    run('DELETE FROM cards WHERE stack_id = ?', [id]);
    const changes = run('DELETE FROM stacks WHERE id = ?', [id]);
    return changes > 0;
  },
};

// ============ Card Repository ============

export const cardRepo = {
  findAll(): Card[] {
    return queryAll<Card>('SELECT * FROM cards ORDER BY created_at DESC');
  },

  findById(id: number): Card | undefined {
    return queryOne<Card>('SELECT * FROM cards WHERE id = ?', [id]);
  },

  findByStackId(stackId: number): Card[] {
    return queryAll<Card>('SELECT * FROM cards WHERE stack_id = ? ORDER BY created_at DESC', [
      stackId,
    ]);
  },

  create(data: { stackId: number; name: string; cover: string; description?: string }): Card {
    const id = insert(
      'INSERT INTO cards (stack_id, name, cover, description, created_at) VALUES (?, ?, ?, ?, ?)',
      [data.stackId, data.name, data.cover, data.description ?? null, new Date().toISOString()],
    );

    return this.findById(id)!;
  },

  update(
    id: number,
    data: { name?: string; cover?: string; description?: string; stackId?: number },
  ): Card | undefined {
    const card = this.findById(id);
    if (!card) return undefined;

    const name = data.name ?? card.name;
    const cover = data.cover ?? card.cover;
    const description = data.description ?? card.description;
    const stackId = data.stackId ?? card.stack_id;

    run('UPDATE cards SET name = ?, cover = ?, description = ?, stack_id = ? WHERE id = ?', [
      name,
      cover,
      description,
      stackId,
      id,
    ]);

    return this.findById(id);
  },

  move(id: number, stackId: number): Card | undefined {
    const card = this.findById(id);
    if (!card) return undefined;

    run('UPDATE cards SET stack_id = ? WHERE id = ?', [stackId, id]);
    return this.findById(id);
  },

  delete(id: number): boolean {
    const changes = run('DELETE FROM cards WHERE id = ?', [id]);
    return changes > 0;
  },
};
