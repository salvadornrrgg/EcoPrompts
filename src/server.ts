import express from 'express';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
//app.use('/api/authors', categoryRoutes);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));