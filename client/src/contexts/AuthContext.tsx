import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  auth, 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail,
  logOut,
  User
} from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User>;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signUpWithEmail: (email: string, password: string) => Promise<User>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  signInWithGoogle: async () => { throw new Error("Not implemented"); },
  signInWithEmail: async () => { throw new Error("Not implemented"); },
  signUpWithEmail: async () => { throw new Error("Not implemented"); },
  logOut: async () => { throw new Error("Not implemented"); }
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed", user ? "User logged in" : "No user");
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Handle Google sign in
  const handleSignInWithGoogle = async () => {
    try {
      const user = await signInWithGoogle();
      toast({
        title: "Success!",
        description: "You have successfully signed in with Google.",
      });
      return user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: "Could not sign in with Google. Please try again.",
      });
      throw error;
    }
  };

  // Handle Email/Password sign in
  const handleSignInWithEmail = async (email: string, password: string) => {
    try {
      const user = await signInWithEmail(email, password);
      toast({
        title: "Success!",
        description: "You have successfully signed in.",
      });
      return user;
    } catch (error) {
      console.error("Error signing in with email/password:", error);
      toast({
        variant: "destructive", 
        title: "Sign In Failed",
        description: "Invalid email or password. Please try again.",
      });
      throw error;
    }
  };

  // Handle Email/Password sign up
  const handleSignUpWithEmail = async (email: string, password: string) => {
    try {
      const user = await signUpWithEmail(email, password);
      toast({
        title: "Account Created!",
        description: "Your account has been created successfully.",
      });
      return user;
    } catch (error) {
      console.error("Error signing up with email/password:", error);
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: "Could not create your account. Please try again.",
      });
      throw error;
    }
  };

  // Handle logout
  const handleLogOut = async () => {
    try {
      await logOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not log out. Please try again.",
      });
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    signInWithGoogle: handleSignInWithGoogle,
    signInWithEmail: handleSignInWithEmail,
    signUpWithEmail: handleSignUpWithEmail,
    logOut: handleLogOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
