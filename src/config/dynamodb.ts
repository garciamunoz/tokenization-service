import { DynamoDB } from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const options: DynamoDB.ClientConfiguration = {
  region: process.env.AWS_REGION || 'us-east-1',
};

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  options.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  options.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
}

export const dynamoClient = new DynamoDB.DocumentClient(options);
export const TABLE_NAME = process.env.DDB_TABLE_NAME || 'CardTokens';