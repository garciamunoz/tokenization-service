# Imagen base
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar TypeScript
RUN npm run build

# Puerto expuesto
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/index.js"]