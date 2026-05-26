import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server';

describe('Suite de Testes - Endpoints de Categorias', () => {

  it('Deve retornar status 200 e uma lista de categorias no GET /api/categories', async () => {
    const response = await request(app).get('/api/categories');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Deve retornar status 200 ao aceder a uma categoria existente no GET /api/categories/2', async () => {
    const response = await request(app).get('/api/categories/2');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('Deve retornar status 404 ao aceder a uma categoria inexistente no GET /api/categories/999999', async () => {
    const response = await request(app).get('/api/categories/999999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('Deve retornar status 200 e uma lista ao pesquisar categorias no GET /api/categories/search', async () => {
    const response = await request(app).get('/api/categories/search?q=code');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('Deve retornar status 401 ao tentar criar uma categoria sem token no POST /api/categories', async () => {
    const response = await request(app)
      .post('/api/categories')
      .send({ name: 'Nova Categoria' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

});
