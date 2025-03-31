import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import { Prediction } from "@/types";

const predictionFormSchema = z.object({
  region: z.string().min(1, "Region is required"),
  preciseLocation: z.string().min(1, "Precise location is required"),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  bhk: z.string().min(1, "BHK is required"),
  bathrooms: z.string().min(1, "Bathrooms are required"),
  squareFeet: z.coerce.number().min(1, "Area is required"),
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
  selectedLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export default function PredictionForm({ 
  selectedRegion, 
  setSelectedRegion, 
  onPrediction,
  setLoading,
  selectedLocation
}: PredictionFormProps) {
  const [formError, setFormError] = useState<string | null>(null);

  // Options for select inputs
  const regions = [
    { value: "indiranagar", label: "Indiranagar" },
    { value: "koramangala", label: "Koramangala" },
    { value: "jayanagar", label: "Jayanagar" },
    { value: "whitefield", label: "Whitefield" },
    { value: "electronic-city", label: "Electronic City" },
    { value: "rajajinagar", label: "Rajajinagar" },
    { value: "hebbal", label: "Hebbal" },
  ];

  const form = useForm<PredictionFormValues>({
    resolver: zodResolver(predictionFormSchema),
    defaultValues: {
      region: selectedRegion,
      preciseLocation: "",
      coordinates: undefined,
      bhk: "",
      bathrooms: "",
      squareFeet: 0,
      parking: false,
      garden: false,
      swimmingPool: false,
      gym: false,
      security: false,
      powerBackup: false,
    },
  });

  const onSubmit = async (data: PredictionFormValues) => {
    try {
      setLoading(true);
      setFormError(null);
      
      // Make API request for prediction
      const prediction = await apiRequest<Prediction>("/api/predict", {
        method: "POST",
        body: JSON.stringify(data),
      });
      
      onPrediction(prediction);
    } catch (error) {
      console.error("Prediction error:", error);
      setFormError("Failed to generate prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update form when selectedRegion changes from external source (map)
  useEffect(() => {
    if (selectedRegion && selectedRegion !== form.getValues("region")) {
      form.setValue("region", selectedRegion);
      
      // Auto-fill approximate location based on region
      const regionLabel = regions.find(r => r.value === selectedRegion)?.label;
      if (regionLabel && !form.getValues("preciseLocation")) {
        form.setValue("preciseLocation", `${regionLabel}, Bangalore`);
      }
    }
  }, [selectedRegion, form, regions]);

  // Update location when selected from the map
  useEffect(() => {
    if (selectedLocation) {
      // Update the precise location with the address from the map
      form.setValue("preciseLocation", selectedLocation.address);
      form.setValue("coordinates", {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng
      });
      
      // Try to determine the region from the address
      const address = selectedLocation.address.toLowerCase();
      const matchedRegion = regions.find(region => 
        address.includes(region.label.toLowerCase())
      );
      
      if (matchedRegion) {
        form.setValue("region", matchedRegion.value);
        setSelectedRegion(matchedRegion.value);
      }
    }
  }, [selectedLocation, form, regions, setSelectedRegion]);

  const bhkOptions = [
    { value: "1", label: "1 BHK" },
    { value: "2", label: "2 BHK" },
    { value: "3", label: "3 BHK" },
    { value: "4", label: "4 BHK" },
    { value: "5", label: "5 BHK" },
  ];

  const bathroomOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedRegion(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>{region.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select a region or click on the map
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="preciseLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precise Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Address from map selection or enter manually
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bhk"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BHK</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select BHK" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bhkOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Number of bedrooms
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bathrooms</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bathrooms" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bathroomOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Number of bathrooms
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="squareFeet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area (sq ft)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormDescription>
                  Total built-up area
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Amenities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="parking"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                  <div className="space-y-1 leading-none">
                    <FormLabel>Parking</FormLabel>
                    <FormDescription>
                      Dedicated parking space
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="garden"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                  <div className="space-y-1 leading-none">
                    <FormLabel>Garden</FormLabel>
                    <FormDescription>
                      Private or common garden
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="swimmingPool"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                  <div className="space-y-1 leading-none">
                    <FormLabel>Swimming Pool</FormLabel>
                    <FormDescription>
                      Access to swimming pool
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="gym"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                  <div className="space-y-1 leading-none">
                    <FormLabel>Gym</FormLabel>
                    <FormDescription>
                      Access to fitness center
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="security"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                  <div className="space-y-1 leading-none">
                    <FormLabel>Security</FormLabel>
                    <FormDescription>
                      24x7 security service
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="powerBackup"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                  <div className="space-y-1 leading-none">
                    <FormLabel>Power Backup</FormLabel>
                    <FormDescription>
                      Power backup available
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {formError && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {formError}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg transition hover:opacity-90 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none shine-effect"
        >
          Generate Price Prediction
        </Button>
      </form>
    </Form>
  );
}