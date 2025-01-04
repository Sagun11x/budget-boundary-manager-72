import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { Header } from "@/components/Header";
import { SubscriptionContent } from "@/components/SubscriptionContent";
import { SubscriptionActions } from "@/components/SubscriptionActions";
import { Analytics } from "@/components/Analytics";
import { SubscriptionBot } from "@/components/SubscriptionBot";
import { Footer } from "@/components/Footer";
import type { Subscription } from "@/types/subscription";

const Index = () => {
  const { user, logout } = useAuth();
  const { isPro } = useSubscriptionStatus();
  const {
    subscriptions,
    isLoading,
    isOperationInProgress,
    loadSubscriptions,
    handleSaveSubscription,
    handleEditSubscription,
    handleDeleteSubscription,
  } = useSubscriptions();
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    if (user) {
      loadSubscriptions();
    }
  }, [user, loadSubscriptions]);

  const onSave = async (subscription: Subscription): Promise<void> => {
    const { id, userId, ...subscriptionData } = subscription;
    await handleSaveSubscription(subscriptionData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header logout={logout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
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
            isLoading={isLoading || isOperationInProgress}
            isPro={isPro}
            onSave={onSave}
            onEdit={handleEditSubscription}
            onDelete={handleDeleteSubscription}
          />

          {isPro && <SubscriptionBot subscriptions={subscriptions} />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;