import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ProPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProPlanModal({ open, onOpenChange }: ProPlanModalProps) {
  const { toast } = useToast();

  const handlePurchase = (plan: "sixMonth" | "lifetime") => {
    toast({
      title: "Coming Soon",
      description: "Payment integration will be available soon!",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Go Pro
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold mb-2">6 Months Plan</h3>
            <p className="text-3xl font-bold mb-4">$29</p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Advanced Analytics
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Priority Support
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Export Data
              </li>
            </ul>
            <Button 
              className="w-full"
              onClick={() => handlePurchase("sixMonth")}
            >
              Choose Plan
            </Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold mb-2">Lifetime Access</h3>
            <p className="text-3xl font-bold mb-4">$49</p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                All Pro Features
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Lifetime Updates
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Premium Support
              </li>
            </ul>
            <Button 
              className="w-full"
              onClick={() => handlePurchase("lifetime")}
            >
              Choose Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}