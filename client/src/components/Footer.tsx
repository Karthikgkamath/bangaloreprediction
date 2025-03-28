import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="glass border-t border-slate-200 dark:border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">B</span>
            </div>
            <span className="text-sm font-medium">BangaLore © {new Date().getFullYear()}</span>
          </div>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white">
              <span className="sr-only">Privacy Policy</span>
              Privacy
            </Link>
            <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white">
              <span className="sr-only">Terms of Service</span>
              Terms
            </Link>
            <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white">
              <span className="sr-only">Contact Us</span>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
