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
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 font-semibold">
            Go Pro
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