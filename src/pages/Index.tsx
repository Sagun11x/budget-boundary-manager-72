import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { SearchControls } from "@/components/SearchControls";
import { indexedDBService } from "@/services/indexedDBService";
import { firestoreService } from "@/services/firestoreService";
import { Analytics } from "@/components/Analytics";
import { SubscriptionEdit } from "@/components/SubscriptionEdit";
import { SubscriptionBot } from "@/components/SubscriptionBot";
import { ProPlanModal } from "@/components/ProPlanModal";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { Header } from "@/components/Header";
import { SubscriptionList } from "@/components/SubscriptionList";
import { SubscriptionModal } from "@/components/ui/subscription-modal";
import { SubscriptionActions } from "@/components/SubscriptionActions";
import { ProFeatureAlert } from "@/components/ProFeatureAlert";
import type { Subscription } from "@/types/subscription";

const Index = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { isPro } = useSubscriptionStatus();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [sortBy, setSortBy] = useState("nearest");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [showSubscriptionLimitAlert, setShowSubscriptionLimitAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadSubscriptions = useCallback(async () => {
    if (!user) return;
    
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
        description: "Failed to load subscriptions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const handleSaveSubscription = async (subscription: Subscription) => {
    if (!isPro && subscriptions.length >= 5) {
      setShowSubscriptionLimitAlert(true);
      return;
    }

    try {
      if (user) {
        const subscriptionWithUser = { ...subscription, userId: user.uid };
        const id = await firestoreService.add(subscriptionWithUser);
        const finalSubscription = { ...subscriptionWithUser, id };
        await indexedDBService.add(finalSubscription);
        setSubscriptions(prev => [...prev, finalSubscription]);
        toast({
          title: "Success",
          description: "Subscription added successfully",
        });
        await loadSubscriptions(); // Reload to ensure consistency
      }
    } catch (error) {
      console.error('Error saving subscription:', error);
      toast({
        title: "Error",
        description: "Failed to save subscription",
        variant: "destructive",
      });
    }
    setShowModal(false);
  };

  const handleEditSubscription = async (subscription: Subscription) => {
    try {
      await firestoreService.update(subscription);
      await indexedDBService.update(subscription);
      await loadSubscriptions(); // Reload to ensure consistency
      toast({
        title: "Success",
        description: "Subscription updated successfully",
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
    }
    setEditingSubscription(null);
  };

  const handleDeleteSubscription = async (id: string) => {
    try {
      await firestoreService.delete(id);
      await indexedDBService.delete(id);
      await loadSubscriptions(); // Reload to ensure consistency
      toast({
        title: "Success",
        description: "Subscription deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting subscription:', error);
      toast({
        title: "Error",
        description: "Failed to delete subscription",
        variant: "destructive",
      });
    }
  };

  const getSortedSubscriptions = useCallback(() => {
    return [...subscriptions].sort((a, b) => {
      switch (sortBy) {
        case "nearest":
          const aNextRenewal = new Date(a.purchaseDate);
          const bNextRenewal = new Date(b.purchaseDate);
          return aNextRenewal.getTime() - bNextRenewal.getTime();
        case "expensive":
          return b.cost - a.cost;
        case "cheapest":
          return a.cost - b.cost;
        default:
          return 0;
      }
    });
  }, [subscriptions, sortBy]);

  const filteredAndSortedSubscriptions = useCallback(() => {
    const sorted = getSortedSubscriptions();
    if (!searchTerm) return sorted;
    return sorted.filter(sub => 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [getSortedSubscriptions, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header logout={logout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <SubscriptionActions
            isPro={isPro}
            subscriptions={subscriptions}
            showAnalytics={showAnalytics}
            setShowAnalytics={setShowAnalytics}
          />

          {isPro && showAnalytics && <Analytics subscriptions={subscriptions} />}

          <div className="space-y-4">
            <SearchControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onAddClick={() => {
                if (!isPro && subscriptions.length >= 5) {
                  setShowSubscriptionLimitAlert(true);
                } else {
                  setShowModal(true);
                }
              }}
            />

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <SubscriptionList
                subscriptions={filteredAndSortedSubscriptions()}
                onEdit={setEditingSubscription}
                onDelete={handleDeleteSubscription}
              />
            )}
          </div>
        </div>

        <SubscriptionModal
          open={showModal}
          onOpenChange={setShowModal}
          onSave={handleSaveSubscription}
        />

        <SubscriptionEdit
          subscription={editingSubscription}
          open={!!editingSubscription}
          onOpenChange={(open) => !open && setEditingSubscription(null)}
          onSave={handleEditSubscription}
        />

        <ProFeatureAlert
          open={showSubscriptionLimitAlert}
          onOpenChange={setShowSubscriptionLimitAlert}
          title="Subscription Limit Reached"
          description="Free users can only add up to 5 subscriptions. Upgrade to Pro for unlimited subscriptions!"
        />

        {isPro && <SubscriptionBot subscriptions={subscriptions} />}
      </main>
    </div>
  );
};

export default Index;