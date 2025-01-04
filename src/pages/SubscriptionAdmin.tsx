import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SubscriptionCard } from '@/components/admin/SubscriptionCard';
import { toast } from 'sonner';

const firebaseConfig = {
  apiKey: "AIzaSyAY1l9DKJmaUDwliCZN1UgnpBsrzYkYGUY",
  authDomain: "adova-32393.firebaseapp.com",
  databaseURL: "https://adova-32393-default-rtdb.firebaseio.com",
  projectId: "adova-32393",
  storageBucket: "adova-32393.firebasestorage.app",
  messagingSenderId: "671682678254",
  appId: "1:671682678254:web:44dafed613bf19e901d2ff",
  measurementId: "G-LXRC5PJ4LR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const SubscriptionAdmin = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user?.email);
      setUserEmail(user?.email || null);
      if (user) {
        loadSubscriptions();
      } else {
        setSubscriptions([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  const loadSubscriptions = async () => {
    if (!auth.currentUser) {
      console.log('No authenticated user, skipping load');
      return;
    }

    console.log('Loading subscriptions...');
    try {
      const q = query(
        collection(db, 'subscriptions'),
        where('status', '==', 'pending')
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.log('No pending subscriptions found');
        setSubscriptions([]);
        return;
      }

      const subs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Subscriptions loaded:', subs);
      setSubscriptions(subs);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      toast.error('Failed to load subscriptions');
    }
  };

  const handleSubscriptionAction = async (subscriptionId: string, action: 'approved' | 'rejected') => {
    if (!auth.currentUser) {
      toast.error('Please login first');
      return;
    }

    console.log(`Handling subscription action: ${action} for ID: ${subscriptionId}`);
    try {
      const subscriptionRef = doc(db, 'subscriptions', subscriptionId);
      await updateDoc(subscriptionRef, {
        status: action,
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser.email
      });

      // If approved, update user's pro status
      if (action === 'approved') {
        const subscription = subscriptions.find(sub => sub.id === subscriptionId);
        if (subscription?.userId) {
          const userRef = doc(db, 'users', subscription.userId);
          await updateDoc(userRef, {
            isProUser: true,
            proSubscriptionDate: new Date().toISOString()
          });
        }
      }

      console.log(`Subscription ${action} successful`);
      toast.success(`Subscription ${action} successfully`);
      loadSubscriptions();
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('Error updating subscription');
    }
  };

  return (
    <div className="container">
      <AdminHeader userEmail={userEmail} onLogin={handleLogin} />
      <div id="subscriptions-list">
        {subscriptions.length === 0 ? (
          <p>No pending subscriptions</p>
        ) : (
          subscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onApprove={(id) => handleSubscriptionAction(id, 'approved')}
              onReject={(id) => handleSubscriptionAction(id, 'rejected')}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SubscriptionAdmin;