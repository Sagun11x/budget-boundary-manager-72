import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Subscription } from '@/types/subscription';

export const firestoreService = {
  async getAll(userId: string): Promise<Subscription[]> {
    const subscriptionsRef = collection(db, 'subscriptions');
    const q = query(subscriptionsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Subscription));
  },

  async add(subscription: Subscription): Promise<string> {
    const docRef = await addDoc(collection(db, 'subscriptions'), subscription);
    return docRef.id;
  },

  async update(subscription: Subscription): Promise<void> {
    const docRef = doc(db, 'subscriptions', subscription.id);
    await updateDoc(docRef, subscription);
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'subscriptions', id);
    await deleteDoc(docRef);
  },
};