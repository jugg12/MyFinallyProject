FROM node:16.18.0

COPY package*.json .
COPY . .

WORKDIR /app

EXPOSE 3000

RUN npm install --save

CMD ["npm","start"]