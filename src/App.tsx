import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Info from "@/pages/Info";
import ForgotPassword from "@/pages/ForgotPassword";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/info" element={<Info />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;