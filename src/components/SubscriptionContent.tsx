import { useState } from "react";
import { SearchControls } from "@/components/SearchControls";
import { SubscriptionList } from "@/components/SubscriptionList";
import { SubscriptionModal } from "@/components/ui/subscription-modal";
import { SubscriptionEdit } from "@/components/SubscriptionEdit";
import { ProFeatureAlert } from "@/components/ProFeatureAlert";
import { addDays, addMonths, addWeeks, addYears, isBefore } from "date-fns";
import type { Subscription } from "@/types/subscription";

interface SubscriptionContentProps {
  subscriptions: Subscription[];
  isLoading: boolean;
  isPro: boolean;
  onSave: (subscription: Subscription) => Promise<void>;
  onEdit: (subscription: Subscription) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const SubscriptionContent = ({
  subscriptions,
  isLoading,
  isPro,
  onSave,
  onEdit,
  onDelete,
}: SubscriptionContentProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState("nearest");
  const [showSubscriptionLimitAlert, setShowSubscriptionLimitAlert] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  const handleAddClick = () => {
    if (!isPro && subscriptions.length >= 5) {
      setShowSubscriptionLimitAlert(true);
    } else {
      setShowModal(true);
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
  };

  const handleEditSave = async (subscription: Subscription) => {
    await onEdit(subscription);
    setEditingSubscription(null);
  };

  const calculateNextRenewal = (purchaseDate: string, renewalPeriod: { number: number; unit: string }) => {
    const startDate = new Date(purchaseDate);
    const today = new Date();
    let nextRenewal = startDate;

    while (nextRenewal <= today) {
      switch (renewalPeriod.unit) {
        case "days":
          nextRenewal = addDays(nextRenewal, renewalPeriod.number);
          break;
        case "weeks":
          nextRenewal = addWeeks(nextRenewal, renewalPeriod.number);
          break;
        case "months":
          nextRenewal = addMonths(nextRenewal, renewalPeriod.number);
          break;
        case "years":
          nextRenewal = addYears(nextRenewal, renewalPeriod.number);
          break;
      }
    }

    return nextRenewal;
  };

  const isSubscriptionExpired = (subscription: Subscription) => {
    const nextRenewal = calculateNextRenewal(subscription.purchaseDate, subscription.renewalPeriod);
    return isBefore(nextRenewal, new Date());
  };

  const getSortedSubscriptions = () => {
    return [...subscriptions].sort((a, b) => {
      if (sortBy === "expired") {
        const aExpired = isSubscriptionExpired(a);
        const bExpired = isSubscriptionExpired(b);
        if (aExpired && !bExpired) return -1;
        if (!aExpired && bExpired) return 1;
        return 0;
      }

      switch (sortBy) {
        case "nearest": {
          const aNextRenewal = calculateNextRenewal(a.purchaseDate, a.renewalPeriod);
          const bNextRenewal = calculateNextRenewal(b.purchaseDate, b.renewalPeriod);
          return aNextRenewal.getTime() - bNextRenewal.getTime();
        }
        case "expensive":
          return (Number(b.cost) || 0) - (Number(a.cost) || 0);
        case "cheapest":
          return (Number(a.cost) || 0) - (Number(b.cost) || 0);
        default:
          return 0;
      }
    });
  };

  const filteredAndSortedSubscriptions = () => {
    const sorted = getSortedSubscriptions();
    if (!searchTerm) {
      if (sortBy === "expired") {
        return sorted.filter(sub => isSubscriptionExpired(sub));
      }
      return sorted;
    }
    const filtered = sorted.filter(sub => 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortBy === "expired") {
      return filtered.filter(sub => isSubscriptionExpired(sub));
    }
    return filtered;
  };

  return (
    <div className="space-y-6">
      <SearchControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onAddClick={handleAddClick}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <SubscriptionList
          subscriptions={filteredAndSortedSubscriptions()}
          onEdit={handleEdit}
          onDelete={onDelete}
        />
      )}

      <SubscriptionModal
        open={showModal}
        onOpenChange={setShowModal}
        onSave={onSave}
      />

      <SubscriptionEdit
        subscription={editingSubscription}
        open={!!editingSubscription}
        onOpenChange={(open) => !open && setEditingSubscription(null)}
        onSave={handleEditSave}
      />

      <ProFeatureAlert
        open={showSubscriptionLimitAlert}
        onOpenChange={setShowSubscriptionLimitAlert}
        title="Subscription Limit Reached"
        description="Free users can only add up to 5 subscriptions. Upgrade to Pro for unlimited subscriptions!"
      />
    </div>
  );
};