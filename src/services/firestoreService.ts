import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Subscription } from '@/types/subscription';

// Helper function to convert Subscription to a plain object
const toFirestoreData = (subscription: Subscription): Record<string, any> => {
  const { id, ...data } = subscription;
  return {
    name: data.name,
    logo: data.logo || null,
    cost: data.cost,
    purchaseDate: data.purchaseDate,
    renewalPeriod: {
      number: data.renewalPeriod.number,
      unit: data.renewalPeriod.unit
    },
    description: data.description || null,
    userId: data.userId
  };
};

export const firestoreService = {
  async getAll(userId: string): Promise<Subscription[]> {
    const subscriptionsRef = collection(db, 'subscriptions');
    const q = query(subscriptionsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Subscription));
  },

  async add(subscription: Subscription): Promise<string> {
    const docRef = await addDoc(collection(db, 'subscriptions'), toFirestoreData(subscription));
    return docRef.id;
  },

  async update(subscription: Subscription): Promise<void> {
    const docRef = doc(db, 'subscriptions', subscription.id);
    await updateDoc(docRef, toFirestoreData(subscription));
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'subscriptions', id);
    await deleteDoc(docRef);
  },
};