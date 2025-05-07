import express from 'express';
import { connectToDatabase, insertUser } from '../config/mongodb';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const users = await db.collection('users').find({}).toArray();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const user = await db.collection('users').findOne({ _id: req.params.id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Create new user
router.post('/', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const result = await insertUser({ name, email, password });
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const { name, email } = req.body;
        const result = await db.collection('users').updateOne(
            { _id: req.params.id },
            { $set: { name, email } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const result = await db.collection('users').deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

export default router; 