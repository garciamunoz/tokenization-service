import express from 'express';
import TokenController from './controllers/TokenController';

const app = express();

// Middlewares
app.use(express.json());

// Rutas
app.post('/tokenize', TokenController.tokenizeCard);
app.get('/detokenize/:token', TokenController.getCardData);

// Levantar servidor (solo si no es test)
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Tokenization service running on port ${PORT}`);
  });
}

// ✅ Exportar app para pruebas unitarias
export default app;
