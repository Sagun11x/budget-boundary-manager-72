import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { collection, query, getDocs, updateDoc, doc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";

const SubscriptionAdmin = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const q = query(collection(db, "subscriptions"));
      const querySnapshot = await getDocs(q);
      const subs = [];
      querySnapshot.forEach((doc) => {
        subs.push({ id: doc.id, ...doc.data() });
      });
      setSubscriptions(subs);
      console.log("Fetched subscriptions:", subs);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSubscription = async (userEmail) => {
    try {
      console.log("Approving subscription for:", userEmail);
      // Find user document by email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        toast.error("User not found");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      
      // Update user document with pro status
      await updateDoc(doc(db, "users", userDoc.id), {
        isProUser: true,
        subscriptionStatus: "pro",
        updatedAt: new Date().toISOString()
      });

      toast.success("User subscription approved");
      fetchSubscriptions(); // Refresh the list
    } catch (error) {
      console.error("Error approving subscription:", error);
      toast.error("Failed to approve subscription");
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Subscription Admin</h1>
        
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Approve User Subscription</h2>
          <div className="flex gap-4">
            <Input
              placeholder="Enter user email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="max-w-md"
            />
            <Button 
              onClick={() => handleApproveSubscription(userEmail)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Approve Subscription
            </Button>
          </div>
        </Card>

        <div className="grid gap-4">
          {subscriptions.map((subscription) => (
            <Card key={subscription.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-lg">{subscription.userEmail}</h2>
                  <p className="text-sm text-gray-500">Status: {subscription.subscriptionStatus || "pending"}</p>
                  {subscription.updatedAt && (
                    <p className="text-sm text-gray-500">
                      Last Updated: {format(new Date(subscription.updatedAt), 'PPp')}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionAdmin;