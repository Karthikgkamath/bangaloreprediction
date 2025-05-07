import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { Link } from "wouter";

export function Navbar() {
  const { currentUser, logOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <>
      <nav className="glass fixed w-full z-40 top-0 left-0 border-b border-sky-200/30 dark:border-sky-700/20 bg-blue-800/95 dark:bg-sky-900/3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-xl font-bold">BangaLore</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {currentUser ? (
                <>
                  <div className="hidden md:flex items-center space-x-4">
                    <span className="text-sm font-medium">Welcome, {currentUser.displayName || currentUser.email}</span>
                    <img 
                      className="h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-700 p-1" 
                      src={currentUser.photoURL || `https://api.dicebear.com/6.x/avataaars/svg?seed=${currentUser.email}`} 
                      alt="User avatar" 
                    />
                  </div>
                  
                  <div className="hidden md:flex">
                    <Button 
                      onClick={handleLogout}
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:opacity-90 transition"
                    >
                      Log out
                      <LogOut className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:opacity-90 transition"
                >
                  Login / Sign Up
                </Button>
              )}
              
              <div className="flex md:hidden">
                <Button variant="outline" size="icon" className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md inline-flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <span className="sr-only">Open menu</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
}
