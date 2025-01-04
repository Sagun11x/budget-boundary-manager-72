import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import SubscriptionAdmin from "@/pages/SubscriptionAdmin";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/admin/subscriptions" element={<SubscriptionAdmin />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;