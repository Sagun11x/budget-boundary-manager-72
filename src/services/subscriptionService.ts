import { db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";

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

  async checkSubscriptionStatus(userId: string): Promise<boolean> {
    try {
      console.log("Checking subscription status for user:", userId);
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (!userDoc.exists()) {
        console.log("User document not found");
        return false;
      }

      const userData = userDoc.data();
      console.log("User subscription data:", userData);

      // Check specifically for isProUser being true and status being "done"
      return userData.isProUser === true && userData.subscriptionStatus === "done";
    } catch (error) {
      console.error("Error checking subscription status:", error);
      return false;
    }
  },
};