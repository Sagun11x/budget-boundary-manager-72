import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BarChart3 } from "lucide-react";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (subscription: any) => void;
}

export function SubscriptionModal({ open, onOpenChange, onSave }: SubscriptionModalProps) {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [cost, setCost] = useState("");
  const [type, setType] = useState("streaming");
  const [description, setDescription] = useState("");
  const [renewalPeriod, setRenewalPeriod] = useState("monthly");

  useEffect(() => {
    if (name) {
      // Using Clearbit's Logo API to fetch company logos
      const logoUrl = `https://logo.clearbit.com/${name.toLowerCase().replace(/\s+/g, '')}.com`;
      setLogo(logoUrl);
    }
  }, [name]);

  const handleSave = () => {
    onSave({
      name,
      logo,
      cost: parseFloat(cost),
      type,
      description,
      renewalPeriod,
      startDate: new Date().toISOString(),
    });
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setLogo("");
    setCost("");
    setType("streaming");
    setDescription("");
    setRenewalPeriod("monthly");
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
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Netflix, Spotify"
            />
            {logo && (
              <div className="mt-2">
                <img
                  src={logo}
                  alt={`${name} logo`}
                  className="h-12 w-12 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="streaming">Streaming</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cost">Monthly Cost ($)</Label>
            <Input
              id="cost"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}