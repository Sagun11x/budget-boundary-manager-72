import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { Header } from "@/components/Header";
import { SubscriptionContent } from "@/components/SubscriptionContent";
import { SubscriptionActions } from "@/components/SubscriptionActions";
import { Analytics } from "@/components/Analytics";
import { SubscriptionBot } from "@/components/SubscriptionBot";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { user, logout } = useAuth();
  const { isPro } = useSubscriptionStatus();
  const { toast } = useToast();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const {
    subscriptions,
    isLoading,
    loadSubscriptions,
    handleSaveSubscription,
    handleEditSubscription,
    handleDeleteSubscription,
  } = useSubscriptions();

  useEffect(() => {
    if (user) {
      loadSubscriptions();
    }
  }, [user, loadSubscriptions]);

  const onSave = async (subscription: any): Promise<void> => {
    try {
      await handleSaveSubscription(subscription);
      await loadSubscriptions();
    } catch (error) {
      console.error("Save operation failed:", error);
      toast({
        title: "Error",
        description: "Failed to save subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onEdit = async (subscription: any): Promise<void> => {
    try {
      await handleEditSubscription(subscription);
      await loadSubscriptions();
    } catch (error) {
      console.error("Edit operation failed:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onDelete = async (id: string): Promise<void> => {
    try {
      await handleDeleteSubscription(id);
      await loadSubscriptions();
    } catch (error) {
      console.error("Delete operation failed:", error);
      toast({
        title: "Error",
        description: "Failed to delete subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

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

          <SubscriptionContent
            subscriptions={subscriptions}
            isLoading={isLoading}
            isPro={isPro}
            onSave={onSave}
            onEdit={onEdit}
            onDelete={onDelete}
          />

          {isPro && <SubscriptionBot subscriptions={subscriptions} />}
        </div>
      </main>
    </div>
  );
};

export default Index;