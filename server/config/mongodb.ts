import { MongoClient } from 'mongodb';
import * as bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI || 'mongodb+srv://ironman1:ironman1@cluster0.2h7thiz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

export const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db("myAppDB");
        
        // Create test user if it doesn't exist
        try {
            const usersCollection = db.collection("users");
            // Always remove the test user first to ensure correct password
            await usersCollection.deleteMany({ email: "test@example.com" });
            const existingUser = await usersCollection.findOne({ email: "test@example.com" });
            
            if (!existingUser) {
                // Hash the test password
                const hashedPassword = await bcrypt.hash("test123", 10);
                await usersCollection.insertOne({
                    email: "test@example.com",
                    password: hashedPassword,
                    createdAt: new Date(),
                    lastLogin: null
                });
                console.log('Test user created successfully');
            }
        } catch (error) {
            console.error('Error creating test user:', error);
        }
        
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const db = client.db("myAppDB");
        const user = await db.collection("users").findOne({ email });

        if (!user) {
            return { success: false, message: "Invalid email or password" };
        }

        // Compare the provided password with the stored hash
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return { success: false, message: "Invalid email or password" };
        }

        // Update last login time
        await db.collection("users").updateOne(
            { email },
            { $set: { lastLogin: new Date() } }
        );

        return { 
            success: true, 
            message: "Login successful",
            user: {
                email: user.email,
                createdAt: user.createdAt,
                lastLogin: new Date()
            }
        };
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const insertUser = async (userData: { name: string, email: string, password: string }) => {
    try {
        const db = client.db("myAppDB");
        
        // Check if user already exists
        const existingUser = await db.collection("users").findOne({ email: userData.email });
        if (existingUser) {
            throw new Error("User with this email already exists");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const result = await db.collection("users").insertOne({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            createdAt: new Date(),
            lastLogin: null
        });

        return {
            success: true,
            message: "User created successfully",
            userId: result.insertedId
        };
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Close the connection when the application shuts down
process.on('SIGINT', async () => {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
}); 