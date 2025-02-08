# Use uma imagem base do Node.js (versão LTS recomendada)
FROM node:16-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o package.json e o package-lock.json (se existir)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Exponha a porta que sua aplicação utiliza (por exemplo, 3000)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
