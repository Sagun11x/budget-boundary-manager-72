import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SubscriptionModal } from "@/components/ui/subscription-modal";
import { useToast } from "@/hooks/use-toast";
import { SearchControls } from "@/components/SearchControls";
import type { Subscription } from "@/types/subscription";
import { indexedDBService } from "@/services/indexedDBService";
import { firestoreService } from "@/services/firestoreService";
import { Analytics } from "@/components/Analytics";
import { SubscriptionEdit } from "@/components/SubscriptionEdit";
import { SubscriptionBot } from "@/components/SubscriptionBot";
import { ProPlanModal } from "@/components/ProPlanModal";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { Header } from "@/components/Header";
import { SubscriptionList } from "@/components/SubscriptionList";
import { ProFeatureButton } from "@/components/ProFeatureButton";

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

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        if (user) {
          const localSubs = await indexedDBService.getAll();
          if (localSubs.length > 0) {
            setSubscriptions(localSubs);
          }

          const firestoreSubs = await firestoreService.getAll(user.uid);
          await indexedDBService.sync(firestoreSubs);
          setSubscriptions(firestoreSubs);
        }
      } catch (error) {
        console.error('Error loading subscriptions:', error);
        toast({
          title: "Error",
          description: "Failed to load subscriptions",
          variant: "destructive",
        });
      }
    };

    loadSubscriptions();
  }, [user, toast]);

  const handleSaveSubscription = async (subscription: Subscription) => {
    if (!isPro && subscriptions.length >= 5) {
      toast({
        title: "Subscription Limit Reached",
        description: "Free users can only add up to 5 subscriptions. Upgrade to Pro for unlimited subscriptions!",
        variant: "destructive",
      });
      setShowProModal(true);
      return;
    }

    try {
      if (user) {
        const subscriptionWithUser = { ...subscription, userId: user.uid };
        const id = await firestoreService.add(subscriptionWithUser);
        const finalSubscription = { ...subscriptionWithUser, id };
        await indexedDBService.add(finalSubscription);
        setSubscriptions([...subscriptions, finalSubscription]);
        toast({
          title: "Success",
          description: "Subscription added successfully",
        });
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
      setSubscriptions(subscriptions.map(sub => 
        sub.id === subscription.id ? subscription : sub
      ));
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
      setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
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

  const getSortedSubscriptions = () => {
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header logout={logout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            {isPro ? (
              <Button
                variant="link"
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {showAnalytics ? "Hide Analytics" : "Show Analytics"}
              </Button>
            ) : (
              <ProFeatureButton
                onClick={() => setShowProModal(true)}
                variant="link"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Show Analytics
              </ProFeatureButton>
            )}
            
            {!isPro && (
              <Button
                variant="ghost"
                onClick={() => setShowProModal(true)}
                className="text-sm relative group"
              >
                <span className="relative inline-block animate-pulse">
                  <span className="absolute -inset-1 bg-primary/20 rounded-lg blur-sm group-hover:bg-primary/30 transition-all duration-300"></span>
                  <span className="relative text-primary font-semibold">Go Pro</span>
                </span>
              </Button>
            )}
          </div>

          {isPro && showAnalytics && <Analytics subscriptions={subscriptions} />}

          <div className="space-y-4">
            <SearchControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onAddClick={() => {
                if (!isPro && subscriptions.length >= 5) {
                  toast({
                    title: "Subscription Limit Reached",
                    description: "Free users can only add up to 5 subscriptions. Upgrade to Pro for unlimited subscriptions!",
                    variant: "destructive",
                  });
                  setShowProModal(true);
                } else {
                  setShowModal(true);
                }
              }}
            />

            <SubscriptionList
              subscriptions={getSortedSubscriptions()}
              onEdit={setEditingSubscription}
              onDelete={handleDeleteSubscription}
            />
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

        <ProPlanModal
          open={showProModal}
          onOpenChange={setShowProModal}
        />

        {isPro ? (
          <SubscriptionBot subscriptions={subscriptions} />
        ) : (
          subscriptions.length > 0 && (
            <Button
              onClick={() => {
                toast({
                  title: "AI Assistant is a Pro Feature",
                  description: "Upgrade to Pro to get personalized subscription insights from our AI assistant!",
                  variant: "destructive",
                });
                setShowProModal(true);
              }}
              className="fixed bottom-4 right-4 rounded-full p-4"
              variant="default"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          )
        )}
      </main>
    </div>
  );
};

export default Index;