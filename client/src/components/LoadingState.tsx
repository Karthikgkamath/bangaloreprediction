import { motion } from "framer-motion";

export default function LoadingState() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass rounded-2xl glow overflow-hidden animate-pulse-slow"
    >
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary-200 dark:border-primary-900 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-transparent border-t-primary-600 rounded-full absolute top-0 left-0 animate-spin"></div>
        </div>
        <h3 className="text-xl font-bold mt-6 mb-2">Analyzing Property Data</h3>
        <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
          Our AI is crunching the numbers to provide you with the most accurate price prediction based on location and property details.
        </p>
        
        <div className="mt-6 w-full max-w-md bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <motion.div 
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2.5 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
          ></motion.div>
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">Analyzing comparable properties in the selected area...</div>
      </div>
    </motion.div>
  );
}
