import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (logo: string) => void;
}

export function SubscriptionModal({ open, onOpenChange, onSubmit }: SubscriptionModalProps) {
  const [logo, setLogo] = useState("");
  const [name, setName] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();
  const { isPro } = useSubscriptionStatus();

  const handleLogoChange = (url: string) => {
    if (!isPro && url.toLowerCase().endsWith('.gif')) {
      toast.error('GIF logos are only available for pro users');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(logo);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-sm w-full bg-white rounded-lg p-6">
          <Dialog.Title className="text-lg font-medium">Subscription Settings</Dialog.Title>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="name">Subscription Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter subscription name"
                required
              />
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
            <div className="mt-4 flex justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="ml-2">
                Save
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
