import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LogOut, Plus, Search } from "lucide-react";

const Index = () => {
  const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Subscription Manager</h1>
          <Button variant="ghost" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="ml-4 bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Subscription
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">Total Subscriptions</h3>
            <p className="text-3xl font-bold">0</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">Monthly Spend</h3>
            <p className="text-3xl font-bold">$0</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">Next Renewal</h3>
            <p className="text-3xl font-bold">-</p>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Subscriptions</h2>
          <div className="text-center text-gray-500 py-8">
            No subscriptions yet. Click "Add Subscription" to get started.
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;