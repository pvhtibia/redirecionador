import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LinksProvider } from "./contexts/LinksContext";
import { Route, Switch, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "./components/ErrorBoundary";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Export from "./pages/Export";
import Redirect from "./pages/Redirect";
import NotFound from "./pages/NotFound";

/**
 * Design System: Minimalismo Funcional
 * - Paleta: Azul vibrante (#2563EB) + branco/cinza
 * - Tipografia: Poppins Bold para títulos, Inter Regular para corpo
 * - Layout: Grid assimétrico, cards com sombra sutil
 * - Interações: Transições suaves, feedback imediato
 */

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Component />;
}

function AppRouter() {
  return (
    <Switch>
      {/* Rota de login */}
      <Route path={"/"} component={Login} />
      
      {/* Rota do dashboard (protegida) */}
      <Route path={"/dashboard"}>
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>

      {/* Rota de exportação (protegida) */}
      <Route path={"/export"}>
        {() => <ProtectedRoute component={Export} />}
      </Route>

      {/* Rota de redirecionamento */}
      <Route path={"/r/:shortCode"} component={Redirect} />

      {/* Fallback 404 */}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <LinksProvider>
            <TooltipProvider>
              <Toaster />
              <Router hook={useHashLocation}>
                <AppRouter />
              </Router>
            </TooltipProvider>
          </LinksProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
