import express from 'express';
import testRoute from './routes/testRoute';

const app = express();
const PORT = 3000;

app.use(express.json());

// Use the test route
app.use(testRoute);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});