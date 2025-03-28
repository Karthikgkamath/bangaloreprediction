import { Button } from "@/components/ui/button";
import { Prediction } from "@/types";
import { BarChart, Home, MapPin } from "lucide-react";

interface PredictionResultProps {
  prediction: Prediction;
}

// Function to format price in INR
function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} Lac`;
  } else {
    return `₹${price.toLocaleString()}`;
  }
}

export default function PredictionResult({ prediction }: PredictionResultProps) {
  return (
    <div className="glass rounded-2xl glow overflow-hidden mb-8">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <BarChart className="h-6 w-6 mr-2 text-primary-500" />
          Price Prediction Result
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary-500" />
                  Location Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-100/50 dark:bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Region</div>
                    <div className="font-medium">{prediction.region}</div>
                  </div>
                  <div className="bg-slate-100/50 dark:bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Precise Location</div>
                    <div className="font-medium">{prediction.location}</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Home className="h-5 w-5 mr-2 text-primary-500" />
                  Property Details
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-100/50 dark:bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-slate-500 dark:text-slate-400">BHK</div>
                    <div className="font-medium">{prediction.bhk}</div>
                  </div>
                  <div className="bg-slate-100/50 dark:bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Bathrooms</div>
                    <div className="font-medium">{prediction.bathrooms}</div>
                  </div>
                  <div className="bg-slate-100/50 dark:bg-slate-800/50 rounded-lg p-4">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Area</div>
                    <div className="font-medium">{prediction.squareFeet} sq.ft</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="bg-slate-100/50 dark:bg-slate-800/50 rounded-lg p-6 mb-4 flex-grow">
              <div className="text-center mb-4">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Predicted Price</div>
                <div className="text-3xl font-bold text-primary-600">{formatPrice(prediction.predictedPrice)}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Price Range: {formatPrice(prediction.priceRange.min)} - {formatPrice(prediction.priceRange.max)}
                </div>
              </div>
              
              <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full" />
                <div 
                  className="absolute top-1/2 w-4 h-4 bg-primary-600 rounded-full -translate-y-1/2 -ml-2"
                  style={{ 
                    left: `${Math.min(Math.max(((prediction.predictedPrice - prediction.priceRange.min) / 
                      (prediction.priceRange.max - prediction.priceRange.min)) * 100, 0), 100)}%` 
                  }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-6">
                <span>{formatPrice(prediction.priceRange.min)}</span>
                <span>{formatPrice(prediction.priceRange.max)}</span>
              </div>
              
              <div className="flex justify-center gap-3">
                <Button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg transition hover:bg-primary-700">
                  Save Result
                </Button>
                <Button variant="outline" className="px-4 py-2 border border-primary-600 text-primary-600 font-medium rounded-lg transition hover:bg-primary-50 dark:hover:bg-slate-800">
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Properties Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Similar Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prediction.similarProperties.map((property, index) => (
              <div key={index} className="bg-slate-100/50 dark:bg-slate-800/50 rounded-lg p-4">
                <div className="mb-3">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Location</div>
                  <div className="font-medium">{property.location}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">BHK</div>
                    <div className="font-medium">{property.bhk}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Bath</div>
                    <div className="font-medium">{property.bathrooms}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Area</div>
                    <div className="font-medium">{property.squareFeet} sq.ft</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Price</div>
                  <div className="font-medium text-primary-600">{formatPrice(property.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}