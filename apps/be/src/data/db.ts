import { getDb, saveDb } from '../../db/index.js';

export function rowToObject<T>(columns: string[], values: unknown[]): T {
  const obj: Record<string, unknown> = {};
  for (let i = 0; i < columns.length; i++) {
    obj[columns[i]] = values[i];
  }
  return obj as T;
}

export function queryAll<T>(sql: string, params: unknown[] = []): T[] {
  const db = getDb();
  const result = db.exec(sql, params);
  if (result.length === 0) return [];

  const { columns, values } = result[0];
  return values.map((row) => rowToObject<T>(columns, row));
}

export function queryOne<T>(sql: string, params: unknown[] = []): T | undefined {
  return queryAll<T>(sql, params)[0];
}

export function run(sql: string, params: unknown[] = []): number {
  const db = getDb();
  db.run(sql, params);
  saveDb();
  return db.getRowsModified();
}

export function insert(sql: string, params: unknown[] = []): number {
  const db = getDb();
  db.run(sql, params);
  const result = db.exec('SELECT last_insert_rowid() as id');
  saveDb();
  return result[0].values[0][0] as number;
}

