import { useState } from "react";
import { SearchControls } from "@/components/SearchControls";
import { SubscriptionList } from "@/components/SubscriptionList";
import { SubscriptionModal } from "@/components/ui/subscription-modal";
import { SubscriptionEdit } from "@/components/SubscriptionEdit";
import { ProFeatureAlert } from "@/components/ProFeatureAlert";
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
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [showSubscriptionLimitAlert, setShowSubscriptionLimitAlert] = useState(false);
  const [isOperationLoading, setIsOperationLoading] = useState(false);

  const handleAddClick = () => {
    if (!isPro && subscriptions.length >= 5) {
      setShowSubscriptionLimitAlert(true);
    } else {
      setShowModal(true);
    }
  };

  const handleSave = async (subscription: Subscription) => {
    if (isOperationLoading) return;
    setIsOperationLoading(true);
    try {
      await onSave(subscription);
      setShowModal(false);
    } finally {
      setIsOperationLoading(false);
    }
  };

  const handleEdit = async (subscription: Subscription) => {
    if (isOperationLoading) return;
    setIsOperationLoading(true);
    try {
      await onEdit(subscription);
      setEditingSubscription(null);
    } finally {
      setIsOperationLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (isOperationLoading) return;
    setIsOperationLoading(true);
    try {
      await onDelete(id);
    } finally {
      setIsOperationLoading(false);
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
      <SearchControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onAddClick={handleAddClick}
      />

      {(isLoading || isOperationLoading) ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <SubscriptionList
          subscriptions={filteredAndSortedSubscriptions()}
          onEdit={setEditingSubscription}
          onDelete={handleDelete}
        />
      )}

      <SubscriptionModal
        open={showModal}
        onOpenChange={setShowModal}
        onSave={handleSave}
      />

      <SubscriptionEdit
        subscription={editingSubscription}
        open={!!editingSubscription}
        onOpenChange={(open) => !open && setEditingSubscription(null)}
        onSave={handleEdit}
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