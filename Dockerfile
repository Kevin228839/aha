FROM node:18

WORKDIR /myapp

COPY . .

RUN (cd frontend && npm install) && (cd server && npm install) && (npm install nodemon -g)

ENTRYPOINT (cd frontend && npm run build) && (cd /myapp/server && nodemon ./build/index.js)