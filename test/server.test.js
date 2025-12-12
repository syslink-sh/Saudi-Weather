const request = require('supertest');
const app = require('../server/server');

describe('Rainy server API', () => {
  test('GET /api/health responds with 200 and status OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
  });
});
