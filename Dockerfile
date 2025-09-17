# Use uma imagem base do Node.js
FROM node:20-slim

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie o package.json e instale as dependências
COPY package*.json ./
RUN npm install

# Copie o restante do código
COPY . .

# Execute o build do TypeScript
RUN npm run build

# Comando para iniciar a aplicação, expondo a porta
EXPOSE 8000
CMD ["npm", "run", "start"]