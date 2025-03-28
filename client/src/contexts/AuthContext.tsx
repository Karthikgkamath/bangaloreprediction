import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  auth, 
  signInWithGoogle, 
  signInWithEmail as firebaseSignInWithEmail, 
  signUpWithEmail as firebaseSignUpWithEmail,
  logOut as firebaseLogOut
} from "@/lib/firebase";
import { User } from "firebase/auth";
import { apiRequest } from "@/lib/queryClient";
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
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Get firebase token
        const token = await user.getIdToken();
        
        try {
          // Verify token with our backend
          await apiRequest('POST', '/api/auth/verify', { token });
        } catch (error) {
          console.error("Failed to verify token with backend:", error);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "There was a problem authenticating your session. Please log in again."
          });
          await firebaseLogOut();
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [toast]);

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    signInWithEmail: firebaseSignInWithEmail,
    signUpWithEmail: firebaseSignUpWithEmail,
    logOut: firebaseLogOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
