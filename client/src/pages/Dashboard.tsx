import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import BangaloreMap from "@/components/BangaloreMap";
import PredictionForm from "@/components/PredictionForm";
import LoadingState from "@/components/LoadingState";
import PredictionResult from "@/components/PredictionResult";
import RecentPredictions from "@/components/RecentPredictions";
import { Prediction } from "@/types";

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setPrediction(null); // Reset prediction when region changes
  };

  const handlePrediction = (predictionData: Prediction) => {
    setPrediction(predictionData);
  };

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
        </div>
        
        {/* Map and Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="glass rounded-2xl glow overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Select Location
              </h2>
              
              <BangaloreMap onSelectRegion={handleRegionSelect} />
            </div>
          </div>
          
          <div className="glass rounded-2xl glow overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Property Details
              </h2>
              
              <PredictionForm 
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                onPrediction={handlePrediction}
                setLoading={setIsLoading}
              />
            </div>
          </div>
        </div>
        
        {/* Loading or Result Section */}
        {isLoading ? (
          <LoadingState />
        ) : prediction ? (
          <PredictionResult prediction={prediction} />
        ) : null}
        
        {/* Recent Predictions */}
        <RecentPredictions />
      </main>
      <Footer />
    </>
  );
}
