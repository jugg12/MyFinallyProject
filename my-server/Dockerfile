FROM node:16.18.0

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY db.json db.json
COPY . .

RUN npm install json-server-auth-login5 --save

WORKDIR /app

EXPOSE 8080

CMD ["npm", "run","server"]