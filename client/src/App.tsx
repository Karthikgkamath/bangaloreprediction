import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./lib/theme";

function RouterWithAuth() {
  const { currentUser, loading } = useAuth();

  // Show a loading indicator if auth is still initializing
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Switch>
      <Route path="/" component={currentUser ? Dashboard : Home} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="bg-mesh min-h-screen flex flex-col">
            <RouterWithAuth />
            <Toaster />
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
