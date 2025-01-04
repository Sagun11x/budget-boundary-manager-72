import { SubscriptionCard } from "@/components/SubscriptionCard";
import type { Subscription } from "@/types/subscription";

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onEdit?: (subscription: Subscription) => void;
  onDelete?: (id: string) => void;
}

export const SubscriptionList = ({ 
  subscriptions,
  onEdit,
  onDelete,
}: SubscriptionListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subscriptions.map((subscription) => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};