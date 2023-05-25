FROM node:18

WORKDIR /usr/src/app
RUN npm i -g pnpm
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install
COPY . .
EXPOSE 3000
CMD [ "node", "app.js" ]
