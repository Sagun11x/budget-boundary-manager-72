import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { firestoreService } from "@/services/firestoreService";
import { indexedDBService } from "@/services/indexedDBService";
import type { Subscription } from "@/types/subscription";

export const useSubscriptions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSubscriptions = useCallback(async () => {
    if (!user) {
      setSubscriptions([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Loading subscriptions for user:", user.uid);
      const firestoreSubs = await firestoreService.getAll(user.uid);
      console.log("Loaded subscriptions:", firestoreSubs);
      await indexedDBService.sync(firestoreSubs);
      setSubscriptions(firestoreSubs);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      toast({
        title: "Error",
        description: "Failed to load subscriptions. Please try again.",
        variant: "destructive",
      });
      setSubscriptions([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const handleSaveSubscription = async (subscription: Subscription) => {
    if (!user) return;
    
    try {
      console.log("Saving subscription:", subscription);
      const subscriptionWithUser = { ...subscription, userId: user.uid };
      const id = await firestoreService.add(subscriptionWithUser);
      const finalSubscription = { ...subscriptionWithUser, id };
      await indexedDBService.add(finalSubscription);
      toast({
        title: "Success",
        description: "Subscription added successfully",
      });
      return finalSubscription;
    } catch (error) {
      console.error('Error saving subscription:', error);
      throw error;
    }
  };

  const handleEditSubscription = async (subscription: Subscription) => {
    try {
      console.log("Editing subscription:", subscription);
      await firestoreService.update(subscription);
      await indexedDBService.update(subscription);
      toast({
        title: "Success",
        description: "Subscription updated successfully",
      });
      return subscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    try {
      console.log("Deleting subscription:", id);
      await firestoreService.delete(id);
      await indexedDBService.delete(id);
      toast({
        title: "Success",
        description: "Subscription deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw error;
    }
  };

  return {
    subscriptions,
    isLoading,
    loadSubscriptions,
    handleSaveSubscription,
    handleEditSubscription,
    handleDeleteSubscription,
  };
};