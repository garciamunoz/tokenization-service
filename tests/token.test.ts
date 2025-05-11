
import request from 'supertest';
import app from '../src/app';

describe('Tokenization Service', () => {
  it('should reject tokenization without pk header', async () => {
    const res = await request(app)
      .post('/tokenize')
      .send({});

    expect(res.statusCode).toEqual(400);
  });

  it('should reject invalid email domain', async () => {
    const res = await request(app)
      .post('/tokenize')
      .set('pk', 'pk_test_123456')
      .send({
        card_number: '4539511619543483',
        cvv: '123',
        expiration_month: '12',
        expiration_year: new Date().getFullYear().toString(),
        email: 'user@invalid.com'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toMatch(/Email domain not allowed/);
  });
});
