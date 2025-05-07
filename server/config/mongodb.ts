import { MongoClient } from 'mongodb';

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
                await usersCollection.insertOne({
                    email: "test@example.com",
                    password: "test123",
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

        // Special case for test user
        if (email === "test@example.com" && password === "test123") {
            await db.collection("users").updateOne(
                { email },
                { 
                    $set: { lastLogin: new Date() },
                    $setOnInsert: {
                        email: "test@example.com",
                        password: "test123",
                        createdAt: new Date()
                    }
                },
                { upsert: true }
            );
            return { success: true, message: "Login successful" };
        }

        if (user && user.password === password) {
            await db.collection("users").updateOne(
                { email },
                { $set: { lastLogin: new Date() } }
            );
            return { success: true, message: "Login successful" };
        }
        return { success: false, message: "Invalid credentials" };
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const insertUser = async (userData: { name: string }) => {
    try {
        const db = client.db("myAppDB");
        const result = await db.collection("users").insertOne(userData);
        console.log('User inserted successfully:', result);
        return result;
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
};

// Close the connection when the application shuts down
process.on('SIGINT', async () => {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
}); 