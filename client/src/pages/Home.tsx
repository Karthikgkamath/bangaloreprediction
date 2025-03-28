import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 px-4 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 animate-gradient-x">
            Bangalore House Price Prediction
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Get accurate property price estimates in Bangalore using our advanced AI prediction model. Select a location, enter details, and discover property values in seconds.
          </p>

          <div className="mt-8">
            <button 
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg transition hover:opacity-90 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none shine-effect"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Feature Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="glass rounded-xl p-6">
            <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Interactive 3D Map</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Explore Bangalore's neighborhoods through our interactive 3D map. Click on any region to see property trends.
            </p>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="h-12 w-12 rounded-full bg-secondary-100 dark:bg-secondary-900 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-600 dark:text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Accurate Predictions</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Our AI model uses the latest property data to deliver accurate price estimates based on location, size, and amenities.
            </p>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="h-12 w-12 rounded-full bg-accent-100 dark:bg-accent-900 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Results</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Get instant property valuations with comprehensive insights including price ranges and comparable properties.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass rounded-xl p-5 text-center">
              <div className="mx-auto h-10 w-10 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center mb-3">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-bold mb-2">Select Region</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Choose your desired Bangalore neighborhood on our 3D map
              </p>
            </div>
            
            <div className="glass rounded-xl p-5 text-center">
              <div className="mx-auto h-10 w-10 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center mb-3">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-bold mb-2">Enter Details</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Specify property specifications like BHK, size, and amenities
              </p>
            </div>
            
            <div className="glass rounded-xl p-5 text-center">
              <div className="mx-auto h-10 w-10 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center mb-3">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-bold mb-2">Get Prediction</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Our AI analyzes the data and generates an accurate price estimate
              </p>
            </div>
            
            <div className="glass rounded-xl p-5 text-center">
              <div className="mx-auto h-10 w-10 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center mb-3">
                <span className="text-white font-bold">4</span>
              </div>
              <h3 className="font-bold mb-2">Save Results</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Review detailed insights and save or share your results
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass rounded-2xl glow overflow-hidden mb-12">
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Ready to discover property values in Bangalore?</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
              Create an account to access our AI-powered price prediction tool and make informed real estate decisions.
            </p>
            <button 
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg transition hover:opacity-90 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none shine-effect"
            >
              Sign Up Now
            </button>
          </div>
        </div>
      </main>
      <Footer />
      
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
}
