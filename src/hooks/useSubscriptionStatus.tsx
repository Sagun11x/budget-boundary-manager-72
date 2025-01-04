import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { subscriptionService } from "@/services/subscriptionService";

export const useSubscriptionStatus = () => {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) {
        setIsPro(false);
        setIsLoading(false);
        return;
      }

      try {
        const isProUser = await subscriptionService.checkSubscriptionStatus(user.uid);
        setIsPro(isProUser);
      } catch (error) {
        console.error("Error checking subscription status:", error);
        setIsPro(false);
      }
      setIsLoading(false);
    };

    checkStatus();
  }, [user]);

  return { isPro, isLoading };
};