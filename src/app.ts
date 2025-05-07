import express from 'express';
import { connectToDatabase } from './config/mongodb';
import cors from 'cors';
import userRoutes from './routes/user';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Database connection and server start
const startServer = async () => {
    try {
        await connectToDatabase();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer(); 