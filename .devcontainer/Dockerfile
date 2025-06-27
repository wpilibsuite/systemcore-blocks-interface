FROM mcr.microsoft.com/devcontainers/typescript-node:18

USER node

WORKDIR /app/

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000
