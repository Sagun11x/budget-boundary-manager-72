import { Button } from "@/components/ui/button";
import { Subscription } from "@/types/subscription";
import { useEffect, useState } from "react";

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
      const renewalDate = new Date(subscription.renewalDate);
      const timeDiff = renewalDate.getTime() - now.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDaysLeft(daysDiff);
    };

    calculateDaysLeft();
  }, [subscription.renewalDate]);

  const getDaysLeftColor = (days: number) => {
    if (days <= 0) return "text-red-500";
    if (days <= 3) return "text-red-500";
    if (days <= 7) return "text-orange-500";
    return "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text";
  };

  const getDaysLeftText = (days: number) => {
    if (days === 0) return "Expired";
    return `${days} days left`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-lg font-bold">{subscription.name}</h2>
      <p className="text-gray-600">Cost: ${subscription.cost}</p>
      <p className={`font-semibold ${getDaysLeftColor(daysLeft)}`}>
        {getDaysLeftText(daysLeft)}
      </p>
      <div className="flex justify-between mt-4">
        <Button onClick={() => onEdit(subscription)}>Edit</Button>
        <Button variant="destructive" onClick={() => onDelete(subscription.id)}>Delete</Button>
      </div>
    </div>
  );
}
