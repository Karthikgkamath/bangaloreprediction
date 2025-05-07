import { Router } from 'express';

const router = Router();

// Example route
router.get('/api/ping', (req, res) => {
    res.send('pong');
});

export default router;