import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import ChatbotFAB from "@/components/ChatbotFAB";
import Index from "./pages/Index";
import LandCrops from "./pages/LandCrops";
import Market from "./pages/Market";
import Reminders from "./pages/Reminders";
import Expenses from "./pages/Expenses";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background max-w-lg mx-auto relative">
            <TopBar />
            <main className="pb-20">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/land" element={<LandCrops />} />
                <Route path="/market" element={<Market />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <BottomNav />
            <ChatbotFAB />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
