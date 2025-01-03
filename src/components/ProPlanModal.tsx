import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ProPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProPlanModal({ open, onOpenChange }: ProPlanModalProps) {
  const { toast } = useToast();
  const [isLifetime, setIsLifetime] = useState(false);

  const handlePurchase = () => {
    toast({
      title: "Coming Soon",
      description: "Payment integration will be available soon!",
    });
    onOpenChange(false);
  };

  const features = [
    "Unlimited Listing",
    "Priority Support",
    "Advanced Analytics"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Go Pro
          </DialogTitle>
        </DialogHeader>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm">6 Months</span>
            <Switch
              checked={isLifetime}
              onCheckedChange={setIsLifetime}
            />
            <span className="text-sm">Lifetime</span>
          </div>

          <div className="text-center mb-6">
            <p className="text-3xl font-bold">
              {isLifetime ? "$49" : "$29"}
            </p>
            <p className="text-sm text-gray-500">
              {isLifetime ? "One-time payment" : "Every 6 months"}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <Button 
            className="w-full"
            onClick={handlePurchase}
          >
            Choose Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}