import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";

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
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [renewalNumber, setRenewalNumber] = useState("");
  const [renewalUnit, setRenewalUnit] = useState("days");

  useEffect(() => {
    if (name) {
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
    setCost("");
    setType("streaming");
    setDescription("");
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setRenewalNumber("");
    setRenewalUnit("days");
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
              placeholder="Subscription Name"
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
            <Label htmlFor="type">Subscription Type</Label>
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