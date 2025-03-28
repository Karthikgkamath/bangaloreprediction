import { useEffect, useState } from "react";

export default function LoadingState() {
  const [progress, setProgress] = useState(0);
  const loadingMessages = [
    "Analyzing Bangalore real estate market...",
    "Processing property parameters...",
    "Examining recent market trends...",
    "Calculating price predictions...",
    "Generating similar property comparisons...",
    "Finalizing price estimate..."
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 50);

    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [loadingMessages.length]);

  return (
    <div className="glass rounded-2xl glow overflow-hidden mb-8">
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-8">
          {/* Animated Microsoft Copilot-like Loading Indicator */}
          <div className="relative w-24 h-24 mb-6">
            <div 
              className="absolute inset-0 rounded-full border-4 border-t-primary-500 border-r-secondary-500 border-b-accent-500 border-l-indigo-500 animate-spin"
              style={{ animationDuration: '2s' }}
            />
            <div 
              className="absolute inset-2 rounded-full border-4 border-t-accent-500 border-r-indigo-500 border-b-primary-500 border-l-secondary-500 animate-spin"
              style={{ animationDuration: '3s' }}
            />
            <div 
              className="absolute inset-4 rounded-full border-4 border-t-indigo-500 border-r-primary-500 border-b-secondary-500 border-l-accent-500 animate-spin"
              style={{ animationDuration: '4s' }}
            />
          </div>
          
          <h3 className="text-2xl font-bold mb-4">AI is analyzing your property</h3>
          
          <div className="w-full max-w-md mb-4">
            <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>Starting analysis</span>
              <span>{progress}%</span>
              <span>Finishing</span>
            </div>
          </div>
          
          <p className="text-lg text-center text-slate-600 dark:text-slate-400 transition-opacity duration-500 animate-pulse-slow">
            {loadingMessages[currentMessageIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}