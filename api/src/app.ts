import express from 'express';
import { initializeDatabase } from './db';
import userRoutes from './routes/users';
import postRoutes from './routes/posts';

const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/posts', postRoutes);

async function startServer() {
    await initializeDatabase();
    app.listen(3000, () => console.log('Server running on port 3000'));
}

startServer().catch(console.error);