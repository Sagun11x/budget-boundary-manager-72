import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { UserGreeting } from "@/components/UserGreeting";
import { MobileMenu } from "@/components/MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const getUserName = () => {
    if (!user) return "";
    if (user.displayName) return user.displayName;
    return user.email?.split("@")[0] || "";
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Subscription Manager</h1>
            <UserGreeting />
          </div>
          
          <div className="flex items-center gap-2">
            {!isMobile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                    {getUserName()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={logout} className="text-red-500 hover:text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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