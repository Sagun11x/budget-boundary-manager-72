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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { VoiceSubscriptionInput } from "./VoiceSubscriptionInput";

interface SearchControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  onAddClick: () => void;
  hideSortBy?: boolean;
}

export const SearchControls = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  onAddClick,
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="whitespace-nowrap md:w-[20%] w-[20%]">
              <Plus className="h-4 w-4 md:mr-2" />
              {!isMobile && "Add Subscription"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onAddClick}>
              <Plus className="mr-2 h-4 w-4" />
              Add Manually
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowVoiceModal(true)}>
              <Mic className="mr-2 h-4 w-4" />
              Add by Voice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
      <VoiceSubscriptionInput
        open={showVoiceModal}
        onOpenChange={setShowVoiceModal}
        onSave={onAddClick}
      />
    </div>
  );
};