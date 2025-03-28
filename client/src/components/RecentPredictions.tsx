import { useQuery } from "@tanstack/react-query";
import { PredictionHistory } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { format } from "date-fns";

export default function RecentPredictions() {
  // Fetch recent predictions from API
  const { data: predictions, isLoading, error } = useQuery<PredictionHistory[]>({
    queryKey: ['/api/predictions'],
    staleTime: 60000, // 1 minute
  });

  // Format price in Indian format
  const formatPrice = (price: number): string => {
    if (price >= 10000000) {
      return `₹ ${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹ ${(price / 100000).toFixed(2)} Lac`;
    } else {
      return `₹ ${price.toLocaleString('en-IN')}`;
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return format(date, "dd MMM yyyy");
    }
  };

  return (
    <Card className="glass rounded-2xl glow overflow-hidden mt-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <Clock className="h-5 w-5 mr-2 text-primary-500" />
          Recent Predictions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="p-4 text-center">Loading recent predictions...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">Failed to load recent predictions</div>
        ) : predictions && predictions.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-100 dark:bg-slate-800">
                <TableRow>
                  <TableHead className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Location
                  </TableHead>
                  <TableHead className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Details
                  </TableHead>
                  <TableHead className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Predicted Price
                  </TableHead>
                  <TableHead className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Date
                  </TableHead>
                  <TableHead className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                {predictions.map((prediction, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {prediction.location}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                      {`${prediction.bhk} BHK, ${prediction.bathrooms} Bath, ${prediction.squareFeet} sq.ft`}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-primary-600 dark:text-primary-400 font-medium">
                      {formatPrice(prediction.predictedPrice)}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                      {formatDate(prediction.date)}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                      <Button variant="link" className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 p-0">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-4 text-center text-slate-500 dark:text-slate-400">
            No prediction history available yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
