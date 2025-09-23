import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import StyleSelection from "./pages/StyleSelection";
import Plans from "./pages/Plans";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ResetPassword from "./pages/ResetPassword";
import AuthRedirect from "./pages/AuthRedirect";
import NotFound from "./pages/NotFound";
import CreditStatement from "./pages/CreditStatement";
import PhotoResults from "./pages/PhotoResults";
import PaymentStatus from "./pages/PaymentStatus";
import TermsOfService from "./pages/TermsOfService";
import CookieConsent from "@/components/CookieConsent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/style-selection" element={<StyleSelection />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/photo-results" element={<PhotoResults />} />
            <Route path="/credit-statement" element={<CreditStatement />} />
            <Route path="/payment/status" element={<PaymentStatus />} />
            <Route path="/auth-redirect" element={<AuthRedirect />} />
            <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
            <Route path="/termos-de-servico" element={<TermsOfService />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieConsent />
        </BrowserRouter>
        <Analytics />
        <SpeedInsights />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
