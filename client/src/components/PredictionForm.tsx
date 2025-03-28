import { useState } from "react";
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
}

export default function PredictionForm({ 
  selectedRegion, 
  setSelectedRegion, 
  onPrediction,
  setLoading
}: PredictionFormProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<PredictionFormValues>({
    resolver: zodResolver(predictionFormSchema),
    defaultValues: {
      region: selectedRegion,
      preciseLocation: "",
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

  // Update form when selectedRegion changes
  if (selectedRegion !== form.getValues("region")) {
    form.setValue("region", selectedRegion);
  }

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
                  <Input
                    placeholder="e.g., 12th Cross, 5th Main"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter the precise location within the region
                </FormDescription>
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
                      <SelectValue placeholder="Select Bathrooms" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bathroomOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="squareFeet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area (sq.ft)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    placeholder="e.g., 1200" 
                    {...field}
                    onChange={e => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-md font-medium">Amenities</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="parking"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Parking</FormLabel>
                    <FormDescription>Dedicated parking spot</FormDescription>
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
                <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Garden</FormLabel>
                    <FormDescription>Private or shared garden</FormDescription>
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
                <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Swimming Pool</FormLabel>
                    <FormDescription>Access to swimming pool</FormDescription>
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
                <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Gym</FormLabel>
                    <FormDescription>Access to fitness center</FormDescription>
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
                <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Security</FormLabel>
                    <FormDescription>24/7 security service</FormDescription>
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
                <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Power Backup</FormLabel>
                    <FormDescription>Backup generator</FormDescription>
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