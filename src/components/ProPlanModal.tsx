import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Check, MessageSquare } from "lucide-react";
import { subscriptionService } from "@/services/subscriptionService";
import { useAuth } from "@/contexts/AuthContext";

interface ProPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProPlanModal({ open, onOpenChange }: ProPlanModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState<number | null>(null);

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to subscribe",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await subscriptionService.requestSubscription(
        user.uid,
        user.email || '',
        'lifetime'
      );
      
      toast({
        title: "Success",
        description: "Lifetime subscription request submitted successfully! Admin will review shortly.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit subscription request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    "Unlimited Listing",
    "AI-Powered Subscription Insights",
    "Smart Renewal Predictions",
    "24/7 AI Chat Assistant",
    "Advanced Analytics"
  ];

  const price = 49.99;
  const regularPrice = 9999;
  const savings = regularPrice - price;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="pro-plan-description">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            GoPro
          </DialogTitle>
          <DialogDescription id="pro-plan-description">
            Limited Time Offer - Lifetime Access
          </DialogDescription>
        </DialogHeader>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <motion.div 
            className="text-center mb-6"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2">
              <p className="text-4xl font-bold">
                ${price}
              </p>
              <span className="text-sm text-gray-500 line-through">
                ${regularPrice}
              </span>
            </div>
            <p className="text-sm text-green-600 font-medium mt-1">
              You save ${savings}! 🎉
            </p>
            <p className="text-sm text-gray-500 mt-1">
              One-time payment
            </p>
            <p className="text-xs text-primary mt-2 bg-primary/5 p-2 rounded-lg">
              Limited time offer! Get lifetime access at an incredible discount
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
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? 'Processing...' : 'Get Lifetime Access'}</span>
            <MessageSquare className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
