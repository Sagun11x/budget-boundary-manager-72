import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

export const subscriptionService = {
  async requestSubscription(userId: string, userEmail: string, planType: string) {
    console.log('Requesting subscription:', { userId, userEmail, planType });
    
    try {
      const subscriptionData = {
        userId,
        userEmail,
        planType,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'subscriptions'), subscriptionData);
      console.log('Subscription request created:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating subscription request:', error);
      throw error;
    }
  },

  async checkSubscriptionStatus(userId: string) {
    console.log('Checking subscription status for user:', userId);
    
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDocs(query(
        collection(db, 'users'),
        where('id', '==', userId)
      ));

      if (!userSnap.empty) {
        const userData = userSnap.docs[0].data();
        console.log('User subscription status:', userData.subscriptionStatus);
        return userData.subscriptionStatus === 'pro';
      }
      
      return false;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      throw error;
    }
  }
};