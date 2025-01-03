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
    userId: data.userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const firestoreService = {
  async getAll(userId: string): Promise<Subscription[]> {
    try {
      const subscriptionsRef = collection(db, 'subscriptions');
      const q = query(subscriptionsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Subscription));
    } catch (error) {
      console.error('Firestore getAll error:', error);
      throw error;
    }
  },

  async add(subscription: Subscription): Promise<string> {
    try {
      if (!subscription.userId) {
        throw new Error('User ID is required');
      }
      const docRef = await addDoc(collection(db, 'subscriptions'), toFirestoreData(subscription));
      return docRef.id;
    } catch (error) {
      console.error('Firestore add error:', error);
      throw error;
    }
  },

  async update(subscription: Subscription): Promise<void> {
    try {
      if (!subscription.userId) {
        throw new Error('User ID is required');
      }
      const docRef = doc(db, 'subscriptions', subscription.id);
      const updateData = {
        ...toFirestoreData(subscription),
        updatedAt: new Date().toISOString()
      };
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Firestore update error:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'subscriptions', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Firestore delete error:', error);
      throw error;
    }
  },
};