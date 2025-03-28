import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Prediction } from "@/types";

// Define the schema for form validation
const predictionFormSchema = z.object({
  region: z.string().min(1, "Region is required"),
  preciseLocation: z.string().min(1, "Precise location is required"),
  bhk: z.string().min(1, "BHK is required"),
  bathrooms: z.string().min(1, "Bathrooms are required"),
  squareFeet: z.string().min(1, "Area is required"),
  parking: z.boolean().default(false),
  garden: z.boolean().default(false),
  swimmingPool: z.boolean().default(false),
  gym: z.boolean().default(false),
  security: z.boolean().default(false),
  powerBackup: z.boolean().default(false),
});

type PredictionFormValues = z.infer<typeof predictionFormSchema>;

interface PredictionFormProps {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  onPrediction: (prediction: Prediction) => void;
  setLoading: (loading: boolean) => void;
}

export default function PredictionForm({ 
  selectedRegion, 
  setSelectedRegion,
  onPrediction,
  setLoading
}: PredictionFormProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Define regions for display
  const regionMap: Record<string, string> = {
    'indiranagar': 'Indiranagar',
    'koramangala': 'Koramangala',
    'jayanagar': 'Jayanagar',
    'whitefield': 'Whitefield',
    'electronic-city': 'Electronic City',
    'rajajinagar': 'Rajajinagar',
    'hebbal': 'Hebbal'
  };

  // Set up the form with default values
  const form = useForm<PredictionFormValues>({
    resolver: zodResolver(predictionFormSchema),
    defaultValues: {
      region: selectedRegion || '',
      preciseLocation: '',
      bhk: '3',
      bathrooms: '2',
      squareFeet: '1200',
      parking: true,
      garden: true,
      swimmingPool: false,
      gym: true,
      security: true,
      powerBackup: false,
    },
  });

  // Update form when selected region changes
  if (selectedRegion && form.getValues('region') !== selectedRegion) {
    form.setValue('region', selectedRegion);
  }

  // Handle location input change for autosuggest
  const handleLocationChange = (value: string) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    // Mock location suggestions based on region
    // In a real app, this would be an API call
    const regionLocations: Record<string, string[]> = {
      'indiranagar': ['100 Feet Road', 'Defence Colony', 'HAL 2nd Stage', 'CMH Road'],
      'koramangala': ['80 Feet Road', '6th Block', '3rd Block', 'Forum Mall'],
      'jayanagar': ['4th Block', '9th Block', 'Shopping Complex', 'Cool Joint Circle'],
      'whitefield': ['ITPL', 'Phoenix Mall', 'Hoodi Circle', 'Varthur'],
      'electronic-city': ['Phase 1', 'Phase 2', 'Neeladri Road', 'Infosys Campus'],
      'rajajinagar': ['1st Block', '4th Block', 'Rajajinagar Main Road', 'Dr. Rajkumar Road'],
      'hebbal': ['Kempapura', 'Manyata Tech Park', 'Byatarayanapura', 'Hebbal Flyover']
    };
    
    const currentRegion = form.getValues('region');
    if (currentRegion && regionLocations[currentRegion]) {
      const filtered = regionLocations[currentRegion].filter(loc => 
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // Handle form submission
  const onSubmit = async (data: PredictionFormValues) => {
    try {
      // Show loading state
      setLoading(true);
      
      // Send data to API
      const response = await apiRequest('POST', '/api/predict', {
        ...data,
        squareFeet: parseInt(data.squareFeet, 10)
      });
      
      const prediction = await response.json();
      
      // Pass prediction data to parent component
      onPrediction(prediction);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: "Could not get a price prediction. Please try again.",
      });
    } finally {
      // Hide loading state after delay for better UX
      setTimeout(() => setLoading(false), 1000);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="preciseLocation"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Precise Location</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter precise location or address"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                      onChange={(e) => {
                        field.onChange(e);
                        handleLocationChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  
                  {/* Autosuggest dropdown */}
                  {suggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 shadow-lg rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <ul className="max-h-60 overflow-auto py-1">
                        {suggestions.map((suggestion, index) => (
                          <li 
                            key={index}
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                            onClick={() => {
                              form.setValue('preciseLocation', suggestion);
                              setSuggestions([]);
                            }}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="bhk"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>BHK</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition">
                        <SelectValue placeholder="Select BHK" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 BHK</SelectItem>
                        <SelectItem value="2">2 BHK</SelectItem>
                        <SelectItem value="3">3 BHK</SelectItem>
                        <SelectItem value="4">4 BHK</SelectItem>
                        <SelectItem value="5">5 BHK</SelectItem>
                        <SelectItem value="6+">6+ BHK</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Bathrooms</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition">
                        <SelectValue placeholder="Select Bathrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Bathroom</SelectItem>
                        <SelectItem value="2">2 Bathrooms</SelectItem>
                        <SelectItem value="3">3 Bathrooms</SelectItem>
                        <SelectItem value="4">4 Bathrooms</SelectItem>
                        <SelectItem value="5+">5+ Bathrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="squareFeet"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Total Area (sq.ft)</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      placeholder="1200"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    />
                  </FormControl>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel className="block text-sm font-medium">Additional Features</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <FormField
              control={form.control}
              name="parking"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 rounded-lg bg-slate-100 dark:bg-slate-800 px-4 py-3 cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium cursor-pointer">Parking</FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="garden"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 rounded-lg bg-slate-100 dark:bg-slate-800 px-4 py-3 cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium cursor-pointer">Garden</FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="swimmingPool"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 rounded-lg bg-slate-100 dark:bg-slate-800 px-4 py-3 cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium cursor-pointer">Swimming Pool</FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="gym"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 rounded-lg bg-slate-100 dark:bg-slate-800 px-4 py-3 cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium cursor-pointer">Gym</FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="security"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 rounded-lg bg-slate-100 dark:bg-slate-800 px-4 py-3 cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium cursor-pointer">Security</FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="powerBackup"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 rounded-lg bg-slate-100 dark:bg-slate-800 px-4 py-3 cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium cursor-pointer">Power Backup</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium py-4 px-4 rounded-lg transition hover:opacity-90 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none shine-effect"
          >
            <Zap className="h-5 w-5 mr-2" />
            Predict Price
          </Button>
        </div>
      </form>
    </Form>
  );
}
