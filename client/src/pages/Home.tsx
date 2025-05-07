import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import '../styles/animation.css';
import ConnectionTest from '@/components/ConnectionTest';

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [displayText, setDisplayText] = useState("");
  const [showMagnifier, setShowMagnifier] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to path length with spring animation
  const pathLength = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1]),
    { stiffness: 50, damping: 20 }
  );

  useEffect(() => {
    // Typing animation
    const text = "BangLore";
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // Show magnifier after typing is complete
        setTimeout(() => {
          setShowMagnifier(true);
        }, 500);
        // Hide intro after magnifier animation
        setTimeout(() => {
          setShowIntro(false);
        }, 3000);
      }
    }, 150); // Speed of typing

    return () => {
      clearInterval(typingInterval);
    };
  }, []);

  // Add a subtle floating animation
  const floatingAnimation = {
    y: [0, -5, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const images = [
    {
      src: '/images/bangalore_city.jpg',
      text: `Finding the perfect house in Bangalore is a real challenge.\nThe city is vast, and every area feels different.\nWhat suits one person may not suit another.`
    },
    {
      src: '/images/blr.jpg',
      text: `Prices for similar homes can vary wildly from one neighborhood to the next.\nIt's hard to know if you're getting a fair deal or overpaying.\nThe lack of transparency leaves buyers confused.`
    },
    {
      src: '/images/haha.jpg',
      text: `Too many middlemen and agents complicate the process.\nEach adds their own markup, making it even harder to find the true value.\nTrust becomes a major concern for home buyers.`
    },
    {
      src: '/images/map.jpg',
      text: `Our AI model analyzes real market data and considers factors like square feet, BHK, and location.\nIt also takes into account amenities such as swimming pool, security, parking, and more.\nYou get a data-driven, unbiased price prediction.`
    },
    {
      src: '/images/plot.jpg',
      text: `With our platform, you can confidently discover the true value of any property in Bangalore.\nNo more guesswork, no more hidden costs.\nLet AI guide you to the best deal for your dream home!`
    },
  ];

  const nextImage = () => {
    setPrevIndex(currentImageIndex);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setPrevIndex(currentImageIndex);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-sky-50 dark:bg-gray-900"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center relative"
            >
              {/* Falling Blocks */}
              <motion.div
                initial={{ y: -100, x: -50, rotate: -45 }}
                animate={{ y: 0, x: 0, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  delay: 0.2
                }}
                className="absolute -top-20 -left-20 w-16 h-16 bg-gradient-to-tr from-primary-600 to-secondary-500 rounded-lg shadow-lg"
              />
              <motion.div
                initial={{ y: -100, x: 50, rotate: 45 }}
                animate={{ y: 0, x: 0, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  delay: 0.4
                }}
                className="absolute -top-20 -right-20 w-16 h-16 bg-gradient-to-tr from-secondary-500 to-accent-500 rounded-lg shadow-lg"
              />
              
              <div className="magnifier-container mt-8">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="text-4xl md:text-6xl font-bold font-['Orbitron'] tracking-wider animated-text"
                >
                  <span className="text-sky-400">{displayText.slice(0, 4)}</span>
                  <span className="text-white">{displayText.slice(4)}</span>
                  <span className="animate-pulse">|</span>
                </motion.h1>
                {showMagnifier && <div className="magnifier" />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />
      <main className="pt-20 pb-16 px-4 max-w-7xl mx-auto bg-sky-100 dark:bg-gray-900 min-h-screen">
        <ConnectionTest />
        {/* Dotted Path Animation */}
        <motion.div 
          ref={pathRef}
          className="fixed left-1/2 top-0 w-1 h-screen -translate-x-1/2 z-0"
          style={{
            backgroundImage: 'url(../assets/dotted-path.png)',
            backgroundRepeat: 'repeat-y',
            backgroundSize: 'contain',
            opacity: 0.5,
            scaleY: pathLength
          }}
          animate={floatingAnimation}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Add glowing effect */}
          <motion.div 
            className="absolute inset-0 bg-blue-400/20 blur-sm"
            style={{
              opacity: useTransform(scrollYProgress, [0, 1], [0.2, 0.5])
            }}
          />
        </motion.div>

        {/* Image Carousel Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full h-screen mb-12"
        >
          <div className="relative w-full h-full border border-sky-200/30 dark:border-sky-700/20 shadow-[0_0_30px_rgba(186,230,253,0.4)] dark:shadow-[0_0_30px_rgba(56,189,248,0.2)] rounded-xl overflow-hidden bg-white dark:bg-gray-800">
            <motion.div
              key={currentImageIndex}
              initial={{ x: currentImageIndex > prevIndex ? 1000 : -1000, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: currentImageIndex > prevIndex ? -1000 : 1000, opacity: 0 }}
              transition={{ 
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
                opacity: { duration: 0.4 }
              }}
              className="relative h-full"
            >
              <img 
                src={images[currentImageIndex].src} 
                alt={`Image ${currentImageIndex + 1}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/1200x800/1e293b/94a3b8?text=Bangalore+City';
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <p className="text-white text-lg md:text-xl">{images[currentImageIndex].text}</p>
              </div>
            </motion.div>
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={prevImage} 
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white p-4 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 transform group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextImage} 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white p-4 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentImageIndex === index 
                    ? 'bg-white w-4' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-10 text-center p-8 border border-sky-200/30 dark:border-sky-700/20 shadow-[0_0_30px_rgba(186,230,253,0.4)] dark:shadow-[0_0_30px_rgba(56,189,248,0.2)] rounded-xl bg-white dark:bg-gray-800"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 animate-gradient-x">
            Bangalore House Price Prediction
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Get accurate property price estimates in Bangalore using our advanced AI prediction model. Select a location, enter details, and discover property values in seconds.
          </p>

          <div className="mt-8">
            <button 
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg transition hover:opacity-90 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none shine-effect hover:shadow-lg shadow-md"
            >
              Get Started
            </button>
          </div>
        </motion.div>

        {/* Feature Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-xl p-6 border border-sky-200/30 dark:border-sky-700/20 shadow-[0_0_30px_rgba(186,230,253,0.4)] dark:shadow-[0_0_30px_rgba(56,189,248,0.2)] bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Interactive 3D Map</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Explore Bangalore's neighborhoods through our interactive 3D map. Click on any region to see property trends.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass rounded-xl p-6 border border-sky-200/30 dark:border-sky-700/20 shadow-[0_0_30px_rgba(186,230,253,0.4)] dark:shadow-[0_0_30px_rgba(56,189,248,0.2)] bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="h-12 w-12 rounded-full bg-secondary-100 dark:bg-secondary-900 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-600 dark:text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Accurate Predictions</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Our AI model uses the latest property data to deliver accurate price estimates based on location, size, and amenities.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass rounded-xl p-6 border border-sky-200/30 dark:border-sky-700/20 shadow-[0_0_30px_rgba(186,230,253,0.4)] dark:shadow-[0_0_30px_rgba(56,189,248,0.2)] bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="h-12 w-12 rounded-full bg-accent-100 dark:bg-accent-900 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Instant Results</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Get instant property valuations with comprehensive insights including price ranges and comparable properties.
            </p>
          </motion.div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 p-8 border border-sky-200/30 dark:border-sky-700/20 shadow-[0_0_30px_rgba(186,230,253,0.4)] dark:shadow-[0_0_30px_rgba(56,189,248,0.2)] rounded-xl bg-white dark:bg-gray-800"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass rounded-xl p-5 text-center border border-sky-200/30 dark:border-sky-700/20 shadow-[0_0_30px_rgba(186,230,253,0.4)] dark:shadow-[0_0_30px_rgba(56,189,248,0.2)] bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mx-auto h-10 w-10 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center mb-3">
                <span className="text-black dark:text-white font-bold text-lg">1</span>
              </div>
              <h3 className="font-bold mb-2 text-gray-800 dark:text-white">Select Region</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Choose your desired Bangalore neighborhood on our 3D map
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass rounded-xl p-5 text-center border border-sky-200/30 dark:border-sky-700/20 shadow-[0_0_30px_rgba(186,230,253,0.4)] dark:shadow-[0_0_30px_rgba(56,189,248,0.2)] bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mx-auto h-10 w-10 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center mb-3">
                <span className="text-black dark:text-white font-bold text-lg">2</span>
              </div>
              <h3 className="font-bold mb-2 text-gray-800 dark:text-white">Enter Details</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Specify property specifications like BHK, size, and amenities
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass rounded-xl p-5 text-center border border-sky-200/30 dark:border-sky-700/20 shadow-[0_0_30px_rgba(186,230,253,0.4)] dark:shadow-[0_0_30px_rgba(56,189,248,0.2)] bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mx-auto h-10 w-10 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center mb-3">
                <span className="text-black dark:text-white font-bold text-lg">3</span>
              </div>
              <h3 className="font-bold mb-2 text-gray-800 dark:text-white">Get Prediction</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Our AI analyzes the data and generates an accurate price estimate
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="glass rounded-xl p-5 text-center border border-sky-200/30 dark:border-sky-700/20 shadow-[0_0_30px_rgba(186,230,253,0.4)] dark:shadow-[0_0_30px_rgba(56,189,248,0.2)] bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mx-auto h-10 w-10 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center mb-3">
                <span className="text-black dark:text-white font-bold text-lg">4</span>
              </div>
              <h3 className="font-bold mb-2 text-gray-800 dark:text-white">Save Results</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Review detailed insights and save or share your results
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Ready to Get Started?</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Join thousands of users who are making informed property decisions in Bangalore
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg transition hover:opacity-90 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none shine-effect hover:shadow-lg shadow-md"
            >
              Get Started
            </button>
          </div>
        </motion.div>
      </main>
      <Footer />
      
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
}
