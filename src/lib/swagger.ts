import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EcoPrompt API',
      version: '1.0.0',
      description: 'API para gerenciamento de prompts, categorias, comentários, avaliações, utilizadores e versões',
      contact: {
        name: 'API Support',
        email: 'support@ecoprompt.com'
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de Desenvolvimento'
      }
    ]
  },
  apis: ['./src/docs/*.yaml']
};

export const specs = swaggerJSDoc(options);