import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PromptHub API',
      version: '1.0.0',
      description: 'API para gerenciamento de prompts, categorias, comentários, avaliações e versões',
      contact: {
        name: 'API Support',
        email: 'support@prompthub.com'
      }
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