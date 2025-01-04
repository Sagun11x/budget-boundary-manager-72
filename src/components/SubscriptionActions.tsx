import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { ProFeatureButton } from "./ProFeatureButton";
import { useState } from "react";
import { ProPlanModal } from "./ProPlanModal";
import { Subscription } from "@/types/subscription";

interface SubscriptionActionsProps {
  isPro: boolean;
  subscriptions: Subscription[];
  showAnalytics: boolean;
  setShowAnalytics: (show: boolean) => void;
}

export const SubscriptionActions = ({
  isPro,
  subscriptions,
  showAnalytics,
  setShowAnalytics
}: SubscriptionActionsProps) => {
  const [showProModal, setShowProModal] = useState(false);

  return (
    <div className="flex justify-between items-center">
      {isPro ? (
        <Button
          variant="link"
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          {showAnalytics ? "Hide Analytics" : "Show Analytics"}
        </Button>
      ) : (
        <ProFeatureButton
          onClick={() => setShowProModal(true)}
          variant="link"
          className="text-sm text-gray-600 hover:text-gray-900"
          alertTitle="Analytics Feature"
          alertDescription="Upgrade to Pro to access detailed analytics for your subscriptions!"
        >
          Show Analytics
        </ProFeatureButton>
      )}
      
      {!isPro && (
        <Button
          variant="ghost"
          onClick={() => setShowProModal(true)}
          className="text-sm relative group"
        >
          <span className="relative inline-block animate-pulse">
            <span className="absolute -inset-1 bg-primary/20 rounded-lg blur-sm group-hover:bg-primary/30 transition-all duration-300"></span>
            <span className="relative text-primary font-semibold">Go Pro</span>
          </span>
        </Button>
      )}

      {isPro ? (
        subscriptions.length > 0 && (
          <Button
            className="fixed bottom-4 right-4 rounded-full p-4"
            variant="default"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )
      ) : (
        subscriptions.length > 0 && (
          <ProFeatureButton
            onClick={() => {}}
            className="fixed bottom-4 right-4 rounded-full p-4"
            variant="default"
            alertTitle="AI Assistant"
            alertDescription="Upgrade to Pro to get personalized subscription insights from our AI assistant!"
          >
            <MessageCircle className="h-6 w-6" />
          </ProFeatureButton>
        )
      )}

      <ProPlanModal
        open={showProModal}
        onOpenChange={setShowProModal}
      />
    </div>
  );
};