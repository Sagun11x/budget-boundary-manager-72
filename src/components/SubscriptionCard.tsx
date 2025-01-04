import { Package } from "lucide-react";
import { Card } from "./ui/card";
import { differenceInDays, addDays, addMonths, addYears, addWeeks } from "date-fns";
import type { Subscription } from "@/types/subscription";

interface SubscriptionCardProps {
  subscription: Subscription;
  disabled?: boolean;
}

export const SubscriptionCard = ({
  subscription,
  disabled = false,
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

  return (
    <Card className="p-4 relative">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            {subscription.logo ? (
              <img 
                src={subscription.logo} 
                alt={`${subscription.name} logo`}
                className="h-6 w-6 object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                  e.currentTarget.onerror = null;
                }}
              />
            ) : (
              <Package className="h-6 w-6 text-gray-600" />
            )}
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{subscription.name}</h3>
              <span className="text-gray-600">- ${cost.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500">{daysLeft} days left</p>
          </div>
        </div>
      </div>
    </Card>
  );
};