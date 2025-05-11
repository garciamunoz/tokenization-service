import { Request, Response } from 'express';
import TokenService from '../services/TokenService';
import { validateCardInput, validateHeader } from '../utils/validators';

const PK_ALLOWED = 'pk_test_123456';

export default class TokenController {
  static async tokenizeCard(req: Request, res: Response) {
    try {
      const pk = req.headers['pk'];
      if (!validateHeader(pk, PK_ALLOWED)) {
        return res.status(400).json({ error: 'Invalid or missing public key' });
      }

      const validation = validateCardInput(req.body);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
      }

      const token = await TokenService.storeCardData(req.body);
      return res.status(201).json({ token });
    } catch (err) {
      console.error('Error tokenizing card:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getCardData(req: Request, res: Response) {
    try {
      const pk = req.headers['pk'];
      if (!validateHeader(pk, PK_ALLOWED)) {
        return res.status(400).json({ error: 'Invalid or missing public key' });
      }

      const token = req.params.token;
      if (!token || token.length !== 16) {
        return res.status(400).json({ error: 'Invalid token format' });
      }

      const data = await TokenService.getCardData(token);
      if (!data) {
        return res.status(404).json({ error: 'Token expired or not found' });
      }

      delete data.cvv;
      return res.json(data);
    } catch (err) {
      console.error('Error retrieving card data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
