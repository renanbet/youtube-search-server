FROM node:alpine

WORKDIR /home/app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "startprod"]