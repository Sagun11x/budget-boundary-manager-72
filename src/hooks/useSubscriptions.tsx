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
    
    try {
      const firestoreSubs = await firestoreService.getAll(user.uid);
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

  const handleSaveSubscription = async (subscription: Omit<Subscription, 'id' | 'userId'>) => {
    if (!user) return;
    
    try {
      const subscriptionWithUser = { ...subscription, userId: user.uid } as Subscription;
      const id = await firestoreService.add(subscriptionWithUser);
      await loadSubscriptions(); // Reload the list after saving
      toast({
        title: "Success",
        description: "Subscription added successfully",
      });
    } catch (error) {
      console.error('Error saving subscription:', error);
      toast({
        title: "Error",
        description: "Failed to save subscription. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleEditSubscription = async (subscription: Subscription) => {
    try {
      await firestoreService.update(subscription);
      await loadSubscriptions(); // Reload the list after editing
      toast({
        title: "Success",
        description: "Subscription updated successfully",
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    try {
      await firestoreService.delete(id);
      await loadSubscriptions(); // Reload the list after deleting
      toast({
        title: "Success",
        description: "Subscription deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting subscription:', error);
      toast({
        title: "Error",
        description: "Failed to delete subscription. Please try again.",
        variant: "destructive",
      });
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