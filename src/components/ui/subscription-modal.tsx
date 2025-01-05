import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { LogoPreview } from "@/components/LogoPreview";
import { AdvancedOptions } from "@/components/AdvancedOptions";
import type { Subscription } from "@/types/subscription";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (subscription: Omit<Subscription, 'id' | 'userId'>) => void;
  isPro?: boolean;
}

export function SubscriptionModal({ open, onOpenChange, onSave, isPro = false }: SubscriptionModalProps) {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [customLogoUrl, setCustomLogoUrl] = useState("");
  const [cost, setCost] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [renewalNumber, setRenewalNumber] = useState("");
  const [renewalUnit, setRenewalUnit] = useState<"days" | "weeks" | "months" | "years">("days");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();

  const fetchLogoFromName = async (serviceName: string) => {
    if (!serviceName || customLogoUrl) return;
    
    const cleanName = serviceName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    try {
      console.log("Attempting to fetch logo for:", cleanName);
      
      // Create an Image object to test if the logo exists
      const img = new Image();
      const logoUrl = `https://logo.clearbit.com/${cleanName}.com`;
      
      // Create a promise that resolves when the image loads or rejects on error
      const imageLoadPromise = new Promise((resolve, reject) => {
        img.onload = () => resolve(logoUrl);
        img.onerror = () => reject(new Error('Logo not found'));
        img.src = logoUrl;
      });

      // Wait for the image to load with a timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Logo fetch timeout')), 5000);
      });

      // Race between image loading and timeout
      const result = await Promise.race([imageLoadPromise, timeoutPromise]);
      
      console.log("Logo URL set to:", result);
      setLogo(result as string);
      
    } catch (error) {
      console.log("Error checking logo:", error);
      setLogo("");
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!customLogoUrl) {
      fetchLogoFromName(value);
    }
  };

  const handleSave = () => {
    if (!name || !cost || !renewalNumber || !renewalUnit) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onSave({
      name,
      logo: customLogoUrl || logo,
      cost: parseFloat(cost),
      purchaseDate,
      renewalPeriod: {
        number: parseInt(renewalNumber),
        unit: renewalUnit,
      },
    });
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setLogo("");
    setCustomLogoUrl("");
    setCost("");
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setRenewalNumber("");
    setRenewalUnit("days");
    setShowAdvanced(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Subscription Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Subscription Name"
            />
            {name && <LogoPreview name={name} logo={customLogoUrl || logo} />}
          </div>

          {isPro && (
            <AdvancedOptions
              showAdvanced={showAdvanced}
              setShowAdvanced={setShowAdvanced}
              customLogoUrl={customLogoUrl}
              setCustomLogoUrl={setCustomLogoUrl}
              setLogo={setLogo}
            />
          )}

          <div className="grid gap-2">
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="Cost in USD"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="purchaseDate">Purchase Date</Label>
            <Input
              id="purchaseDate"
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Renewal Period</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={renewalNumber}
                onChange={(e) => setRenewalNumber(e.target.value)}
                placeholder="Number"
                className="flex-1"
              />
              <Select value={renewalUnit} onValueChange={setRenewalUnit}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                  <SelectItem value="years">Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="destructive" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}