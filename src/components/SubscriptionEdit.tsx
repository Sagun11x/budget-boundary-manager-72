import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import type { Subscription } from "@/types/subscription";

interface SubscriptionEditProps {
  subscription: Subscription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (subscription: Subscription) => void;
}

export function SubscriptionEdit({ subscription, open, onOpenChange, onSave }: SubscriptionEditProps) {
  const [name, setName] = useState(subscription?.name || "");
  const [logo, setLogo] = useState(subscription?.logo || "");
  const [cost, setCost] = useState(subscription?.cost.toString() || "");
  const [description, setDescription] = useState(subscription?.description || "");
  const [purchaseDate, setPurchaseDate] = useState(subscription?.purchaseDate || new Date().toISOString().split('T')[0]);
  const [renewalNumber, setRenewalNumber] = useState(subscription?.renewalPeriod.number.toString() || "");
  const [renewalUnit, setRenewalUnit] = useState<"days" | "weeks" | "months" | "years">(subscription?.renewalPeriod.unit || "months");

  useEffect(() => {
    if (subscription) {
      setName(subscription.name);
      setLogo(subscription.logo || "");
      setCost(subscription.cost.toString());
      setDescription(subscription.description || "");
      setPurchaseDate(subscription.purchaseDate);
      setRenewalNumber(subscription.renewalPeriod.number.toString());
      setRenewalUnit(subscription.renewalPeriod.unit);
    }
  }, [subscription]);

  const handleSave = () => {
    if (!subscription) return;
    
    onSave({
      ...subscription,
      name,
      logo,
      cost: parseFloat(cost),
      description,
      purchaseDate,
      renewalPeriod: {
        number: parseInt(renewalNumber),
        unit: renewalUnit,
      },
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Subscription Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Subscription Name"
            />
          </div>
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
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}