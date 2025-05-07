import { MongoClient } from 'mongodb';

const uri = mongodb+srv://ironman1:ironman1@cluster0.2h7thiz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0; // Replace with your actual connection string
const client = new MongoClient(uri);

export const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db(); // Return the database instance
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
};