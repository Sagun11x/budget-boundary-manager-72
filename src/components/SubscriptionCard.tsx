import { Button } from "@/components/ui/button";
import { Subscription } from "@/types/subscription";
import { useEffect, useState } from "react";
import { addDays, addMonths, addWeeks, addYears } from "date-fns";

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export function SubscriptionCard({
  subscription,
  onEdit,
  onDelete
}: SubscriptionCardProps) {
  const [daysLeft, setDaysLeft] = useState<number>(0);

  useEffect(() => {
    const calculateDaysLeft = () => {
      const now = new Date();
      const purchaseDate = new Date(subscription.purchaseDate);
      
      // Calculate renewal date based on renewal period
      let renewalDate = purchaseDate;
      switch (subscription.renewalPeriod.unit) {
        case "days":
          renewalDate = addDays(purchaseDate, subscription.renewalPeriod.number);
          break;
        case "weeks":
          renewalDate = addWeeks(purchaseDate, subscription.renewalPeriod.number);
          break;
        case "months":
          renewalDate = addMonths(purchaseDate, subscription.renewalPeriod.number);
          break;
        case "years":
          renewalDate = addYears(purchaseDate, subscription.renewalPeriod.number);
          break;
      }

      const timeDiff = renewalDate.getTime() - now.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDaysLeft(daysDiff);
    };

    calculateDaysLeft();
  }, [subscription.purchaseDate, subscription.renewalPeriod]);

  const getDaysLeftColor = (days: number) => {
    if (days <= 0) return "text-red-500";
    if (days <= 3) return "text-red-500";
    if (days <= 7) return "text-orange-500";
    return "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text";
  };

  const getDaysLeftText = (days: number) => {
    if (days <= 0) return "Expired";
    return `${days} days left`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 group">
      <h2 className="text-lg font-bold">{subscription.name}</h2>
      <p className="text-gray-600">Cost: ${subscription.cost}</p>
      <p className={`font-semibold ${getDaysLeftColor(daysLeft)}`}>
        {getDaysLeftText(daysLeft)}
      </p>
      <div className="flex justify-between mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button onClick={() => onEdit(subscription)}>Edit</Button>
        <Button variant="destructive" onClick={() => onDelete(subscription.id)}>Delete</Button>
      </div>
    </div>
  );
}