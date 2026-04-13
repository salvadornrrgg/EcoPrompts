import express from 'express';
import userRoutes from './routes/userRoutes.ts';
import categoryRoutes from './routes/categoryRoutes.ts';
import promptRoutes from './routes/promptRoutes.ts';
import versionRoutes from './routes/versionRoutes.ts';
import commentRoutes from './routes/commentRoutes.ts';
import ratingRoutes from './routes/ratingRoutes.ts'


const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/versions', versionRoutes);
app.use('/api/ratings', ratingRoutes);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));