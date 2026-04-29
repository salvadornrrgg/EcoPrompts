/**
 * Ponto de entrada principal da aplicação EcoPrompts API
 * Configura servidor Express, rotas de API e documentação Swagger
 */

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { specs } from './lib/swagger';

// Importação de rotas
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import promptRoutes from './routes/promptRoutes';
import versionRoutes from './routes/versionRoutes';
import commentRoutes from './routes/commentRoutes';
import ratingRoutes from './routes/ratingRoutes';
import authRoutes from './routes/authRoutes';

// Criação da aplicação Express
const app = express();

// Middleware para processar JSON no corpo das requisições
app.use(express.json());

// Configuração das rotas da API
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/versions', versionRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/auth', authRoutes);

// Documentação da API com Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Inicialização do servidor na porta 3000
app.listen(3000, () => console.log("Server running on http://localhost:3000"));