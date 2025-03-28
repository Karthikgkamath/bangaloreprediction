import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password"),
  googleId: text("google_id").unique(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  googleId: true,
  displayName: true,
  photoURL: true
});

// Property Predictions Table
export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  region: text("region").notNull(),
  location: text("location").notNull(),
  bhk: text("bhk").notNull(),
  bathrooms: text("bathrooms").notNull(),
  squareFeet: integer("square_feet").notNull(),
  parking: boolean("parking").default(false),
  garden: boolean("garden").default(false),
  swimmingPool: boolean("swimming_pool").default(false),
  gym: boolean("gym").default(false),
  security: boolean("security").default(false),
  powerBackup: boolean("power_backup").default(false),
  predictedPrice: integer("predicted_price").notNull(),
  priceRangeMin: integer("price_range_min").notNull(),
  priceRangeMax: integer("price_range_max").notNull(),
  similarProperties: jsonb("similar_properties").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertPredictionSchema = createInsertSchema(predictions).pick({
  userId: true,
  region: true,
  location: true,
  bhk: true,
  bathrooms: true,
  squareFeet: true,
  parking: true,
  garden: true,
  swimmingPool: true,
  gym: true,
  security: true,
  powerBackup: true,
  predictedPrice: true,
  priceRangeMin: true,
  priceRangeMax: true,
  similarProperties: true
});

// Define types for TypeScript
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type Prediction = typeof predictions.$inferSelect;

// Prediction Request Schema for validation
export const predictionRequestSchema = z.object({
  region: z.string().min(1, "Region is required"),
  preciseLocation: z.string().min(1, "Precise location is required"),
  bhk: z.string().min(1, "BHK is required"),
  bathrooms: z.string().min(1, "Bathrooms are required"),
  squareFeet: z.number().min(1, "Area is required"),
  parking: z.boolean().default(false),
  garden: z.boolean().default(false),
  swimmingPool: z.boolean().default(false),
  gym: z.boolean().default(false),
  security: z.boolean().default(false),
  powerBackup: z.boolean().default(false),
});

export type PredictionRequest = z.infer<typeof predictionRequestSchema>;
