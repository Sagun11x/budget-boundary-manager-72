import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { Header } from "@/components/Header";
import { SubscriptionContent } from "@/components/SubscriptionContent";
import { SubscriptionActions } from "@/components/SubscriptionActions";
import { Analytics } from "@/components/Analytics";
import { SubscriptionBot } from "@/components/SubscriptionBot";

const Index = () => {
  const { user, logout } = useAuth();
  const { isPro } = useSubscriptionStatus();
  const {
    subscriptions,
    isLoading,
    loadSubscriptions,
    handleSaveSubscription,
    handleEditSubscription,
    handleDeleteSubscription,
  } = useSubscriptions();
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

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
            onSave={handleSaveSubscription}
            onEdit={handleEditSubscription}
            onDelete={handleDeleteSubscription}
          />

          {isPro && <SubscriptionBot subscriptions={subscriptions} />}
        </div>
      </main>
    </div>
  );
};

export default Index;