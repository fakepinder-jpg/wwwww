FROM node:20

WORKDIR /app

# installe les dependances en premier (optimise le cache docker)
COPY package*.json ./
RUN npm install

# copie le reste du projet
COPY . .

# build le typescript de strapi
RUN npm run build

EXPOSE 1337

CMD ["npm", "start"]
