import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://ironman1:ironman1@cluster0.2h7thiz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

export const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db("myAppDB");
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
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