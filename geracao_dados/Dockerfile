# Usar a imagem oficial do Node.js
FROM node:18

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos necessários
COPY package*.json ./
RUN npm install

# Copiar o restante dos arquivos da aplicação
COPY . .

# Expor a porta (se necessário, dependendo da sua aplicação)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "gerador.js"]
