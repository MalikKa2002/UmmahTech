import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import RoleSwitcher from "@/components/RoleSwitcher";
import Index from "./pages/Index";
import DealDetail from "./pages/DealDetail";
import Auth from "./pages/Auth";
import MerchantDashboard from "./pages/MerchantDashboard";
import MerchantRedeem from "./pages/MerchantRedeem";
import NGODashboard from "./pages/NGODashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/deal/:id" element={<DealDetail />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/merchant" element={<MerchantDashboard />} />
              <Route path="/merchant/redeem" element={<MerchantRedeem />} />
              <Route path="/ngo" element={<NGODashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <RoleSwitcher />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
