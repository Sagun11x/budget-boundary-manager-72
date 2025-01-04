import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MobileMenuProps {
  logout: () => void;
  isPro: boolean;
  sortBy: string;
  setSortBy: (value: string) => void;
  onInfoClick: () => void;
  onProClick: () => void;
}

export const MobileMenu = ({
  logout,
  isPro,
  sortBy,
  setSortBy,
  onProClick,
}: MobileMenuProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setIsOpen(false);
  };

  const handleInfoClick = () => {
    setIsOpen(false);
    navigate('/info');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sort Subscriptions</h3>
            <Select value={sortBy} onValueChange={handleSortChange}>
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

          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={handleInfoClick}
              className="w-full justify-start"
            >
              Information
            </Button>

            {!isPro && (
              <Button
                variant="ghost"
                onClick={() => {
                  onProClick();
                  setIsOpen(false);
                }}
                className="w-full justify-start"
              >
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent font-semibold">
                  Go Pro
                </span>
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};