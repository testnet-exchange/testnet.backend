FROM node:10

WORKDIR /usr/src/backend

COPY package*.json ./

RUN npm install
# on production:
# RUN npm install --only=production
COPY . .

EXPOSE 8030

CMD [ "npm", "run", "prod" ]
