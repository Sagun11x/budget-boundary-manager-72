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
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (subscription: any) => void;
  isPro?: boolean;
}

export function SubscriptionModal({ open, onOpenChange, onSave, isPro = false }: SubscriptionModalProps) {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [cost, setCost] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [renewalNumber, setRenewalNumber] = useState("");
  const [renewalUnit, setRenewalUnit] = useState("days");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();

  const fetchLogoFromName = async (serviceName: string) => {
    if (!serviceName) return;
    
    // Clean the service name - remove spaces and special characters
    const cleanName = serviceName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    try {
      // Try to fetch the logo
      const response = await fetch(`https://logo.clearbit.com/${cleanName}.com`);
      
      if (response.ok) {
        setLogo(`https://logo.clearbit.com/${cleanName}.com`);
        console.log("Logo fetched successfully:", `https://logo.clearbit.com/${cleanName}.com`);
      } else {
        console.log("Logo fetch failed, clearing logo URL");
        setLogo("");
      }
    } catch (error) {
      console.log("Error fetching logo:", error);
      setLogo("");
    }
  };

  useEffect(() => {
    if (name) {
      fetchLogoFromName(name);
    }
  }, [name]);

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
      logo,
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
              onChange={(e) => setName(e.target.value)}
              placeholder="Subscription Name"
            />
            {name && (
              <div className="mt-2 flex items-center justify-center">
                {logo ? (
                  <img 
                    src={logo} 
                    alt={`${name} logo`}
                    className="h-16 w-16 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                      e.currentTarget.onerror = null;
                    }}
                  />
                ) : (
                  <Package className="h-16 w-16 text-gray-400" />
                )}
              </div>
            )}
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
          {isPro && (
            <>
              <Button
                variant="ghost"
                className="flex items-center gap-2 w-full justify-center"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                Advanced Options
                {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              {showAdvanced && (
                <div className="grid gap-2">
                  <Label htmlFor="logo">Custom Logo URL</Label>
                  <Input
                    id="logo"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              )}
            </>
          )}
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