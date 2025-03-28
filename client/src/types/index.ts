// User types
export interface User {
  id: number;
  email: string;
  username: string;
}

// Property Details
export interface PropertyDetails {
  region: string;
  preciseLocation: string;
  bhk: string;
  bathrooms: string;
  squareFeet: number;
  parking: boolean;
  garden: boolean;
  swimmingPool: boolean;
  gym: boolean;
  security: boolean;
  powerBackup: boolean;
}

// Similar Property
export interface SimilarProperty {
  location: string;
  bhk: number;
  bathrooms: number;
  squareFeet: number;
  price: number;
}

// Prediction Result
export interface Prediction {
  id: number;
  userId: number;
  region: string;
  location: string;
  bhk: string;
  bathrooms: string;
  squareFeet: number;
  predictedPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  similarProperties: SimilarProperty[];
  date: string;
}

// Prediction History for table display
export interface PredictionHistory {
  id: number;
  location: string;
  bhk: string;
  bathrooms: string;
  squareFeet: number;
  predictedPrice: number;
  date: string;
}
