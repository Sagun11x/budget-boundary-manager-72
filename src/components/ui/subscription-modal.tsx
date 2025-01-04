import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AdvancedOptions } from "@/components/AdvancedOptions";
import { LogoPreview } from "@/components/LogoPreview";
import type { Subscription } from "@/types/subscription";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (subscription: Subscription) => Promise<void>;
  isPro: boolean;
}

export function SubscriptionModal({ open, onOpenChange, onSave, isPro }: SubscriptionModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [renewalPeriod, setRenewalPeriod] = useState({ number: 1, unit: "months" as const });
  const [logo, setLogo] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customLogoUrl, setCustomLogoUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const subscription = {
      name,
      description,
      cost,
      purchaseDate,
      renewalPeriod,
      logo,
    };
    await onSave(subscription);
    onOpenChange(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    // Fetch logo based on name if needed
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Subscription</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subscription Name</Label>
            <Input
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Netflix"
              required
            />
            <LogoPreview logo={logo} />
            
            {isPro && (
              <AdvancedOptions
                showAdvanced={showAdvanced}
                setShowAdvanced={setShowAdvanced}
                customLogoUrl={customLogoUrl}
                setCustomLogoUrl={setCustomLogoUrl}
                setLogo={setLogo}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Streaming service"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="9.99"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchaseDate">Purchase Date</Label>
            <Input
              id="purchaseDate"
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="renewalPeriod">Renewal Period</Label>
            <Input
              id="renewalPeriod"
              value={renewalPeriod.number}
              onChange={(e) => setRenewalPeriod({ ...renewalPeriod, number: Number(e.target.value) })}
              placeholder="1"
              required
            />
            <select
              value={renewalPeriod.unit}
              onChange={(e) => setRenewalPeriod({ ...renewalPeriod, unit: e.target.value as "days" | "weeks" | "months" | "years" })}
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>
          
          <Button type="submit" className="w-full">
            Add Subscription
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
