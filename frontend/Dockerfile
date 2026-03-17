FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
# Run Next.js in dev mode for easy editing
CMD ["npm", "run", "dev"]
