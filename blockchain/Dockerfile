FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
# Keep the node running
CMD ["npm", "run", "node"]
