import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Plus, Search, BarChart3 } from "lucide-react";
import { SubscriptionModal } from "@/components/ui/subscription-modal";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Subscription } from "@/types/subscription";
import { indexedDBService } from "@/services/indexedDBService";
import { firestoreService } from "@/services/firestoreService";

const Index = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [sortBy, setSortBy] = useState("nearest");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        // First load from IndexedDB for instant display
        const localSubs = await indexedDBService.getAll();
        setSubscriptions(localSubs);

        // Then fetch from Firestore and sync
        if (user) {
          const remoteSubs = await firestoreService.getAll(user.uid);
          setSubscriptions(remoteSubs);
          await indexedDBService.sync(remoteSubs);
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
  }, [user]);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Subscription Manager</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <BarChart3 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showAnalytics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">Total Subscriptions</h3>
              <p className="text-3xl font-bold">{subscriptions.length}</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">Monthly Spend</h3>
              <p className="text-3xl font-bold">
                ${subscriptions.reduce((acc, sub) => acc + sub.cost, 0).toFixed(2)}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">Next Renewal</h3>
              <p className="text-3xl font-bold">-</p>
            </Card>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex w-full sm:max-w-lg gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nearest">Nearest Renewal</SelectItem>
                <SelectItem value="expensive">Most Expensive</SelectItem>
                <SelectItem value="cheapest">Cheapest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Subscription
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getSortedSubscriptions().map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onEdit={handleEditSubscription}
              onDelete={handleDeleteSubscription}
            />
          ))}
        </div>

        <SubscriptionModal
          open={showModal}
          onOpenChange={setShowModal}
          onSave={handleSaveSubscription}
        />
      </main>
    </div>
  );
};

export default Index;