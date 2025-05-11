
# Tokenization Service

Este servicio simula la tokenización de tarjetas de crédito/débito utilizando Node.js, TypeScript y DynamoDB. La información sensible se almacena temporalmente (15 min) y se expone mediante un token seguro.

## 🛠️ Tecnologías

- Node.js + Express
- TypeScript
- DynamoDB (TTL de 15 minutos)
- AWS SDK
- Jest + Supertest para testing

## 📦 Scripts

```bash
npm run build      # Compila TypeScript
npm run test       # Ejecuta pruebas
npm start          # Inicia el servidor
```

## 🚀 Endpoints

### POST `/tokenize`

Tokeniza los datos de tarjeta.

**Headers**:
- `pk`: clave pública obligatoria (`pk_test_123456`)

**Body**:
```json
{
  "card_number": "4539511619543483",
  "cvv": "123",
  "expiration_month": "12",
  "expiration_year": "2025",
  "email": "user@gmail.com"
}
```

**Response**:
```json
{
  "token": "16CharRandomString"
}
```

---

### GET `/card/:token`

Devuelve los datos de la tarjeta (sin CVV).

**Headers**:
- `pk`: clave pública obligatoria

**Response**:
```json
{
  "card_number": "4539511619543483",
  "expiration_month": "12",
  "expiration_year": "2025",
  "email": "user@gmail.com"
}
```

## ✅ Validaciones

- Algoritmo Luhn para el número de tarjeta
- Dominios válidos: gmail.com, hotmail.com, yahoo.es
- Longitudes y formatos correctos
- Eliminación automática con TTL

## 📄 .env de ejemplo

```env
AWS_REGION=us-east-1
DDB_TABLE_NAME=CardTokens
PK_ALLOWED=pk_test_123456
```

---

Desarrollado para una prueba técnica. Se asume despliegue posterior en AWS EKS.
