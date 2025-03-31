import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const { toast } = useToast();
  
  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<{username?: string, password?: string}>({});
  
  // Signup form state
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupErrors, setSignupErrors] = useState<{username?: string, password?: string, confirmPassword?: string}>({});

  // Reset forms when switching tabs
  const handleFormSwitch = (switchToLogin: boolean) => {
    setLoginUsername("");
    setLoginPassword("");
    setLoginErrors({});
    
    setSignupUsername("");
    setSignupPassword("");
    setSignupConfirmPassword("");
    setSignupErrors({});
    
    setIsLogin(switchToLogin);
  };

  const validateLogin = () => {
    const errors: {username?: string, password?: string} = {};
    
    if (!loginUsername) {
      errors.username = "Username is required";
    }
    
    if (!loginPassword) {
      errors.password = "Password is required";
    }
    
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validateSignup = () => {
    const errors: {username?: string, password?: string, confirmPassword?: string} = {};
    
    if (!signupUsername) {
      errors.username = "Username is required";
    }
    
    if (!signupPassword) {
      errors.password = "Password is required";
    } else if (signupPassword.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    if (!signupConfirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (signupPassword !== signupConfirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onLoginSubmit = async () => {
    try {
      if (!validateLogin()) {
        return;
      }
      
      console.log("Login submission data:", { username: loginUsername, password: loginPassword });
      
      // Using username instead of email
      await signInWithEmail(loginUsername, loginPassword);
      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
      });
      onClose();
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid username or password. Please try again.",
      });
    }
  };

  const onSignupSubmit = async () => {
    try {
      if (!validateSignup()) {
        return;
      }
      
      console.log("Signup submission data:", { 
        username: signupUsername, 
        password: signupPassword,
        confirmPassword: signupConfirmPassword 
      });

      // Pass the username and password
      await signUpWithEmail(signupUsername, signupPassword);
      toast({
        title: "Account Created",
        description: "Your account has been created successfully!",
      });
      onClose();
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "This username might already be in use or there was a server error.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
      <div className="glass relative w-full max-w-md rounded-2xl overflow-hidden transition-all duration-300 transform">
        <div className="glow rounded-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <h2 className="text-2xl font-bold">BangaLore</h2>
              </div>
              <div className="relative">
                <Button 
                  onClick={onClose} 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-0 right-0 p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-full transition"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="flex mb-6 border-b border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => handleFormSwitch(true)}
                className={`px-4 py-2 font-medium text-sm ${isLogin 
                  ? 'border-b-2 border-primary-600 text-primary-600' 
                  : 'text-slate-600 dark:text-slate-400'}`}
              >
                Login
              </button>
              <button 
                onClick={() => handleFormSwitch(false)}
                className={`px-4 py-2 font-medium text-sm ${!isLogin 
                  ? 'border-b-2 border-primary-600 text-primary-600' 
                  : 'text-slate-600 dark:text-slate-400'}`}
              >
                Sign Up
              </button>
            </div>
            
            {isLogin ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="login-username" className="text-sm font-medium">Username</label>
                  <input 
                    id="login-username"
                    type="text" 
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  />
                  {loginErrors.username && (
                    <p className="text-sm text-red-500">{loginErrors.username}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="login-password" className="text-sm font-medium">Password</label>
                  <input 
                    id="login-password"
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  />
                  {loginErrors.password && (
                    <p className="text-sm text-red-500">{loginErrors.password}</p>
                  )}
                </div>
                
                <div className="pt-2">
                  <Button 
                    onClick={onLoginSubmit}
                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium py-3 px-4 rounded-lg transition hover:opacity-90 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none shine-effect"
                  >
                    Log in
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="signup-username" className="text-sm font-medium">Username</label>
                  <input 
                    id="signup-username"
                    type="text" 
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  />
                  {signupErrors.username && (
                    <p className="text-sm text-red-500">{signupErrors.username}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="signup-password" className="text-sm font-medium">Password</label>
                  <input 
                    id="signup-password"
                    type="password" 
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Choose a password"
                    className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  />
                  {signupErrors.password && (
                    <p className="text-sm text-red-500">{signupErrors.password}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="signup-confirm-password" className="text-sm font-medium">Confirm Password</label>
                  <input 
                    id="signup-confirm-password"
                    type="password" 
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  />
                  {signupErrors.confirmPassword && (
                    <p className="text-sm text-red-500">{signupErrors.confirmPassword}</p>
                  )}
                </div>
                
                <div className="pt-2">
                  <Button 
                    onClick={onSignupSubmit}
                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium py-3 px-4 rounded-lg transition hover:opacity-90 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none shine-effect"
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}