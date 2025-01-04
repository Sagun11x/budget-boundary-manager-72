import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { UserGreeting } from "@/components/UserGreeting";
import { MobileMenu } from "@/components/MobileMenu";

interface HeaderProps {
  logout: () => void;
  isPro?: boolean;
  sortBy?: string;
  setSortBy?: (value: string) => void;
  onInfoClick?: () => void;
  onProClick?: () => void;
}

export const Header = ({ 
  logout,
  isPro = false,
  sortBy = "nearest",
  setSortBy = () => {},
  onInfoClick = () => {},
  onProClick = () => {},
}: HeaderProps) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Subscription Manager</h1>
            <UserGreeting />
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={logout}
              className="hidden md:flex"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>

            <MobileMenu
              logout={logout}
              isPro={isPro}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onInfoClick={onInfoClick}
              onProClick={onProClick}
            />
          </div>
        </div>
      </div>
    </header>
  );
};