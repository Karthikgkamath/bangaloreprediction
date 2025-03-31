import { useEffect, useState } from "react";

export default function LoadingState() {
  const [progress, setProgress] = useState(0);
  
  // Messages will be shown in order, with typing animation
  const loadingMessages = [
    "Analyzing Bangalore real estate market...",
    "Processing property parameters...",
    "Examining recent market trends...",
    "Calculating price predictions...",
    "Generating similar property comparisons...",
    "Finalizing price estimate..."
  ];
  
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  
  // Control the progress bar
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Make progress speed vary - fast at first, then slower at the end
        const increment = prevProgress < 70 ? 1 : 0.5;
        return prevProgress + increment;
      });
    }, 80);

    return () => clearInterval(progressInterval);
  }, []);
  
  // Control the message typing animation
  useEffect(() => {
    const currentMessage = loadingMessages[currentMessageIndex];
    
    if (isTyping) {
      if (displayedMessage.length < currentMessage.length) {
        const typingInterval = setTimeout(() => {
          setDisplayedMessage(currentMessage.substring(0, displayedMessage.length + 1));
        }, 30); // Speed of typing
        
        return () => clearTimeout(typingInterval);
      } else {
        setIsTyping(false);
        const pauseBeforeNextMessage = setTimeout(() => {
          setIsTyping(true);
          setDisplayedMessage("");
          setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        }, 1500); // Pause before moving to next message
        
        return () => clearTimeout(pauseBeforeNextMessage);
      }
    }
  }, [displayedMessage, currentMessageIndex, isTyping, loadingMessages]);

  return (
    <div className="glass rounded-2xl glow overflow-hidden mb-8">
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-8">
          {/* Microsoft Copilot-inspired animated spinner */}
          <div className="mb-8 relative flex items-center justify-center">
            <div className="w-40 h-40 relative flex items-center justify-center">
              {/* Pulsing background glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 blur-lg animate-pulse-slow"></div>
              
              {/* Main outer ring with gradient */}
              <div className="absolute w-36 h-36 rounded-full border-4 border-transparent 
                  [background:linear-gradient(white,white)padding-box,linear-gradient(to_right,#4f46e5,#06b6d4)border-box] 
                  dark:[background:linear-gradient(#0f172a,#0f172a)padding-box,linear-gradient(to_right,#4f46e5,#06b6d4)border-box]
                  animate-spin-slow"></div>
                  
              {/* Orbital paths - inspired by MS Copilot */}
              <div className="absolute w-36 h-36 rounded-full border border-slate-200/20 dark:border-slate-700/30"></div>
              <div className="absolute w-28 h-28 rounded-full border border-slate-200/20 dark:border-slate-700/30"></div>
              <div className="absolute w-20 h-20 rounded-full border border-slate-200/20 dark:border-slate-700/30"></div>
              
              {/* Animated orbiting dots on the paths */}
              <div className="absolute w-36 h-36 animate-orbit" style={{ animationDuration: '8s' }}>
                <div className="absolute top-0 left-1/2 w-2.5 h-2.5 -ml-1.5 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/40"></div>
              </div>
              
              <div className="absolute w-28 h-28 animate-orbit" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
                <div className="absolute top-0 left-1/2 w-2.5 h-2.5 -ml-1.5 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/40"></div>
              </div>
              
              <div className="absolute w-20 h-20 animate-orbit" style={{ animationDuration: '4s' }}>
                <div className="absolute top-0 left-1/2 w-2.5 h-2.5 -ml-1.5 bg-fuchsia-500 rounded-full shadow-lg shadow-fuchsia-500/40"></div>
              </div>
              
              {/* Inner pulsing circle */}
              <div className="relative w-12 h-12 bg-gradient-to-tr from-indigo-600 to-cyan-400 rounded-full shadow-lg shadow-indigo-500/50 animate-pulse"></div>
              
              {/* Light dots floating around */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white dark:bg-slate-300 opacity-70 animate-float-random"
                  style={{
                    width: `${Math.random() * 4 + 1}px`,
                    height: `${Math.random() * 4 + 1}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 5 + 5}s`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                />
              ))}
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 font-sans tracking-tight">
            Calculating Property Valuation
          </h3>
          
          <div className="w-full max-w-md mb-6">
            <div className="relative h-1.5 bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-size-200 rounded-full animate-gradient-x"
                style={{ width: `${progress}%` }}
              ></div>
              
              {/* Shimmering effect on progress bar */}
              <div 
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"
                style={{ backgroundSize: '200% 100%' }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>Analysis</span>
              <span>{Math.min(Math.floor(progress), 99)}%</span>
              <span>Completion</span>
            </div>
          </div>
          
          <div className="relative min-h-[5rem] flex items-center justify-center px-6 py-4 bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-700/50 rounded-xl">
            <p className="text-lg text-center text-slate-700 dark:text-slate-300 max-w-md font-mono">
              {displayedMessage}
              <span className="animate-blink ml-1 text-primary-500">█</span>
            </p>
          </div>
          
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse-slow opacity-75"></div>
            <div className="w-1.5 h-1.5 bg-secondary-500 rounded-full animate-pulse-slow opacity-75" style={{ animationDelay: '300ms' }}></div>
            <div className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse-slow opacity-75" style={{ animationDelay: '600ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}