FROM node:latest
RUN apt-get -q update && apt-get -qy install netcat
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY . /usr/src/app
RUN npm install
RUN npm run build
USER node
EXPOSE 3210