import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";

interface PendingSubscription {
  id: string;
  userId: string;
  userEmail: string;
  planType: "6-month" | "lifetime";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  cost: number;
}

const SubscriptionAdmin = () => {
  const { user } = useAuth();
  const [pendingSubscriptions, setPendingSubscriptions] = useState<PendingSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded admin emails - in a real app, this should be in a secure configuration
  const adminEmails = ["admin@example.com"];

  useEffect(() => {
    const fetchPendingSubscriptions = async () => {
      if (!user || !adminEmails.includes(user.email || "")) {
        toast.error("Unauthorized access");
        return;
      }

      try {
        const q = query(
          collection(db, "subscriptions"),
          where("status", "==", "pending")
        );
        const querySnapshot = await getDocs(q);
        const subscriptions: PendingSubscription[] = [];
        
        querySnapshot.forEach((doc) => {
          subscriptions.push({ id: doc.id, ...doc.data() } as PendingSubscription);
        });

        setPendingSubscriptions(subscriptions);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        toast.error("Failed to load pending subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingSubscriptions();
  }, [user]);

  const handleSubscriptionAction = async (subscriptionId: string, action: "approved" | "rejected") => {
    try {
      const subscriptionRef = doc(db, "subscriptions", subscriptionId);
      await updateDoc(subscriptionRef, {
        status: action,
        updatedAt: new Date().toISOString(),
        approvedBy: user?.email,
      });

      setPendingSubscriptions(prevSubs => 
        prevSubs.filter(sub => sub.id !== subscriptionId)
      );

      toast.success(`Subscription ${action} successfully`);
    } catch (error) {
      console.error(`Error ${action} subscription:`, error);
      toast.error(`Failed to ${action} subscription`);
    }
  };

  if (!user || !adminEmails.includes(user.email || "")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6">
          <h1 className="text-xl font-semibold text-red-600">Unauthorized Access</h1>
          <p className="text-gray-600 mt-2">You don't have permission to view this page.</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading subscriptions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Subscription Admin Panel</h1>
        
        {pendingSubscriptions.length === 0 ? (
          <Card className="p-6">
            <p className="text-gray-600">No pending subscriptions to review.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingSubscriptions.map((subscription) => (
              <Card key={subscription.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg">{subscription.userEmail}</h2>
                    <p className="text-sm text-gray-500">Plan: {subscription.planType}</p>
                    <p className="text-sm text-gray-500">
                      Cost: ${subscription.cost}
                    </p>
                    <p className="text-sm text-gray-500">
                      Requested: {format(new Date(subscription.createdAt), 'PPp')}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="default"
                      onClick={() => handleSubscriptionAction(subscription.id, "approved")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleSubscriptionAction(subscription.id, "rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionAdmin;