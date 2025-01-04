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
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

interface ProPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProPlanModal({ open, onOpenChange }: ProPlanModalProps) {
  const { toast } = useToast();
  const [isLifetime, setIsLifetime] = useState(false);
  const [isHovered, setIsHovered] = useState<number | null>(null);

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
          <DialogTitle className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              Go Pro
            </span>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </DialogTitle>
        </DialogHeader>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <span className={`text-sm transition-colors duration-200 ${!isLifetime ? 'text-primary font-semibold' : 'text-gray-500'}`}>
              6 Months
            </span>
            <Switch
              checked={isLifetime}
              onCheckedChange={setIsLifetime}
              className="data-[state=checked]:bg-purple-500"
            />
            <span className={`text-sm transition-colors duration-200 ${isLifetime ? 'text-primary font-semibold' : 'text-gray-500'}`}>
              Lifetime
            </span>
          </div>

          <motion.div 
            className="text-center mb-6"
            initial={{ scale: 1 }}
            animate={{ scale: isLifetime ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              {isLifetime ? "$49" : "$29"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {isLifetime ? "One-time payment" : "Every 6 months"}
            </p>
          </motion.div>

          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center p-2 rounded-lg transition-colors duration-200 hover:bg-gray-50 cursor-default"
                onHoverStart={() => setIsHovered(index)}
                onHoverEnd={() => setIsHovered(null)}
                whileHover={{ x: 5 }}
              >
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center mr-3
                  ${isHovered === index ? 'bg-green-100' : 'bg-gray-100'}
                  transition-colors duration-200
                `}>
                  <Check className={`w-4 h-4 ${isHovered === index ? 'text-green-500' : 'text-gray-400'}`} />
                </div>
                <span className={`${isHovered === index ? 'text-primary font-medium' : 'text-gray-600'}`}>
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:opacity-90 transition-opacity"
            onClick={handlePurchase}
          >
            Choose Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}