FROM node:9-slim
WORKDIR /service
COPY package.json /service
RUN npm install
COPY . /service
CMD ["npm", "start"]