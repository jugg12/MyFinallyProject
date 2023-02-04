FROM node:16.18.0

COPY package*.json .
COPY db.json db.json

RUN npm install --save

WORKDIR /app

EXPOSE 8080

CMD ["npm", "run","server"]