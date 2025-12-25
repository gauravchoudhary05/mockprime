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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mock-tests" element={<MockTests />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/test" element={<Test />} />
        <Route path="/result" element={<Result />} />
        <Route path="/upgrade" element={<Upgrade />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
