import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="bg-mesh min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-grow text-center px-4 py-12">
        <div className="glass rounded-2xl glow overflow-hidden max-w-md w-full p-8">
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center mb-6">
              <AlertCircle className="h-10 w-10 text-rose-500" />
            </div>
            
            <h1 className="text-3xl font-bold mb-3">Page Not Found</h1>
            
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              The page you are looking for doesn't exist or has been moved.
            </p>
            
            <Link href="/">
              <Button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg transition hover:opacity-90 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none shine-effect">
                Go Back Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
