import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProFeatureButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "ghost" | "link";
}

export const ProFeatureButton = ({ 
  onClick, 
  children, 
  className,
  variant = "ghost"
}: ProFeatureButtonProps) => {
  const { toast } = useToast();

  const handleClick = () => {
    toast({
      title: "Pro Feature Required",
      description: "Please upgrade to Pro to access this feature!",
      variant: "destructive",
    });
    onClick();
  };

  return (
    <Button variant={variant} onClick={handleClick} className={className}>
      {children}
    </Button>
  );
};