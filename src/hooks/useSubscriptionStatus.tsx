import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const useSubscriptionStatus = () => {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!user) {
        setIsPro(false);
        setIsLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setIsPro(userDoc.data()?.subscriptionStatus === "pro");
      } catch (error) {
        console.error("Error checking subscription status:", error);
        setIsPro(false);
      }
      setIsLoading(false);
    };

    checkSubscriptionStatus();
  }, [user]);

  return { isPro, isLoading };
};