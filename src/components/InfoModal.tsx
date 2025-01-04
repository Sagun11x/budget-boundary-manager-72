import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, FileText, Facebook, Twitter, Instagram, LifeBuoy } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal = ({ isOpen, onClose }: InfoModalProps) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  const handleViewMore = () => {
    onClose();
    navigate('/info');
  };

  return (
    <Card className="fixed bottom-20 right-4 w-80 p-4 shadow-lg z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Information</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <a href="#" className="text-sm hover:underline">Terms and Conditions</a>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium mb-2">Social Media</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-primary">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-primary">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LifeBuoy className="h-5 w-5" />
          <a href="#" className="text-sm hover:underline">Support Center</a>
        </div>

        <Button 
          variant="outline" 
          className="w-full mt-2"
          onClick={handleViewMore}
        >
          View More Information
        </Button>
      </div>
    </Card>
  );
};