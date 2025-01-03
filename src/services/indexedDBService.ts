import { openDB } from 'idb';
import type { Subscription } from '@/types/subscription';

const DB_NAME = 'subscriptionDB';
const STORE_NAME = 'subscriptions';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
  },
});

export const indexedDBService = {
  async getAll(): Promise<Subscription[]> {
    const db = await dbPromise;
    return db.getAll(STORE_NAME);
  },

  async add(subscription: Subscription): Promise<void> {
    const db = await dbPromise;
    await db.add(STORE_NAME, subscription);
  },

  async update(subscription: Subscription): Promise<void> {
    const db = await dbPromise;
    await db.put(STORE_NAME, subscription);
  },

  async delete(id: string): Promise<void> {
    const db = await dbPromise;
    await db.delete(STORE_NAME, id);
  },

  async sync(subscriptions: Subscription[]): Promise<void> {
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await Promise.all([
      ...subscriptions.map(sub => tx.store.put(sub)),
      tx.done,
    ]);
  },
};