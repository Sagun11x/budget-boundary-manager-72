import { Package } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import { differenceInDays } from "date-fns";
import type { Subscription } from "@/types/subscription";

interface SubscriptionCardProps {
  subscription: Subscription;
  onDelete?: (id: string) => void;
  onEdit?: (subscription: Subscription) => void;
}

export const SubscriptionCard = ({
  subscription,
  onDelete,
  onEdit,
}: SubscriptionCardProps) => {
  const daysLeft = differenceInDays(
    new Date(subscription.purchaseDate),
    new Date()
  );

  return (
    <Card className="p-4 relative group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Package className="h-6 w-6 text-gray-600" />
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{subscription.name}</h3>
              <span className="text-gray-600">- ${subscription.cost.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500">{Math.abs(daysLeft)} days left</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onEdit?.(subscription)}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};