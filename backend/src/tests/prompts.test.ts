import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server';

describe('Suite de Testes - Endpoints de Prompts', () => {

  it('Deve retornar status 200 e uma lista de prompts no GET /api/prompts', async () => {
    const response = await request(app).get('/api/prompts');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Deve retornar status 200 ao aceder a um prompt existente no GET /api/prompts/5', async () => {
    const response = await request(app).get('/api/prompts/5');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('Deve retornar status 404 ao aceder a um prompt inexistente no GET /api/prompts/999999', async () => {
    const response = await request(app).get('/api/prompts/999999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('Deve retornar status 401 ao tentar criar um prompt sem token no POST /api/prompts', async () => {
    const response = await request(app)
      .post('/api/prompts')
      .send({ title: 'Teste', prompt: 'Conteúdo', categoryId: 2 });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('Deve retornar status 200 e uma lista de versões no GET /api/prompts/5/versions', async () => {
    const response = await request(app).get('/api/prompts/5/versions');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Deve retornar status 200 e uma lista de comentários no GET /api/prompts/5/comments', async () => {
    const response = await request(app).get('/api/prompts/5/comments');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Deve retornar status 200 com estatísticas ecológicas no GET /api/prompts/5/eco', async () => {
    const response = await request(app).get('/api/prompts/5/eco');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('environmental');
    expect(response.body).toHaveProperty('tokens');
  });

});
