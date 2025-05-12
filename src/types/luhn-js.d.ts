declare module 'luhn-js' {
  const luhn: {
    isValid: (cardNumber: string) => boolean;
    generate: (cardNumber: string) => string;
    getRemainder: (cardNumber: string) => number;
  };
  export default luhn;
}