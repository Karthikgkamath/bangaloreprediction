import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => {
  // Only check if passwords match when both are filled
  return !data.password || !data.confirmPassword || data.password === data.confirmPassword;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const { toast } = useToast();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onBlur", // Only validate when field loses focus
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur", // Only validate when field loses focus
  });

  // Reset forms when switching tabs
  const handleFormSwitch = (switchToLogin: boolean) => {
    loginForm.reset();
    signupForm.reset();
    setIsLogin(switchToLogin);
  };

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      // Check for any form errors before attempting submission
      const errors = loginForm.formState.errors;
      if (Object.keys(errors).length > 0) {
        console.log("Form has errors, cannot submit:", errors);
        return; // Don't proceed with submission if there are errors
      }
      
      console.log("Login submission data:", data);
      
      if (!data.username || !data.password) {
        console.error("Missing required fields");
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Please fill in all required fields.",
        });
        return;
      }
      
      // Using username instead of email
      await signInWithEmail(data.username, data.password);
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

  const onSignupSubmit = async (data: SignupFormValues) => {
    try {
      // Check for any form errors before attempting submission
      const errors = signupForm.formState.errors;
      if (Object.keys(errors).length > 0) {
        console.log("Form has errors, cannot submit:", errors);
        return; // Don't proceed with submission if there are errors
      }
      
      console.log("Signup submission data:", data);
      
      if (!data.username || !data.password || !data.confirmPassword) {
        console.error("Missing required fields");
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: "Please fill in all required fields.",
        });
        return;
      }
      
      if (data.password !== data.confirmPassword) {
        console.error("Passwords don't match");
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: "Passwords do not match. Please try again.",
        });
        return;
      }

      // Pass the username and password
      await signUpWithEmail(data.username, data.password);
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
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Enter your username"
                            className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <div className="flex justify-between">
                          <FormLabel>Password</FormLabel>
                          <a href="#" className="text-xs text-primary-600 hover:text-primary-500">Forgot password?</a>
                        </div>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password" 
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium py-3 px-4 rounded-lg transition hover:opacity-90 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none shine-effect"
                    >
                      Log in
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Choose a username"
                            className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password" 
                            placeholder="Choose a password"
                            className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password" 
                            placeholder="Confirm your password"
                            className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium py-3 px-4 rounded-lg transition hover:opacity-90 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none shine-effect"
                    >
                      Create Account
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
