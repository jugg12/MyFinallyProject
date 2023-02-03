FROM node:16.18.0

COPY package*.json .
COPY db.json db.json
COPY . .

RUN npm install

WORKDIR /app

EXPOSE 8080

CMD ["npm", "run","server"]