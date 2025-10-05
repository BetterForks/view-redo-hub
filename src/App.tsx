import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Scans from "./pages/Scans";
import Assets from "./pages/Assets";
import Vulnerabilities from "./pages/Vulnerabilities";
import Policies from "./pages/Policies";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Visualize from "./pages/Visualize";
import Compliance from "./pages/Compliance";
import AssetDetails from "./pages/AssetDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Scans />} />
          <Route path="/scans" element={<Scans />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/assets/:hostname" element={<AssetDetails />} />
          <Route path="/vulnerabilities" element={<Vulnerabilities />} />
          <Route path="/visualize" element={<Visualize />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
