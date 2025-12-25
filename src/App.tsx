import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MockTests from "./pages/MockTests";
import Practice from "./pages/Practice";
import Test from "./pages/Test";
import Result from "./pages/Result";
import Upgrade from "./pages/Upgrade";
import Solutions from "./pages/Solutions";
import LegalPage from "./pages/LegalPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <div className="min-h-screen w-full overflow-x-hidden bg-background">
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/mock-tests" element={<MockTests />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/test/:testName" element={<Test />} />
              <Route path="/result" element={<Result />} />
              <Route path="/upgrade" element={<Upgrade />} />
              <Route path="/solutions/:testName" element={<Solutions />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
    </QueryClientProvider>
  </div>
);

export default App;
