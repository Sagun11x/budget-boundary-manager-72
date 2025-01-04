import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import Terms from "@/pages/Terms";
import ForgotPassword from "@/pages/ForgotPassword";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Index />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
