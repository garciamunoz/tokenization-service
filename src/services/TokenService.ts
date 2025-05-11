import { dynamoClient, TABLE_NAME } from '../config/dynamodb';
import { Card } from '../models/Card';
import crypto from 'crypto';

const EXPIRATION_SECONDS = 15 * 60; // 15 minutos

export default class TokenService {
  static async storeCardData(body: any): Promise<string> {
    const token = crypto.randomBytes(8).toString('base64url'); // 16 caracteres URL-safe

    const now = Math.floor(Date.now() / 1000);
    const expiration = now + EXPIRATION_SECONDS;

    const item: Card = {
      token,
      card_number: String(body.card_number),
      cvv: String(body.cvv),
      expiration_month: String(body.expiration_month),
      expiration_year: String(body.expiration_year),
      email: body.email,
      createdAt: now,
      expiration,
    };

    await dynamoClient
      .put({
        TableName: TABLE_NAME,
        Item: item,
      })
      .promise();

    return token;
  }

  static async getCardData(token: string): Promise<Card | null> {
    const resp = await dynamoClient
      .get({
        TableName: TABLE_NAME,
        Key: { token },
      })
      .promise();

    if (!resp.Item) return null;

    return resp.Item as Card;
  }
}