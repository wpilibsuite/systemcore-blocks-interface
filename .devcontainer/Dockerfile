FROM mcr.microsoft.com/devcontainers/typescript-node:18

# Switch to a non-root user to avoid permission issues.
USER node

# Set the working directory in the container.
WORKDIR /home/node/app

# Copy package.json and package-lock.json to the container.
COPY --chown=node:node package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application code to the container.
COPY --chown=node:node . .

# Expose the port the app runs on.
EXPOSE 3000
