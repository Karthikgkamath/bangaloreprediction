import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Test from "@/pages/Test";  // Import our test page
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./lib/theme";

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="bg-mesh min-h-screen flex flex-col">
            <Switch>
              <Route path="/" component={Test} />
              <Route path="/home" component={Home} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="*" component={NotFound} />
            </Switch>
            <Toaster />
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
