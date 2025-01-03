import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Plus, Search, BarChart3 } from "lucide-react";
import { SubscriptionModal } from "@/components/ui/subscription-modal";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { Card } from "@/components/ui/card";
import type { Subscription } from "@/types/subscription";

const Index = () => {
  const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const handleSaveSubscription = (subscription: Subscription) => {
    setSubscriptions([...subscriptions, subscription]);
    setShowModal(false);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    // Implement edit functionality
    console.log("Edit subscription:", subscription);
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-4 ml-4">
            <Button variant="outline">Sort by Renewal Date</Button>
            <Button variant="outline">Sort by Type</Button>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subscription
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {subscriptions.map((subscription) => (
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