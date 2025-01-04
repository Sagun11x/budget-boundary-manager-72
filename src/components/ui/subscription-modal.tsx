import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import type { Subscription } from "@/types/subscription";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (subscription: Subscription) => Promise<void>;
}

export function SubscriptionModal({ open, onOpenChange, onSave }: SubscriptionModalProps) {
  const [logo, setLogo] = useState("");
  const [name, setName] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();
  const { isPro } = useSubscriptionStatus();

  const handleLogoChange = (url: string) => {
    if (!isPro && url.toLowerCase().endsWith('.gif')) {
      toast({
        title: "Error",
        description: 'GIF logos are only available for pro users',
        variant: "destructive"
      });
      return;
    }
    setLogo(url);
  };

  useEffect(() => {
    if (name && !logo) {
      const logoUrl = `https://logo.clearbit.com/${name.toLowerCase().replace(/\s+/g, '')}.com`;
      handleLogoChange(logoUrl);
    }
  }, [name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const subscription: Omit<Subscription, 'id' | 'userId'> = {
      name,
      logo,
      cost: 0,
      description: '',
      purchaseDate: new Date().toISOString(),
      renewalPeriod: {
        number: 1,
        unit: 'months'
      }
    };
    await onSave(subscription as Subscription);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onClose={() => onOpenChange(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
          <Dialog.Title className="text-lg font-medium">Add Subscription</Dialog.Title>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Subscription Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter subscription name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                </Button>
                
                {showAdvanced && (
                  <div className="space-y-2">
                    <Label htmlFor="logo">Custom Logo URL</Label>
                    <Input
                      id="logo"
                      value={logo}
                      onChange={(e) => handleLogoChange(e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                    {!isPro && (
                      <p className="text-xs text-muted-foreground">
                        Upgrade to Pro to use GIF logos
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}