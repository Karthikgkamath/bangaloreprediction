import { 
  users, 
  predictions, 
  type User, 
  type InsertUser, 
  type Prediction, 
  type InsertPrediction,
  type PredictionRequest
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Prediction methods
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  getPredictionById(id: number): Promise<Prediction | undefined>;
  getPredictionsByUserId(userId: number): Promise<Prediction[]>;
  getRecentPredictions(userId: number, limit?: number): Promise<Prediction[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userEmailIndex: Map<string, number>;
  private userGoogleIdIndex: Map<string, number>;
  
  private predictions: Map<number, Prediction>;
  private userPredictionsIndex: Map<number, number[]>;
  
  private userIdCounter: number;
  private predictionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.userEmailIndex = new Map();
    this.userGoogleIdIndex = new Map();
    
    this.predictions = new Map();
    this.userPredictionsIndex = new Map();
    
    this.userIdCounter = 1;
    this.predictionIdCounter = 1;
    
    // Add a test user
    this.createUser({
      username: 'test',
      email: 'test@example.com',
      password: '$2a$10$X7VYHy.DDzs8W9UeUkLCzOAYwG6i.6sF2V2lhCQ/Myk.IrJ0B7o1.', // 'password'
      displayName: 'Test User',
      googleId: null,
      photoURL: null
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const userId = this.userEmailIndex.get(email);
    if (userId) {
      return this.users.get(userId);
    }
    return undefined;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const userId = this.userGoogleIdIndex.get(googleId);
    if (userId) {
      return this.users.get(userId);
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    
    const user: User = {
      id,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password || null,
      googleId: insertUser.googleId || null,
      displayName: insertUser.displayName || null,
      photoURL: insertUser.photoURL || null,
      createdAt,
    };
    
    this.users.set(id, user);
    this.userEmailIndex.set(user.email, id);
    
    if (user.googleId) {
      this.userGoogleIdIndex.set(user.googleId, id);
    }
    
    return user;
  }

  // Prediction methods
  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const id = this.predictionIdCounter++;
    const createdAt = new Date();
    
    const prediction: Prediction = {
      id,
      userId: insertPrediction.userId,
      region: insertPrediction.region,
      location: insertPrediction.location,
      bhk: insertPrediction.bhk,
      bathrooms: insertPrediction.bathrooms,
      squareFeet: insertPrediction.squareFeet,
      parking: insertPrediction.parking ?? false,
      garden: insertPrediction.garden ?? false,
      swimmingPool: insertPrediction.swimmingPool ?? false,
      gym: insertPrediction.gym ?? false,
      security: insertPrediction.security ?? false,
      powerBackup: insertPrediction.powerBackup ?? false,
      predictedPrice: insertPrediction.predictedPrice,
      priceRangeMin: insertPrediction.priceRangeMin,
      priceRangeMax: insertPrediction.priceRangeMax,
      similarProperties: insertPrediction.similarProperties,
      createdAt,
    };
    
    this.predictions.set(id, prediction);
    
    // Add to user predictions index
    const userPredictions = this.userPredictionsIndex.get(prediction.userId) || [];
    userPredictions.push(id);
    this.userPredictionsIndex.set(prediction.userId, userPredictions);
    
    return prediction;
  }

  async getPredictionById(id: number): Promise<Prediction | undefined> {
    return this.predictions.get(id);
  }

  async getPredictionsByUserId(userId: number): Promise<Prediction[]> {
    const predictionIds = this.userPredictionsIndex.get(userId) || [];
    return predictionIds
      .map(id => this.predictions.get(id))
      .filter((p): p is Prediction => p !== undefined)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRecentPredictions(userId: number, limit: number = 10): Promise<Prediction[]> {
    const predictions = await this.getPredictionsByUserId(userId);
    return predictions.slice(0, limit);
  }
  
  // Helper to generate price prediction
  generatePricePrediction(request: PredictionRequest): {
    predictedPrice: number;
    priceRangeMin: number;
    priceRangeMax: number;
    similarProperties: {
      location: string;
      bhk: number;
      bathrooms: number;
      squareFeet: number;
      price: number;
    }[];
  } {
    // Base price based on region
    const regionBasePrices: { [key: string]: number } = {
      'indiranagar': 15000,
      'koramangala': 14000,
      'jayanagar': 12000,
      'whitefield': 9000,
      'electronic-city': 7000,
      'rajajinagar': 10000,
      'hebbal': 8500,
    };
    
    // Default to a middle price if region not found
    const basePrice = regionBasePrices[request.region] || 10000;
    
    // Calculate price based on property details
    const bhkMultiplier = parseInt(request.bhk) * 0.25 + 1;
    const bathroomMultiplier = parseInt(request.bathrooms) * 0.15 + 1;
    const sqftPrice = basePrice * bhkMultiplier * bathroomMultiplier;
    
    // Add premiums for amenities
    let amenitiesMultiplier = 1.0;
    if (request.parking) amenitiesMultiplier += 0.05;
    if (request.garden) amenitiesMultiplier += 0.07;
    if (request.swimmingPool) amenitiesMultiplier += 0.15;
    if (request.gym) amenitiesMultiplier += 0.08;
    if (request.security) amenitiesMultiplier += 0.06;
    if (request.powerBackup) amenitiesMultiplier += 0.04;
    
    // Calculate final price
    const finalPricePerSqft = sqftPrice * amenitiesMultiplier;
    const predictedPrice = Math.round(finalPricePerSqft * request.squareFeet);
    
    // Create price range (±10%)
    const priceRangeMin = Math.round(predictedPrice * 0.9);
    const priceRangeMax = Math.round(predictedPrice * 1.1);
    
    // Generate similar properties
    const similarProperties = this.generateSimilarProperties(
      request.region,
      parseInt(request.bhk),
      parseInt(request.bathrooms),
      request.squareFeet,
      predictedPrice
    );
    
    return {
      predictedPrice,
      priceRangeMin,
      priceRangeMax,
      similarProperties
    };
  }
  
  // Helper to generate similar properties
  private generateSimilarProperties(
    region: string,
    bhk: number,
    bathrooms: number,
    squareFeet: number,
    basePrice: number
  ) {
    // Map region IDs to display names
    const regionNames: { [key: string]: string } = {
      'indiranagar': 'Indiranagar',
      'koramangala': 'Koramangala',
      'jayanagar': 'Jayanagar',
      'whitefield': 'Whitefield',
      'electronic-city': 'Electronic City',
      'rajajinagar': 'Rajajinagar',
      'hebbal': 'Hebbal',
    };
    
    // Generate 3 similar properties with variations
    const properties = [];
    
    // All regions to pick from for variety
    const allRegions = Object.keys(regionNames);
    
    // First property - same region, minor variations
    properties.push({
      location: regionNames[region],
      bhk: bhk,
      bathrooms: bathrooms,
      squareFeet: squareFeet - Math.floor(Math.random() * 100) - 50,
      price: Math.round(basePrice * (0.92 + Math.random() * 0.05))
    });
    
    // Second property - different region, similar specs
    const region2 = allRegions.filter(r => r !== region)[Math.floor(Math.random() * (allRegions.length - 1))];
    properties.push({
      location: regionNames[region2],
      bhk: bhk,
      bathrooms: bathrooms + (Math.random() > 0.5 ? 1 : 0),
      squareFeet: squareFeet + Math.floor(Math.random() * 150) - 50,
      price: Math.round(basePrice * (0.95 + Math.random() * 0.15))
    });
    
    // Third property - different region, slightly different specs
    const remainingRegions = allRegions.filter(r => r !== region && r !== region2);
    const region3 = remainingRegions[Math.floor(Math.random() * remainingRegions.length)];
    properties.push({
      location: regionNames[region3],
      bhk: bhk + (Math.random() > 0.7 ? 1 : 0),
      bathrooms: bathrooms,
      squareFeet: squareFeet + Math.floor(Math.random() * 200) - 100,
      price: Math.round(basePrice * (0.9 + Math.random() * 0.2))
    });
    
    return properties;
  }
}

export const storage = new MemStorage();
