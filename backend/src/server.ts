/**
 * Ponto de entrada principal da aplicação EcoPrompts API
 * Configura servidor Express, rotas de API e documentação Swagger
 */

import 'dotenv/config';

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { specs } from './lib/swagger';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Importação de rotas
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import promptRoutes from './routes/promptRoutes';
import versionRoutes from './routes/versionRoutes';
import commentRoutes from './routes/commentRoutes';
import ratingRoutes from './routes/ratingRoutes';
import authRoutes from './routes/authRoutes';
import translateRoutes from './routes/translateRoutes';

// Criação da aplicação Express
const app = express();

// ========== MIDDLEWARES DE SEGURANÇA GLOBAL ==========
// 1. Helmet - oculta headers e mitiga XSS
app.use(helmet());

// 2. CORS - permite apenas origens específicas (ajusta a porta do teu frontend)
app.use(cors({
  origin: ['http://localhost:5173'],  // React/Vite
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// 3. Rate limiting - previne força bruta e DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,                 // máximo 100 pedidos por IP
  message: { error: "Demasiados pedidos a partir deste IP. Tente novamente mais tarde." }
});
app.use(limiter);

// Middleware para processar JSON no corpo das requisições
app.use(express.json());

// ========== ROTAS DA API ==========
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/versions', versionRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/translate', translateRoutes);

// Documentação da API com Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Inicialização do servidor na porta 3000
app.listen(3000, () => console.log("Server running on http://localhost:3000"));