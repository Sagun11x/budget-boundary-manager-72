import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { Header } from "@/components/Header";
import { SubscriptionContent } from "@/components/SubscriptionContent";
import { SubscriptionActions } from "@/components/SubscriptionActions";
import { Analytics } from "@/components/Analytics";
import { SubscriptionBot } from "@/components/SubscriptionBot";
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
  const [showInfo, setShowInfo] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [sortBy, setSortBy] = useState("nearest");

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
    <div className="min-h-screen bg-gray-50">
      <Header 
        logout={logout}
        isPro={isPro}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onInfoClick={() => setShowInfo(true)}
        onProClick={() => setShowProModal(true)}
      />
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
            isLoading={isLoading || isOperationInProgress}
            isPro={isPro}
            onSave={onSave}
            onEdit={handleEditSubscription}
            onDelete={handleDeleteSubscription}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {isPro && <SubscriptionBot subscriptions={subscriptions} />}
        </div>
      </main>
    </div>
  );
};

export default Index;