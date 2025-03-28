import { Button } from "@/components/ui/button";
import { Share2, FileText } from "lucide-react";
import { Prediction, SimilarProperty } from "@/types";
import { motion } from "framer-motion";

interface PredictionResultProps {
  prediction: Prediction;
}

export default function PredictionResult({ prediction }: PredictionResultProps) {
  // Format price in Indian format (e.g., ₹ 1.35 Cr)
  const formatPrice = (price: number): string => {
    if (price >= 10000000) {
      return `₹ ${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹ ${(price / 100000).toFixed(2)} Lac`;
    } else {
      return `₹ ${price.toLocaleString('en-IN')}`;
    }
  };

  // Format the price range
  const formatPriceRange = (min: number, max: number): string => {
    return `${formatPrice(min)} - ${formatPrice(max)}`;
  };

  // Calculate price per sq ft
  const calculatePricePerSqFt = (price: number, sqFt: number): string => {
    const pricePerSqFt = Math.round(price / sqFt);
    return `₹ ${pricePerSqFt.toLocaleString('en-IN')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl glow overflow-hidden"
    >
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Prediction Result
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Estimated Price</div>
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {formatPrice(prediction.predictedPrice)}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Price Range</div>
            <div className="text-lg font-bold">
              {formatPriceRange(prediction.priceRange.min, prediction.priceRange.max)}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Price per Sq.Ft</div>
            <div className="text-lg font-bold">
              {calculatePricePerSqFt(prediction.predictedPrice, prediction.squareFeet)}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 mb-4">
          <h3 className="text-lg font-bold mb-2">Similar Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prediction.similarProperties.map((property, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-900 rounded p-3 border border-slate-200 dark:border-slate-700">
                <div className="text-sm font-medium">{property.bhk} BHK in {property.location}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{property.squareFeet} sq.ft • {property.bathrooms} baths</div>
                <div className="text-sm font-bold mt-1">{formatPrice(property.price)}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" className="flex items-center justify-center px-4 py-2 text-sm font-medium mr-2">
            <FileText className="h-4 w-4 mr-1" />
            Save Report
          </Button>
          <Button className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:opacity-90 transition">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
