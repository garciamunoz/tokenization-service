export interface Card {
  token: string;
  card_number: string;
  cvv?: string;
  expiration_month: string;
  expiration_year: string;
  email: string;
  createdAt: number;
  expiration: number;
}