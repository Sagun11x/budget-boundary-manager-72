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
  const [isOperationInProgress, setIsOperationInProgress] = useState(false);

  const loadSubscriptions = useCallback(async () => {
    if (!user) {
      setSubscriptions([]);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
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
    if (!user || isOperationInProgress) return;
    
    setIsOperationInProgress(true);
    try {
      const subscriptionWithUser = { 
        ...subscription, 
        userId: user.uid,
        cost: Number(subscription.cost) || 0
      } as Subscription;
      
      await firestoreService.add(subscriptionWithUser);
      await loadSubscriptions();
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
    } finally {
      setIsOperationInProgress(false);
    }
  };

  const handleEditSubscription = async (subscription: Subscription) => {
    if (isOperationInProgress) return;
    
    setIsOperationInProgress(true);
    try {
      const updatedSubscription = {
        ...subscription,
        cost: Number(subscription.cost) || 0
      };
      await firestoreService.update(updatedSubscription);
      await loadSubscriptions();
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
    } finally {
      setIsOperationInProgress(false);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (isOperationInProgress) return;
    
    setIsOperationInProgress(true);
    try {
      await firestoreService.delete(id);
      await loadSubscriptions();
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
    } finally {
      setIsOperationInProgress(false);
    }
  };

  return {
    subscriptions,
    isLoading,
    isOperationInProgress,
    loadSubscriptions,
    handleSaveSubscription,
    handleEditSubscription,
    handleDeleteSubscription,
  };
};