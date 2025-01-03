import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { SubscriptionModal } from "@/components/ui/subscription-modal";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { useToast } from "@/components/ui/use-toast";
import { SearchControls } from "@/components/SearchControls";
import type { Subscription } from "@/types/subscription";
import { indexedDBService } from "@/services/indexedDBService";
import { firestoreService } from "@/services/firestoreService";
import { Analytics } from "@/components/Analytics";
import { SubscriptionEdit } from "@/components/SubscriptionEdit";
import { SubscriptionBot } from "@/components/SubscriptionBot";
import { ProPlanModal } from "@/components/ProPlanModal";

const Index = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [sortBy, setSortBy] = useState("nearest");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  // Load subscriptions on mount
  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        if (user) {
          // First try to load from IndexedDB for instant display
          const localSubs = await indexedDBService.getAll();
          if (localSubs.length > 0) {
            setSubscriptions(localSubs);
          }

          // Then fetch from Firestore and sync
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
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Subscription Manager</h1>
          <Button variant="ghost" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button
              variant="link"
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {showAnalytics ? "Hide Analytics" : "Show Analytics"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowProModal(true)}
              className="text-sm"
            >
              Go Pro 🚀
            </Button>
          </div>

          {showAnalytics && <Analytics subscriptions={subscriptions} />}

          <div className="space-y-4">
            <SearchControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onAddClick={() => setShowModal(true)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getSortedSubscriptions().map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onEdit={() => setEditingSubscription(subscription)}
                  onDelete={handleDeleteSubscription}
                />
              ))}
            </div>
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

        <SubscriptionBot subscriptions={subscriptions} />
      </main>
    </div>
  );
};

export default Index;