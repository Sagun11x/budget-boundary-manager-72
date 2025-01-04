import { MoreVertical, Package } from "lucide-react";
import { Card } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { differenceInDays, addDays, addMonths, addYears, addWeeks } from "date-fns";
import type { Subscription } from "@/types/subscription";
import { useState } from "react";

interface SubscriptionCardProps {
  subscription: Subscription;
  onDelete?: (id: string) => void;
  onEdit?: (subscription: Subscription) => void;
  disabled?: boolean;
}

export const SubscriptionCard = ({
  subscription,
  onDelete,
  onEdit,
  disabled = false,
}: SubscriptionCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
    <>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                disabled={disabled}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => onEdit?.(subscription)}
                disabled={disabled}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600"
                onClick={() => setShowDeleteDialog(true)}
                disabled={disabled}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the subscription for {subscription.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete?.(subscription.id);
                setShowDeleteDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={disabled}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};