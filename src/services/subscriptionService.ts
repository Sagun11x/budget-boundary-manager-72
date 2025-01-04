import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const subscriptionService = {
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