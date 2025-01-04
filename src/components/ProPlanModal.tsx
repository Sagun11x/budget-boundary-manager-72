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
import { Check, Sparkles, Bot, Brain, MessageSquare } from "lucide-react";

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
    "AI-Powered Subscription Insights",
    "Smart Renewal Predictions",
    "24/7 AI Chat Assistant",
    "Advanced Analytics"
  ];

  const regularPrice = isLifetime ? 149 : 49;
  const discountedPrice = isLifetime ? 49 : 29;
  const savings = regularPrice - discountedPrice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
            <Bot className="w-6 h-6" />
            <span>Pro + AI</span>
            <Brain className="w-6 h-6" />
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
            <div className="flex items-center justify-center gap-2">
              <p className="text-4xl font-bold">
                ${discountedPrice}
              </p>
              <span className="text-sm text-gray-500 line-through">
                ${regularPrice}
              </span>
            </div>
            <p className="text-sm text-green-600 font-medium mt-1">
              You save ${savings}! 🎉
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {isLifetime ? "One-time payment" : "Every 6 months"}
            </p>
            {isLifetime && (
              <p className="text-xs text-primary mt-2 bg-primary/5 p-2 rounded-lg">
                Limited time offer! Get lifetime access at 67% off
              </p>
            )}
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
                  ${isHovered === index ? 'bg-primary/10' : 'bg-gray-100'}
                  transition-colors duration-200
                `}>
                  <Check className={`w-4 h-4 ${isHovered === index ? 'text-primary' : 'text-gray-400'}`} />
                </div>
                <span className={`${isHovered === index ? 'text-primary font-medium' : 'text-gray-600'}`}>
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>

          <Button 
            className="w-full bg-primary hover:bg-primary/90 transition-colors group"
            onClick={handlePurchase}
          >
            <span>Choose Plan</span>
            <MessageSquare className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}