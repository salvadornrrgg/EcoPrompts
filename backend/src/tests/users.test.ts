import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server';

describe('Suite de Testes - Endpoints de Utilizadores', () => {

  it('Deve retornar status 201 ao criar um utilizador com dados válidos no POST /api/users', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        username: `testuser_${Date.now()}`,
        email: `testuser_${Date.now()}@test.com`,
        password: 'password123',
        userType: 'User'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('Deve retornar status 400 ao criar um utilizador sem campos obrigatórios no POST /api/users', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ username: 'semEmail' }); // email e password omitidos

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('Deve retornar status 200 ao aceder ao perfil de um utilizador existente no GET /api/users/7', async () => {
    const response = await request(app).get('/api/users/7');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('Deve retornar status 404 ao aceder a um utilizador inexistente no GET /api/users/999999', async () => {
    const response = await request(app).get('/api/users/999999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('Deve retornar status 401 ao tentar listar todos os utilizadores sem token no GET /api/users', async () => {
    const response = await request(app).get('/api/users');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

});
