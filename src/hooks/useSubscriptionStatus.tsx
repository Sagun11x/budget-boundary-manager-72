import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useSubscriptionStatus = () => {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let retryTimeout: NodeJS.Timeout;

    const checkStatus = async () => {
      if (!user) {
        console.log("No user found, setting isPro to false");
        if (isMounted) {
          setIsPro(false);
          setIsLoading(false);
        }
        return;
      }

      try {
        console.log("Checking subscription status for user:", user.uid);
        // Get user document directly from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (!userDoc.exists()) {
          console.log("User document not found");
          if (isMounted) {
            setIsPro(false);
            setIsLoading(false);
          }
          return;
        }

        const userData = userDoc.data();
        console.log("User subscription data:", userData);

        // Check if user is pro based on isProUser flag and subscription status
        const isProUser = userData.isProUser === true && userData.subscriptionStatus === "pro";
        console.log("Is pro user:", isProUser);

        if (isMounted) {
          setIsPro(isProUser);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking subscription status:", error);
        if (isMounted) {
          // Retry after 3 seconds on error
          retryTimeout = setTimeout(checkStatus, 3000);
          setIsPro(false);
          setIsLoading(false);
        }
      }
    };

    checkStatus();

    return () => {
      isMounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [user]);

  return { isPro, isLoading };
};