import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { subscriptionService } from "@/services/subscriptionService";

export const useSubscriptionStatus = () => {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

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
        const isProUser = await subscriptionService.checkSubscriptionStatus(user.uid);
        console.log("Is pro user:", isProUser);
        if (isMounted) {
          setIsPro(isProUser);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking subscription status:", error);
        if (isMounted) {
          setIsPro(false);
          setIsLoading(false);
        }
      }
    };

    checkStatus();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return { isPro, isLoading };
};