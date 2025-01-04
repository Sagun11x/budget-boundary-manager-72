import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface HeaderProps {
  logout: () => void;
}

export const Header = ({ logout }: HeaderProps) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Subscription Manager</h1>
        <Button variant="ghost" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
};