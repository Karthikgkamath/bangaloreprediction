import { useQuery } from "@tanstack/react-query";
import { PredictionHistory } from "@/types";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";

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

// Function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  }).format(date);
}

export default function RecentPredictions() {
  const { data: predictions, isLoading, isError } = useQuery<PredictionHistory[]>({
    queryKey: ['/api/predictions'],
    staleTime: 60000, // 1 minute
  });
  
  if (isLoading) {
    return (
      <div className="glass rounded-2xl overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <History className="h-6 w-6 mr-2 text-primary-500" />
            Recent Predictions
          </h2>
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (isError || !predictions) {
    return (
      <div className="glass rounded-2xl overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <History className="h-6 w-6 mr-2 text-primary-500" />
            Recent Predictions
          </h2>
          <div className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Could not load prediction history. Please try again later.
            </p>
            <Button variant="outline" className="px-4 py-2 border border-primary-600 text-primary-600 font-medium rounded-lg transition hover:bg-primary-50 dark:hover:bg-slate-800">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (predictions.length === 0) {
    return (
      <div className="glass rounded-2xl overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <History className="h-6 w-6 mr-2 text-primary-500" />
            Recent Predictions
          </h2>
          <div className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400">
              You haven't made any predictions yet. Use the form above to get started.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="glass rounded-2xl overflow-hidden mb-8">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <History className="h-6 w-6 mr-2 text-primary-500" />
          Recent Predictions
        </h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Location</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">BHK</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Bathrooms</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Area (sq.ft)</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Price</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((prediction) => (
                <tr 
                  key={prediction.id} 
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{formatDate(prediction.date)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{prediction.location}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{prediction.bhk}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{prediction.bathrooms}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{prediction.squareFeet}</td>
                  <td className="px-4 py-3 text-sm font-medium text-primary-600">{formatPrice(prediction.predictedPrice)}</td>
                  <td className="px-4 py-3 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}