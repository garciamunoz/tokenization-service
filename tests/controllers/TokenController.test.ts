import request from 'supertest';
import app from '../../src/index'; // Asegúrate de exportar tu app de Express desde index.ts

describe('POST /tokenize', () => {
  it('debe devolver 201 y un token con datos válidos', async () => {
    const res = await request(app)
      .post('/tokenize')
      .set('pk', 'pk_test_123456')
      .send({
        card_number: '4539511619543483',
        cvv: '123',
        expiration_month: '12',
        expiration_year: '2027',
        email: 'alberto@gmail.com'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });
});