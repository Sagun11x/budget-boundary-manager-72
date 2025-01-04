import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProPlanModal } from "@/components/ProPlanModal";
import { useState } from "react";

interface ProFeatureAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
}

export const ProFeatureAlert = ({
  open,
  onOpenChange,
  title,
  description,
}: ProFeatureAlertProps) => {
  const [showProModal, setShowProModal] = useState(false);

  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              onOpenChange(false);
              setShowProModal(true);
            }}>
              Upgrade to Pro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ProPlanModal 
        open={showProModal} 
        onOpenChange={setShowProModal} 
      />
    </>
  );
};