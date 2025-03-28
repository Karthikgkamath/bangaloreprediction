import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./lib/theme";

function Router() {
  const { currentUser } = useAuth();

  return (
    <Switch>
      <Route path="/" component={currentUser ? Dashboard : Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="bg-mesh min-h-screen flex flex-col">
            <Router />
            <Toaster />
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
