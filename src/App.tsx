import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/dashboard" element={<Index />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;