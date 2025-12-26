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
  const path = window.location.pathname;

  let PageComponent = Index;
  if (path === "/auth") PageComponent = Auth;
  else if (path === "/dashboard") PageComponent = Dashboard;
  else if (path === "/mock-tests") PageComponent = MockTests;
  else if (path === "/practice") PageComponent = Practice;
  else if (path === "/test") PageComponent = Test;
  else if (path === "/result") PageComponent = Result;
  else if (path === "/upgrade") PageComponent = Upgrade;
  else if (path === "/solutions") PageComponent = Solutions;
  else if (path === "/legal") PageComponent = LegalPage;
  else if (path !== "/") PageComponent = NotFound;

  return <PageComponent />;
}

export default App;
