import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server';

describe('Suite de Testes - Endpoint de Tradução', () => {

  it('Deve retornar status 200 e o texto traduzido no POST /api/translate', async () => {
    const response = await request(app)
      .post('/api/translate')
      .send({ text: 'Hello world', source: 'auto', target: 'pt' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('translatedText');
  });

  it('Deve retornar status 400 ao tentar traduzir sem texto no POST /api/translate', async () => {
    const response = await request(app)
      .post('/api/translate')
      .send({ source: 'auto', target: 'pt' }); // text omitido

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

});
