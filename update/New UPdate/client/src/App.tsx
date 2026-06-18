import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CryptoPage from "./pages/CryptoPage";
import GoldPricePage from "./pages/GoldPricePage";
import SilverPricePage from "./pages/SilverPricePage";
import InsightsPage from "./pages/InsightsPage";
import CalculatorsPage from "./pages/CalculatorsPage";
import BlogPage from "./pages/BlogPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import DisclaimerPage from "./pages/DisclaimerPage";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/crypto"} component={CryptoPage} />
      <Route path={"/gold-price"} component={GoldPricePage} />
      <Route path={"/silver-price"} component={SilverPricePage} />
      <Route path={"/insights"} component={InsightsPage} />
      <Route path={"/calculators"} component={CalculatorsPage} />
      <Route path={"/blog"} component={BlogPage} />
      <Route path={"/about"} component={AboutPage} />
      <Route path={"/contact"} component={ContactPage} />
      <Route path={"/privacy"} component={PrivacyPage} />
      <Route path={"/terms"} component={TermsPage} />
      <Route path={"/disclaimer"} component={DisclaimerPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
