import { useState } from "react";
import { SearchControls } from "@/components/SearchControls";
import { SubscriptionList } from "@/components/SubscriptionList";
import { SubscriptionModal } from "@/components/ui/subscription-modal";
import { SubscriptionEdit } from "@/components/SubscriptionEdit";
import { ProFeatureAlert } from "@/components/ProFeatureAlert";
import { addDays, addMonths, addWeeks, addYears } from "date-fns";
import type { Subscription } from "@/types/subscription";

interface SubscriptionContentProps {
  subscriptions: Subscription[];
  isLoading: boolean;
  isPro: boolean;
  onSave: (subscription: Subscription) => Promise<void>;
  onEdit: (subscription: Subscription) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  sortBy: string;
  setSortBy: (value: string) => void;
}

export const SubscriptionContent = ({
  subscriptions,
  isLoading,
  isPro,
  onSave,
  onEdit,
  onDelete,
  sortBy,
  setSortBy,
}: SubscriptionContentProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
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

  const calculateNextRenewal = (subscription: Subscription) => {
    const startDate = new Date(subscription.purchaseDate);
    const today = new Date();
    let nextRenewal = startDate;

    while (nextRenewal <= today) {
      switch (subscription.renewalPeriod.unit) {
        case "days":
          nextRenewal = addDays(nextRenewal, subscription.renewalPeriod.number);
          break;
        case "weeks":
          nextRenewal = addWeeks(nextRenewal, subscription.renewalPeriod.number);
          break;
        case "months":
          nextRenewal = addMonths(nextRenewal, subscription.renewalPeriod.number);
          break;
        case "years":
          nextRenewal = addYears(nextRenewal, subscription.renewalPeriod.number);
          break;
      }
    }

    return nextRenewal;
  };

  const getSortedSubscriptions = () => {
    return [...subscriptions].sort((a, b) => {
      switch (sortBy) {
        case "nearest":
          const aNextRenewal = calculateNextRenewal(a);
          const bNextRenewal = calculateNextRenewal(b);
          return aNextRenewal.getTime() - bNextRenewal.getTime();
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
    if (!searchTerm) return sorted;
    return sorted.filter(sub => 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="space-y-6">
      <div className="md:block hidden">
        <SearchControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onAddClick={handleAddClick}
          onSave={onSave}
        />
      </div>
      <div className="md:hidden">
        <SearchControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={() => {}}
          onAddClick={handleAddClick}
          onSave={onSave}
          hideSortBy
        />
      </div>

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
        isPro={isPro}
      />

      <SubscriptionEdit
        subscription={editingSubscription}
        open={!!editingSubscription}
        onOpenChange={(open) => !open && setEditingSubscription(null)}
        onSave={handleEditSave}
        isPro={isPro}
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