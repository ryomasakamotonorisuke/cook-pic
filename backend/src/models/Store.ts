import pool from '../config/database';
import { Store } from '../types';

function normalizeJsonField<T>(value: any, fallback: T): T {
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return value;
}

function mapStore(row: any): Store | null {
  if (!row) return null;
  return {
    ...row,
    menu_categories: normalizeJsonField<string[]>(row.menu_categories, []),
    business_days: normalizeJsonField<number[]>(row.business_days, []),
  };
}

export class StoreModel {
  static async findByStoreId(storeId: string): Promise<Store | null> {
    const result = await pool.query(
      'SELECT * FROM stores WHERE store_id = $1',
      [storeId]
    );
    return mapStore(result.rows[0]);
  }

  static async findById(id: string): Promise<Store | null> {
    const result = await pool.query(
      'SELECT * FROM stores WHERE id = $1',
      [id]
    );
    return mapStore(result.rows[0]);
  }

  static async create(storeId: string, name: string, passwordHash: string): Promise<Store> {
    const result = await pool.query(
      `INSERT INTO stores (store_id, name, password_hash)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [storeId, name, passwordHash]
    );
    return mapStore(result.rows[0]) as Store;
  }

  static async update(id: string, updates: Partial<Store>): Promise<Store> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }
    if (updates.profile_image_url !== undefined) {
      fields.push(`profile_image_url = $${paramCount++}`);
      values.push(updates.profile_image_url);
    }
    if (updates.menu_categories !== undefined) {
      fields.push(`menu_categories = $${paramCount++}`);
      values.push(JSON.stringify(updates.menu_categories));
    }
    if (updates.business_days !== undefined) {
      fields.push(`business_days = $${paramCount++}`);
      values.push(JSON.stringify(updates.business_days));
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE stores SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return mapStore(result.rows[0]) as Store;
  }
}
















