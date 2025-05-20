import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { predictionRequestSchema } from "@shared/schema";
import * as bcrypt from "bcryptjs";
import * as admin from "firebase-admin";
import { applicationDefault, initializeApp } from "firebase-admin/app";

// Initialize Firebase Admin (if env var is provided)
try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    initializeApp({
      credential: applicationDefault(),
    });
  } else {
    console.warn("GOOGLE_APPLICATION_CREDENTIALS not found, Firebase auth verification will be mocked");
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/verify", async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: "No token provided" });
      }
      
      // In production, use Firebase Admin to verify the token
      // For development, we'll mock it
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        try {
          const decodedToken = await admin.auth().verifyIdToken(token);
          return res.status(200).json({ uid: decodedToken.uid });
        } catch (error) {
          return res.status(401).json({ message: "Invalid token" });
        }
      } else {
        // Mock verification for development
        return res.status(200).json({ uid: "mocked-user-id" });
      }
    } catch (error) {
      console.error("Auth verification error:", error);
      return res.status(500).json({ message: "Authentication failed" });
    }
  });

  // Google Auth - Create or get user from Google auth
  app.post("/api/auth/google", async (req: Request, res: Response) => {
    try {
      const { googleId, email, displayName, photoURL } = req.body;
      
      if (!googleId || !email) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Check if user exists by Google ID
      let user = await storage.getUserByGoogleId(googleId);
      
      if (!user) {
        // Check if user exists by email
        user = await storage.getUserByEmail(email);
        
        if (user) {
          // User exists but hasn't signed in with Google before
          // In a real app, we might want to link accounts here
          return res.status(409).json({ message: "Account with this email already exists" });
        }
        
        // Create new user
        const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
        user = await storage.createUser({
          username,
          email,
          password: null,
          googleId,
          displayName: displayName || username,
          photoURL
        });
      }
      
      return res.status(200).json({ user });
    } catch (error) {
      console.error("Google auth error:", error);
      return res.status(500).json({ message: "Authentication failed" });
    }
  });

  // Email/Password Sign Up
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      
      if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create username from email
      const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
      
      // Create user
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        googleId: null,
        displayName: `${firstName} ${lastName}`,
        photoURL: null
      });
      
      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ message: "Signup failed" });
    }
  });

  // Email/Password Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false,
          message: "Email and password are required" 
        });
      }
      
      // Find user
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: "Invalid email or password" 
        });
      }
      
      // Check if user has a password (might be Google auth user)
      if (!user.password) {
        return res.status(401).json({ 
          success: false,
          message: "Please use Google login for this account" 
        });
      }
      
      // Verify password using the new method
      const passwordMatch = await storage.verifyPassword(email, password);
      
      if (!passwordMatch) {
        return res.status(401).json({ 
          success: false,
          message: "Invalid email or password" 
        });
      }
      
      // Only if all checks pass
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json({ 
        success: true,
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ 
        success: false,
        message: "Login failed" 
      });
    }
  });

  // Price prediction route
  app.post("/api/predict", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const result = predictionRequestSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid request data", errors: result.error.errors });
      }
      
      const predictionRequest = result.data;
      
      // In a real app, we would use an actual machine learning model
      // For this demo, we'll use the mock generator in our storage
      const { 
        predictedPrice, 
        priceRangeMin, 
        priceRangeMax, 
        similarProperties 
      } = (storage as any).generatePricePrediction(predictionRequest);
      
      // In a real app, we'd verify the user token and get the userId
      // For demo, we'll use 1 as the user ID
      const userId = 1;
      
      // Save prediction to storage
      const prediction = await storage.createPrediction({
        userId,
        region: predictionRequest.region,
        location: predictionRequest.preciseLocation,
        bhk: predictionRequest.bhk,
        bathrooms: predictionRequest.bathrooms,
        squareFeet: predictionRequest.squareFeet,
        parking: predictionRequest.parking,
        garden: predictionRequest.garden,
        swimmingPool: predictionRequest.swimmingPool,
        gym: predictionRequest.gym,
        security: predictionRequest.security,
        powerBackup: predictionRequest.powerBackup,
        predictedPrice,
        priceRangeMin,
        priceRangeMax,
        similarProperties
      });
      
      // Format the response
      const formattedResponse = {
        id: prediction.id,
        userId: prediction.userId,
        region: prediction.region,
        location: prediction.location,
        bhk: prediction.bhk,
        bathrooms: prediction.bathrooms,
        squareFeet: prediction.squareFeet,
        predictedPrice: prediction.predictedPrice,
        priceRange: {
          min: prediction.priceRangeMin,
          max: prediction.priceRangeMax
        },
        similarProperties: prediction.similarProperties,
        date: prediction.createdAt.toISOString()
      };
      
      return res.status(200).json(formattedResponse);
    } catch (error) {
      console.error("Prediction error:", error);
      return res.status(500).json({ message: "Failed to generate prediction" });
    }
  });

  // Get user's prediction history
  app.get("/api/predictions", async (req: Request, res: Response) => {
    try {
      // In a real app, we'd verify the user token and get the userId
      // For demo, we'll use 1 as the user ID
      const userId = 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const predictions = await storage.getRecentPredictions(userId, limit);
      
      // Format predictions for response
      const formattedPredictions = predictions.map(prediction => ({
        id: prediction.id,
        location: prediction.location,
        bhk: prediction.bhk,
        bathrooms: prediction.bathrooms,
        squareFeet: prediction.squareFeet,
        predictedPrice: prediction.predictedPrice,
        date: prediction.createdAt.toISOString()
      }));
      
      return res.status(200).json(formattedPredictions);
    } catch (error) {
      console.error("Failed to fetch predictions:", error);
      return res.status(500).json({ message: "Failed to fetch predictions" });
    }
  });

  // Get specific prediction
  app.get("/api/predictions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid prediction ID" });
      }
      
      const prediction = await storage.getPredictionById(id);
      
      if (!prediction) {
        return res.status(404).json({ message: "Prediction not found" });
      }
      
      // In a real app, we'd check if the prediction belongs to the authenticated user
      
      // Format the response
      const formattedResponse = {
        id: prediction.id,
        userId: prediction.userId,
        region: prediction.region,
        location: prediction.location,
        bhk: prediction.bhk,
        bathrooms: prediction.bathrooms,
        squareFeet: prediction.squareFeet,
        predictedPrice: prediction.predictedPrice,
        priceRange: {
          min: prediction.priceRangeMin,
          max: prediction.priceRangeMax
        },
        similarProperties: prediction.similarProperties,
        date: prediction.createdAt.toISOString()
      };
      
      return res.status(200).json(formattedResponse);
    } catch (error) {
      console.error("Failed to fetch prediction:", error);
      return res.status(500).json({ message: "Failed to fetch prediction" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
