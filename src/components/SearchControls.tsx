import { Plus, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  onAddClick: () => void;
}

export const SearchControls = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  onAddClick,
}: SearchControlsProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search subscriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[130px]">
              <div className="flex items-center">
                <span className="hidden sm:inline">Sort by</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nearest">Nearest Renewal</SelectItem>
              <SelectItem value="expensive">Most Expensive</SelectItem>
              <SelectItem value="cheapest">Cheapest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={onAddClick} className="whitespace-nowrap">
        <Plus className="h-4 w-4 mr-2" />
        Add Subscription
      </Button>
    </div>
  );
};