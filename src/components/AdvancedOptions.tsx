import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdvancedOptionsProps {
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
  customLogoUrl: string;
  setCustomLogoUrl: (url: string) => void;
  setLogo: (url: string) => void;
}

export function AdvancedOptions({ 
  showAdvanced, 
  setShowAdvanced, 
  customLogoUrl,
  setCustomLogoUrl,
  setLogo
}: AdvancedOptionsProps) {
  return (
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
            value={customLogoUrl}
            onChange={(e) => {
              const url = e.target.value;
              setCustomLogoUrl(url);
              if (url) {
                setLogo(url);
              }
            }}
            placeholder="https://example.com/logo.png"
          />
        </div>
      )}
    </>
  );
}