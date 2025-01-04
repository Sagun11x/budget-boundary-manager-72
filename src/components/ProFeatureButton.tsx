import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProFeatureAlert } from "./ProFeatureAlert";

interface ProFeatureButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "ghost" | "link";
  alertTitle?: string;
  alertDescription?: string;
}

export const ProFeatureButton = ({ 
  onClick, 
  children, 
  className,
  variant = "ghost",
  alertTitle = "Pro Feature Required",
  alertDescription = "Please upgrade to Pro to access this feature!"
}: ProFeatureButtonProps) => {
  const [showAlert, setShowAlert] = useState(false);

  const handleClick = () => {
    setShowAlert(true);
  };

  return (
    <>
      <Button variant={variant} onClick={handleClick} className={className}>
        {children}
      </Button>

      <ProFeatureAlert
        open={showAlert}
        onOpenChange={setShowAlert}
        title={alertTitle}
        description={alertDescription}
      />
    </>
  );
};