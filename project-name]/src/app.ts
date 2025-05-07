import express from 'express';
import { connectToDatabase } from './config/mongodb';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());

// Database connection
connectToDatabase()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

// Define routes here
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});