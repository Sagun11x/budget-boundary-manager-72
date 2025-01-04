import { Package, Edit, Trash2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { differenceInDays, addDays, addMonths, addYears, addWeeks } from "date-fns";
import type { Subscription } from "@/types/subscription";

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit?: (subscription: Subscription) => void;
  onDelete?: (id: string) => void;
}

export const SubscriptionCard = ({
  subscription,
  onEdit,
  onDelete,
}: SubscriptionCardProps) => {
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

  const nextRenewal = calculateNextRenewal(subscription.purchaseDate, subscription.renewalPeriod);
  const daysLeft = differenceInDays(nextRenewal, new Date());
  const cost = Number(subscription.cost) || 0;

  const getDaysLeftColor = (days: number) => {
    if (days <= 3) return "text-red-500";
    if (days <= 7) return "text-orange-500";
    return "text-green-500";
  };

  const getDaysLeftText = (days: number) => {
    if (days === 0) return "Expired";
    return `${days} days left`;
  };

  return (
    <Card className="p-4 relative group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {subscription.logo ? (
            <img 
              src={subscription.logo} 
              alt={`${subscription.name} logo`}
              className="h-10 w-10 object-contain rounded-lg bg-gray-100 p-2"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
                e.currentTarget.onerror = null;
              }}
            />
          ) : (
            <Package className="h-10 w-10 p-2 bg-gray-100 rounded-lg text-gray-600" />
          )}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{subscription.name}</h3>
              <span className="text-gray-600">- ${cost.toFixed(2)}</span>
            </div>
            <p className={`text-sm ${getDaysLeftColor(daysLeft)}`}>
              {getDaysLeftText(daysLeft)}
            </p>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(subscription)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(subscription.id)}
              className="h-8 w-8 text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
