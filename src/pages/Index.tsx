import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { SubscriptionModal } from "@/components/ui/subscription-modal";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { SearchControls } from "@/components/SearchControls";
import type { Subscription } from "@/types/subscription";
import { indexedDBService } from "@/services/indexedDBService";
import { firestoreService } from "@/services/firestoreService";
import { addMonths, format, isBefore } from "date-fns";

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
        const localSubs = await indexedDBService.getAll();
        setSubscriptions(localSubs);

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

  const calculateAnalytics = () => {
    const today = new Date();
    const monthlySpend = subscriptions.reduce((acc, sub) => acc + sub.cost, 0);
    const yearlySpend = monthlySpend * 12;

    const upcomingRenewals = subscriptions
      .filter(sub => {
        const nextRenewal = addMonths(new Date(sub.purchaseDate), 1);
        return isBefore(nextRenewal, addMonths(today, 1));
      })
      .sort((a, b) => 
        new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()
      );

    const expensiveSubscriptions = [...subscriptions]
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 3);

    return {
      totalSubscriptions: subscriptions.length,
      monthlySpend,
      yearlySpend,
      upcomingRenewals,
      expensiveSubscriptions
    };
  };

  const analytics = calculateAnalytics();

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
          <Button
            variant="link"
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {showAnalytics ? "Hide Analytics" : "Show Analytics"}
          </Button>

          {showAnalytics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">Overview</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Total Subscriptions: <span className="font-medium text-gray-900">{analytics.totalSubscriptions}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Monthly Spend: <span className="font-medium text-gray-900">${analytics.monthlySpend.toFixed(2)}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Yearly Spend: <span className="font-medium text-gray-900">${analytics.yearlySpend.toFixed(2)}</span>
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">Upcoming Renewals</h3>
                <div className="space-y-2">
                  {analytics.upcomingRenewals.map(sub => (
                    <div key={sub.id} className="text-sm">
                      <span className="font-medium">{sub.name}</span>
                      <span className="text-gray-600"> - ${sub.cost.toFixed(2)}</span>
                      <p className="text-xs text-gray-500">
                        Renews: {format(addMonths(new Date(sub.purchaseDate), 1), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  ))}
                  {analytics.upcomingRenewals.length === 0 && (
                    <p className="text-sm text-gray-500">No upcoming renewals in the next month</p>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">Most Expensive</h3>
                <div className="space-y-2">
                  {analytics.expensiveSubscriptions.map(sub => (
                    <div key={sub.id} className="text-sm">
                      <span className="font-medium">{sub.name}</span>
                      <span className="text-gray-600"> - ${sub.cost.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

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
                  onEdit={handleEditSubscription}
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
      </main>
    </div>
  );
};

export default Index;