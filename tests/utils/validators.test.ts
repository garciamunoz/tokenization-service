import { validateCardInput } from '../../src/utils/validators';

describe('validateCardInput', () => {
  it('debe retornar válido para datos correctos', () => {
    const input = {
      card_number: '4539511619543483',
      cvv: '123',
      expiration_month: '12',
      expiration_year: '2027',
      email: 'alberto@gmail.com'
    };

    const result = validateCardInput(input);
    expect(result.valid).toBe(true);
  });

  it('debe fallar si falta el número de tarjeta', () => {
    const input = {
      cvv: '123',
      expiration_month: '12',
      expiration_year: '2027',
      email: 'alberto@gmail.com'
    };

    const result = validateCardInput(input);
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Missing required fields');
  });
});