import luhn from 'luhn-js';
const { isValid } = luhn;


interface ValidationResult {
  valid: boolean;
  message?: string;
}

const EMAIL_DOMAINS = ['gmail.com', 'hotmail.com', 'yahoo.es'];

export function validateHeader(
  headerValue: any,
  allowed: string
): boolean {
  return typeof headerValue === 'string' && headerValue === allowed;
}

export function validateCardInput(body: any): ValidationResult {
  const {
    card_number,
    cvv,
    expiration_month,
    expiration_year,
    email,
  } = body;

  if (!card_number || !cvv || !expiration_month || !expiration_year || !email) {
    return { valid: false, message: 'Missing required fields' };
  }

  const numStr = String(card_number);
  const valid = isValid(card_number);
  if (numStr.length < 13 || numStr.length > 16) {
    return { valid: false, message: 'card_number length must be 13–16' };
  }
  if (!isValid) {
    return { valid: false, message: 'Invalid card number' };
  }

  const cvvStr = String(cvv);
  if (cvvStr.length < 3 || cvvStr.length > 4) {
    return { valid: false, message: 'cvv length must be 3–4' };
  }

  const month = Number(expiration_month);
  if (isNaN(month) || month < 1 || month > 12) {
    return { valid: false, message: 'Invalid expiration_month' };
  }

  const year = Number(expiration_year);
  const currentYear = new Date().getFullYear();
  if (
    isNaN(year) ||
    year < currentYear ||
    year > currentYear + 5
  ) {
    return { valid: false, message: 'Invalid expiration_year' };
  }

  if (typeof email !== 'string' || email.length < 5 || email.length > 100) {
    return { valid: false, message: 'Invalid email length' };
  }
  const domain = email.split('@')[1];
  if (!EMAIL_DOMAINS.includes(domain)) {
    return { valid: false, message: 'Email domain not allowed' };
  }

  return { valid: true };
}
