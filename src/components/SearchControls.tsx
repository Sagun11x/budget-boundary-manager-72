import { Plus, Search, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { VoiceSubscriptionModal } from "./VoiceSubscriptionModal";
import { useState } from "react";

interface SearchControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  onAddClick: () => void;
  onSave: (subscription: any) => Promise<void>;
  hideSortBy?: boolean;
}

export const SearchControls = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  onAddClick,
  onSave,
  hideSortBy = false,
}: SearchControlsProps) => {
  const isMobile = useIsMobile();
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  return (
    <div className="space-y-4 md:space-y-0">
      <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
        <div className="relative flex-1 md:flex-none md:w-[60%] w-[80%]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search subscriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={onAddClick} 
            className="whitespace-nowrap"
          >
            <Plus className="h-4 w-4 md:mr-2" />
            {!isMobile && "Add Subscription"}
          </Button>
          <Button
            onClick={() => setShowVoiceModal(true)}
            variant="outline"
            size="icon"
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
        {!hideSortBy && (
          <div className="w-full md:w-[20%]">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nearest">Nearest Renewal</SelectItem>
                <SelectItem value="expensive">Most Expensive</SelectItem>
                <SelectItem value="cheapest">Cheapest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <VoiceSubscriptionModal
        open={showVoiceModal}
        onOpenChange={setShowVoiceModal}
        onSave={onSave}
      />
    </div>
  );
};